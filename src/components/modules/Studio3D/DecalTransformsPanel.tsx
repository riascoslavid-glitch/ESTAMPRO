import React from 'react';
import { PrintZone3D, DecalLayer3D } from '../../../types';
import { PRINT_ZONES_METADATA } from '../../../services/three/decalSurfaceEngine';
import {
  Move,
  Maximize2,
  RotateCw,
  RotateCcw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Layers,
  Sparkles,
  Camera,
  Target,
  Plus,
  Palette,
  Sliders,
  Check
} from 'lucide-react';

interface DecalTransformsPanelProps {
  decalLayers: DecalLayer3D[];
  activeDecalId: string | null;
  onSelectDecal: (id: string) => void;
  onAddDecal: (zone: PrintZone3D) => void;
  onUpdateDecal: (id: string, updates: Partial<DecalLayer3D>) => void;
  onRemoveDecal: (id: string) => void;
  onDuplicateDecal: (id: string) => void;
  onFocusCameraZone: (zone: PrintZone3D) => void;
  isRaycastPickActive: boolean;
  onToggleRaycastPick: () => void;
}

export const DecalTransformsPanel: React.FC<DecalTransformsPanelProps> = ({
  decalLayers,
  activeDecalId,
  onSelectDecal,
  onAddDecal,
  onUpdateDecal,
  onRemoveDecal,
  onDuplicateDecal,
  onFocusCameraZone,
  isRaycastPickActive,
  onToggleRaycastPick
}) => {
  const activeDecal = decalLayers.find((d) => d.id === activeDecalId) || decalLayers[0];

  const currentZoneMeta = activeDecal ? PRINT_ZONES_METADATA[activeDecal.zone] : PRINT_ZONES_METADATA.centro_frontal;

  const handleZoneChange = (zone: PrintZone3D) => {
    if (!activeDecal) return;
    const meta = PRINT_ZONES_METADATA[zone];
    onUpdateDecal(activeDecal.id, {
      zone,
      widthCm: Math.min(activeDecal.widthCm, meta.maxWidthCm),
      heightCm: Math.min(activeDecal.heightCm, meta.maxHeightCm),
      offsetXCm: 0,
      offsetYCm: 0
    });
    // Enfocar cámara hacia la nueva zona automáticamente
    onFocusCameraZone(zone);
  };

  const handleAlign = (alignment: 'center' | 'left' | 'right' | 'top' | 'bottom') => {
    if (!activeDecal) return;
    const meta = currentZoneMeta;
    let newX = activeDecal.offsetXCm;
    let newY = activeDecal.offsetYCm;

    switch (alignment) {
      case 'center':
        newX = 0;
        newY = 0;
        break;
      case 'left':
        newX = -3.5;
        break;
      case 'right':
        newX = 3.5;
        break;
      case 'top':
        newY = 4.0;
        break;
      case 'bottom':
        newY = -4.0;
        break;
    }
    onUpdateDecal(activeDecal.id, { offsetXCm: newX, offsetYCm: newY });
  };

  return (
    <div className="space-y-5 text-xs text-slate-800 dark:text-slate-200">
      {/* 1. GESTIÓN MULTI-CAPA DE ESTAMPADOS (Prompt 8: Múltiples estampados) */}
      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <h3 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Capas de Estampado 3D ({decalLayers.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onAddDecal('pecho_izquierdo')}
            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Zona</span>
          </button>
        </div>

        {/* Lista de estampados activos */}
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {decalLayers.map((decal) => {
            const isSel = decal.id === activeDecal?.id;
            const zoneInfo = PRINT_ZONES_METADATA[decal.zone];

            return (
              <div
                key={decal.id}
                onClick={() => onSelectDecal(decal.id)}
                className={`p-2 rounded-lg border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                  isSel
                    ? 'bg-indigo-50 dark:bg-cyan-950/40 border-indigo-400 dark:border-cyan-500 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {/* Miniatura del diseño */}
                  <div className="w-7 h-7 rounded bg-slate-900 overflow-hidden border border-slate-700 shrink-0 flex items-center justify-center">
                    <img
                      src={decal.textureUri}
                      alt={decal.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 dark:text-white block truncate text-[11px]">
                      {decal.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block truncate">
                      {zoneInfo?.label || decal.zone} · {decal.widthCm}×{decal.heightCm}cm
                    </span>
                  </div>
                </div>

                {/* Acciones por capa */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateDecal(decal.id, { visible: !decal.visible });
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    title={decal.visible ? 'Ocultar estampado' : 'Mostrar estampado'}
                  >
                    {decal.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-500" />}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateDecal(decal.id);
                    }}
                    className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400"
                    title="Duplicar estampado en otra zona"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {decalLayers.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveDecal(decal.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-500"
                      title="Eliminar estampado"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeDecal && (
        <>
          {/* 2. SECCIÓN: 1. UBICACIONES SOBRE LA PRENDA */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                <h3 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  1. Zona de Ubicación
                </h3>
              </div>
              <button
                type="button"
                onClick={onToggleRaycastPick}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                  isRaycastPickActive
                    ? 'bg-rose-600 text-white animate-pulse shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
                title="Haz clic sobre cualquier parte de la prenda 3D para posicionar el estampado"
              >
                <Target className="w-3 h-3" />
                <span>{isRaycastPickActive ? 'Haz clic en la prenda 3D' : 'Posicionar con clic 3D'}</span>
              </button>
            </div>

            {/* Selector de Zonas de Estampado Reglamentarias */}
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(PRINT_ZONES_METADATA).map(([zoneKey, z]) => {
                const isSel = activeDecal.zone === zoneKey;
                return (
                  <button
                    key={zoneKey}
                    type="button"
                    onClick={() => handleZoneChange(zoneKey as PrintZone3D)}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      isSel
                        ? 'bg-indigo-600 dark:bg-cyan-600 text-white font-bold border-transparent shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="block truncate text-[11px]">{z.label}</span>
                    <span className={`text-[9px] font-mono block ${isSel ? 'text-white/80' : 'text-slate-400'}`}>
                      Máx {z.maxWidthCm}×{z.maxHeightCm}cm
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => onFocusCameraZone(activeDecal.zone)}
              className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[11px]"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
              <span>Enfocar Cámara en {currentZoneMeta.label}</span>
            </button>
          </div>

          {/* 3. SECCIÓN: 2. TRANSFORMACIONES (Mover, Escalar, Rotar, Alinear) */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Move className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                <h3 className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  2. Transformaciones
                </h3>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                Proyección DecalGeometry Real
              </span>
            </div>

            {/* A. MOVER (Offset X / Y en centímetros reales) */}
            <div className="space-y-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Desplazamiento Milimétrico:
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  X: {activeDecal.offsetXCm > 0 ? `+${activeDecal.offsetXCm}` : activeDecal.offsetXCm}cm · Y: {activeDecal.offsetYCm > 0 ? `+${activeDecal.offsetYCm}` : activeDecal.offsetYCm}cm
                </span>
              </div>

              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span>Eje X (Horizontal): {activeDecal.offsetXCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="0.5"
                    value={activeDecal.offsetXCm}
                    onChange={(e) => onUpdateDecal(activeDecal.id, { offsetXCm: parseFloat(e.target.value) })}
                    className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span>Eje Y (Vertical): {activeDecal.offsetYCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="0.5"
                    value={activeDecal.offsetYCm}
                    onChange={(e) => onUpdateDecal(activeDecal.id, { offsetYCm: parseFloat(e.target.value) })}
                    className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Botones de Alineación Rápida */}
              <div className="pt-1.5 flex items-center justify-between gap-1">
                <span className="text-[10px] text-slate-400 font-semibold">Alinear:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleAlign('left')}
                    className="p-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100"
                    title="Alinear Izquierda"
                  >
                    <AlignLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAlign('center')}
                    className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 text-[10px] font-bold"
                    title="Centrar en la Zona"
                  >
                    Centro
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAlign('right')}
                    className="p-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100"
                    title="Alinear Derecha"
                  >
                    <AlignRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAlign('top')}
                    className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 text-[10px]"
                    title="Subir a parte superior"
                  >
                    Arriba
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAlign('bottom')}
                    className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 text-[10px]"
                    title="Bajar"
                  >
                    Abajo
                  </button>
                </div>
              </div>
            </div>

            {/* B. ESCALAR & CAMBIAR TAMAÑO EN CENTÍMETROS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Dimensiones Reales sobre Prenda:
                </span>
                <span className="font-mono font-bold text-indigo-600 dark:text-cyan-400">
                  {Math.round(activeDecal.widthCm * activeDecal.scale)} × {Math.round(activeDecal.heightCm * activeDecal.scale)} cm
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Ancho (cm):</label>
                  <input
                    type="number"
                    min="4"
                    max={currentZoneMeta.maxWidthCm}
                    value={activeDecal.widthCm}
                    onChange={(e) => onUpdateDecal(activeDecal.id, { widthCm: Math.max(4, parseFloat(e.target.value) || 4) })}
                    className="w-full px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Alto (cm):</label>
                  <input
                    type="number"
                    min="4"
                    max={currentZoneMeta.maxHeightCm}
                    value={activeDecal.heightCm}
                    onChange={(e) => onUpdateDecal(activeDecal.id, { heightCm: Math.max(4, parseFloat(e.target.value) || 4) })}
                    className="w-full px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                  <span>Escalado Proporcional:</span>
                  <span className="font-mono font-bold">{Math.round(activeDecal.scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.0"
                  step="0.05"
                  value={activeDecal.scale}
                  onChange={(e) => onUpdateDecal(activeDecal.id, { scale: parseFloat(e.target.value) })}
                  className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* C. ROTAR (Ángulo 0 a 360°) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Rotación en Superficie:
                </span>
                <span className="font-mono font-bold">{activeDecal.rotationDeg}°</span>
              </div>

              <input
                type="range"
                min="0"
                max="360"
                step="5"
                value={activeDecal.rotationDeg}
                onChange={(e) => onUpdateDecal(activeDecal.id, { rotationDeg: parseInt(e.target.value) })}
                className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
              />

              <div className="flex items-center justify-between gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => onUpdateDecal(activeDecal.id, { rotationDeg: (activeDecal.rotationDeg - 90 + 360) % 360 })}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[10px] font-mono flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>-90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateDecal(activeDecal.id, { rotationDeg: 0 })}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[10px] font-mono"
                >
                  0° (Restablecer)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateDecal(activeDecal.id, { rotationDeg: (activeDecal.rotationDeg + 90) % 360 })}
                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-[10px] font-mono flex items-center gap-1"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>+90°</span>
                </button>
              </div>
            </div>

            {/* D. ACABADO PBR DE TÉCNICA TEXTIL */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="text-[10px] font-semibold text-slate-400 block">
                Acabado y Tacto de Técnica Textil:
              </label>
              <select
                value={activeDecal.finishStyle}
                onChange={(e) => onUpdateDecal(activeDecal.id, { finishStyle: e.target.value as any })}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-xs"
              >
                <option value="dtf_suave">DTF Soft-Touch (Acabado Satinado)</option>
                <option value="plastisol_brillante">Plastisol Brillante (Serigrafía Plástica)</option>
                <option value="base_agua_mate">Base Agua Mate (Zero-Hand Feel)</option>
                <option value="sublimado">Sublimación Térmica (Integrado en Fibra)</option>
                <option value="relieve_puff">Relieve Espumoso (Puff 3D)</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
