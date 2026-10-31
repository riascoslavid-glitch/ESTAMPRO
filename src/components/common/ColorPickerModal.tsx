import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ColorSystem, PRESET_TEXTILE_PALETTES, TextileColor } from '../../services/colorSystem';
import { 
  X, 
  Check, 
  Star, 
  Clock, 
  Palette, 
  Copy, 
  Pipette, 
  Sparkles 
} from 'lucide-react';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentColorHex: string;
  onSelectColor: (hex: string, name?: string) => void;
  title?: string;
  partName?: string;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  onClose,
  currentColorHex,
  onSelectColor,
  title = 'Paleta Profesional de Color Textil',
  partName
}) => {
  const {
    favoriteColors,
    addFavoriteColor,
    removeFavoriteColor,
    recentColors,
    addRecentColor
  } = useApp();

  const [hexInput, setHexInput] = useState(currentColorHex || '#0a0a0c');
  const [colorName, setColorName] = useState('Color Seleccionado');
  const [activeTab, setActiveTab] = useState<'paletas' | 'personalizado' | 'favoritos'>('paletas');
  const [copiedNotification, setCopiedNotification] = useState('');

  if (!isOpen) return null;

  const currentColorData: TextileColor = ColorSystem.parseHex(hexInput, colorName);
  const isFav = favoriteColors.includes(hexInput.toLowerCase());

  const handlePickColor = (hex: string, name = 'Color') => {
    setHexInput(hex);
    setColorName(name);
    addRecentColor(hex);
  };

  const handleApply = () => {
    addRecentColor(hexInput);
    onSelectColor(hexInput, colorName);
    onClose();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNotification(`¡${label} copiado!`);
    setTimeout(() => setCopiedNotification(''), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-500" />
              <span>{title}</span>
            </h3>
            {partName && (
              <p className="text-xs text-indigo-600 dark:text-cyan-400 font-medium mt-0.5">
                Aplicando color a: <strong>{partName}</strong>
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Color Preview & Values Card (Section 3: HEX, RGB, HSL, CMYK) */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Color preview box */}
            <div
              className="w-20 h-20 rounded-xl border-2 border-white dark:border-slate-800 shadow-md shrink-0 flex items-end justify-end p-1.5 transition-colors"
              style={{ backgroundColor: currentColorData.hex }}
            >
              <button
                type="button"
                onClick={() =>
                  isFav
                    ? removeFavoriteColor(currentColorData.hex)
                    : addFavoriteColor(currentColorData.hex)
                }
                className="p-1 rounded bg-black/40 text-white hover:scale-110 transition-transform"
                title={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    isFav ? 'fill-amber-400 text-amber-400' : 'text-white'
                  }`}
                />
              </button>
            </div>

            {/* Conversions Grid */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 w-full text-xs">
              {/* HEX */}
              <div
                onClick={() => copyToClipboard(currentColorData.hex, 'HEX')}
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-cyan-500 transition-colors"
                title="Clic para copiar"
              >
                <span className="text-[10px] text-slate-400 uppercase font-mono block">HEX</span>
                <strong className="font-mono text-slate-900 dark:text-white truncate block">
                  {currentColorData.hex.toUpperCase()}
                </strong>
              </div>

              {/* RGB */}
              <div
                onClick={() =>
                  copyToClipboard(
                    `rgb(${currentColorData.rgb.r}, ${currentColorData.rgb.g}, ${currentColorData.rgb.b})`,
                    'RGB'
                  )
                }
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-cyan-500 transition-colors"
                title="Clic para copiar"
              >
                <span className="text-[10px] text-slate-400 uppercase font-mono block">RGB</span>
                <strong className="font-mono text-slate-900 dark:text-white truncate block text-[11px]">
                  {currentColorData.rgb.r}, {currentColorData.rgb.g}, {currentColorData.rgb.b}
                </strong>
              </div>

              {/* HSL */}
              <div
                onClick={() =>
                  copyToClipboard(
                    `hsl(${currentColorData.hsl.h}, ${currentColorData.hsl.s}%, ${currentColorData.hsl.l}%)`,
                    'HSL'
                  )
                }
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-cyan-500 transition-colors"
                title="Clic para copiar"
              >
                <span className="text-[10px] text-slate-400 uppercase font-mono block">HSL</span>
                <strong className="font-mono text-slate-900 dark:text-white truncate block text-[11px]">
                  {currentColorData.hsl.h}°, {currentColorData.hsl.s}%, {currentColorData.hsl.l}%
                </strong>
              </div>

              {/* CMYK */}
              <div
                onClick={() =>
                  copyToClipboard(
                    `C:${currentColorData.cmyk.c}% M:${currentColorData.cmyk.m}% Y:${currentColorData.cmyk.y}% K:${currentColorData.cmyk.k}%`,
                    'CMYK'
                  )
                }
                className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-cyan-500 transition-colors"
                title="Referencia para tintas de taller"
              >
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 uppercase font-mono block">CMYK Ref</span>
                <strong className="font-mono text-slate-900 dark:text-white truncate block text-[11px]">
                  {currentColorData.cmyk.c}/{currentColorData.cmyk.m}/{currentColorData.cmyk.y}/{currentColorData.cmyk.k}
                </strong>
              </div>
            </div>
          </div>

          {copiedNotification && (
            <div className="mt-2 text-center text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              {copiedNotification}
            </div>
          )}
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-2 border-b border-slate-200 dark:border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('paletas')}
            className={`py-2 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'paletas'
                ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Paletas Textiles
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('personalizado')}
            className={`py-2 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'personalizado'
                ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Selector Personalizado
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('favoritos')}
            className={`py-2 px-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'favoritos'
                ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Favoritos ({favoriteColors.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'paletas' && (
            <div className="space-y-4">
              {PRESET_TEXTILE_PALETTES.map((palette) => (
                <div key={palette.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {palette.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{palette.description}</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {palette.colors.map((c) => {
                      const isSelected = hexInput.toLowerCase() === c.hex.toLowerCase();
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => handlePickColor(c.hex, c.name)}
                          className={`group p-2 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50/50 dark:bg-cyan-950/30'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div
                            className="w-full h-8 rounded-lg border border-slate-300 dark:border-slate-700 shadow-2xs mb-1.5 flex items-center justify-center"
                            style={{ backgroundColor: c.hex }}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-sm" />}
                          </div>
                          <div className="text-[11px] font-medium text-slate-900 dark:text-white truncate">
                            {c.name}
                          </div>
                          <div className="text-[9px] font-mono text-slate-400 uppercase">
                            {c.hex}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'personalizado' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={hexInput}
                  onChange={(e) => handlePickColor(e.target.value, 'Color Personalizado')}
                  className="w-14 h-14 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700"
                />
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Código HEX
                  </label>
                  <input
                    type="text"
                    value={hexInput}
                    onChange={(e) => handlePickColor(e.target.value, 'Color Personalizado')}
                    className="w-full px-3 py-2 text-xs font-mono uppercase rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Recent colors strip */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Historial de Colores Recientes</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {recentColors.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => handlePickColor(hex, 'Color Reciente')}
                      className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 shadow-2xs hover:scale-110 transition-transform"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'favoritos' && (
            <div className="space-y-3">
              {favoriteColors.length === 0 ? (
                <div className="text-center p-8 text-xs text-slate-400">
                  No tienes colores favoritos guardados. Pulsa la estrella en la vista previa para guardar colores.
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                  {favoriteColors.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => handlePickColor(hex, 'Color Favorito')}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-center hover:border-cyan-500 transition-colors group"
                    >
                      <div
                        className="w-full h-8 rounded-lg border border-slate-300 dark:border-slate-700 shadow-2xs mb-1"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">
                        {hex}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-lg shadow-sm transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Aplicar Color</span>
          </button>
        </div>
      </div>
    </div>
  );
};
