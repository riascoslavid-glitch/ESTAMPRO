import React from 'react';
import {
  TextileEffectConfig,
  TextileFilterPreset,
  BlackAndWhiteMode
} from '../../../types/imageEditor';
import {
  Wand2,
  Sparkles,
  Contrast,
  Grid,
  Palette,
  Flame,
  Shirt,
  Check,
  RotateCcw
} from 'lucide-react';

interface ImageEffectsPanelProps {
  effects: TextileEffectConfig;
  activeFilterPreset: TextileFilterPreset;
  onEffectsChange: (updates: Partial<TextileEffectConfig>) => void;
  onApplyEffects: () => void;
  onResetEffects: () => void;
  onSelectFilterPreset: (preset: TextileFilterPreset) => void;
}

export const ImageEffectsPanel: React.FC<ImageEffectsPanelProps> = ({
  effects,
  activeFilterPreset,
  onEffectsChange,
  onApplyEffects,
  onResetEffects,
  onSelectFilterPreset
}) => {
  return (
    <div className="space-y-6 text-xs text-slate-800 dark:text-slate-200">
      {/* 1. SECCIÓN 14: CONVERTIR A BLANCO Y NEGRO */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Contrast className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <h3 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              14. Blanco y Negro & Fotolitos
            </h3>
          </div>
          {effects.bwMode !== 'none' && (
            <button
              type="button"
              onClick={() => onEffectsChange({ bwMode: 'none' })}
              className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Desactivar
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          Conversión calibrada para fotolitos de serigrafía o estilos monocromáticos de alto impacto.
        </p>

        {/* Modos B&W */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'none', label: 'Color Natural' },
            { id: 'grayscale', label: 'Escala de Grises' },
            { id: 'high_contrast', label: 'Alto Contraste B&N' },
            { id: 'halftone_mono', label: 'Trama Monocroma' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onEffectsChange({ bwMode: item.id as BlackAndWhiteMode })}
              className={`px-2 py-2 rounded-lg text-center font-medium transition-colors ${
                effects.bwMode === item.id
                  ? 'bg-indigo-600 dark:bg-cyan-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Umbral de corte si está en alto contraste */}
        {(effects.bwMode === 'high_contrast' || effects.bwMode === 'halftone_mono') && (
          <div className="space-y-1 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800 mt-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Umbral de Corte Serigráfico (Threshold):
              </span>
              <span className="font-mono font-bold">{effects.thresholdValue} / 255</span>
            </div>
            <input
              type="range"
              min="10"
              max="245"
              value={effects.thresholdValue}
              onChange={(e) => onEffectsChange({ thresholdValue: parseInt(e.target.value) })}
              className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>Más Negro</span>
              <span>Equilibrado (128)</span>
              <span>Más Blanco</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. SECCIÓN 15: CREAR EFECTOS TEXTILES */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <h3 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              15. Efectos Textiles & Serigrafía
            </h3>
          </div>
          <button
            type="button"
            onClick={onResetEffects}
            className="text-[10px] text-indigo-500 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restablecer</span>
          </button>
        </div>

        {/* A. Tramado de Semitonos (Halftone Screen) */}
        <div className="space-y-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-cyan-500" />
              Tramado de Semitonos (Halftone)
            </span>
            <select
              value={effects.halftoneMode}
              onChange={(e) => onEffectsChange({ halftoneMode: e.target.value as any })}
              className="text-[11px] font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="none">Desactivado</option>
              <option value="mono">Puntos Monocromo (K)</option>
              <option value="cmyk">Puntos de Color Cuatricromía</option>
            </select>
          </div>

          {effects.halftoneMode !== 'none' && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Tamaño de Punto (LPI): {effects.halftoneDotSize}px</label>
                <input
                  type="range"
                  min="3"
                  max="18"
                  value={effects.halftoneDotSize}
                  onChange={(e) => onEffectsChange({ halftoneDotSize: parseInt(e.target.value) })}
                  className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Ángulo de Trama: {effects.halftoneAngle}°</label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="7.5"
                  value={effects.halftoneAngle}
                  onChange={(e) => onEffectsChange({ halftoneAngle: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* B. Duotono Textil */}
        <div className="space-y-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={effects.duotoneEnabled}
                onChange={(e) => onEffectsChange({ duotoneEnabled: e.target.checked })}
                className="rounded accent-indigo-600 dark:accent-cyan-400 w-4 h-4"
              />
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-pink-500" />
                Duotono de Dos Tintas
              </span>
            </label>
          </div>

          {effects.duotoneEnabled && (
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Tinta Sombras:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={effects.duotoneColor1}
                    onChange={(e) => onEffectsChange({ duotoneColor1: e.target.value })}
                    className="w-7 h-7 rounded border border-slate-300 dark:border-slate-600 cursor-pointer"
                  />
                  <span className="font-mono text-[11px] uppercase font-bold">{effects.duotoneColor1}</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Tinta Luces:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={effects.duotoneColor2}
                    onChange={(e) => onEffectsChange({ duotoneColor2: e.target.value })}
                    className="w-7 h-7 rounded border border-slate-300 dark:border-slate-600 cursor-pointer"
                  />
                  <span className="font-mono text-[11px] uppercase font-bold">{effects.duotoneColor2}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* C. Desgaste Vintage Grunge Textil */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-semibold">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Desgaste Vintage Grunge Textil:
            </span>
            <span className="font-mono font-bold">{effects.vintageGrungeIntensity}%</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Aplica micro-grietas y erosión orgánica para simular estampados de prendas lavadas con piedra.
          </p>
          <input
            type="range"
            min="0"
            max="100"
            value={effects.vintageGrungeIntensity}
            onChange={(e) => onEffectsChange({ vintageGrungeIntensity: parseInt(e.target.value) })}
            className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* D. Posterizado (Reducción a N Tintas Planas) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">
              Posterizado Serigráfico (Niveles de Tinta):
            </span>
            <span className="font-mono font-bold">
              {effects.posterizeLevels === 0 ? 'Desactivado' : `${effects.posterizeLevels} tonos`}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="16"
            step="2"
            value={effects.posterizeLevels}
            onChange={(e) => onEffectsChange({ posterizeLevels: parseInt(e.target.value) })}
            className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
          />
        </div>

        <button
          type="button"
          onClick={onApplyEffects}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Renderizar Efectos en Imagen</span>
        </button>
      </div>

      {/* 3. SECCIÓN 16: APLICAR FILTROS PREESTABLECIDOS TEXTILES */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Shirt className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
          <h3 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            16. Filtros Calibrados de Imprenta
          </h3>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          Presets calibrados de fábrica para optimizar curvas tonales según la técnica de producción.
        </p>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'none', label: 'Original Sin Filtro', desc: 'Curva lineal estándar' },
            { id: 'dtg_optimal', label: 'DTG Óptima', desc: 'Realce de micro-contraste' },
            { id: 'serigrafia_clasica', label: 'Serigrafía Clásica', desc: 'Contraste duro para mallas' },
            { id: 'sublimacion_pop', label: 'Sublimación Pop', desc: 'Colores flúor de alta saturación' },
            { id: 'cyberpunk_streetwear', label: 'Cyberpunk Streetwear', desc: 'Tonos fríos y sombras neón' },
            { id: 'sepia_tradicional', label: 'Sepia Taller', desc: 'Atmósfera retro de archivo' },
            { id: 'cinema_moody', label: 'Cinema Moody', desc: 'Gama de película con sombras profundas' },
            { id: 'crisp_detail', label: 'Detalle Ultranítido', desc: 'Máxima agudeza en bordes' }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onSelectFilterPreset(f.id as TextileFilterPreset)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                activeFilterPreset === f.id
                  ? 'bg-indigo-50 dark:bg-cyan-950/40 border-indigo-400 dark:border-cyan-500 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white block">
                  {f.label}
                </span>
                {activeFilterPreset === f.id && (
                  <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                )}
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {f.desc}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
