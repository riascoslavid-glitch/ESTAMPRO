import React from 'react';
import { PrintDpiAnalysis } from '../../../types/imageEditor';
import { AlertTriangle, CheckCircle2, Info, Sparkles, Printer, ArrowUpRight } from 'lucide-react';

interface ImageDpiWarningBannerProps {
  analysis: PrintDpiAnalysis;
  targetArea: string;
  onTargetAreaChange: (area: string) => void;
  onTriggerUpscale: () => void;
}

export const PRINT_AREAS: Record<string, { name: string; widthCm: number; heightCm: number; desc: string }> = {
  a4_pecho: { name: 'A4 Pecho Centro', widthCm: 21, heightCm: 29.7, desc: 'Estándar para remeras y buzos' },
  pecho_frente: { name: 'Pecho Completo Oversize', widthCm: 30, heightCm: 35, desc: 'Estampados streetwear grandes' },
  espalda_max: { name: 'Espalda Completa', widthCm: 35, heightCm: 45, desc: 'Estampado póster dorsal' },
  bolsillo: { name: 'Bolsillo / Escudo', widthCm: 10, heightCm: 10, desc: 'Detalle pecho izquierdo o manga' },
  gorra: { name: 'Frontal Gorra', widthCm: 12, heightCm: 6.5, desc: 'Corona trucker o curva' }
};

export const ImageDpiWarningBanner: React.FC<ImageDpiWarningBannerProps> = ({
  analysis,
  targetArea,
  onTargetAreaChange,
  onTriggerUpscale
}) => {
  const isInsufficient = analysis.qualityLevel === 'insufficient';
  const isAcceptable = analysis.qualityLevel === 'acceptable';
  const isOptimal = analysis.qualityLevel === 'optimal';

  // Porcentaje del medidor DPI (0 a 400 DPI)
  const dpiMeterPercent = Math.min(100, Math.round((analysis.calculatedDpi / 400) * 100));

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all ${
        isInsufficient
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          : isAcceptable
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
      }`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Lado izquierdo: Estado y mensaje */}
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg shrink-0 mt-0.5 ${
              isInsufficient
                ? 'bg-rose-500/20 text-rose-400'
                : isAcceptable
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            {isInsufficient ? (
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            ) : isAcceptable ? (
              <Info className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                Densidad para Estampado Textil:
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-mono font-bold ${
                  isInsufficient
                    ? 'bg-rose-500 text-white'
                    : isAcceptable
                    ? 'bg-amber-500 text-slate-950 font-extrabold'
                    : 'bg-emerald-500 text-slate-950 font-extrabold'
                }`}
              >
                {analysis.calculatedDpi} DPI
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({analysis.widthPx} × {analysis.heightPx} px)
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
              {analysis.warningMessage}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-400">
              <span>
                Área física: <strong className="text-slate-900 dark:text-white">{analysis.targetWidthCm} × {analysis.targetHeightCm} cm</strong>
              </span>
              <span>•</span>
              <span>
                Tamaño máx nítido a 300 DPI: <strong className="text-slate-900 dark:text-white">{analysis.maxRecommendedPrintWidthCm} × {analysis.maxRecommendedPrintHeightCm} cm</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Lado derecho: Selector de área y botón de upscale si es insuficiente */}
        <div className="flex flex-wrap items-center gap-2.5 self-end md:self-center shrink-0 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-white/50 dark:bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={targetArea}
              onChange={(e) => onTargetAreaChange(e.target.value)}
              className="text-xs font-medium bg-transparent text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
            >
              {Object.entries(PRINT_AREAS).map(([k, area]) => (
                <option key={k} value={k} className="bg-slate-900 text-white">
                  {area.name} ({area.widthCm}×{area.heightCm}cm)
                </option>
              ))}
            </select>
          </div>

          {isInsufficient && (
            <button
              type="button"
              onClick={onTriggerUpscale}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mejorar con IA</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Barra de progreso / termómetro DPI */}
      <div className="mt-3 pt-2.5 border-t border-slate-200/40 dark:border-slate-800/60">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
          <span>72 DPI (Pantalla)</span>
          <span className="text-amber-400 font-bold">150 DPI (Mínimo Textil)</span>
          <span className="text-emerald-400 font-bold">300 DPI (Estándar Imprenta)</span>
          <span>400+ DPI</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
          <div
            className={`h-full transition-all duration-500 ${
              isInsufficient
                ? 'bg-rose-500'
                : isAcceptable
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${dpiMeterPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
