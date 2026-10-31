import React, { useState } from 'react';
import { GraphicElement } from '../../../types/graphicEditor';
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
  Type,
  Square,
  Circle,
  PenTool,
  Image as ImageIcon,
  Edit2
} from 'lucide-react';

interface LayersPanelProps {
  elements: GraphicElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
  onRenameElement: (id: string, newName: string) => void;
  onCreateNewLayer: () => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  elements,
  selectedElementId,
  onSelectElement,
  onToggleVisibility,
  onToggleLock,
  onDuplicateElement,
  onDeleteElement,
  onMoveLayer,
  onRenameElement,
  onCreateNewLayer
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState<string>('');

  const getElementIcon = (type: GraphicElement['type']) => {
    switch (type) {
      case 'text':
        return <Type className="w-3.5 h-3.5 text-indigo-500" />;
      case 'rect':
        return <Square className="w-3.5 h-3.5 text-cyan-500" />;
      case 'circle':
        return <Circle className="w-3.5 h-3.5 text-amber-500" />;
      case 'path':
        return <PenTool className="w-3.5 h-3.5 text-emerald-500" />;
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const handleStartRename = (el: GraphicElement) => {
    setEditingId(el.id);
    setTempName(el.name);
  };

  const handleSaveRename = (id: string) => {
    if (tempName.trim()) {
      onRenameElement(id, tempName.trim());
    }
    setEditingId(null);
  };

  // En la pila de capas gráfica, la capa superior del SVG se lista arriba (reversed)
  const displayElements = [...elements].reverse();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            Capas ({elements.length})
          </span>
        </div>
        <button
          type="button"
          onClick={onCreateNewLayer}
          title="Crear Nueva Capa de Texto"
          className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva</span>
        </button>
      </div>

      {/* Lista de Capas */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {displayElements.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No hay elementos en el diseño. Selecciona una herramienta para comenzar.
          </div>
        ) : (
          displayElements.map((el, index) => {
            const isSelected = selectedElementId === el.id;
            return (
              <div
                key={el.id}
                onClick={() => onSelectElement(el.id)}
                className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50/70 dark:bg-cyan-950/40 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {/* Lado Izquierdo: Icono y Nombre */}
                <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
                  <div className="p-1 rounded-md bg-white dark:bg-slate-800 shadow-2xs">
                    {getElementIcon(el.type)}
                  </div>

                  {editingId === el.id ? (
                    <input
                      type="text"
                      autoFocus
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onBlur={() => handleSaveRename(el.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(el.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="px-1.5 py-0.5 text-xs rounded border border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none w-full"
                    />
                  ) : (
                    <span
                      onDoubleClick={() => handleStartRename(el)}
                      className="truncate text-slate-800 dark:text-slate-200 select-none text-[11px]"
                      title="Doble clic para renombrar"
                    >
                      {el.name}
                    </span>
                  )}
                </div>

                {/* Acciones de Capa: Visibilidad, Bloqueo, Mover y Eliminar */}
                <div className="flex items-center gap-1">
                  {/* Visibilidad */}
                  <button
                    type="button"
                    title={el.visible ? 'Ocultar capa' : 'Mostrar capa'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(el.id);
                    }}
                    className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
                      !el.visible ? 'text-amber-500' : 'text-slate-400'
                    }`}
                  >
                    {el.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Bloqueo */}
                  <button
                    type="button"
                    title={el.locked ? 'Desbloquear capa' : 'Bloquear capa'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLock(el.id);
                    }}
                    className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
                      el.locked ? 'text-rose-500' : 'text-slate-400'
                    }`}
                  >
                    {el.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  </button>

                  {/* Reordenar Subir / Bajar */}
                  <div className="flex flex-col">
                    <button
                      type="button"
                      title="Traer hacia el frente"
                      disabled={index === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayer(el.id, 'up');
                      }}
                      className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      title="Enviar hacia atrás"
                      disabled={index === displayElements.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayer(el.id, 'down');
                      }}
                      className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Duplicar */}
                  <button
                    type="button"
                    title="Duplicar capa"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateElement(el.id);
                    }}
                    className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                  </button>

                  {/* Eliminar */}
                  <button
                    type="button"
                    title="Eliminar capa"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteElement(el.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
