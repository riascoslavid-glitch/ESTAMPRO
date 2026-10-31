import React from 'react';
import { PreflightIssue, IssueSeverity } from '../../../types/printPreparation';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Wand2,
  Layers,
  Maximize2,
  Sparkles
} from 'lucide-react';

interface PreflightValidationPanelProps {
  issues: PreflightIssue[];
  onApplyFix: (action: string) => void;
}

export const PreflightValidationPanel: React.FC<PreflightValidationPanelProps> = ({
  issues,
  onApplyFix
}) => {
  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;
  const passCount = issues.filter((i) => i.severity === 'pass').length;

  const getSeverityBadge = (severity: IssueSeverity) => {
    switch (severity) {
      case 'error':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertOctagon className="w-3.5 h-3.5" />
            Error Crítico
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Advertencia
          </span>
        );
      case 'info':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Info className="w-3.5 h-3.5" />
            Sugerencia
          </span>
        );
      case 'pass':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verificado
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4">
      {/* Header con resumen de pre-vuelo */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Auditoría Pre-vuelo (Preflight)</h3>
            <p className="text-xs text-slate-400">Validación de resolución, cotas y RIP</p>
          </div>
        </div>

        {/* Marcadores de estado */}
        <div className="flex items-center gap-2 text-xs">
          {errorCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-medium">
              {errorCount} {errorCount === 1 ? 'error' : 'errores'}
            </span>
          )}
          {warningCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-medium">
              {warningCount} adv
            </span>
          )}
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-medium">
            {passCount} ok
          </span>
        </div>
      </div>

      {/* Lista de chequeos */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className={`p-3 rounded-lg border transition-colors ${
              issue.severity === 'error'
                ? 'bg-rose-950/20 border-rose-900/40 text-rose-200'
                : issue.severity === 'warning'
                ? 'bg-amber-950/20 border-amber-900/40 text-amber-200'
                : issue.severity === 'info'
                ? 'bg-sky-950/20 border-sky-900/40 text-sky-200'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-xs font-medium text-slate-200">{issue.title}</span>
              {getSeverityBadge(issue.severity)}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              {issue.description}
            </p>

            {/* Métricas detectadas */}
            {(issue.metricValue || issue.recommendedValue) && (
              <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mb-2 bg-slate-950/40 px-2 py-1 rounded">
                {issue.metricValue && (
                  <span>
                    Actual: <strong className="text-slate-200">{issue.metricValue}</strong>
                  </span>
                )}
                {issue.recommendedValue && (
                  <span>
                    Objetivo: <strong className="text-cyan-400">{issue.recommendedValue}</strong>
                  </span>
                )}
              </div>
            )}

            {/* Botón de auto-corrección rápida */}
            {issue.autoFixAvailable && issue.autoFixAction && (
              <button
                type="button"
                onClick={() => onApplyFix(issue.autoFixAction!)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer shadow-sm"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Auto-corregir automáticamente
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
