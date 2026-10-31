import React, { useState } from 'react';
import { ProductionEquipmentProfile } from '../../../types/productionAssistant';
import { PrintingTechniqueId } from '../../../types/techniques';
import { TECHNIQUES_ENCYCLOPEDIA } from '../../../constants/techniquesEncyclopedia';
import { 
  saveEquipmentProfile, 
  deleteEquipmentProfile 
} from '../../../services/productionAssistantService';
import { 
  X, 
  Sliders, 
  Plus, 
  Trash2, 
  Check, 
  Cpu, 
  Layers, 
  Thermometer, 
  Clock, 
  Gauge, 
  Sparkles,
  Building2
} from 'lucide-react';

interface ProductionProfilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: ProductionEquipmentProfile[];
  onSelectProfile: (profile: ProductionEquipmentProfile) => void;
  onRefreshProfiles: () => void;
}

export const ProductionProfilesModal: React.FC<ProductionProfilesModalProps> = ({
  isOpen,
  onClose,
  profiles,
  onSelectProfile,
  onRefreshProfiles
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [baseTechniqueId, setBaseTechniqueId] = useState<PrintingTechniqueId>('dtf');
  const [machineBrandModel, setMachineBrandModel] = useState('');
  const [heatPressModel, setHeatPressModel] = useState('');
  const [consumableBrand, setConsumableBrand] = useState('');
  const [substrateComposition, setSubstrateComposition] = useState('');
  const [defaultTempC, setDefaultTempC] = useState<number>(150);
  const [defaultTimeSec, setDefaultTimeSec] = useState<number>(14);
  const [defaultPressureLevel, setDefaultPressureLevel] = useState('Media-Alta');
  const [defaultPeeling, setDefaultPeeling] = useState('Pelado en Frío (<28°C)');
  const [safetyNotes, setSafetyNotes] = useState('');

  if (!isOpen) return null;

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await saveEquipmentProfile({
      ownerId: 'operator',
      name: name.trim(),
      description: description.trim() || undefined,
      baseTechniqueId,
      machineBrandModel: machineBrandModel.trim() || 'Prensa Térmica Estándar',
      heatPressModel: heatPressModel.trim() || 'Prensa Plana de Taller',
      consumableBrand: consumableBrand.trim() || 'Consumibles Homologados',
      substrateComposition: substrateComposition.trim() || '100% Algodón',
      defaultTempC: Number(defaultTempC),
      defaultTimeSec: Number(defaultTimeSec),
      defaultPressureLevel,
      defaultPeeling,
      safetyNotes: safetyNotes.trim() || undefined
    });

    setIsCreating(false);
    onRefreshProfiles();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este perfil guardado?')) {
      await deleteEquipmentProfile(id);
      onRefreshProfiles();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-cyan-950/60 text-indigo-700 dark:text-cyan-300">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Perfiles de Máquinas y Materiales</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300">
                  {profiles.length} guardados
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Guarda y carga combinaciones frecuentes de máquinas, prensas y telas con 1 solo click.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCreating && (
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 dark:bg-cyan-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Perfil</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {isCreating ? (
            <form onSubmit={handleCreateProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nombre del Perfil *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: DTF Hoodie French Terry STAHLS"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Técnica Base *
                  </label>
                  <select
                    value={baseTechniqueId}
                    onChange={(e) => setBaseTechniqueId(e.target.value as PrintingTechniqueId)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    {TECHNIQUES_ENCYCLOPEDIA.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Prensa Térmica
                  </label>
                  <input
                    type="text"
                    value={heatPressModel}
                    onChange={(e) => setHeatPressModel(e.target.value)}
                    placeholder="Ej: Hotronix Fusion IQ"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Máquina / Impresora
                  </label>
                  <input
                    type="text"
                    value={machineBrandModel}
                    onChange={(e) => setMachineBrandModel(e.target.value)}
                    placeholder="Ej: Oric DTF 60"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Consumibles
                  </label>
                  <input
                    type="text"
                    value={consumableBrand}
                    onChange={(e) => setConsumableBrand(e.target.value)}
                    placeholder="Ej: Film KDX + TPU Media"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Sustrato / Tela Calibrada
                </label>
                <input
                  type="text"
                  value={substrateComposition}
                  onChange={(e) => setSubstrateComposition(e.target.value)}
                  placeholder="Ej: 100% Algodón Peinado Ring-Spun 240 GSM"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Temperatura (°C)
                  </label>
                  <input
                    type="number"
                    value={defaultTempC}
                    onChange={(e) => setDefaultTempC(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tiempo (Seg)
                  </label>
                  <input
                    type="number"
                    value={defaultTimeSec}
                    onChange={(e) => setDefaultTimeSec(Number(e.target.value))}
                    className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Presión
                  </label>
                  <select
                    value={defaultPressureLevel}
                    onChange={(e) => setDefaultPressureLevel(e.target.value)}
                    className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                  >
                    <option value="Media">Media</option>
                    <option value="Media-Alta">Media-Alta</option>
                    <option value="Alta">Alta</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Pelado
                  </label>
                  <select
                    value={defaultPeeling}
                    onChange={(e) => setDefaultPeeling(e.target.value)}
                    className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                  >
                    <option value="Pelado en Frío (<28°C)">En Frío</option>
                    <option value="Pelado en Caliente (Hot Peel: 2-4 seg)">En Caliente</option>
                    <option value="Pelado en Tibio (Warm Peel)">En Tibio</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold"
                >
                  Guardar Perfil
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {profiles.map((prof) => (
                <div
                  key={prof.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-cyan-500 transition-all space-y-3 text-xs flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-cyan-950/60 text-indigo-700 dark:text-cyan-300 border border-indigo-200 dark:border-cyan-800/50">
                          {prof.baseTechniqueId.toUpperCase()}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">
                          {prof.name}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDelete(prof.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Eliminar perfil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {prof.description || `${prof.heatPressModel} · ${prof.substrateComposition}`}
                    </p>

                    <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[11px] bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Temp</span>
                        <strong className="text-slate-900 dark:text-white font-bold">{prof.defaultTempC}°C</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Tiempo</span>
                        <strong className="text-slate-900 dark:text-white font-bold">{prof.defaultTimeSec}s</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Presión</span>
                        <strong className="text-slate-900 dark:text-white font-bold truncate block">{prof.defaultPressureLevel}</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectProfile(prof);
                      onClose();
                    }}
                    className="w-full py-1.5 rounded-lg bg-indigo-50 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-cyan-600 font-bold text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Cargar en el Asistente</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Configuraciones guardadas accesibles sin conexión</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
