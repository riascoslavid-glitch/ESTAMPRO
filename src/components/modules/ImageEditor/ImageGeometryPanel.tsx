import React, { useState, useEffect } from 'react';
import { CropAspectRatio } from '../../../types/imageEditor';
import {
  Crop,
  Maximize2,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Lock,
  Unlock,
  Check,
  X,
  RefreshCw,
  Compass
} from 'lucide-react';

interface ImageGeometryPanelProps {
  imageWidth: number;
  imageHeight: number;
  isCropping: boolean;
  cropAspect: CropAspectRatio;
  onCropAspectChange: (aspect: CropAspectRatio) => void;
  onStartCrop: () => void;
  onApplyCrop: () => void;
  onCancelCrop: () => void;
  onResize: (targetWidth: number, targetHeight: number, mode: 'bicubic' | 'smooth' | 'pixelated') => void;
  onRotateAngle: (angle: number) => void;
  onRotateStep: (degrees: number) => void;
  onFlip: (horizontal: boolean, vertical: boolean) => void;
}

export const ImageGeometryPanel: React.FC<ImageGeometryPanelProps> = ({
  imageWidth,
  imageHeight,
  isCropping,
  cropAspect,
  onCropAspectChange,
  onStartCrop,
  onApplyCrop,
  onCancelCrop,
  onResize,
  onRotateAngle,
  onRotateStep,
  onFlip
}) => {
  // Estados para Redimensionado
  const [resizeWidthPx, setResizeWidthPx] = useState<number>(imageWidth);
  const [resizeHeightPx, setResizeHeightPx] = useState<number>(imageHeight);
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  const [resizeDpi, setResizeDpi] = useState<number>(300);
  const [resampleMode, setResampleMode] = useState<'bicubic' | 'smooth' | 'pixelated'>('bicubic');

  // Estados para Rotación libre
  const [freeAngle, setFreeAngle] = useState<number>(0);

  // Sincronizar dimensiones cuando cambia la imagen
  useEffect(() => {
    setResizeWidthPx(imageWidth);
    setResizeHeightPx(imageHeight);
  }, [imageWidth, imageHeight]);

  // Dimensiones físicas en cm calculadas según DPI
  const widthCm = Number(((resizeWidthPx / resizeDpi) * 2.54).toFixed(1));
  const heightCm = Number(((resizeHeightPx / resizeDpi) * 2.54).toFixed(1));

  const handleWidthPxChange = (val: number) => {
    const w = Math.max(10, val);
    setResizeWidthPx(w);
    if (lockRatio && imageWidth > 0) {
      const ratio = imageHeight / imageWidth;
      setResizeHeightPx(Math.round(w * ratio));
    }
  };

  const handleHeightPxChange = (val: number) => {
    const h = Math.max(10, val);
    setResizeHeightPx(h);
    if (lockRatio && imageHeight > 0) {
      const ratio = imageWidth / imageHeight;
      setResizeWidthPx(Math.round(h * ratio));
    }
  };

  const handleWidthCmChange = (cm: number) => {
    const px = Math.round((cm / 2.54) * resizeDpi);
    handleWidthPxChange(px);
  };

  const handleHeightCmChange = (cm: number) => {
    const px = Math.round((cm / 2.54) * resizeDpi);
    handleHeightPxChange(px);
  };

  const handleApplyResize = () => {
    onResize(resizeWidthPx, resizeHeightPx, resampleMode);
  };

  const handleSliderAngleChange = (angle: number) => {
    setFreeAngle(angle);
    onRotateAngle(angle);
  };

  const handleResetAngle = () => {
    setFreeAngle(0);
    onRotateAngle(0);
  };

  return (
    <div className="space-y-6 text-xs text-slate-800 dark:text-slate-200">
      {/* 1. SECCIÓN: RECORTAR (CROP) */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crop className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <h3 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              2. Recortar (Crop)
            </h3>
          </div>
          {isCropping && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 animate-pulse">
              Modo Recorte Activo
            </span>
          )}
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          Ajusta el encuadre libremente o selecciona una proporción textil estándar para camisetas y prendas.
        </p>

        {/* Selector de proporción */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'free', label: 'Libre' },
            { id: '1:1', label: '1:1 Cuadrado' },
            { id: '4:3', label: '4:3 Estándar' },
            { id: '16:9', label: '16:9 Paisaje' },
            { id: 'a4_pecho', label: 'A4 Pecho (21:29.7)' },
            { id: 'pecho_frente', label: 'Pecho (30:35)' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onCropAspectChange(item.id as CropAspectRatio)}
              className={`px-2 py-1.5 rounded-lg text-center font-medium transition-colors ${
                cropAspect === item.id
                  ? 'bg-indigo-600 dark:bg-cyan-600 text-white font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Acciones de recorte */}
        <div className="pt-2 flex items-center gap-2">
          {!isCropping ? (
            <button
              type="button"
              onClick={onStartCrop}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Crop className="w-3.5 h-3.5" />
              <span>Activar Guías de Recorte</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onApplyCrop}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Aplicar Recorte</span>
              </button>
              <button
                type="button"
                onClick={onCancelCrop}
                className="px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 2. SECCIÓN: REDIMENSIONAR (RESIZE) */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <h3 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              3. Redimensionar (Resize)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setLockRatio(!lockRatio)}
            title={lockRatio ? 'Bloqueo de proporción activo' : 'Proporción desbloqueada'}
            className={`p-1.5 rounded-lg border transition-colors ${
              lockRatio
                ? 'bg-indigo-50 dark:bg-cyan-950/40 border-indigo-200 dark:border-cyan-800 text-indigo-600 dark:text-cyan-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
          >
            {lockRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Controles de Píxeles */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">Ancho (Píxeles)</label>
            <div className="relative">
              <input
                type="number"
                value={resizeWidthPx}
                onChange={(e) => handleWidthPxChange(parseInt(e.target.value) || 1)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-1 focus:ring-indigo-500"
              />
              <span className="absolute right-2.5 top-1.5 text-[10px] text-slate-400">px</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">Alto (Píxeles)</label>
            <div className="relative">
              <input
                type="number"
                value={resizeHeightPx}
                onChange={(e) => handleHeightPxChange(parseInt(e.target.value) || 1)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-1 focus:ring-indigo-500"
              />
              <span className="absolute right-2.5 top-1.5 text-[10px] text-slate-400">px</span>
            </div>
          </div>
        </div>

        {/* Medidas Físicas Calculadas en CM */}
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Medida sobre prenda:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400">DPI base:</span>
              <select
                value={resizeDpi}
                onChange={(e) => setResizeDpi(parseInt(e.target.value))}
                className="text-[11px] font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              >
                <option value={72}>72 DPI (Web)</option>
                <option value={150}>150 DPI (Mínimo)</option>
                <option value={300}>300 DPI (Óptimo)</option>
                <option value={600}>600 DPI (Ultra)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] text-slate-400">Ancho real:</span>
              <div className="relative mt-0.5">
                <input
                  type="number"
                  step="0.5"
                  value={widthCm}
                  onChange={(e) => handleWidthCmChange(parseFloat(e.target.value) || 1)}
                  className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                />
                <span className="absolute right-2 top-1 text-[10px] text-slate-400">cm</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400">Alto real:</span>
              <div className="relative mt-0.5">
                <input
                  type="number"
                  step="0.5"
                  value={heightCm}
                  onChange={(e) => handleHeightCmChange(parseFloat(e.target.value) || 1)}
                  className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                />
                <span className="absolute right-2 top-1 text-[10px] text-slate-400">cm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modo de remuestreo */}
        <div>
          <label className="text-[10px] font-mono text-slate-400 block mb-1">Algoritmo de Interpolación</label>
          <select
            value={resampleMode}
            onChange={(e) => setResampleMode(e.target.value as any)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium text-xs"
          >
            <option value="bicubic">Bicúbica Escalonada (Suave y Nítida)</option>
            <option value="smooth">Bilineal Estándar</option>
            <option value="pixelated">Vecino Más Cercano (Pixel Art / Gráficos Planos)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleApplyResize}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Ejecutar Redimensionado Real</span>
        </button>
      </div>

      {/* 3. SECCIÓN: ROTAR Y VOLTEAR (ROTATE & FLIP) */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <h3 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              4. Rotar y Voltear
            </h3>
          </div>
          {freeAngle !== 0 && (
            <button
              type="button"
              onClick={handleResetAngle}
              className="text-[10px] text-indigo-500 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              Restablecer (0°)
            </button>
          )}
        </div>

        {/* Botones de rotación rápida de 90° */}
        <div className="grid grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => onRotateStep(-90)}
            className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex flex-col items-center gap-1 transition-colors"
            title="Rotar 90° Antihorario"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span className="text-[10px] font-mono">-90°</span>
          </button>
          <button
            type="button"
            onClick={() => onRotateStep(90)}
            className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex flex-col items-center gap-1 transition-colors"
            title="Rotar 90° Horario"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span className="text-[10px] font-mono">+90°</span>
          </button>
          <button
            type="button"
            onClick={() => onFlip(true, false)}
            className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex flex-col items-center gap-1 transition-colors"
            title="Voltear Horizontal"
          >
            <FlipHorizontal className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span className="text-[10px] font-mono">Voltear H</span>
          </button>
          <button
            type="button"
            onClick={() => onFlip(false, true)}
            className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex flex-col items-center gap-1 transition-colors"
            title="Voltear Vertical"
          >
            <FlipVertical className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
            <span className="text-[10px] font-mono">Voltear V</span>
          </button>
        </div>

        {/* Deslizador de ángulo libre arbitrario */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-500">Ángulo libre arbitrario:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{freeAngle}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            step="1"
            value={freeAngle}
            onChange={(e) => handleSliderAngleChange(parseInt(e.target.value))}
            className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-0.5">
            <span>-180°</span>
            <span>-90°</span>
            <span>0°</span>
            <span>+90°</span>
            <span>+180°</span>
          </div>
        </div>
      </div>
    </div>
  );
};
