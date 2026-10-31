import React from 'react';
import { useApp } from '../../../context/AppContext';
import { LearningCourse, LearningLesson } from '../../../types/learning';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertTriangle, 
  HelpCircle, 
  Flame, 
  ExternalLink,
  BookOpen,
  Wrench,
  Package,
  Layers,
  Award
} from 'lucide-react';

interface LessonViewProps {
  course: LearningCourse;
  lesson: LearningLesson;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onNextLesson: () => void;
  onPrevLesson: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  onBackToCourse: () => void;
  onOpenQuiz?: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  course,
  lesson,
  isCompleted,
  onToggleComplete,
  onNextLesson,
  onPrevLesson,
  hasNext,
  hasPrev,
  onBackToCourse,
  onOpenQuiz
}) => {
  const { setActiveModuleId, addNotification } = useApp();

  const handleNavigateToModule = (moduleId: string, label: string) => {
    setActiveModuleId(moduleId);
    addNotification('Módulo Vinculado', `Navegaste a "${label}" desde el tutorial educativo.`, 'info', moduleId);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-150 pb-12">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onBackToCourse}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al temario de: {course.title}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Mark Complete Toggle Button */}
          <button
            type="button"
            onClick={onToggleComplete}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
              isCompleted
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <Circle className="w-4 h-4 text-slate-400" />
            )}
            <span>{isCompleted ? 'Lección Completada' : 'Marcar como Completada'}</span>
          </button>
        </div>
      </div>

      {/* Lesson Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 text-white relative overflow-hidden shadow-lg">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
          <BookOpen className="w-4 h-4" />
          <span>LECCIÓN {lesson.order} DE {course.lessons.length} · {lesson.durationMinutes} MINUTOS ESTIMADOS</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          {lesson.procedureSummary}
        </p>

        {/* Technical parameters badge if present */}
        {lesson.technicalParameters && (
          <div className="mt-5 p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {lesson.technicalParameters.temperatureC && (
              <div>
                <span className="text-[10px] text-cyan-400 uppercase font-mono tracking-wider block">Temperatura</span>
                <span className="text-sm font-bold text-white">{lesson.technicalParameters.temperatureC}</span>
              </div>
            )}
            {lesson.technicalParameters.timeSeconds && (
              <div>
                <span className="text-[10px] text-cyan-400 uppercase font-mono tracking-wider block">Tiempo</span>
                <span className="text-sm font-bold text-white">{lesson.technicalParameters.timeSeconds}</span>
              </div>
            )}
            {lesson.technicalParameters.pressure && (
              <div>
                <span className="text-[10px] text-cyan-400 uppercase font-mono tracking-wider block">Presión</span>
                <span className="text-sm font-bold text-white">{lesson.technicalParameters.pressure}</span>
              </div>
            )}
            {lesson.technicalParameters.peeling && (
              <div>
                <span className="text-[10px] text-cyan-400 uppercase font-mono tracking-wider block">Tipo de Pelado</span>
                <span className="text-sm font-bold text-white">{lesson.technicalParameters.peeling}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 1: Objective */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>1. Objetivo de Aprendizaje</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
          {lesson.objective}
        </p>
      </div>

      {/* Section 2 & 3: Materials & Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <Package className="w-4 h-4 text-cyan-500" />
            <span>2. Materiales e Insumos Necesarios</span>
          </div>
          <ul className="space-y-2">
            {lesson.materialsNeeded.map((mat, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                <span>{mat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <Wrench className="w-4 h-4 text-cyan-500" />
            <span>3. Herramientas y Maquinaria</span>
          </div>
          <ul className="space-y-2">
            {lesson.toolsNeeded.map((tool, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span>{tool}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section 4 & 5: Procedimiento y Explicación Paso a Paso */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>4 y 5. Procedimiento y Explicación Paso a Paso</span>
        </div>

        <div className="space-y-4">
          {lesson.stepByStep.map((step) => (
            <div
              key={step.stepNumber}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-cyan-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {step.stepNumber}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 pl-8.5 leading-relaxed">
                {step.instruction}
              </p>
              {step.tip && (
                <div className="ml-8.5 p-2 rounded-lg bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 text-[11px] text-cyan-800 dark:text-cyan-300 font-medium">
                  💡 <strong>Consejo del impresor:</strong> {step.tip}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 6: Imágenes ilustrativas */}
      {lesson.illustrativeImages && lesson.illustrativeImages.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            <span>6. Registro Fotográfico & Diagramas de Taller</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lesson.illustrativeImages.map((imgUrl, i) => (
              <div key={i} className="h-48 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                <img
                  src={imgUrl}
                  alt={`Diagrama ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 7: Advertencias de Seguridad */}
      {lesson.safetyWarnings && lesson.safetyWarnings.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>7. Protocolos de Seguridad Industrial Activa</span>
          </div>
          <ul className="space-y-1.5 pl-6 list-disc text-xs text-amber-900 dark:text-amber-200">
            {lesson.safetyWarnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 8 & 9: Errores Frecuentes y Soluciones Técnicas */}
      {lesson.frequentMistakes && lesson.frequentMistakes.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>8 y 9. Errores Frecuentes, Causas y Soluciones Contrastadas</span>
          </div>

          <div className="space-y-3">
            {lesson.frequentMistakes.map((f, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
              >
                <div className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <span>❌ Síntoma:</span>
                  <span>{f.mistake}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 pl-4 border-l-2 border-slate-300 dark:border-slate-700">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Causa técnica: </span>
                  {f.cause}
                </div>
                <div className="text-emerald-700 dark:text-emerald-400 font-medium pl-4 border-l-2 border-emerald-500">
                  <span className="font-semibold">Solución definitiva: </span>
                  {f.solution}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 10: Resumen */}
      <div className="p-5 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800/50 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>10. Resumen Técnico de la Lección</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {lesson.summary}
        </p>
      </div>

      {/* Related Module Link Banner */}
      {lesson.relatedModuleAction && (
        <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Conexión Interactiva con ESTAMPAPRO 360°
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Pon en práctica los parámetros de esta lección en la estación de trabajo en vivo.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleNavigateToModule(lesson.relatedModuleAction!.moduleId, lesson.relatedModuleAction!.buttonLabel)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-xs"
          >
            <span>{lesson.relatedModuleAction.buttonLabel}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrevLesson}
          disabled={!hasPrev}
          className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Lección Anterior</span>
        </button>

        {hasNext ? (
          <button
            type="button"
            onClick={onNextLesson}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2 transition-colors shadow-xs"
          >
            <span>Siguiente Lección</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : course.quiz && onOpenQuiz ? (
          <button
            type="button"
            onClick={onOpenQuiz}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 transition-colors shadow-xs"
          >
            <Award className="w-4 h-4" />
            <span>Realizar Examen del Curso</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onBackToCourse}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2 transition-colors"
          >
            <span>Finalizar y Volver</span>
          </button>
        )}
      </div>
    </div>
  );
};
