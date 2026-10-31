import React, { useState } from 'react';
import { LibraryResourceItem, LibraryPermission, LIBRARY_CATEGORIES_META } from '../../../types/library';
import { LibraryStorageService } from '../../../services/library/libraryStorageService';
import { 
  X, 
  Download, 
  PenTool, 
  Box, 
  Copy, 
  Trash2, 
  Heart, 
  ShieldCheck, 
  Check, 
  Tag, 
  Layers, 
  Maximize2 
} from 'lucide-react';

interface LibraryResourceDetailModalProps {
  isOpen: boolean;
  resource: LibraryResourceItem | null;
  onClose: () => void;
  onSendToDesigner: (resource: LibraryResourceItem) => void;
  onSendTo3D: (resource: LibraryResourceItem) => void;
  onToggleFavorite: (resourceId: string) => void;
  onDuplicate: (resource: LibraryResourceItem) => void;
  onDelete: (resourceId: string) => void;
  onUpdateResource: (resource: LibraryResourceItem) => void;
}

export const LibraryResourceDetailModal: React.FC<LibraryResourceDetailModalProps> = ({
  isOpen,
  resource,
  onClose,
  onSendToDesigner,
  onSendTo3D,
  onToggleFavorite,
  onDuplicate,
  onDelete,
  onUpdateResource
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!isOpen || !resource) return null;

  const categoryMeta = LIBRARY_CATEGORIES_META.find((c) => c.id === resource.category);

  const handleStartEdit = () => {
    setTitleValue(resource.title);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (titleValue.trim() && titleValue.trim() !== resource.title) {
      onUpdateResource({ ...resource, title: titleValue.trim() });
    }
    setIsEditingTitle(false);
  };

  const handlePermissionChange = (perm: LibraryPermission) => {
    onUpdateResource({ ...resource, permission: perm });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        {/* Left Side: Enlarged Visual Preview */}
        <div className="md:w-1/2 bg-slate-950 p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-800">
          <div className="w-full h-72 md:h-96 flex items-center justify-center p-4 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] rounded-xl border border-slate-800/80">
            <img
              src={resource.dataUri || resource.previewUrl}
              alt={resource.title}
              className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
            />
          </div>

          <div className="mt-3 flex items-center justify-between w-full text-[11px] text-slate-400 font-mono">
            <span>Resolución: {resource.widthPx} x {resource.heightPx} px</span>
            <span>{resource.dpi || 300} DPI · CMYK Ready</span>
          </div>
        </div>

        {/* Right Side: Information & Actions */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-5">
            {/* Top Bar with Close & Favorite */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  {categoryMeta?.name || resource.category}
                </span>
                <span className="ml-2 px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  .{resource.format}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(resource.id)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    resource.isFavorite
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                  }`}
                  title={resource.isFavorite ? 'Quitar de favoritos' : 'Marcar favorito'}
                >
                  <Heart className={`w-4 h-4 ${resource.isFavorite ? 'fill-rose-500' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Title & Editable Name */}
            <div>
              {isEditingTitle ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-cyan-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSaveTitle}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 text-white text-xs font-semibold"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                    {resource.title}
                  </h2>
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="text-xs text-cyan-500 hover:underline shrink-0"
                  >
                    Renombrar
                  </button>
                </div>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Registrado el {new Date(resource.createdAt).toLocaleDateString('es-ES')}
              </p>
            </div>

            {/* Technical specs pill grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Técnica Sugerida</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">
                  {resource.recommendedTechnique || 'DTF / Serigrafía'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Peso del Archivo</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {(resource.sizeBytes / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>

            {/* Permissions selector */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                <span>Nivel de Acceso y Permisos</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(['publico', 'taller', 'privado', 'cliente'] as LibraryPermission[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePermissionChange(p)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left flex items-center justify-between transition-colors ${
                      resource.permission === p
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="capitalize">{p}</span>
                    {resource.permission === p && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Etiquetas</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resource.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions Suite */}
          <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800 mt-6">
            {/* Primary Action Buttons: Designer & 3D */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onSendToDesigner(resource);
                  onClose();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <PenTool className="w-4 h-4" />
                <span>Enviar al Diseñador</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onSendTo3D(resource);
                  onClose();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Box className="w-4 h-4" />
                <span>Colocar en Prenda 3D</span>
              </button>
            </div>

            {/* Secondary actions: Download, Duplicate, Delete */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => LibraryStorageService.downloadResource(resource)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </button>

                <button
                  type="button"
                  onClick={() => onDuplicate(resource)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicar</span>
                </button>
              </div>

              {isConfirmingDelete ? (
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-red-500 font-semibold">¿Seguro?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(resource.id);
                      onClose();
                    }}
                    className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded font-medium"
                  >
                    Sí, eliminar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    className="px-2 py-1 text-xs text-slate-500"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                  title="Eliminar de la biblioteca"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
