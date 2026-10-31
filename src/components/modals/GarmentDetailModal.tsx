import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GarmentItem } from '../../types';
import { ColorPickerModal } from '../common/ColorPickerModal';
import { 
  X, 
  Edit3, 
  Copy, 
  Trash2, 
  Box, 
  Shirt, 
  Layers, 
  Maximize2, 
  DollarSign, 
  Check, 
  Palette, 
  ShieldCheck, 
  Info,
  Calendar,
  Sparkles
} from 'lucide-react';

interface GarmentDetailModalProps {
  garment: GarmentItem | null;
  onClose: () => void;
}

export const GarmentDetailModal: React.FC<GarmentDetailModalProps> = ({ garment, onClose }) => {
  const {
    updateGarment,
    deleteGarment,
    duplicateGarment,
    setGarmentToEdit,
    setIsGarmentFormModalOpen,
    setActiveModuleId
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ficha' | 'colores_partes' | 'medidas'>('colores_partes');
  const [selectedPartIndex, setSelectedPartIndex] = useState<number | null>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!garment) return null;

  const currentParts = garment.customizableParts || [
    { partId: 'cuerpo', partName: 'Cuerpo / Torso', colorHex: garment.colors[0]?.hex || '#0a0a0c' }
  ];

  const handleColorChangeForPart = (hex: string) => {
    if (selectedPartIndex === null) return;
    const updatedParts = [...currentParts];
    updatedParts[selectedPartIndex] = {
      ...updatedParts[selectedPartIndex],
      colorHex: hex
    };
    updateGarment(garment.id, { customizableParts: updatedParts });
  };

  const handleDelete = () => {
    deleteGarment(garment.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleDuplicate = () => {
    duplicateGarment(garment.id);
    onClose();
  };

  const handleEdit = () => {
    setGarmentToEdit(garment);
    setIsGarmentFormModalOpen(true);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal Dialog */}
        <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {garment.mainCategory.toUpperCase()} · {garment.subcategory.replace('_', ' ').toUpperCase()}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Ref: {garment.id}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {garment.name}
              </h2>
            </div>

            {/* Actions Bar: Duplicate, Edit, Delete */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDuplicate}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Duplicar prenda"
              >
                <Copy className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleEdit}
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Editar prenda"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Eliminar prenda"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Delete confirmation strip */}
          {showDeleteConfirm && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border-b border-rose-200 dark:border-rose-900 flex items-center justify-between text-xs text-rose-800 dark:text-rose-200">
              <span>¿Confirmas que deseas eliminar esta prenda del catálogo?</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2.5 py-1 text-xs rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-2.5 py-1 text-xs rounded bg-rose-600 text-white font-semibold"
                >
                  Sí, Eliminar
                </button>
              </div>
            </div>
          )}

          {/* Tab Selector */}
          <div className="flex items-center gap-2 px-6 pt-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('colores_partes')}
              className={`py-2 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'colores_partes'
                  ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Personalización de Partes & Color</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ficha')}
              className={`py-2 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'ficha'
                  ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Ficha Técnica & Áreas Estampables</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('medidas')}
              className={`py-2 px-3 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'medidas'
                  ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Guía de Tallas & Medidas (cm)</span>
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'colores_partes' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left: Garment Image Preview */}
                <div className="md:col-span-5 space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-850 aspect-4/3 flex items-center justify-center">
                    <img
                      src={garment.photoUrl}
                      alt={garment.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-mono flex items-center gap-1">
                      <Box className="w-3 h-3 text-cyan-400" />
                      <span>{garment.model3DName}</span>
                    </div>
                  </div>

                  {/* 3D Engine Link Note */}
                  <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-cyan-950/20 border border-indigo-100 dark:border-cyan-900/40 text-[11px] text-indigo-900 dark:text-cyan-300 flex items-center justify-between">
                    <span>Modelo 3D vinculado listo para simulación orbital en Prompt 4.</span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setActiveModuleId('probador_3d');
                      }}
                      className="font-bold hover:underline shrink-0 ml-2"
                    >
                      Ir al Probador 3D →
                    </button>
                  </div>
                </div>

                {/* Right: Section 3 Multi-part color customization */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Coloración Independiente por Partes
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Haz clic en cualquier pieza de la prenda para abrir la paleta profesional y asignarle un color específico (cuerpo, mangas, cuello rib, cordones, visera).
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {currentParts.map((part, idx) => (
                      <div
                        key={part.partId}
                        onClick={() => {
                          setSelectedPartIndex(idx);
                          setIsColorPickerOpen(true);
                        }}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-cyan-500 dark:hover:border-cyan-400 cursor-pointer transition-all shadow-2xs group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-600 shadow-xs shrink-0 group-hover:scale-105 transition-transform"
                            style={{ backgroundColor: part.colorHex }}
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white block">
                              {part.partName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 uppercase">
                              HEX: {part.colorHex}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                          <span>Cambiar Color</span>
                          <Palette className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Fabrics/colors swatches preset */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Colores Estándar del Fabricante ({garment.colors.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {garment.colors.map((c, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {c.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ficha' && (
              <div className="space-y-5">
                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="text-slate-400 text-[11px] block">Material Base</span>
                    <strong className="text-slate-900 dark:text-white font-bold block mt-0.5">
                      {garment.materialName}
                    </strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="text-slate-400 text-[11px] block">Composición</span>
                    <strong className="text-slate-900 dark:text-white font-bold block mt-0.5 truncate" title={garment.composition}>
                      {garment.composition}
                    </strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="text-slate-400 text-[11px] block">Peso / Gramaje</span>
                    <strong className="text-slate-900 dark:text-white font-bold block mt-0.5 font-mono">
                      {garment.weightGsm || 'N/D'}
                    </strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="text-slate-400 text-[11px] block">Coste Unitario Base</span>
                    <strong className="text-indigo-600 dark:text-cyan-400 font-bold block mt-0.5 font-mono tabular-nums text-sm">
                      ${garment.basePurchasePrice.toFixed(2)} USD
                    </strong>
                  </div>
                </div>

                {/* Printable Areas */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Áreas Estampables Reglamentarias
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {garment.printableAreas.map((area, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        <span>{area}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compatible Techniques */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Técnicas de Estampado Recomendadas
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {garment.compatibleTechniques.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300 border border-indigo-200 dark:border-cyan-800/50 text-xs font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Observations */}
                {garment.notes && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">Observaciones de Confección:</span>
                    {garment.notes}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'medidas' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Tabla de Medidas Reales de Taller (cm)
                    </h4>
                    <p className="text-xs text-slate-500">Tolerancia industrial de confección: ±1.5 cm</p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3">Talla</th>
                        <th className="p-3">Pecho / Ancho (cm)</th>
                        <th className="p-3">Largo Total (cm)</th>
                        <th className="p-3">Manga (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums">
                      {garment.measurements.map((m) => (
                        <tr key={m.size} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                          <td className="p-3 font-bold text-slate-900 dark:text-white font-sans">{m.size}</td>
                          <td className="p-3">{m.chestCm} cm</td>
                          <td className="p-3">{m.lengthCm} cm</td>
                          <td className="p-3">{m.sleeveCm ? `${m.sleeveCm} cm` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Color picker for selected part */}
      {selectedPartIndex !== null && (
        <ColorPickerModal
          isOpen={isColorPickerOpen}
          onClose={() => {
            setIsColorPickerOpen(false);
            setSelectedPartIndex(null);
          }}
          currentColorHex={currentParts[selectedPartIndex]?.colorHex || '#0a0a0c'}
          partName={currentParts[selectedPartIndex]?.partName}
          onSelectColor={handleColorChangeForPart}
        />
      )}
    </>
  );
};
