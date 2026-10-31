import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { TECHNIQUES_ENCYCLOPEDIA } from '../../constants/techniquesEncyclopedia';
import { DetailedTechniqueSheet, CustomTechniqueSheet, TechnicalParameters, PrintingTechniqueId } from '../../types/techniques';
import { TechniqueSheetDetail } from './Techniques/TechniqueSheetDetail';
import { TechniqueComparisonModal } from './Techniques/TechniqueComparisonModal';
import { CustomSheetModal } from './Techniques/CustomSheetModal';
import { CustomSheetsManager } from './Techniques/CustomSheetsManager';
import { getCustomTechniqueSheets } from '../../services/techniquesStorageService';
import {
  Layers,
  ArrowLeft,
  Search,
  Scale,
  Sparkles,
  ShieldCheck,
  Filter,
  Plus,
  BookOpen,
  CheckCircle2,
  Sliders,
  Printer,
  ChevronRight,
  Flame,
  Shirt,
  X
} from 'lucide-react';

export const TechniquesView: React.FC = () => {
  const { setActiveModuleId, setIsNewProjectModalOpen } = useApp();
  const { currentUser } = useAuth();

  // Navigation mode: 'enciclopedia' | 'mis_fichas'
  const [activeViewMode, setActiveViewMode] = useState<'enciclopedia' | 'mis_fichas'>('enciclopedia');

  // Currently selected technique for detailed inspection
  const [selectedTechId, setSelectedTechId] = useState<PrintingTechniqueId>('dtf');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [fabricFilter, setFabricFilter] = useState<'todos' | 'algodon' | 'poliester' | 'mezclas' | 'rigidos'>('todos');
  const [volumeFilter, setVolumeFilter] = useState<'todos' | 'unitaria' | 'mediana' | 'industrial'>('todos');
  const [finishFilter, setFinishFilter] = useState<'todos' | 'tacto_cero' | 'suave' | 'relieve_3d' | 'metalico_reflectivo' | 'bordado'>('todos');

  // Comparison State (list of techniques currently being compared)
  const [comparedTechniques, setComparedTechniques] = useState<DetailedTechniqueSheet[]>(() => {
    // Default with DTF and Serigrafía for instant comparison utility
    return [TECHNIQUES_ENCYCLOPEDIA[0], TECHNIQUES_ENCYCLOPEDIA[4]];
  });
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);

  // Custom sheets state
  const [customSheets, setCustomSheets] = useState<CustomTechniqueSheet[]>([]);
  const [isCustomSheetModalOpen, setIsCustomSheetModalOpen] = useState(false);
  const [editingCustomSheet, setEditingCustomSheet] = useState<CustomTechniqueSheet | null>(null);
  const [initialCustomParams, setInitialCustomParams] = useState<Partial<TechnicalParameters> | undefined>(undefined);

  // Load custom sheets on mount and when auth changes
  const reloadCustomSheets = async () => {
    const list = await getCustomTechniqueSheets(currentUser?.uid);
    setCustomSheets(list);
  };

  useEffect(() => {
    reloadCustomSheets();
  }, [currentUser]);

  // Selected technique object
  const currentTech = useMemo(() => {
    return TECHNIQUES_ENCYCLOPEDIA.find((t) => t.id === selectedTechId) || TECHNIQUES_ENCYCLOPEDIA[0];
  }, [selectedTechId]);

  // Filtered Encyclopedia techniques
  const filteredTechniques = useMemo(() => {
    return TECHNIQUES_ENCYCLOPEDIA.filter((tech) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = tech.name.toLowerCase().includes(q);
        const inDesc = tech.shortDesc.toLowerCase().includes(q) || tech.fullDesc.toLowerCase().includes(q);
        const inFabrics = tech.compatibleFabrics.some((f) => f.fabric.toLowerCase().includes(q) || f.notes.toLowerCase().includes(q));
        const inMachines = tech.machines.some((m) => m.type.toLowerCase().includes(q) || m.recommendedBrandsModels.some((b) => b.toLowerCase().includes(q)));
        const inConsumables = tech.consumables.some((c) => c.name.toLowerCase().includes(q) || c.recommendedBrands.some((b) => b.toLowerCase().includes(q)));
        const inProcedure = tech.procedure.some((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
        const inProblems = tech.commonProblems.some((cp) => cp.symptom.toLowerCase().includes(q) || cp.probableCause.toLowerCase().includes(q) || cp.technicalSolution.toLowerCase().includes(q));

        if (!inName && !inDesc && !inFabrics && !inMachines && !inConsumables && !inProcedure && !inProblems) {
          return false;
        }
      }

      // 2. Fabric Filter
      if (fabricFilter === 'algodon') {
        const hasCotton = tech.compatibleFabrics.some((f) => f.fabric.toLowerCase().includes('algodón') && (f.rating === 'Excelente' || f.rating === 'Compatible con ajuste'));
        if (!hasCotton) return false;
      } else if (fabricFilter === 'poliester') {
        const hasPoly = tech.compatibleFabrics.some((f) => f.fabric.toLowerCase().includes('poliéster') && (f.rating === 'Excelente' || f.rating === 'Compatible con ajuste'));
        if (!hasPoly) return false;
      } else if (fabricFilter === 'mezclas') {
        const hasMix = tech.compatibleFabrics.some((f) => f.fabric.toLowerCase().includes('mezcla') || f.fabric.toLowerCase().includes('poly-cotton'));
        if (!hasMix) return false;
      } else if (fabricFilter === 'rigidos') {
        const hasRigid = tech.compatibleFabrics.some((f) => f.fabric.toLowerCase().includes('rígido') || f.fabric.toLowerCase().includes('accesorio') || f.fabric.toLowerCase().includes('cuero'));
        if (!hasRigid) return false;
      }

      // 3. Volume Filter
      if (volumeFilter === 'unitaria') {
        if (tech.comparisonMetrics.quantityFlexibilityScore < 9) return false;
      } else if (volumeFilter === 'mediana') {
        if (tech.comparisonMetrics.quantityFlexibilityScore < 6) return false;
      } else if (volumeFilter === 'industrial') {
        if (tech.comparisonMetrics.costPerUnitBulkRun !== 'Muy Económico') return false;
      }

      // 4. Finish Filter
      if (finishFilter === 'tacto_cero') {
        if (tech.finishing.touch !== 'Tacto Cero (Inapreciable)') return false;
      } else if (finishFilter === 'suave') {
        if (!tech.finishing.touch.includes('Suave') && tech.finishing.touch !== 'Tacto Cero (Inapreciable)') return false;
      } else if (finishFilter === 'relieve_3d') {
        if (!tech.finishing.touch.includes('3D') && tech.finishing.touch !== 'Aterciopelado') return false;
      } else if (finishFilter === 'metalico_reflectivo') {
        if (tech.finishing.gloss !== 'Metálico Espejo' && tech.finishing.gloss !== 'Reflectivo de Seguridad') return false;
      } else if (finishFilter === 'bordado') {
        if (tech.finishing.touch !== 'Puntadas Bordadas') return false;
      }

      return true;
    });
  }, [searchQuery, fabricFilter, volumeFilter, finishFilter]);

  // Comparison Handlers
  const handleToggleComparison = (tech: DetailedTechniqueSheet) => {
    setComparedTechniques((prev) => {
      const exists = prev.some((t) => t.id === tech.id);
      if (exists) {
        return prev.filter((t) => t.id !== tech.id);
      } else {
        if (prev.length >= 4) {
          alert('Puedes comparar un máximo de 4 técnicas simultáneamente en pantalla.');
          return prev;
        }
        return [...prev, tech];
      }
    });
  };

  const handleRemoveFromComparison = (techId: string) => {
    setComparedTechniques((prev) => prev.filter((t) => t.id !== techId));
  };

  const handleStartProject = (techId: string) => {
    setIsNewProjectModalOpen(true);
  };

  const handleOpenCustomModalForCurrent = (initialParams?: Partial<TechnicalParameters>) => {
    setEditingCustomSheet(null);
    setInitialCustomParams(initialParams);
    setIsCustomSheetModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-2 sm:py-4">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveModuleId('inicio')}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Módulo 7 · Centro Técnico de Consulta
              </span>
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-indigo-50 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300 border border-indigo-200 dark:border-cyan-800/50">
                17 Técnicas Calibradas
              </span>
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                FESPA &amp; SGIA Verified
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <Layers className="w-7 h-7 text-indigo-600 dark:text-cyan-400" />
              <span>Enciclopedia Profesional de Técnicas de Estampado</span>
            </h1>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
          {/* Toggle View Mode Buttons */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveViewMode('enciclopedia')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeViewMode === 'enciclopedia'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Enciclopedia (17)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveViewMode('mis_fichas')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeViewMode === 'mis_fichas'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
              <span>Mis Fichas de Taller ({customSheets.length})</span>
            </button>
          </div>

          {/* Comparador Button */}
          <button
            type="button"
            onClick={() => setIsComparisonModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-400 dark:hover:border-cyan-500 transition-colors shadow-xs"
          >
            <Scale className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <span>Comparador</span>
            {comparedTechniques.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 dark:bg-cyan-950 text-indigo-700 dark:text-cyan-300 font-extrabold">
                {comparedTechniques.length}
              </span>
            )}
          </button>

          {/* New Project Button */}
          <button
            type="button"
            onClick={() => setIsNewProjectModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 dark:bg-cyan-600 hover:bg-indigo-500 dark:hover:bg-cyan-500 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      {/* Main Content Area based on View Mode */}
      {activeViewMode === 'mis_fichas' ? (
        <CustomSheetsManager
          sheets={customSheets}
          onOpenCreateModal={() => {
            setEditingCustomSheet(null);
            setInitialCustomParams(undefined);
            setIsCustomSheetModalOpen(true);
          }}
          onEditSheet={(sheet) => {
            setEditingCustomSheet(sheet);
            setIsCustomSheetModalOpen(true);
          }}
          onRefreshList={reloadCustomSheets}
          onStartProjectWithCustomSheet={(sheet) => {
            setSelectedTechId(sheet.baseTechniqueId);
            setIsNewProjectModalOpen(true);
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Search & Multifaceted Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            {/* Input search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar técnicas, materiales (algodón, poliéster...), procedimientos (curado, pelado...), máquinas o síntomas de fallas..."
                className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Chips */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-xs">
              {/* Fabric Type */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Shirt className="w-3 h-3" />
                  <span>Tejido:</span>
                </span>
                <div className="flex items-center gap-1">
                  {(['todos', 'algodon', 'poliester', 'mezclas', 'rigidos'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFabricFilter(cat)}
                      className={`px-2.5 py-1 rounded-lg font-medium capitalize text-[11px] transition-all ${
                        fabricFilter === cat
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {cat === 'todos' ? 'Todos' : cat === 'algodon' ? 'Algodón' : cat === 'poliester' ? 'Poliéster' : cat === 'mezclas' ? 'Mezclas' : 'Rígidos'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume / Min Run */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                  Tirada:
                </span>
                <div className="flex items-center gap-1">
                  {(['todos', 'unitaria', 'mediana', 'industrial'] as const).map((vol) => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => setVolumeFilter(vol)}
                      className={`px-2.5 py-1 rounded-lg font-medium capitalize text-[11px] transition-all ${
                        volumeFilter === vol
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {vol === 'todos' ? 'Todas' : vol === 'unitaria' ? 'Desde 1 u.' : vol === 'mediana' ? 'Mediana (12+)' : 'Industrial'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Finish / Touch */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Acabado:</span>
                </span>
                <div className="flex items-center gap-1">
                  {(['todos', 'tacto_cero', 'suave', 'relieve_3d', 'metalico_reflectivo', 'bordado'] as const).map((fin) => (
                    <button
                      key={fin}
                      type="button"
                      onClick={() => setFinishFilter(fin)}
                      className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all ${
                        finishFilter === fin
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {fin === 'todos'
                        ? 'Todos'
                        : fin === 'tacto_cero'
                        ? 'Tacto Cero'
                        : fin === 'suave'
                        ? 'Mano Suave'
                        : fin === 'relieve_3d'
                        ? 'Relieve 3D'
                        : fin === 'metalico_reflectivo'
                        ? 'Foil/Reflectivo'
                        : 'Bordado'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Master-Detail Layout: Left 17 Techniques list, Right Detailed Sheet */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Technique Directory List (4 cols) */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
                <span>Directorio Técnico ({filteredTechniques.length} de 17)</span>
                {filteredTechniques.length < 17 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setFabricFilter('todos');
                      setVolumeFilter('todos');
                      setFinishFilter('todos');
                    }}
                    className="text-indigo-600 dark:text-cyan-400 hover:underline normal-case font-semibold text-[11px]"
                  >
                    Restablecer filtros
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-[750px] overflow-y-auto pr-1">
                {filteredTechniques.map((tech, index) => {
                  const isSelected = tech.id === selectedTechId;
                  const isCompared = comparedTechniques.some((ct) => ct.id === tech.id);
                  const itemIndex = TECHNIQUES_ENCYCLOPEDIA.findIndex((t) => t.id === tech.id) + 1;

                  return (
                    <div
                      key={tech.id}
                      onClick={() => setSelectedTechId(tech.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer relative group ${
                        isSelected
                          ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50/80 dark:bg-cyan-950/30 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-md text-[10px] font-mono font-bold flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white dark:bg-cyan-500 dark:text-slate-950'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            {itemIndex}
                          </span>
                          <span
                            className={`text-xs font-extrabold ${
                              isSelected
                                ? 'text-indigo-600 dark:text-cyan-300'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {tech.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {isCompared && (
                            <span
                              className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-cyan-400"
                              title="En comparador"
                            />
                          )}
                          <span className="text-[10px] font-mono font-semibold text-slate-400">
                            {tech.comparisonMetrics.quantityFlexibilityScore >= 9
                              ? 'Min: 1u'
                              : tech.comparisonMetrics.quantityFlexibilityScore >= 7
                              ? 'Min: 12u'
                              : 'Min: 24u'}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 leading-snug">
                        {tech.shortDesc}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/60">
                        <span className="truncate max-w-[170px]">
                          {tech.finishing.touch}
                        </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          ★ {tech.comparisonMetrics.durabilityScore}/10
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredTechniques.length === 0 && (
                  <div className="p-8 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2">
                    <p>No se encontraron técnicas con esos criterios.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setFabricFilter('todos');
                        setVolumeFilter('todos');
                        setFinishFilter('todos');
                      }}
                      className="text-xs font-bold text-indigo-600 dark:text-cyan-400 underline"
                    >
                      Mostrar las 17 técnicas
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Detailed Technique Inspection Sheet (8 cols) */}
            <div className="lg:col-span-8">
              <TechniqueSheetDetail
                technique={currentTech}
                onStartProject={handleStartProject}
                onAddToComparison={handleToggleComparison}
                isCompared={comparedTechniques.some((t) => t.id === currentTech.id)}
                onOpenCustomSheetModal={handleOpenCustomModalForCurrent}
              />
            </div>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      <TechniqueComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        comparedTechniques={comparedTechniques}
        onAddTechnique={(tech) => setComparedTechniques((prev) => [...prev, tech])}
        onRemoveTechnique={handleRemoveFromComparison}
        onSelectTechniqueForDetail={(techId) => {
          setSelectedTechId(techId);
          setActiveViewMode('enciclopedia');
        }}
      />

      {/* Custom Technique Sheet Create/Edit Modal */}
      <CustomSheetModal
        isOpen={isCustomSheetModalOpen}
        onClose={() => setIsCustomSheetModalOpen(false)}
        onSaved={(newSheet) => {
          reloadCustomSheets();
          setActiveViewMode('mis_fichas');
        }}
        editingSheet={editingCustomSheet}
        initialParams={initialCustomParams}
        baseTechniqueId={selectedTechId}
      />
    </div>
  );
};
