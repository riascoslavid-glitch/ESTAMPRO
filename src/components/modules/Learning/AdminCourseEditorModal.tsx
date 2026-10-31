import React, { useState } from 'react';
import { 
  LearningCourse, 
  LearningCategory, 
  CourseLevel, 
  LEARNING_CATEGORIES_META, 
  LearningLesson 
} from '../../../types/learning';
import { X, Plus, Trash2, Check, BookOpen, Layers } from 'lucide-react';

interface AdminCourseEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseToEdit: LearningCourse | null;
  onSaveCourse: (course: LearningCourse) => void;
}

export const AdminCourseEditorModal: React.FC<AdminCourseEditorModalProps> = ({
  isOpen,
  onClose,
  courseToEdit,
  onSaveCourse
}) => {
  const [title, setTitle] = useState(courseToEdit?.title || '');
  const [description, setDescription] = useState(courseToEdit?.description || '');
  const [category, setCategory] = useState<LearningCategory>(courseToEdit?.category || 'dtf');
  const [level, setLevel] = useState<CourseLevel>(courseToEdit?.level || 'Principiante');
  const [durationMinutes, setDurationMinutes] = useState(courseToEdit?.durationMinutes || 45);
  const [coverImage, setCoverImage] = useState(
    courseToEdit?.coverImage || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80'
  );
  const [isPublished, setIsPublished] = useState(courseToEdit?.isPublished ?? true);

  // Lesson inline editor
  const [lessons, setLessons] = useState<LearningLesson[]>(courseToEdit?.lessons || []);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonObjective, setLessonObjective] = useState('');
  const [lessonTemp, setLessonTemp] = useState('');
  const [lessonTime, setLessonTime] = useState('');
  const [lessonPressure, setLessonPressure] = useState('');

  if (!isOpen) return null;

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) return;

    const newLesson: LearningLesson = {
      id: `les-${Date.now().toString(36)}`,
      order: lessons.length + 1,
      title: lessonTitle.trim(),
      durationMinutes: 20,
      objective: lessonObjective.trim() || 'Aprender los conceptos fundamentales del proceso.',
      materialsNeeded: ['Prendas de prueba', 'Insumos de calibración'],
      toolsNeeded: ['Equipo de taller calibrado'],
      procedureSummary: 'Ejecución del procedimiento estándar con control de calidad.',
      stepByStep: [
        {
          stepNumber: 1,
          title: 'Preparación de insumos',
          instruction: 'Verifica los niveles y temperaturas antes de comenzar.',
          tip: 'Asegúrate de registrar las mediciones en la bitácora de taller.'
        },
        {
          stepNumber: 2,
          title: 'Ejecución del estampado',
          instruction: 'Aplica los parámetros establecidos según la ficha técnica.',
          tip: 'No abras la prensa bruscamente para evitar desprendimientos.'
        }
      ],
      illustrativeImages: [coverImage],
      safetyWarnings: ['Usa protección térmica adecuada.'],
      frequentMistakes: [
        {
          mistake: 'Falta de uniformidad térmica',
          cause: 'Zonas frías en la prensa térmica',
          solution: 'Mide periódicamente con pirómetro láser.'
        }
      ],
      summary: 'El cumplimiento de los tiempos y presiones garantiza acabados industriales de primer nivel.',
      technicalParameters: {
        temperatureC: lessonTemp || '155°C',
        timeSeconds: lessonTime || '15 s',
        pressure: lessonPressure || 'Media-Firme (4 Bar)',
        peeling: 'Según especificación de film'
      }
    };

    setLessons([...lessons, newLesson]);
    setLessonTitle('');
    setLessonObjective('');
  };

  const handleRemoveLesson = (lessonId: string) => {
    setLessons(lessons.filter((l) => l.id !== lessonId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const saved: LearningCourse = {
      id: courseToEdit?.id || `course-custom-${Date.now().toString(36)}`,
      title: title.trim(),
      description: description.trim(),
      category,
      level,
      durationMinutes: Number(durationMinutes) || 45,
      coverImage: coverImage.trim(),
      isPublished,
      isCustom: true,
      createdAt: courseToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lessons: lessons.length > 0 ? lessons : (courseToEdit?.lessons || []),
      quiz: courseToEdit?.quiz || {
        id: `quiz-${Date.now()}`,
        title: `Evaluación de ${title.trim()}`,
        description: 'Examen de validación de conocimientos técnicos.',
        passingScorePercent: 80,
        questions: [
          {
            id: 'q1',
            question: '¿Cuál es el factor más crítico para asegurar la solidez del estampado al lavado?',
            options: ['El tiempo de enfriamiento', 'El curado y polimerización a temperatura y presión correctas', 'El color de la tela', 'El doblado de la prenda'],
            correctIndex: 1,
            explanation: 'La correcta polimerización térmica asegura el anclaje físico-químico de las tintas.'
          }
        ]
      }
    };

    onSaveCourse(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {courseToEdit ? 'Editar Curso Educativo' : 'Crear Nuevo Curso Textil'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Título del Curso *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Calibración y Mantenimiento de Prensas Térmicas"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Descripción General
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica qué aprenderá el impresor en este curso..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Categoría (17 Secciones)
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as LearningCategory)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                {LEARNING_CATEGORIES_META.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nivel de Dificultad
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as CourseLevel)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Maestro">Maestro</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Duración Estimada (min)
              </label>
              <input
                type="number"
                min="10"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              URL de Imagen de Portada
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            />
          </div>

          {/* Lessons Section */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                <Layers className="w-4 h-4 text-cyan-500" />
                <span>Lecciones del Curso ({lessons.length})</span>
              </label>
            </div>

            {/* Existing lessons list */}
            {lessons.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {lessons.map((les, idx) => (
                  <div
                    key={les.id}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {idx + 1}. {les.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLesson(les.id)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Quick add lesson form */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">
                Agregar Lección Rápida
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="Título de la lección (ej. Preparación del sustrato)"
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                />
                <input
                  type="text"
                  value={lessonObjective}
                  onChange={(e) => setLessonObjective(e.target.value)}
                  placeholder="Objetivo principal"
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={lessonTemp}
                  onChange={(e) => setLessonTemp(e.target.value)}
                  placeholder="Temp (ej. 160°C)"
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                />
                <input
                  type="text"
                  value={lessonTime}
                  onChange={(e) => setLessonTime(e.target.value)}
                  placeholder="Tiempo (ej. 15 s)"
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                />
                <input
                  type="text"
                  value={lessonPressure}
                  onChange={(e) => setLessonPressure(e.target.value)}
                  placeholder="Presión (ej. Media)"
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleAddLesson}
                disabled={!lessonTitle.trim()}
                className="w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Lección a la Malla Curricular</span>
              </button>
            </div>
          </div>

          {/* Published Toggle */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublishedCheck"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 border-slate-300"
            />
            <label htmlFor="isPublishedCheck" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Publicar este curso inmediatamente para todos los usuarios y operarios
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-xs"
            >
              Guardar Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
