import React, { useState } from 'react';
import { ImageVersion } from '../../../types/imageEditor';
import {
  History,
  RotateCcw,
  Save,
  Clock,
  Check,
  X,
  FileImage,
  SplitSquareVertical,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';

interface ImageVersionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  versions: ImageVersion[];
  activeVersionId: string;
  onRestoreVersion: (version: ImageVersion) => void;
  onCompareWithVersion: (version: ImageVersion) => void;
  onSaveCurrentAsVersion: (name: string) => void;
  onRevertToOriginal: () => void;
}

export const ImageVersionsDrawer: React.FC<ImageVersionsDrawerProps> = ({
  isOpen,
  onClose,
  versions,
  activeVersionId,
  onRestoreVersion,
  onCompareWithVersion,
  onSaveCurrentAsVersion,
  onRevertToOriginal
}) => {
  const [newVersionName, setNewVersionName] = useState('');
  const [isAddingVersion, setIsAddingVersion] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!newVersionName.trim()) return;
    onSaveCurrentAsVersion(newVersionName.trim());
    setNewVersionName('');
    setIsAddingVersion(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-xs">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
          <h2 className="font-bold text-sm text-slate-900 dark:text-white">
            17. Historial & Versiones
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Conservar Original Banner */}
      <div className="p-3 bg-indigo-50/50 dark:bg-cyan-950/20 border-b border-indigo-100 dark:border-cyan-900/30 flex items-center justify-between">
        <div>
          <span className="font-bold text-indigo-950 dark:text-cyan-300 block">
            Archivo Original Protegido
          </span>
          <span className="text-[11px] text-slate-500">
            Edición 100% no destructiva.
          </span>
        </div>
        <button
          type="button"
          onClick={onRevertToOriginal}
          className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-cyan-800 text-indigo-700 dark:text-cyan-400 font-bold rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Revertir</span>
        </button>
      </div>

      {/* Formulario para guardar versión manual */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800">
        {!isAddingVersion ? (
          <button
            type="button"
            onClick={() => setIsAddingVersion(true)}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Estado Actual como Versión</span>
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Nombre de la versión (ej. Sin fondo v2)..."
              value={newVersionName}
              onChange={(e) => setNewVersionName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Guardar</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddingVersion(false)}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-300 cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Versiones */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block px-1">
          Línea de Tiempo ({versions.length} instantáneas)
        </span>

        {versions.map((ver, idx) => {
          const isActive = ver.id === activeVersionId;
          const isOriginal = idx === 0;

          return (
            <div
              key={ver.id}
              className={`p-3 rounded-xl border transition-all ${
                isActive
                  ? 'bg-indigo-50 dark:bg-cyan-950/30 border-indigo-400 dark:border-cyan-500 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Miniatura */}
                <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center relative">
                  {ver.thumbnailUrl ? (
                    <img
                      src={ver.thumbnailUrl}
                      alt={ver.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <FileImage className="w-6 h-6 text-slate-400" />
                  )}
                  {isActive && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>

                {/* Datos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate text-xs">
                      {ver.name}
                    </h3>
                    {isOriginal && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        Original
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-indigo-600 dark:text-cyan-400 font-medium block truncate mt-0.5">
                    {ver.actionTaken}
                  </span>

                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                    <span>{ver.width} × {ver.height} px</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Acciones por versión */}
                  <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                    <button
                      type="button"
                      onClick={() => onRestoreVersion(ver)}
                      disabled={isActive}
                      className="text-[11px] font-bold text-indigo-600 dark:text-cyan-400 hover:underline disabled:opacity-40 disabled:no-underline cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>{isActive ? 'Activa actualmente' : 'Restaurar'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onCompareWithVersion(ver)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer flex items-center gap-1"
                      title="Comparar pantalla dividida con esta versión"
                    >
                      <SplitSquareVertical className="w-2.5 h-2.5" />
                      <span>Comparar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
