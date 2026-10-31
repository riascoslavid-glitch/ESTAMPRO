import React, { useState } from 'react';
import { LibraryFolder } from '../../../types/library';
import { X, Folder, Palette, Plus, Trash2 } from 'lucide-react';

interface LibraryFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: LibraryFolder[];
  onSaveFolder: (folder: LibraryFolder) => void;
  onDeleteFolder: (folderId: string) => void;
}

const PRESET_COLORS = [
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#ef4444', // Red
  '#8b5cf6'  // Purple
];

export const LibraryFolderModal: React.FC<LibraryFolderModalProps> = ({
  isOpen,
  onClose,
  folders,
  onSaveFolder,
  onDeleteFolder
}) => {
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    const newFolder: LibraryFolder = {
      id: `fol-${Date.now().toString(36)}`,
      name: folderName.trim(),
      color: selectedColor,
      createdAt: new Date().toISOString()
    };
    onSaveFolder(newFolder);
    setFolderName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-cyan-500" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Gestor de Carpetas
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Create new folder form */}
          <form onSubmit={handleCreate} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Nueva Carpeta
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Nombre de la carpeta (ej. Colección Invierno 2026)"
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="submit"
                disabled={!folderName.trim()}
                className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Crear</span>
              </button>
            </div>

            {/* Color picker */}
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1.5">
                Color de identificación:
              </span>
              <div className="flex gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      selectedColor === c ? 'scale-125 ring-2 ring-offset-2 ring-cyan-500' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </form>

          {/* Existing folders list */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Carpetas Existentes ({folders.length})
            </label>
            <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
              {folders.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: f.color || '#06b6d4' }}
                    />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      {f.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteFolder(f.id)}
                    className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded transition-colors"
                    title="Eliminar carpeta"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
};
