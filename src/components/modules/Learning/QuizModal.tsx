import React, { useState } from 'react';
import { LearningQuiz, QuizQuestion } from '../../../types/learning';
import { X, CheckCircle2, AlertCircle, Award, RotateCcw } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: LearningQuiz;
  courseTitle: string;
  onCompleteQuiz: (scorePercent: number, passed: boolean) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  quiz,
  courseTitle,
  onCompleteQuiz
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scorePercent, setScorePercent] = useState(0);
  const [isPassed, setIsPassed] = useState(false);

  if (!isOpen) return null;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = percent >= quiz.passingScorePercent;
    setScorePercent(percent);
    setIsPassed(passed);
    setIsSubmitted(true);
    onCompleteQuiz(percent, passed);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScorePercent(0);
    setIsPassed(false);
  };

  const allAnswered = quiz.questions.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              Evaluación Técnica
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {quiz.title}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Curso: {courseTitle} · Aprobación requerida: {quiz.passingScorePercent}%
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Result Banner after Submission */}
          {isSubmitted && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                isPassed
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              }`}
            >
              {isPassed ? (
                <Award className="w-8 h-8 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-8 h-8 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold">
                    {isPassed ? '¡Evaluación Aprobada con Éxito!' : 'Puntaje Insuficiente para Certificación'}
                  </h4>
                  <span className="text-lg font-black font-mono">
                    {scorePercent}%
                  </span>
                </div>
                <p className="text-xs mt-1">
                  {isPassed
                    ? 'Has demostrado dominio técnico sobre los parámetros y protocolos de este curso.'
                    : `Necesitas al menos ${quiz.passingScorePercent}% para aprobar. Repasa la lección y vuelve a intentarlo.`}
                </p>
              </div>
            </div>
          )}

          {/* Questions list */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {quiz.questions.map((q, qIndex) => {
              const selectedIdx = selectedAnswers[q.id];
              const isCorrect = isSubmitted && selectedIdx === q.correctIndex;
              const isIncorrect = isSubmitted && selectedIdx !== q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {qIndex + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {q.question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-1.5 pl-7">
                    {q.options.map((opt, optIndex) => {
                      const isOptionSelected = selectedIdx === optIndex;
                      let optionClasses = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300';

                      if (isSubmitted) {
                        if (optIndex === q.correctIndex) {
                          optionClasses = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-semibold';
                        } else if (isOptionSelected && !isCorrect) {
                          optionClasses = 'border-red-500 bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-200';
                        }
                      } else if (isOptionSelected) {
                        optionClasses = 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 font-medium';
                      }

                      return (
                        <button
                          key={optIndex}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIndex)}
                          className={`w-full p-2.5 rounded-lg border text-xs text-left flex items-center justify-between transition-colors ${optionClasses}`}
                        >
                          <span>{opt}</span>
                          {isSubmitted && optIndex === q.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation when submitted */}
                  {isSubmitted && (
                    <div className="pl-7 pt-2 text-[11px] text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Explicación técnica: </span>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between">
              {isSubmitted ? (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reintentar Evaluación</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cerrar
                </button>
                {!isSubmitted && (
                  <button
                    type="submit"
                    disabled={!allAnswered}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white transition-colors shadow-xs"
                  >
                    Calificar Cuestionario
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
