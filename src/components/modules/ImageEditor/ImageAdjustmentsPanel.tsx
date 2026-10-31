import React, { useState } from 'react';
import {
  ImageAdjustments,
  ColorSwapConfig,
  TransparencyWandConfig
} from '../../../types/imageEditor';
import {
  Sliders,
  Sun,
  Contrast,
  Palette,
  Sparkles,
  Droplets,
  RotateCcw,
  Pipette,
  Layers,
  Check,
  Eye,
  Eraser
} from 'lucide-react';

interface ImageAdjustmentsPanelProps {
  adjustments: ImageAdjustments;
  colorSwap: ColorSwapConfig;
  transparencyWand: TransparencyWandConfig;
  isEyedropperActive: boolean;
  eyedropperTarget: 'swap_source' | 'transparency_color' | null;
  onAdjustmentsChange: (updates: Partial<ImageAdjustments>) => void;
  onResetAdjustments: () => void;
  onColorSwapChange: (updates: Partial<ColorSwapConfig>) => void;
  onApplyColorSwap: () => void;
  onTransparencyWandChange: (updates: Partial<TransparencyWandConfig>) => void;
  onApplyTransparencyWand: () => void;
  onToggleEyedropper: (target: 'swap_source' | 'transparency_color') => void;
}

export const ImageAdjustmentsPanel: React.FC<ImageAdjustmentsPanelProps> = ({
  adjustments,
  colorSwap,
  transparencyWand,
  isEyedropperActive,
  eyedropperTarget,
  onAdjustmentsChange,
  onResetAdjustments,
  onColorSwapChange,
  onApplyColorSwap,
  onTransparencyWandChange,
  onApplyTransparencyWand,
  onToggleEyedropper
}) => {
  const [activeTab, setActiveTab] = useState<'tonales' | 'color_swap' | 'transparencia'>('tonales');

  return (
    <div className="space-y-4 text-xs text-slate-800 dark:text-slate-200">
      {/* Selector de pestañas */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('tonales')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center transition-all ${
            activeTab === 'tonales'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Tonales & Nitidez
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('color_swap')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center transition-all ${
            activeTab === 'color_swap'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Cambiar Colores
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('transparencia')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center transition-all ${
            activeTab === 'transparencia'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Transparencia
        </button>
      </div>

      {/* PESTAÑA 1: AJUSTES TONALES Y NITIDEZ */}
      {activeTab === 'tonales' && (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
              <h3 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Ajustes Fotográficos Reales
              </h3>
            </div>
            <button
              type="button"
              onClick={onResetAdjustments}
              className="text-[10px] text-indigo-500 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restablecer</span>
            </button>
          </div>

          {/* 7. BRILLO */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                7. Brillo
              </span>
              <span className="font-mono font-bold">{adjustments.brightness > 0 ? `+${adjustments.brightness}` : adjustments.brightness}</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={adjustments.brightness}
              onChange={(e) => onAdjustmentsChange({ brightness: parseInt(e.target.value) })}
              className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* 8. CONTRASTE */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Contrast className="w-3.5 h-3.5 text-indigo-500" />
                8. Contraste
              </span>
              <span className="font-mono font-bold">{adjustments.contrast > 0 ? `+${adjustments.contrast}` : adjustments.contrast}</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={adjustments.contrast}
              onChange={(e) => onAdjustmentsChange({ contrast: parseInt(e.target.value) })}
              className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* 9. SATURACIÓN */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Droplets className="w-3.5 h-3.5 text-pink-500" />
                9. Saturación
              </span>
              <span className="font-mono font-bold">{adjustments.saturation}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={adjustments.saturation}
              onChange={(e) => onAdjustmentsChange({ saturation: parseInt(e.target.value) })}
              className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* 10. NITIDEZ (MATRIZ DE CONVOLUCIÓN REAL) */}
          <div className="space-y-1 p-2.5 bg-indigo-50/50 dark:bg-cyan-950/20 rounded-lg border border-indigo-100 dark:border-cyan-900/40">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-indigo-900 dark:text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                10. Nitidez (Unsharp Mask Kernel)
              </span>
              <span className="font-mono font-bold text-indigo-600 dark:text-cyan-400">
                {adjustments.sharpness}%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Convolución espacial 3x3 para recuperar bordes nítidos antes del estampado serigráfico.
            </p>
            <input
              type="range"
              min="0"
              max="100"
              value={adjustments.sharpness}
              onChange={(e) => onAdjustmentsChange({ sharpness: parseInt(e.target.value) })}
              className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer mt-1"
            />
          </div>

          {/* TONO (HUE) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Palette className="w-3.5 h-3.5 text-cyan-500" />
                Tono / Matiz (Hue Shift)
              </span>
              <span className="font-mono font-bold">{adjustments.hue}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={adjustments.hue}
              onChange={(e) => onAdjustmentsChange({ hue: parseInt(e.target.value) })}
              className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* TEMPERATURA */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-600 dark:text-slate-400">
                Temperatura (Frío / Cálido)
              </span>
              <span className="font-mono font-bold">{adjustments.temperature > 0 ? `+${adjustments.temperature}` : adjustments.temperature}</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={adjustments.temperature}
              onChange={(e) => onAdjustmentsChange({ temperature: parseInt(e.target.value) })}
              className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* PESTAÑA 2: 11. CAMBIAR COLORES */}
      {activeTab === 'color_swap' && (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <h3 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              11. Cambiar Colores
            </h3>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Reemplaza cualquier color específico de la imagen por un nuevo tono deseado conservando las sombras y luces de la prenda.
          </p>

          {/* Selector de color origen y destino */}
          <div className="grid grid-cols-2 gap-3">
            {/* Color origen */}
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-semibold block mb-1">Color a Reemplazar</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorSwap.sourceColor}
                  onChange={(e) => onColorSwapChange({ sourceColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-300 dark:border-slate-600 cursor-pointer bg-transparent"
                />
                <div className="flex-1">
                  <span className="font-mono font-bold text-xs block text-slate-900 dark:text-white uppercase">
                    {colorSwap.sourceColor}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleEyedropper('swap_source')}
                    className={`mt-1 text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
                      isEyedropperActive && eyedropperTarget === 'swap_source'
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                    }`}
                  >
                    <Pipette className="w-2.5 h-2.5" />
                    <span>{isEyedropperActive && eyedropperTarget === 'swap_source' ? 'Muestreando...' : 'Cuentagotas'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Color destino */}
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-semibold block mb-1">Nuevo Color Deseado</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorSwap.targetColor}
                  onChange={(e) => onColorSwapChange({ targetColor: e.target.value })}
                  className="w-8 h-8 rounded border border-slate-300 dark:border-slate-600 cursor-pointer bg-transparent"
                />
                <div className="flex-1">
                  <span className="font-mono font-bold text-xs block text-slate-900 dark:text-white uppercase">
                    {colorSwap.targetColor}
                  </span>
                  <span className="text-[10px] text-slate-400">Tono de destino</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tolerancia de color */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-600 dark:text-slate-400">Tolerancia de Coincidencia (Delta-E):</span>
              <span className="font-mono font-bold">{colorSwap.tolerance}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={colorSwap.tolerance}
              onChange={(e) => onColorSwapChange({ tolerance: parseInt(e.target.value) })}
              className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Checkbox Preservar Luminosidad */}
          <label className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={colorSwap.preserveLuminosity}
              onChange={(e) => onColorSwapChange({ preserveLuminosity: e.target.checked })}
              className="rounded accent-indigo-600 dark:accent-cyan-400 w-4 h-4"
            />
            <div className="text-[11px]">
              <span className="font-bold text-slate-900 dark:text-white block">Preservar Sombras y Luces</span>
              <span className="text-slate-500">Mantiene el volumen tridimensional de la tela o ilustración.</span>
            </div>
          </label>

          <button
            type="button"
            onClick={onApplyColorSwap}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Ejecutar Reemplazo de Color</span>
          </button>
        </div>
      )}

      {/* PESTAÑA 3: 12. CREAR TRANSPARENCIAS */}
      {activeTab === 'transparencia' && (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <h3 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              12. Crear Transparencias
            </h3>
          </div>

          {/* Opacidad global */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-600 dark:text-slate-400">Opacidad General de la Capa:</span>
              <span className="font-mono font-bold">{adjustments.opacity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={adjustments.opacity}
              onChange={(e) => onAdjustmentsChange({ opacity: parseInt(e.target.value) })}
              className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-2" />

          {/* Varita mágica de transparencia */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
              <Eraser className="w-3.5 h-3.5 text-rose-500" />
              Varita de Borrado a Canal Alfa
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Selecciona un color (por ejemplo el blanco o negro de un fondo de logo) para convertirlo en transparencia total.
            </p>
          </div>

          {/* Color objetivo de transparencia */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-400 font-semibold">Color a Volver Transparente</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onTransparencyWandChange({ targetColor: '#ffffff' })}
                  className="px-1.5 py-0.5 rounded bg-white text-slate-900 font-mono text-[9px] border border-slate-300 font-bold"
                >
                  Blanco
                </button>
                <button
                  type="button"
                  onClick={() => onTransparencyWandChange({ targetColor: '#000000' })}
                  className="px-1.5 py-0.5 rounded bg-black text-white font-mono text-[9px] border border-slate-700 font-bold"
                >
                  Negro
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={transparencyWand.targetColor}
                onChange={(e) => onTransparencyWandChange({ targetColor: e.target.value })}
                className="w-8 h-8 rounded border border-slate-300 dark:border-slate-600 cursor-pointer bg-transparent"
              />
              <div className="flex-1">
                <span className="font-mono font-bold text-xs block text-slate-900 dark:text-white uppercase">
                  {transparencyWand.targetColor}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleEyedropper('transparency_color')}
                  className={`mt-1 text-[10px] font-semibold flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
                    isEyedropperActive && eyedropperTarget === 'transparency_color'
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                  }`}
                >
                  <Pipette className="w-2.5 h-2.5" />
                  <span>{isEyedropperActive && eyedropperTarget === 'transparency_color' ? 'Muestreando...' : 'Cuentagotas'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tolerancia */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-600 dark:text-slate-400">Tolerancia de Selección:</span>
              <span className="font-mono font-bold">{transparencyWand.tolerance}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={transparencyWand.tolerance}
              onChange={(e) => onTransparencyWandChange({ tolerance: parseInt(e.target.value) })}
              className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Suavizado de bordes (Feather) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-600 dark:text-slate-400">Suavizado de Bordes (Feather):</span>
              <span className="font-mono font-bold">{transparencyWand.feather} px</span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              value={transparencyWand.feather}
              onChange={(e) => onTransparencyWandChange({ feather: parseInt(e.target.value) })}
              className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={onApplyTransparencyWand}
            className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Eraser className="w-4 h-4" />
            <span>Eliminar Color Seleccionado a Transparente</span>
          </button>
        </div>
      )}
    </div>
  );
};
