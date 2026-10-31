import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { PRINTING_TECHNIQUES, GARMENT_CATALOG, BlankGarmentPreset } from '../../constants/techniques';
import { PrintingTechniqueId, ProjectStatus } from '../../types';
import { X, Plus, Shirt, Layers, Check, Calendar, AlertCircle } from 'lucide-react';

export const NewProjectModal: React.FC = () => {
  const { garments, isNewProjectModalOpen, setIsNewProjectModalOpen, createProject, setActiveModuleId } = useApp();
  const { currentUser, userProfile } = useAuth();

  const garmentOptions = React.useMemo(() => {
    if (garments && garments.length > 0) {
      return garments.map((g) => ({
        id: g.id,
        name: g.name,
        material: g.materialName || g.composition,
        colors: g.colors && g.colors.length > 0 ? g.colors : [{ name: 'Base', hex: '#111827' }]
      }));
    }
    return GARMENT_CATALOG.map((g: BlankGarmentPreset) => ({
      id: g.id,
      name: g.name,
      material: g.material,
      colors: g.availableColors
    }));
  }, [garments]);

  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [selectedGarmentId, setSelectedGarmentId] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [techniqueId, setTechniqueId] = useState<PrintingTechniqueId>('dtf');
  const [quantity, setQuantity] = useState<number>(30);
  const [notes, setNotes] = useState('');
  const [deadline, setDeadline] = useState('');

  if (!isNewProjectModalOpen) return null;

  const currentGarment = garmentOptions.find((g) => g.id === selectedGarmentId) || garmentOptions[0];
  const currentColor = currentGarment?.colors[selectedColorIndex] || currentGarment?.colors[0] || { name: 'Negro', hex: '#111827' };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) return;

    createProject({
      title: title.trim(),
      ownerId: currentUser?.uid || userProfile?.uid || 'admin-master-uid',
      ownerEmail: currentUser?.email || userProfile?.email || 'harmonyestampadosr@gmail.com',
      clientName: clientName.trim(),
      garmentName: currentGarment.name,
      garmentColor: currentColor.name,
      garmentColorHex: currentColor.hex,
      techniqueId,
      quantity: Number(quantity) || 1,
      status: 'en_diseno' as ProjectStatus,
      deadline: deadline || undefined,
      notes: notes.trim() || undefined
    });

    // Reset form and close
    setTitle('');
    setClientName('');
    setNotes('');
    setIsNewProjectModalOpen(false);
    setActiveModuleId('inicio');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsNewProjectModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Nuevo Proyecto de Estampado
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Registra una nueva orden de diseño o producción para el taller.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsNewProjectModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Project Title & Client Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nombre del Proyecto *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Poleras Heavyweight Tokio Drop"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Cliente o Marca *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Harmony Wear / Club Street"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Garment Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Shirt className="w-3.5 h-3.5" />
              <span>Prenda Base</span>
            </label>
            <select
              value={selectedGarmentId}
              onChange={(e) => {
                setSelectedGarmentId(e.target.value);
                setSelectedColorIndex(0);
              }}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500"
            >
              {garmentOptions.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} — {g.material}
                </option>
              ))}
            </select>
          </div>

          {/* Garment Color Swatches */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Color de Prenda: <span className="font-normal text-slate-500">{currentColor.name}</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {currentGarment.colors.map((color: { name: string; hex: string }, idx: number) => (
                <button
                  key={`${color.name}-${idx}`}
                  type="button"
                  onClick={() => setSelectedColorIndex(idx)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                    selectedColorIndex === idx
                      ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50 dark:bg-cyan-950/30 text-indigo-900 dark:text-cyan-200'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shadow-2xs"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Technique Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Técnica Principal de Estampado</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRINTING_TECHNIQUES.map((tech) => {
                const isSelected = techniqueId === tech.id;
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => setTechniqueId(tech.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50/70 dark:bg-cyan-950/30'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {tech.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {tech.shortDesc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Cantidad Estimada de Unidades
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Fecha Estimada de Entrega
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Workshop Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Instrucciones y Notas de Taller (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Ej. Estampado en pecho 28cm de ancho, acabado tacto cero, planchado a 160°C..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500 resize-none"
            />
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsNewProjectModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-lg shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Crear y Registrar Proyecto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
