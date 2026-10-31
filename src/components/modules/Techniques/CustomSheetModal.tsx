import React, { useState, useEffect } from 'react';
import { CustomTechniqueSheet, TechnicalParameters, PrintingTechniqueId } from '../../../types/techniques';
import { TECHNIQUES_ENCYCLOPEDIA } from '../../../constants/techniquesEncyclopedia';
import { saveCustomTechniqueSheet } from '../../../services/techniquesStorageService';
import { useAuth } from '../../../context/AuthContext';
import { X, Save, Sparkles, Building2, User, Wrench, Thermometer, Clock, Gauge, FileText, CheckCircle } from 'lucide-react';

interface CustomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (savedSheet: CustomTechniqueSheet) => void;
  editingSheet?: CustomTechniqueSheet | null;
  initialParams?: Partial<TechnicalParameters>;
  baseTechniqueId?: PrintingTechniqueId;
}

export const CustomSheetModal: React.FC<CustomSheetModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  editingSheet,
  initialParams,
  baseTechniqueId = 'dtf'
}) => {
  const { currentUser, userProfile } = useAuth();

  const selectedBaseTech = TECHNIQUES_ENCYCLOPEDIA.find((t) => t.id === (editingSheet?.baseTechniqueId || baseTechniqueId)) || TECHNIQUES_ENCYCLOPEDIA[0];

  const [title, setTitle] = useState('');
  const [techId, setTechId] = useState<PrintingTechniqueId>(baseTechniqueId);
  const [workshopName, setWorkshopName] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [equipmentBrandModel, setEquipmentBrandModel] = useState('');
  const [heatPressModel, setHeatPressModel] = useState('');
  const [consumableBrand, setConsumableBrand] = useState('');
  const [substrateFabric, setSubstrateFabric] = useState('');
  const [tempCelsius, setTempCelsius] = useState<number>(150);
  const [timeSeconds, setTimeSeconds] = useState<number>(15);
  const [pressureLevel, setPressureLevel] = useState<any>('Media-Alta');
  const [pressureDetails, setPressureDetails] = useState('4.5 Bares (60 PSI)');
  const [curingDetails, setCuringDetails] = useState('');
  const [coolingMethod, setCoolingMethod] = useState('');
  const [peelingType, setPeelingType] = useState('');
  const [prePressSeconds, setPrePressSeconds] = useState<number>(4);
  const [postPressSeconds, setPostPressSeconds] = useState<number>(6);
  const [testedWashCycles, setTestedWashCycles] = useState<number>(50);
  const [technicalNotes, setTechnicalNotes] = useState('');
  const [sourceReference, setSourceReference] = useState('');

  // Sync state whenever modal opens or editingSheet changes
  useEffect(() => {
    if (editingSheet) {
      setTitle(editingSheet.title);
      setTechId(editingSheet.baseTechniqueId);
      setWorkshopName(editingSheet.workshopName || '');
      setOperatorName(editingSheet.operatorName || '');
      setEquipmentBrandModel(editingSheet.equipmentBrandModel);
      setHeatPressModel(editingSheet.heatPressModel);
      setConsumableBrand(editingSheet.consumableBrand);
      setSubstrateFabric(editingSheet.substrateFabric);
      setTempCelsius(editingSheet.tempCelsius);
      setTimeSeconds(editingSheet.timeSeconds);
      setPressureLevel(editingSheet.pressureLevel);
      setPressureDetails(editingSheet.pressureDetails || '');
      setCuringDetails(editingSheet.curingDetails || '');
      setCoolingMethod(editingSheet.coolingMethod);
      setPeelingType(editingSheet.peelingType);
      setPrePressSeconds(editingSheet.prePressSeconds);
      setPostPressSeconds(editingSheet.postPressSeconds);
      setTestedWashCycles(editingSheet.testedWashCycles || 50);
      setTechnicalNotes(editingSheet.technicalNotes);
      setSourceReference(editingSheet.sourceReference || '');
    } else {
      const currentTech = TECHNIQUES_ENCYCLOPEDIA.find((t) => t.id === (baseTechniqueId || 'dtf')) || TECHNIQUES_ENCYCLOPEDIA[0];
      setTitle(`Calibración ${currentTech.name} Taller`);
      setTechId(currentTech.id);
      setWorkshopName(userProfile?.displayName ? `Taller de ${userProfile.displayName}` : 'Mi Taller Textil');
      setOperatorName(userProfile?.displayName || 'Operador Principal');
      setEquipmentBrandModel(currentTech.machines[0]?.recommendedBrandsModels[0] || 'Equipo Estándar');
      setHeatPressModel(currentTech.defaultParameters.machineModelReference);
      setConsumableBrand(currentTech.consumables[0]?.name || 'Consumibles Certificados');
      setSubstrateFabric(initialParams?.primaryMaterials?.[0] || currentTech.defaultParameters.primaryMaterials[0] || '100% Algodón');
      setTempCelsius(initialParams?.tempCelsiusMin || currentTech.defaultParameters.tempCelsiusMin);
      setTimeSeconds(initialParams?.timeSecondsMin || currentTech.defaultParameters.timeSecondsMin);
      setPressureLevel(initialParams?.pressureLevel || currentTech.defaultParameters.pressureLevel);
      setPressureDetails(initialParams?.pressureBars || currentTech.defaultParameters.pressureBars || '4.0 Bar');
      setCuringDetails(currentTech.defaultParameters.curingMethod);
      setCoolingMethod(initialParams?.cooling || currentTech.defaultParameters.cooling);
      setPeelingType(initialParams?.peeling || currentTech.defaultParameters.peeling);
      setPrePressSeconds(4);
      setPostPressSeconds(6);
      setTestedWashCycles(currentTech.care.certifiedWashCycles || 50);
      setTechnicalNotes('Parámetros verificados en taller para producción en serie.');
      setSourceReference('Calibración directa de taller');
    }
  }, [editingSheet, initialParams, baseTechniqueId, isOpen, userProfile]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const currentTech = TECHNIQUES_ENCYCLOPEDIA.find((t) => t.id === techId) || selectedBaseTech;

    const saved = await saveCustomTechniqueSheet({
      id: editingSheet?.id,
      ownerId: currentUser?.uid || userProfile?.uid || 'local_operator',
      title: title.trim(),
      baseTechniqueId: techId,
      baseTechniqueName: currentTech.name,
      workshopName: workshopName.trim() || undefined,
      operatorName: operatorName.trim() || undefined,
      equipmentBrandModel: equipmentBrandModel.trim() || 'Equipo de Taller',
      heatPressModel: heatPressModel.trim() || 'Prensa Térmica',
      consumableBrand: consumableBrand.trim() || 'Insumos de Taller',
      substrateFabric: substrateFabric.trim() || '100% Algodón',
      tempCelsius: Number(tempCelsius),
      timeSeconds: Number(timeSeconds),
      pressureLevel,
      pressureDetails: pressureDetails.trim() || undefined,
      curingDetails: curingDetails.trim() || undefined,
      coolingMethod: coolingMethod.trim() || 'Ambiente',
      peelingType: peelingType.trim() || 'Estándar',
      prePressSeconds: Number(prePressSeconds) || 0,
      postPressSeconds: Number(postPressSeconds) || 0,
      testedWashCycles: Number(testedWashCycles) || 30,
      technicalNotes: technicalNotes.trim() || 'Sin notas especiales.',
      sourceReference: sourceReference.trim() || 'Calibración propia de taller',
      isFavorite: editingSheet?.isFavorite ?? true
    });

    onSaved(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-cyan-950/60 text-indigo-700 dark:text-cyan-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingSheet ? 'Editar Ficha Técnica Calibrada' : 'Guardar Nueva Ficha Técnica Personalizada'}
              </h2>
              <p className="text-xs text-slate-500">
                Guarda los parámetros reales probados en las máquinas y prensas de tu taller.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Title & Technique */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Nombre de la Ficha / Calibración *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: DTF Hoodie French Terry 400g Prensa STAHLS"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Técnica de Estampado Base *
              </label>
              <select
                value={techId}
                onChange={(e) => setTechId(e.target.value as PrintingTechniqueId)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                {TECHNIQUES_ENCYCLOPEDIA.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Workshop & Operator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Nombre del Taller / Sede</span>
              </label>
              <input
                type="text"
                value={workshopName}
                onChange={(e) => setWorkshopName(e.target.value)}
                placeholder="Ej: Taller Norte - EstampaPro"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Operador / Maestro Estampador</span>
              </label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                placeholder="Ej: Carlos M. / Jefe de Prensa"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Machinery and Consumables used */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
            <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
              Maquinaria y Materiales Específicos
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Prensa Térmica / Túnel
                </label>
                <input
                  type="text"
                  value={heatPressModel}
                  onChange={(e) => setHeatPressModel(e.target.value)}
                  placeholder="Ej: STAHLS' Hotronix Fusion IQ"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Impresora / Pulpo / Plotter
                </label>
                <input
                  type="text"
                  value={equipmentBrandModel}
                  onChange={(e) => setEquipmentBrandModel(e.target.value)}
                  placeholder="Ej: Oric DTF 60 / Roland GS-24"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Consumibles (Tintas/Films/Vinilo)
                </label>
                <input
                  type="text"
                  value={consumableBrand}
                  onChange={(e) => setConsumableBrand(e.target.value)}
                  placeholder="Ej: Film KDX + Tintas DuPont"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Sustrato / Tela Específica
              </label>
              <input
                type="text"
                value={substrateFabric}
                onChange={(e) => setSubstrateFabric(e.target.value)}
                placeholder="Ej: Hoodie 80% Algodón 20% Poly French Terry 400 GSM"
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          {/* Calibrated Operational Parameters */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
              Parámetros Calibrados en Prensa Térmica
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Temperatura (°C)
                </label>
                <input
                  type="number"
                  min="0"
                  max="250"
                  value={tempCelsius}
                  onChange={(e) => setTempCelsius(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tiempo Prensa (Seg)
                </label>
                <input
                  type="number"
                  min="1"
                  max="600"
                  value={timeSeconds}
                  onChange={(e) => setTimeSeconds(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Pre-Prensado (Seg)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={prePressSeconds}
                  onChange={(e) => setPrePressSeconds(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Post-Prensado (Seg)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={postPressSeconds}
                  onChange={(e) => setPostPressSeconds(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nivel de Presión
                </label>
                <select
                  value={pressureLevel}
                  onChange={(e) => setPressureLevel(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Media-Alta">Media-Alta</option>
                  <option value="Alta">Alta</option>
                  <option value="Muy Alta">Muy Alta</option>
                  <option value="No aplica">No aplica</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Detalle Presión (Bares/PSI)
                </label>
                <input
                  type="text"
                  value={pressureDetails}
                  onChange={(e) => setPressureDetails(e.target.value)}
                  placeholder="Ej: 4.5 Bares (Nivel 6 Hotronix)"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Tipo de Pelado (Peeling)
                </label>
                <select
                  value={peelingType}
                  onChange={(e) => setPeelingType(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                >
                  <option value="Pelado en Caliente (Hot Peel: 2-4 seg)">Pelado en Caliente (2-4 seg)</option>
                  <option value="Pelado en Tibio (Warm Peel: 8-12 seg)">Pelado en Tibio (8-12 seg)</option>
                  <option value="Pelado en Frío (Cold Peel: <30°C ambiente)">Pelado en Frío (&lt;30°C)</option>
                  <option value="Pelado Instantáneo o Tibio según film">Instantáneo o Tibio</option>
                  <option value="No aplica (Impresión directa o bordado)">No aplica (Directo)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Technical Notes & Warnings */}
          <div>
            <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Instrucciones y Notas Críticas para el Operario de Taller
            </label>
            <textarea
              rows={3}
              value={technicalNotes}
              onChange={(e) => setTechnicalNotes(e.target.value)}
              placeholder="Instrucciones precisas: precalentado del plato, papel protector teflonado o kraft mate, etc."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 dark:bg-cyan-600 hover:bg-indigo-500 dark:hover:bg-cyan-500 rounded-lg shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Ficha en Taller</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
