import React, { useState } from 'react';
import { DecalPresetVersion } from '../../../types';
import {
  Eye,
  EyeOff,
  RotateCw,
  Camera,
  History,
  Save,
  Check,
  X,
  Sparkles,
  Shirt,
  Compass,
  Maximize2
} from 'lucide-react';

interface DecalComparisonToolbarProps {
  showCustomizedGarment: boolean;
  onToggleCustomizedGarment: () => void;
  isHoldingCompare: boolean;
  onHoldCompareStart: () => void;
  onHoldCompareEnd: () => void;
  onSetCameraPreset: (preset: 'frente' | 'espalda' | 'manga_izq' | 'manga_der' | 'detalle') => void;
  isAutoRotate: boolean;
  onToggleAutoRotate: () => void;
  decalVersions: DecalPresetVersion[];
  onSaveVersion: (name: string) => void;
  onRestoreVersion: (version: DecalPresetVersion) => void;
  activeDecalsCount: number;
}

export const DecalComparisonToolbar: React.FC<DecalComparisonToolbarProps> = ({
  showCustomizedGarment,
  onToggleCustomizedGarment,
  isHoldingCompare,
  onHoldCompareStart,
  onHoldCompareEnd,
  onSetCameraPreset,
  isAutoRotate,
  onToggleAutoRotate,
  decalVersions,
  onSaveVersion,
  onRestoreVersion,
  activeDecalsCount
}) => {
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');

  const handleSave = () => {
    if (!newVersionName.trim()) return;
    onSaveVersion(newVersionName.trim());
    setNewVersionName('');
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-800 text-xs shadow-xl select-none">
        {/* Lado izquierdo: 5. COMPARACIÓN (Original vs Personalizada) */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">
              5. Comparar:
            </span>

            {/* Alternar Prenda Original / Personalizada */}
            <button
              type="button"
              onClick={onToggleCustomizedGarment}
              className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                showCustomizedGarment
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>{showCustomizedGarment ? 'Personalizada' : 'Original en Blanco'}</span>
            </button>

            {/* Mantener presionado para ver original */}
            <button
              type="button"
              onMouseDown={onHoldCompareStart}
              onMouseUp={onHoldCompareEnd}
              onMouseLeave={onHoldCompareEnd}
              onTouchStart={onHoldCompareStart}
              onTouchEnd={onHoldCompareEnd}
              className={`px-2.5 py-1 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
                isHoldingCompare
                  ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Mantén pulsado para ocultar temporalmente los estampados y ver la prenda base"
            >
              {isHoldingCompare ? 'Viendo Prenda en Blanco' : 'Mantener para ver original'}
            </button>
          </div>

          {/* Versiones y snapshots */}
          <button
            type="button"
            onClick={() => setIsVersionModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Versiones ({decalVersions.length})</span>
          </button>
        </div>

        {/* Lado derecho: 7. PRUEBAS DESDE DIFERENTES ÁNGULOS DE CÁMARA */}
        <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1 hidden sm:inline">
            7. Cámara 360°:
          </span>

          <button
            type="button"
            onClick={() => onSetCameraPreset('frente')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono font-bold"
            title="Vista Frontal directa"
          >
            Frente
          </button>

          <button
            type="button"
            onClick={() => onSetCameraPreset('espalda')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono font-bold"
            title="Vista Espalda 180°"
          >
            Espalda
          </button>

          <button
            type="button"
            onClick={() => onSetCameraPreset('manga_izq')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono"
            title="Vista Manga Izquierda"
          >
            Manga Izq
          </button>

          <button
            type="button"
            onClick={() => onSetCameraPreset('manga_der')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono"
            title="Vista Manga Derecha"
          >
            Manga Der
          </button>

          <button
            type="button"
            onClick={() => onSetCameraPreset('detalle')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono"
            title="Zoom cercano al estampado activo"
          >
            Zoom Estampa
          </button>

          <div className="w-px h-3.5 bg-slate-800 mx-0.5" />

          {/* Rotación automática 360° continua */}
          <button
            type="button"
            onClick={onToggleAutoRotate}
            className={`p-1 rounded-md transition-colors ${
              isAutoRotate
                ? 'bg-cyan-600 text-white animate-spin'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={isAutoRotate ? 'Detener rotación 360°' : 'Activar rotación continua 360°'}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modal de Versiones de Estampado 3D */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm">Versiones de Estampados Guardadas</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVersionModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Guardar nueva versión */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-semibold block">
                Guardar Configuración Actual como Variante:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Nombre de la versión (ej. Escudo + Dorsal)..."
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-white outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar</span>
                </button>
              </div>
            </div>

            {/* Lista de versiones */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {decalVersions.map((ver) => (
                <div
                  key={ver.id}
                  className="p-3 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-xs text-white">{ver.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {ver.decals.length} estampados · {new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onRestoreVersion(ver);
                      setIsVersionModalOpen(false);
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
                  >
                    Restaurar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
