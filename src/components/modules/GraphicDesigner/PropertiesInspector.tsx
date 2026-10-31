import React from 'react';
import { GraphicElement } from '../../../types/graphicEditor';
import { TYPOGRAPHY_PRESETS } from '../../../services/graphicEditor/typographyPresets';
import {
  Sliders,
  Type,
  Palette,
  Maximize2,
  RotateCw,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sun,
  Shield,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PropertiesInspectorProps {
  element: GraphicElement | null;
  onUpdateElement: (id: string, updates: Partial<GraphicElement>) => void;
  onAlignElement: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onOpenInImageEditor?: (imageUri: string) => void;
}

export const PropertiesInspector: React.FC<PropertiesInspectorProps> = ({
  element,
  onUpdateElement,
  onAlignElement,
  onOpenInImageEditor
}) => {
  if (!element) {
    return (
      <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
        <Sliders className="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p className="font-semibold">Sin elemento seleccionado</p>
        <p className="text-[11px] mt-1">Haz clic en cualquier objeto del lienzo para editar sus propiedades de color, texto, curvas o dimensiones.</p>
      </div>
    );
  }

  const isText = element.type === 'text';

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 overflow-y-auto p-4 space-y-5 text-xs">
      {/* 1. Header con Nombre del Elemento y Tipo */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-cyan-400">
            Propiedades · {element.type.toUpperCase()}
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
            {element.name}
          </h3>
        </div>
        <div className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
          {element.width.toFixed(1)} x {element.height.toFixed(1)} cm
        </div>
      </div>

      {/* Acción directa de edición si es imagen */}
      {element.type === 'image' && element.imageSrc && (
        <div className="p-3 bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-slate-800 dark:to-cyan-950/30 rounded-xl border border-indigo-200 dark:border-cyan-800 space-y-2">
          <div className="flex items-center gap-1.5 text-indigo-700 dark:text-cyan-400 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Editor Avanzado de Imágenes</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Elimina el fondo con IA, ajusta nitidez, recorta o cambia colores en el estudio de preparación fotográfica.
          </p>
          <button
            type="button"
            onClick={() => onOpenInImageEditor?.(element.imageSrc!)}
            className="w-full py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Abrir en Editor de Imágenes</span>
          </button>
        </div>
      )}

      {/* 2. Alineación Rápida en el Lienzo */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
          Alinear en el Lienzo:
        </label>
        <div className="grid grid-cols-6 gap-1">
          <button
            type="button"
            title="Alinear Izquierda"
            onClick={() => onAlignElement('left')}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Centrar Horizontalmente"
            onClick={() => onAlignElement('center')}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Alinear Derecha"
            onClick={() => onAlignElement('right')}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 flex items-center justify-center cursor-pointer"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Alinear Arriba"
            onClick={() => onAlignElement('top')}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 flex items-center justify-center text-[10px] font-mono cursor-pointer"
          >
            Top
          </button>
          <button
            type="button"
            title="Centrar Verticalmente"
            onClick={() => onAlignElement('middle')}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 flex items-center justify-center text-[10px] font-mono cursor-pointer"
          >
            Mid
          </button>
          <button
            type="button"
            title="Alinear Abajo"
            onClick={() => onAlignElement('bottom')}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 flex items-center justify-center text-[10px] font-mono cursor-pointer"
          >
            Btm
          </button>
        </div>
      </div>

      {/* 3. Posición, Dimensiones (cm) y Rotación */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
          Geometría y Escala (cm):
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500">Ancho (cm):</span>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={element.width}
              onChange={(e) => onUpdateElement(element.id, { width: Math.max(0.5, parseFloat(e.target.value) || 1) })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500">Alto (cm):</span>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={element.height}
              onChange={(e) => onUpdateElement(element.id, { height: Math.max(0.5, parseFloat(e.target.value) || 1) })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500">Rotación (°):</span>
            <input
              type="number"
              min="-180"
              max="180"
              value={element.rotation}
              onChange={(e) => onUpdateElement(element.id, { rotation: parseInt(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500">Opacidad (%):</span>
            <input
              type="number"
              min="10"
              max="100"
              value={Math.round(element.opacity * 100)}
              onChange={(e) => onUpdateElement(element.id, { opacity: (parseInt(e.target.value) || 100) / 100 })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* 4. Propiedades Específicas de Texto */}
      {isText && (
        <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-indigo-500" />
            <span>Edición de Texto & Tipografía:</span>
          </label>

          {/* Campo de contenido */}
          <textarea
            rows={2}
            value={element.text || ''}
            onChange={(e) => onUpdateElement(element.id, { text: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs resize-none"
            placeholder="Texto del estampado..."
          />

          {/* Selector de Fuente */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500">Tipografía de Taller:</span>
            <select
              value={element.fontFamily || TYPOGRAPHY_PRESETS[0].family}
              onChange={(e) => onUpdateElement(element.id, { fontFamily: e.target.value })}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none"
            >
              {TYPOGRAPHY_PRESETS.map((t) => (
                <option key={t.id} value={t.family}>
                  {t.name} ({t.category})
                </option>
              ))}
            </select>
          </div>

          {/* Estilo: Negrita, Cursiva, Alineación */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onUpdateElement(element.id, { fontWeight: element.fontWeight === 'bold' ? 'normal' : 'bold' })}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                element.fontWeight === 'bold'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-cyan-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateElement(element.id, { fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                element.fontStyle === 'italic'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-cyan-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />

            <button
              type="button"
              onClick={() => onUpdateElement(element.id, { textAlign: 'left' })}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                element.textAlign === 'left' ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-cyan-400' : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateElement(element.id, { textAlign: 'center' })}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                element.textAlign === 'center' ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-cyan-400' : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateElement(element.id, { textAlign: 'right' })}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                element.textAlign === 'right' ? 'border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-cyan-400' : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Curvatura / Arco de Texto (Circular Text) */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                Texto en Arco / Curvado:
              </span>
              <input
                type="checkbox"
                checked={element.isCurved || false}
                onChange={(e) => onUpdateElement(element.id, { isCurved: e.target.checked })}
                className="rounded accent-indigo-600 w-4 h-4 cursor-pointer"
              />
            </div>

            {element.isCurved && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Radio de Curva:</span>
                  <span className="font-mono">{element.curveRadius || 12} cm</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="1"
                  value={element.curveRadius || 12}
                  onChange={(e) => onUpdateElement(element.id, { curveRadius: parseInt(e.target.value) || 12 })}
                  className="w-full accent-indigo-600 dark:accent-cyan-400 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Espaciado (Tracking) e Inclinación (Skew) */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500">Tracking / Espaciado:</span>
              <input
                type="number"
                min="-5"
                max="30"
                value={element.letterSpacing || 0}
                onChange={(e) => onUpdateElement(element.id, { letterSpacing: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500">Inclinación (Skew °):</span>
              <input
                type="number"
                min="-45"
                max="45"
                value={element.skewX || 0}
                onChange={(e) => onUpdateElement(element.id, { skewX: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* 5. Relleno y Color */}
      <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>Color de Relleno:</span>
          <span className="font-mono text-[10px] text-slate-400">{element.fill}</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={element.fill === 'transparent' ? '#ffffff' : typeof element.fill === 'string' ? element.fill : '#ffffff'}
            onChange={(e) => onUpdateElement(element.id, { fill: e.target.value })}
            className="w-9 h-9 p-0.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent cursor-pointer"
          />
          <button
            type="button"
            onClick={() => onUpdateElement(element.id, { fill: 'transparent' })}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer ${
              element.fill === 'transparent'
                ? 'border-indigo-600 bg-indigo-50 dark:bg-cyan-950/40 text-indigo-600 dark:text-cyan-400'
                : 'border-slate-200 dark:border-slate-700'
            }`}
          >
            Transparente
          </button>
        </div>
      </div>

      {/* 6. Contorno (Stroke / Delineado serigráfico) */}
      <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>Contorno / Borde Serigráfico:</span>
          <span className="font-mono text-[10px] text-slate-400">{element.strokeWidth} px</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={element.stroke === 'transparent' ? '#000000' : element.stroke}
            onChange={(e) => onUpdateElement(element.id, { stroke: e.target.value })}
            className="w-9 h-9 p-0.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-transparent cursor-pointer"
          />
          <input
            type="number"
            min="0"
            max="40"
            value={element.strokeWidth}
            onChange={(e) => onUpdateElement(element.id, { strokeWidth: Math.max(0, parseInt(e.target.value) || 0) })}
            className="w-20 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
            placeholder="Grosor"
          />
          <button
            type="button"
            onClick={() => onUpdateElement(element.id, { stroke: 'transparent', strokeWidth: 0 })}
            className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            Sin contorno
          </button>
        </div>

        {/* Estilo de línea */}
        {element.strokeWidth > 0 && element.stroke !== 'transparent' && (
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400">Estilo:</span>
            {[
              { id: 'solid', label: 'Sólido' },
              { id: 'dashed', label: 'Guiones' },
              { id: 'dotted', label: 'Puntos' }
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onUpdateElement(element.id, { strokeDash: st.id as any })}
                className={`px-2 py-0.5 rounded text-[10px] font-medium border cursor-pointer ${
                  (element.strokeDash || 'solid') === st.id
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-cyan-950/40 text-indigo-600 dark:text-cyan-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-500'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
