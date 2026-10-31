import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { 
  LearningCourse, 
  LearningLesson, 
  UserCourseProgress, 
  UserEvaluationRecord,
  LearningCategory, 
  CourseLevel,
  LEARNING_CATEGORIES_META 
} from '../../../types/learning';
import { LearningService } from '../../../services/learning/learningService';
import { LessonView } from './LessonView';
import { QuizModal } from './QuizModal';
import { AdminCourseEditorModal } from './AdminCourseEditorModal';
import { 
  GraduationCap, 
  Search, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Heart, 
  Award, 
  Plus, 
  Play, 
  Layers, 
  ChevronRight, 
  Filter,
  BarChart,
  History,
  RotateCcw
} from 'lucide-react';

export const LearningCenterView: React.FC = () => {
  const { addNotification } = useApp();
  const { currentUser, currentRole } = useAuth();
  const isAdmin = currentRole === 'administrador';

  const [courses, setCourses] = useState<LearningCourse[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, UserCourseProgress>>({});
  const [evaluations, setEvaluations] = useState<UserEvaluationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Active View Mode: 'catalog' | 'course_detail' | 'lesson_view' | 'history'
  const [activeView, setActiveView] = useState<'catalog' | 'course_detail' | 'lesson_view' | 'history'>('catalog');
  const [selectedCourse, setSelectedCourse] = useState<LearningCourse | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<LearningLesson | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  // Modals
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isAdminEditorOpen, setIsAdminEditorOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<LearningCourse | null>(null);

  const userId = currentUser?.uid || 'local_user';

  // Load courses and progress
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [crs, evals] = await Promise.all([
        LearningService.getCourses(),
        LearningService.getEvaluations(userId)
      ]);
      setCourses(crs);
      setEvaluations(evals);

      // Load progress for each course
      const progObj: Record<string, UserCourseProgress> = {};
      for (const c of crs) {
        const prog = await LearningService.getUserProgress(userId, c.id);
        progObj[c.id] = prog;
      }
      setProgressMap(progObj);
    } catch (e) {
      console.error('Error loading learning data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  // Overall Learning Stats
  const stats = useMemo(() => {
    const totalCourses = courses.length;
    let completedCount = 0;
    let inProgressCount = 0;
    let totalLessonsCount = 0;
    let completedLessonsCount = 0;

    courses.forEach((c) => {
      const prog = progressMap[c.id];
      const completedIds = prog?.completedLessonIds || [];
      totalLessonsCount += c.lessons.length;
      completedLessonsCount += completedIds.length;

      if (completedIds.length > 0) {
        if (completedIds.length >= c.lessons.length) {
          completedCount++;
        } else {
          inProgressCount++;
        }
      }
    });

    const overallPercent = totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0;

    return {
      totalCourses,
      completedCount,
      inProgressCount,
      overallPercent,
      completedLessonsCount,
      totalLessonsCount
    };
  }, [courses, progressMap]);

  // Last active lesson to continue
  const continueTarget = useMemo(() => {
    for (const c of courses) {
      const prog = progressMap[c.id];
      if (prog && prog.completedLessonIds.length > 0 && prog.completedLessonIds.length < c.lessons.length) {
        // Find next uncompleted lesson
        const nextUnfinished = c.lessons.find((l) => !prog.completedLessonIds.includes(l.id)) || c.lessons[0];
        return { course: c, lesson: nextUnfinished };
      }
    }
    return null;
  }, [courses, progressMap]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (selectedLevel !== 'all' && c.level !== selectedLevel) return false;

      const prog = progressMap[c.id];
      const completedCount = prog?.completedLessonIds.length || 0;
      const isCompleted = completedCount > 0 && completedCount >= c.lessons.length;
      const isInProgress = completedCount > 0 && completedCount < c.lessons.length;

      if (statusFilter === 'completed' && !isCompleted) return false;
      if (statusFilter === 'in_progress' && !isInProgress) return false;

      if (onlyFavorites && !prog?.isFavorite) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesDesc = c.description.toLowerCase().includes(q);
        const matchesCat = c.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }
      return true;
    });
  }, [courses, selectedCategory, selectedLevel, statusFilter, onlyFavorites, searchQuery, progressMap]);

  // Handlers
  const handleToggleFavorite = async (courseId: string) => {
    const isFav = await LearningService.toggleCourseFavorite(userId, courseId);
    setProgressMap((prev) => ({
      ...prev,
      [courseId]: {
        ...(prev[courseId] || { id: '', userId, courseId, completedLessonIds: [], updatedAt: '' }),
        isFavorite: isFav
      }
    }));
    addNotification('Favoritos Actualizados', isFav ? 'Curso guardado en favoritos.' : 'Removido de favoritos.', 'info', 'centro_aprendizaje');
  };

  const handleToggleLessonComplete = async (courseId: string, lessonId: string) => {
    const updated = await LearningService.toggleLessonCompleted(userId, courseId, lessonId);
    setProgressMap((prev) => ({
      ...prev,
      [courseId]: updated
    }));
    const isNowDone = updated.completedLessonIds.includes(lessonId);
    addNotification(
      isNowDone ? 'Lección Completada' : 'Progreso Actualizado',
      isNowDone ? 'Has registrado el avance de esta lección técnica.' : 'Lección marcada como pendiente.',
      'success',
      'centro_aprendizaje'
    );
  };

  const handleOpenCourse = (course: LearningCourse) => {
    setSelectedCourse(course);
    setActiveView('course_detail');
  };

  const handleStartLesson = (course: LearningCourse, lesson: LearningLesson) => {
    setSelectedCourse(course);
    setSelectedLesson(lesson);
    setActiveView('lesson_view');
  };

  const handleCompleteQuiz = async (scorePercent: number, passed: boolean) => {
    if (!selectedCourse) return;
    await LearningService.saveQuizResult(userId, selectedCourse.id, selectedCourse.title, scorePercent, passed);
    // Reload evaluations
    const evals = await LearningService.getEvaluations(userId);
    setEvaluations(evals);
    addNotification(
      passed ? '¡Certificación Aprobada!' : 'Evaluación Calificada',
      `Obtuviste ${scorePercent}% en ${selectedCourse.title}.`,
      passed ? 'success' : 'warning',
      'centro_aprendizaje'
    );
  };

  const handleSaveCourse = async (saved: LearningCourse) => {
    await LearningService.saveCourse(saved);
    await loadData();
    addNotification('Curso Guardado', `"${saved.title}" disponible en la academia.`, 'success', 'centro_aprendizaje');
  };

  // If inside Lesson View
  if (activeView === 'lesson_view' && selectedCourse && selectedLesson) {
    const prog = progressMap[selectedCourse.id];
    const isCompleted = prog?.completedLessonIds.includes(selectedLesson.id) || false;
    const currentIndex = selectedCourse.lessons.findIndex((l) => l.id === selectedLesson.id);
    const hasNext = currentIndex < selectedCourse.lessons.length - 1;
    const hasPrev = currentIndex > 0;

    return (
      <LessonView
        course={selectedCourse}
        lesson={selectedLesson}
        isCompleted={isCompleted}
        onToggleComplete={() => handleToggleLessonComplete(selectedCourse.id, selectedLesson.id)}
        onNextLesson={() => {
          if (hasNext) setSelectedLesson(selectedCourse.lessons[currentIndex + 1]);
        }}
        onPrevLesson={() => {
          if (hasPrev) setSelectedLesson(selectedCourse.lessons[currentIndex - 1]);
        }}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onBackToCourse={() => setActiveView('course_detail')}
        onOpenQuiz={() => setIsQuizModalOpen(true)}
      />
    );
  }

  // If inside Course Detail View
  if (activeView === 'course_detail' && selectedCourse) {
    const prog = progressMap[selectedCourse.id];
    const completedIds = prog?.completedLessonIds || [];
    const coursePercent = Math.round((completedIds.length / selectedCourse.lessons.length) * 100);

    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-150 pb-12">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => setActiveView('catalog')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          ← Volver a todos los cursos
        </button>

        {/* Hero Course Header */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs flex flex-col md:flex-row">
          <div className="md:w-1/3 h-56 md:h-auto bg-slate-950 relative">
            <img
              src={selectedCourse.coverImage}
              alt={selectedCourse.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded bg-cyan-500 text-slate-950">
                {selectedCourse.level}
              </span>
            </div>
          </div>

          <div className="md:w-2/3 p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                  {selectedCourse.category.replace(/_/g, ' ')}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleFavorite(selectedCourse.id)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    prog?.isFavorite
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${prog?.isFavorite ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                {selectedCourse.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {selectedCourse.description}
              </p>
            </div>

            {/* Progress bar in header */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">
                  Progreso del curso: {completedIds.length} de {selectedCourse.lessons.length} lecciones
                </span>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono">{coursePercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 transition-all duration-300"
                  style={{ width: `${coursePercent}%` }}
                />
              </div>
            </div>

            {/* Actions: Start / Continue / Quiz */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  const firstIncomplete = selectedCourse.lessons.find((l) => !completedIds.includes(l.id)) || selectedCourse.lessons[0];
                  handleStartLesson(selectedCourse, firstIncomplete);
                }}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{completedIds.length === 0 ? 'Iniciar Curso' : 'Continuar Aprendizaje'}</span>
              </button>

              {selectedCourse.quiz && (
                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span>Realizar Evaluación</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Syllabus / Lessons List */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <span>Malla Curricular ({selectedCourse.lessons.length} Lecciones)</span>
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Duración total: {selectedCourse.durationMinutes} min
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {selectedCourse.lessons.map((les, idx) => {
              const isDone = completedIds.includes(les.id);

              return (
                <div
                  key={les.id}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors"
                >
                  <div
                    onClick={() => handleStartLesson(selectedCourse, les)}
                    className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <span className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 text-[10px] font-bold flex items-center justify-center text-slate-500">
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white hover:text-cyan-500 transition-colors">
                        {les.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {les.procedureSummary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {les.durationMinutes} min
                    </span>
                    <button
                      type="button"
                      onClick={() => handleStartLesson(selectedCourse, les)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-cyan-600 dark:bg-slate-800 dark:hover:bg-cyan-600 text-slate-700 dark:text-slate-200 hover:text-white transition-colors"
                    >
                      Abrir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quiz Modal */}
        {selectedCourse.quiz && (
          <QuizModal
            isOpen={isQuizModalOpen}
            onClose={() => setIsQuizModalOpen(false)}
            quiz={selectedCourse.quiz}
            courseTitle={selectedCourse.title}
            onCompleteQuiz={handleCompleteQuiz}
          />
        )}
      </div>
    );
  }

  // If inside History View
  if (activeView === 'history') {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-150 pb-12">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveView('catalog')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            ← Volver a los Cursos
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            Historial de Aprendizaje & Certificaciones
          </h1>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Evaluaciones y Exámenes Realizados ({evaluations.length})
          </h2>

          {evaluations.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">
              Aún no has completado evaluaciones. Completa las lecciones de un curso y toma su examen para registrar tus certificaciones.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {evaluations.map((ev) => (
                <div key={ev.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {ev.courseTitle}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      Fecha: {ev.createdAt}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold">
                      {ev.scorePercent}%
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ev.passed
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {ev.passed ? 'Aprobado' : 'Reproceso'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // DEFAULT VIEW: Course Catalog & Dashboard
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Módulo 20 · Academia & Capacitación Textil
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              17 Especialidades Industriales
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
            <span>Centro de Aprendizaje & Academia de Taller</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            Cursos paso a paso, procedimientos técnicos verificados, solución de fallas (fibrilación, desgarro de poliamida), protocolos de curado y certificaciones de operario.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setActiveView('history')}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <History className="w-4 h-4 text-cyan-500" />
            <span>Historial & Evaluaciones</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setCourseToEdit(null);
                setIsAdminEditorOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Curso (Admin)</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress & Quick Continue Widget Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Global Progress Bar Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Avance Global del Taller
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {stats.completedCount} de {stats.totalCourses} cursos
            </div>
            <div className="text-xs text-slate-500">
              {stats.completedLessonsCount} lecciones dominadas ({stats.overallPercent}%)
            </div>
          </div>
          <div className="w-14 h-14 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 flex items-center justify-center font-bold text-xs text-cyan-600 dark:text-cyan-400 font-mono">
            {stats.overallPercent}%
          </div>
        </div>

        {/* Quick Continue Card */}
        {continueTarget ? (
          <div className="md:col-span-2 p-4 rounded-2xl bg-gradient-to-r from-cyan-900/40 to-indigo-900/40 border border-cyan-500/30 flex items-center justify-between">
            <div className="space-y-1 min-w-0 pr-3">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Continuar donde lo dejaste</span>
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                {continueTarget.course.title}
              </h3>
              <p className="text-[11px] text-slate-300 truncate">
                Siguiente: {continueTarget.lesson.title}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleStartLesson(continueTarget.course, continueTarget.lesson)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Continuar</span>
            </button>
          </div>
        ) : (
          <div className="md:col-span-2 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Comienza tu entrenamiento
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Selecciona un curso para dominar técnicas de DTF, serigrafía, corte y preimpresión.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filter and 17 Categories Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar curso, técnica (DTF, vinilo, serigrafía) o problema..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            <option value="all">Todos los niveles</option>
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
            <option value="Maestro">Maestro</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="in_progress">En progreso</option>
            <option value="completed">Completados</option>
          </select>

          {/* Favorites Filter */}
          <button
            type="button"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors shrink-0 ${
              onlyFavorites
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-500' : ''}`} />
            <span>Favoritos</span>
          </button>
        </div>

        {/* 17 Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950'
                : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            Todas las Especialidades ({courses.length})
          </button>

          {LEARNING_CATEGORIES_META.map((cat) => {
            const count = courses.filter((c) => c.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg shrink-0 flex items-center gap-1.5 transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>{cat.name}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-slate-800 dark:bg-cyan-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Cargando malla curricular de capacitación...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <GraduationCap className="w-12 h-12 mx-auto text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No se encontraron cursos con estos filtros
          </h3>
          <p className="text-xs text-slate-500">
            Prueba seleccionando "Todas las especialidades" o limpiando el término de búsqueda.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedLevel('all');
              setStatusFilter('all');
              setSearchQuery('');
              setOnlyFavorites(false);
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const prog = progressMap[course.id];
            const completedCount = prog?.completedLessonIds.length || 0;
            const percent = Math.round((completedCount / course.lessons.length) * 100);
            const isCompleted = completedCount > 0 && completedCount >= course.lessons.length;

            return (
              <div
                key={course.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md hover:border-cyan-500/50 transition-all flex flex-col justify-between"
              >
                {/* Course Cover */}
                <div
                  onClick={() => handleOpenCourse(course)}
                  className="h-44 bg-slate-950 relative cursor-pointer overflow-hidden group"
                >
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  {/* Level Pill */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-900/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-xs">
                    {course.level}
                  </span>

                  {/* Favorite button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(course.id);
                    }}
                    className={`absolute top-3 right-3 p-1.5 rounded-lg backdrop-blur-xs transition-colors ${
                      prog?.isFavorite
                        ? 'bg-rose-500/20 text-rose-500'
                        : 'bg-slate-900/60 text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${prog?.isFavorite ? 'fill-rose-500' : ''}`} />
                  </button>

                  {/* Status Badge */}
                  {isCompleted && (
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500 text-slate-950 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Completado</span>
                    </span>
                  )}
                </div>

                {/* Course Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                        {course.category.replace(/_/g, ' ')}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {course.durationMinutes} min
                      </span>
                    </div>

                    <h3
                      onClick={() => handleOpenCourse(course)}
                      className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 hover:text-cyan-500 cursor-pointer"
                      title={course.title}
                    >
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  {/* Progress & Bottom Action */}
                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">
                          {completedCount} de {course.lessons.length} lecciones
                        </span>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                          {percent}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenCourse(course)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>Ver Temario</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setCourseToEdit(course);
                            setIsAdminEditorOpen(true);
                          }}
                          className="py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium"
                          title="Editar curso"
                        >
                          Editar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin Course Editor Modal */}
      <AdminCourseEditorModal
        isOpen={isAdminEditorOpen}
        onClose={() => setIsAdminEditorOpen(false)}
        courseToEdit={courseToEdit}
        onSaveCourse={handleSaveCourse}
      />
    </div>
  );
};
