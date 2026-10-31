import React, { useState } from 'react';
import { PrePressMachine, PrintFormat, MachineCategory } from '../../../types/printPreparation';
import { X, Plus, Trash2, Printer, Check, Info } from 'lucide-react';

interface PrepressMachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  machines: PrePressMachine[];
  onSaveMachine: (machine: PrePressMachine) => void;
  onDeleteMachine: (id: string) => void;
  selectedMachineId: string;
  onSelectMachine: (id: string) => void;
}

export const PrepressMachineModal: React.FC<PrepressMachineModalProps> = ({
  isOpen,
  onClose,
  machines,
  onSaveMachine,
  onDeleteMachine,
  selectedMachineId,
  onSelectMachine
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<PrePressMachine>>({
    name: '',
    category: 'dtf',
    categoryLabel: 'DTF Industrial',
    model: '',
    bedWidthMm: 600,
    bedHeightMm: 1200,
    maxDpi: 1440,
    recommendedDpi: 300,
    supportedFormats: ['TIFF', 'PNG', 'PDF'],
    recommendedRip: '',
    ripInstructions: '',
    requiresMirror: true,
    requiresWhiteUnderbase: true,
    defaultBleedMm: 2,
    defaultMarginMm: 8
  });

  if (!isOpen) return null;

  const allFormats: PrintFormat[] = ['PNG', 'JPG', 'SVG', 'PDF', 'TIFF', 'EPS'];

  const handleToggleFormat = (fmt: PrintFormat) => {
    const current = formData.supportedFormats || [];
    if (current.includes(fmt)) {
      setFormData({
        ...formData,
        supportedFormats: current.filter((f) => f !== fmt)
      });
    } else {
      setFormData({
        ...formData,
        supportedFormats: [...current, fmt]
      });
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.model) return;

    const newMachine: PrePressMachine = {
      id: `custom_machine_${Date.now()}`,
      name: formData.name,
      category: formData.category || 'dtf',
      categoryLabel: formData.categoryLabel || 'Equipo Personalizado',
      model: formData.model,
      bedWidthMm: Number(formData.bedWidthMm) || 600,
      bedHeightMm: Number(formData.bedHeightMm) || 1000,
      maxDpi: Number(formData.maxDpi) || 1440,
      recommendedDpi: Number(formData.recommendedDpi) || 300,
      supportedFormats: formData.supportedFormats?.length ? formData.supportedFormats : ['PNG', 'PDF'],
      recommendedRip: formData.recommendedRip || 'Software RIP del Fabricante',
      ripInstructions: formData.ripInstructions || 'Exportar archivo compatible e importar en el RIP del equipo.',
      requiresMirror: Boolean(formData.requiresMirror),
      requiresWhiteUnderbase: Boolean(formData.requiresWhiteUnderbase),
      defaultBleedMm: Number(formData.defaultBleedMm) || 2,
      defaultMarginMm: Number(formData.defaultMarginMm) || 5,
      isCustom: true
    };

    onSaveMachine(newMachine);
    onSelectMachine(newMachine.id);
    setIsCreatingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Parque de Máquinas & RIPs de Producción
              </h2>
              <p className="text-xs text-slate-400">
                Configure impresoras, camas de impresión y formatos admitidos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Realism Notice */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              Cada máquina física requiere drivers y software RIP específico (Wasatch, Cadlink, Caldera, VersaWorks). Al configurar su máquina, el sistema validará automáticamente si su diseño cabe en la cama y generará los archivos en el formato correcto para descargar y enviar al RIP.
            </span>
          </div>

          {!isCreatingNew ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200">
                  Máquinas Registradas ({machines.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Agregar Nueva Máquina
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {machines.map((m) => {
                  const isSelected = selectedMachineId === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => onSelectMachine(m.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-950/20 ring-1 ring-cyan-500/40'
                          : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <span className="text-xs font-semibold text-slate-200">{m.name}</span>
                            <div className="text-[11px] text-cyan-400 font-mono">{m.model}</div>
                          </div>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Activa
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-400 space-y-1 mb-3">
                          <div>
                            Cama física:{' '}
                            <strong className="text-slate-300 font-mono">
                              {m.bedWidthMm} x {m.bedHeightMm} mm
                            </strong>
                          </div>
                          <div>
                            DPI óptimo:{' '}
                            <strong className="text-slate-300 font-mono">
                              {m.recommendedDpi} DPI
                            </strong>{' '}
                            (Máx: {m.maxDpi})
                          </div>
                          <div>
                            RIP habitual: <span className="text-slate-300">{m.recommendedRip}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">
                          Formatos: {m.supportedFormats.join(', ')}
                        </span>
                        {m.isCustom && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteMachine(m.id);
                            }}
                            className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded transition-colors"
                            title="Eliminar máquina personalizada"
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
          ) : (
            /* Formulario para agregar nueva máquina */
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-semibold text-slate-100">
                  Registrar Máquina de Producción
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nombre Descriptivo:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Epson F570 Taller Principal"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Modelo o Fabricante:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: SC-F570 24 Pulgadas"
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Categoría de Técnica:
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as MachineCategory,
                        categoryLabel: e.target.selectedOptions[0].text
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="dtf">DTF (Direct to Film)</option>
                    <option value="dtg">DTG (Direct to Garment)</option>
                    <option value="sublimacion">Sublimación</option>
                    <option value="serigrafia">Serigrafía / Fotolitos</option>
                    <option value="plotter_corte">Plotter de Corte Vinilo</option>
                    <option value="uv_dtf">UV DTF</option>
                    <option value="bordado">Bordado Industrial</option>
                    <option value="transfer_laser">Transfer Láser / Tóner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Software RIP Recomendado:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Wasatch SoftRIP, Cadlink, etc."
                    value={formData.recommendedRip || ''}
                    onChange={(e) => setFormData({ ...formData, recommendedRip: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Ancho Cama / Bobina (mm):
                  </label>
                  <input
                    type="number"
                    value={formData.bedWidthMm || 600}
                    onChange={(e) => setFormData({ ...formData, bedWidthMm: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Largo Cama / Tirada (mm):
                  </label>
                  <input
                    type="number"
                    value={formData.bedHeightMm || 1200}
                    onChange={(e) => setFormData({ ...formData, bedHeightMm: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    DPI Recomendado:
                  </label>
                  <input
                    type="number"
                    value={formData.recommendedDpi || 300}
                    onChange={(e) =>
                      setFormData({ ...formData, recommendedDpi: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Sangrado por Defecto (mm):
                  </label>
                  <input
                    type="number"
                    value={formData.defaultBleedMm || 2}
                    onChange={(e) =>
                      setFormData({ ...formData, defaultBleedMm: Number(e.target.value) })
                    }
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Formatos soportados */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Formatos aceptados por el RIP de este equipo:
                </label>
                <div className="flex flex-wrap gap-2">
                  {allFormats.map((fmt) => {
                    const isChecked = formData.supportedFormats?.includes(fmt);
                    return (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => handleToggleFormat(fmt)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          isChecked
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {fmt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botón Guardar */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
                >
                  Guardar Máquina
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Aceptar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
