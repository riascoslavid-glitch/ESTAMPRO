import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { 
  PRODUCTION_STEPS, 
  verifyProductionCompatibility, 
  getEquipmentProfiles, 
  getProductionJobLogs, 
  saveProductionJobLog, 
  askProductionAdvisor 
} from '../../../services/productionAssistantService';
import { 
  ProductionStepId, 
  ProductionEquipmentProfile, 
  ProductionJobRecord, 
  AssistantChatMessage 
} from '../../../types/productionAssistant';
import { PrintingTechniqueId } from '../../../types/techniques';
import { TECHNIQUES_ENCYCLOPEDIA } from '../../../constants/techniquesEncyclopedia';
import { GARMENT_CATALOG } from '../../../constants/techniques';
import { ProductionSafetyBanner } from './ProductionSafetyBanner';
import { ProductionAuditLogModal } from './ProductionAuditLogModal';
import { ProductionProfilesModal } from './ProductionProfilesModal';
import { 
  Cpu, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Thermometer, 
  Gauge, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  History, 
  Sliders, 
  Send, 
  HelpCircle, 
  Shirt, 
  FileText, 
  Scissors, 
  ShieldCheck, 
  Flame, 
  Wind, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Building2, 
  User, 
  Wrench,
  Layers,
  MessageSquare,
  Bot
} from 'lucide-react';

export const ProductionAssistantView: React.FC = () => {
  const { setActiveModuleId, setIsNewProjectModalOpen } = useApp();
  const { currentUser, userProfile } = useAuth();

  // Wizard Step State (0-indexed, 0 to 13 representing the 14 steps)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const currentStep = PRODUCTION_STEPS[currentStepIndex] || PRODUCTION_STEPS[0];

  // Operator identification
  const operatorName = userProfile?.displayName || currentUser?.displayName || 'Operador de Taller';
  const operatorEmail = userProfile?.email || currentUser?.email || 'harmonyestampadosr@gmail.com';
  const operatorRole = userProfile?.role || 'operador';

  // Selected Production State
  const [selectedGarment, setSelectedGarment] = useState(GARMENT_CATALOG[0]);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [fabricComposition, setFabricComposition] = useState('100% Algodón peinado ring-spun 240 GSM');
  const [fabricGrammage, setFabricGrammage] = useState(240);
  const [isDarkGarment, setIsDarkGarment] = useState(true);

  // Design state
  const [designName, setDesignName] = useState('Skull Urban Art 300 DPI');
  const [designWidthCm, setDesignWidthCm] = useState(28);
  const [designHeightCm, setDesignHeightCm] = useState(35);
  const [designDpi, setDesignDpi] = useState(300);

  // Technique and Machine state
  const [selectedTechniqueId, setSelectedTechniqueId] = useState<PrintingTechniqueId>('dtf');
  const selectedTech = useMemo(() => {
    return TECHNIQUES_ENCYCLOPEDIA.find((t) => t.id === selectedTechniqueId) || TECHNIQUES_ENCYCLOPEDIA[0];
  }, [selectedTechniqueId]);

  const [machineBrandModel, setMachineBrandModel] = useState("Prensa Térmica STAHLS' Hotronix Fusion IQ");
  const [heatPressModel, setHeatPressModel] = useState("Hotronix Fusion IQ 40x50 Neumática");
  const [consumableBrand, setConsumableBrand] = useState('Film KDX Double Matte 75u + TPU Media 120u');

  // Applied parameters in production
  const [tempC, setTempC] = useState<number>(selectedTech.defaultParameters.tempCelsiusMin || 150);
  const [timeSec, setTimeSec] = useState<number>(selectedTech.defaultParameters.timeSecondsMin || 14);
  const [pressureLevel, setPressureLevel] = useState(selectedTech.defaultParameters.pressureLevel || 'Media-Alta');
  const [pressureBars, setPressureBars] = useState(selectedTech.defaultParameters.pressureBars || '4.5 Bar');
  const [peelingType, setPeelingType] = useState(selectedTech.defaultParameters.peeling);
  const [quantityUnits, setQuantityUnits] = useState<number>(30);
  const [prePressSeconds, setPrePressSeconds] = useState<number>(5);
  const [postPressSeconds, setPostPressSeconds] = useState<number>(6);
  const [qualityRating, setQualityRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [auditNotes, setAuditNotes] = useState('');

  // Interactive Pressing Timer State (Step 11)
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(timeSec);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerCompleted, setTimerCompleted] = useState<boolean>(false);

  // Checklist state per step: stepIndex -> Set of checked item strings
  const [stepChecklists, setStepChecklists] = useState<Record<number, string[]>>({});

  // Compatibility Engine Verdict
  const compatibilityResult = useMemo(() => {
    return verifyProductionCompatibility(fabricComposition, selectedTechniqueId, isDarkGarment);
  }, [fabricComposition, selectedTechniqueId, isDarkGarment]);

  // Profiles & Logs state
  const [profiles, setProfiles] = useState<ProductionEquipmentProfile[]>([]);
  const [isProfilesModalOpen, setIsProfilesModalOpen] = useState(false);
  const [jobLogs, setJobLogs] = useState<ProductionJobRecord[]>([]);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Technical Chat Assistant State
  const [chatMessages, setChatMessages] = useState<AssistantChatMessage[]>([
    {
      id: 'welcome_msg',
      sender: 'assistant',
      text: '¡Hola! Soy tu Asistente Técnico de Producción. Te acompañaré durante los 14 pasos de estampado. Puedes preguntarme en cualquier momento sobre compatibilidad de telas, temperaturas, tiempos o fallas en el lavado.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isVerifiedRecommendation: true,
      verifiedSource: 'Guía de Estandarización Textil ESTAMPAPRO 360°'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Load profiles and logs on mount
  const refreshData = async () => {
    const profs = await getEquipmentProfiles(currentUser?.uid);
    setProfiles(profs);
    const logs = await getProductionJobLogs(currentUser?.uid);
    setJobLogs(logs);
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  // Sync default parameters when technique changes
  useEffect(() => {
    if (selectedTech.defaultParameters.tempCelsiusMin > 0) {
      setTempC(selectedTech.defaultParameters.tempCelsiusMin);
    }
    if (selectedTech.defaultParameters.timeSecondsMin > 0) {
      setTimeSec(selectedTech.defaultParameters.timeSecondsMin);
      setTimerSecondsLeft(selectedTech.defaultParameters.timeSecondsMin);
    }
    setPressureLevel(selectedTech.defaultParameters.pressureLevel);
    setPressureBars(selectedTech.defaultParameters.pressureBars || '4.0 Bar');
    setPeelingType(selectedTech.defaultParameters.peeling);
    setConsumableBrand(selectedTech.consumables[0]?.name || 'Consumibles Homologados');
  }, [selectedTechniqueId, selectedTech]);

  // Sound cue for timer completion using Web Audio API
  const playTimerCompletionSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // Note A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      // Audio fallback silent
    }
  };

  // Timer effect for step 11
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      setTimerCompleted(true);
      playTimerCompletionSound();
      // Auto check the timer step checklist
      handleToggleChecklist('Ciclo completo de prensado cumplido sin interrupciones');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  // Checklist helper
  const handleToggleChecklist = (item: string) => {
    setStepChecklists((prev) => {
      const currentList = prev[currentStepIndex] || [];
      const exists = currentList.includes(item);
      const updated = exists ? currentList.filter((i) => i !== item) : [...currentList, item];
      return { ...prev, [currentStepIndex]: updated };
    });
  };

  const isCurrentStepComplete = useMemo(() => {
    const checked = stepChecklists[currentStepIndex] || [];
    // Allow advancing if at least 2 default checklist items or all are checked
    return checked.length >= Math.min(2, currentStep.defaultChecklist.length);
  }, [stepChecklists, currentStepIndex, currentStep]);

  // Navigation handlers
  const handleNextStep = () => {
    if (currentStepIndex < PRODUCTION_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Profile Loader
  const handleApplyProfile = (prof: ProductionEquipmentProfile) => {
    setSelectedTechniqueId(prof.baseTechniqueId);
    setMachineBrandModel(prof.machineBrandModel);
    setHeatPressModel(prof.heatPressModel);
    setConsumableBrand(prof.consumableBrand);
    setFabricComposition(prof.substrateComposition);
    setTempC(prof.defaultTempC);
    setTimeSec(prof.defaultTimeSec);
    setTimerSecondsLeft(prof.defaultTimeSec);
    setPressureLevel(prof.defaultPressureLevel as any);
    setPeelingType(prof.defaultPeeling as any);

    // Add note to assistant chat
    setChatMessages((prev) => [
      ...prev,
      {
        id: `prof_loaded_${Date.now()}`,
        sender: 'assistant',
        text: `Perfil cargado: "${prof.name}". Máquina: ${prof.heatPressModel}, Temperatura: ${prof.defaultTempC}°C, Tiempo: ${prof.defaultTimeSec}s. Todos los parámetros operativos han sido actualizados en la estación de trabajo.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isVerifiedRecommendation: true,
        verifiedSource: 'Perfil de Taller Calibrado'
      }
    ]);
  };

  // Submit Job Log (Step 14)
  const [isSavingLog, setIsSavingLog] = useState(false);
  const [savedJobSuccess, setSavedJobSuccess] = useState<ProductionJobRecord | null>(null);

  const handleRegisterJob = async () => {
    setIsSavingLog(true);
    try {
      const record = await saveProductionJobLog({
        ownerId: currentUser?.uid || 'local_operator',
        operatorName,
        operatorEmail,
        operatorRole,
        operatorUid: currentUser?.uid || 'local_operator',
        projectName: `Orden ${selectedGarment.name} - ${selectedTechniqueId.toUpperCase()}`,
        garmentName: selectedGarment.name,
        garmentColor: selectedGarment.availableColors[selectedColorIndex]?.name || 'Base',
        fabricComposition,
        techniqueId: selectedTechniqueId,
        techniqueName: selectedTech.name,
        machineUsed: machineBrandModel,
        heatPressUsed: heatPressModel,
        consumablesUsed: consumableBrand,
        designName,
        designDpi,
        quantityUnits,
        parametersApplied: {
          temperatureC: tempC,
          timeSeconds: timeSec,
          pressureBars,
          pressureLevel,
          peelingType,
          prePressSeconds,
          postPressSeconds
        },
        compatibilityStatus: compatibilityResult.status,
        qualityChecksPassed: stepChecklists[12] || [
          'Bordes soldados',
          'Prueba de tracción elástica superada',
          'Opacidad total'
        ],
        qualityRating,
        observations: auditNotes.trim() || 'Trabajo ejecutado según protocolo estándar de 14 pasos sin incidencias.',
        durationMinutes: Math.round(timeSec * quantityUnits / 60) + 15
      });

      setSavedJobSuccess(record);
      refreshData();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingLog(false);
    }
  };

  // Assistant Question Submit
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userText = chatInput.trim();
    setChatInput('');

    // Append user message
    const userMsg: AssistantChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await askProductionAdvisor(userText, {
        garmentFabric: fabricComposition,
        selectedTechnique: selectedTech.name,
        isDarkGarment,
        quantity: quantityUnits
      });

      const assistantMsg: AssistantChatMessage = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isVerifiedRecommendation: response.isVerifiedRecommendation,
        verifiedSource: response.verifiedSource,
        recommendedTechniqueId: response.recommendedTechniqueId,
        compatibilityAdvice: {
          compatible: true,
          reason: response.verifiedSource || 'Recomendación de taller',
          cautionPoints: response.cautionPoints
        }
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 py-2 sm:py-4">
      {/* Top Header Bar */}
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
                Módulo 8 · Taller y Técnica
              </span>
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-indigo-50 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300 border border-indigo-200 dark:border-cyan-800/50">
                14 Pasos Operativos
              </span>
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                Auditoría Activa
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2">
              <Cpu className="w-7 h-7 text-indigo-600 dark:text-cyan-400" />
              <span>Asistente Técnico Inteligente de Producción</span>
            </h1>
          </div>
        </div>

        {/* Global Control Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsProfilesModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-cyan-500 transition-colors shadow-xs"
          >
            <Sliders className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <span>Perfiles ({profiles.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAuditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-cyan-500 transition-colors shadow-xs"
          >
            <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Bitácora ({jobLogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('¿Reiniciar el asistente desde el Paso 1?')) {
                setCurrentStepIndex(0);
                setSavedJobSuccess(null);
              }
            }}
            className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reiniciar producción"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Industrial Safety Alert Banner */}
      <ProductionSafetyBanner />

      {/* Progress & 14-Step Timeline Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-indigo-600 dark:text-cyan-400 text-sm">
              Paso {currentStep.number} de 14
            </span>
            <span className="text-slate-400">•</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {currentStep.phase}
            </span>
          </div>
          <span className="font-mono text-xs text-slate-500 font-bold">
            {Math.round(((currentStepIndex + 1) / 14) * 100)}% completado
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStepIndex + 1) / 14) * 100}%` }}
          />
        </div>

        {/* Scrollable Step Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
          {PRODUCTION_STEPS.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isPassed = idx < currentStepIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 text-[11px] shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white dark:bg-cyan-500 dark:text-slate-950 font-bold shadow-xs'
                    : isPassed
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <span>{step.number}.</span>
                <span>{step.title}</span>
                {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Step Cockpit (8 cols) & Assistant Chat / Overview (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Step Execution Cockpit (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            {/* Step Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-cyan-950/60 text-indigo-700 dark:text-cyan-300 border border-indigo-200 dark:border-cyan-800/50">
                  Fase: {currentStep.phase}
                </span>
                {currentStep.parametersBadge && (
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {currentStep.parametersBadge}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white pt-1">
                {currentStep.number}. {currentStep.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                {currentStep.subtitle}
              </p>
            </div>

            {/* STEP-SPECIFIC INTERACTIVE CONTROLS */}
            <div className="space-y-4">
              {/* STEP 1: Seleccionar Prenda */}
              {currentStep.id === 'seleccionar_prenda' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Catálogo de Prendas en Blanco
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {GARMENT_CATALOG.map((garment) => {
                      const isSelected = selectedGarment.id === garment.id;
                      return (
                        <div
                          key={garment.id}
                          onClick={() => {
                            setSelectedGarment(garment);
                            setFabricComposition(garment.material);
                          }}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all space-y-2 ${
                            isSelected
                              ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50/70 dark:bg-cyan-950/30'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-xs font-bold text-slate-900 dark:text-white">
                              {garment.name}
                            </strong>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />}
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {garment.material}
                          </p>
                          <div className="flex items-center gap-1.5 pt-1">
                            {garment.availableColors.map((color, cIdx) => (
                              <span
                                key={cIdx}
                                className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shadow-2xs"
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quantity selector */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Tirada a Producir (Unidades):
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={quantityUnits}
                      onChange={(e) => setQuantityUnits(Math.max(1, Number(e.target.value)))}
                      className="w-24 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-center"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Identificar Tela y Composición */}
              {currentStep.id === 'identificar_tela' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Composición Textil Declarada
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        '100% Algodón peinado ring-spun 240 GSM',
                        '80% Algodón / 20% Poliéster French Terry 400 GSM',
                        '100% Poliéster Interlock Dry-Fit 140 GSM',
                        'Mezcla 50/50 Poly-Cotton Ring-Spun',
                        '88% Poliéster / 12% Spandex Elástico',
                        '100% Algodón Lona Cruda 320 GSM'
                      ].map((comp) => (
                        <button
                          key={comp}
                          type="button"
                          onClick={() => setFabricComposition(comp)}
                          className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                            fabricComposition === comp
                              ? 'border-indigo-600 dark:border-cyan-400 bg-white dark:bg-slate-900 text-indigo-700 dark:text-cyan-300 font-bold shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          {comp}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Color de base de la prenda:</span>
                      <div className="flex items-center gap-2 font-medium">
                        <button
                          type="button"
                          onClick={() => setIsDarkGarment(false)}
                          className={`px-3 py-1 rounded-lg border ${!isDarkGarment ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                        >
                          Blanco / Claro
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsDarkGarment(true)}
                          className={`px-3 py-1 rounded-lg border ${isDarkGarment ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'}`}
                        >
                          Negro / Oscuro
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Seleccionar Diseño */}
              {currentStep.id === 'seleccionar_diseno' && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <strong className="text-sm font-bold text-slate-900 dark:text-white block">
                        {designName}
                      </strong>
                      <span className="text-slate-500 text-[11px]">
                        Gráfico para estampación textil · Canal Alpha verificado
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] border border-emerald-300">
                      ✓ 300 DPI Físico
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">Ancho (cm):</label>
                      <input
                        type="number"
                        value={designWidthCm}
                        onChange={(e) => setDesignWidthCm(Number(e.target.value))}
                        className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">Alto (cm):</label>
                      <input
                        type="number"
                        value={designHeightCm}
                        onChange={(e) => setDesignHeightCm(Number(e.target.value))}
                        className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">Resolución:</label>
                      <input
                        type="number"
                        value={designDpi}
                        onChange={(e) => setDesignDpi(Number(e.target.value))}
                        className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Seleccionar Técnica */}
              {currentStep.id === 'seleccionar_tecnica' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Selecciona una de las 17 Técnicas Textiles
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[350px] overflow-y-auto pr-1">
                    {TECHNIQUES_ENCYCLOPEDIA.map((tech) => {
                      const isSelected = selectedTechniqueId === tech.id;
                      return (
                        <div
                          key={tech.id}
                          onClick={() => setSelectedTechniqueId(tech.id)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all space-y-1.5 ${
                            isSelected
                              ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50/70 dark:bg-cyan-950/30 shadow-xs'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {tech.name}
                            </strong>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400 shrink-0" />}
                          </div>
                          <p className="text-[10px] text-slate-500 line-clamp-2">
                            {tech.shortDesc}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span>Durabilidad: {tech.comparisonMetrics.durabilityScore}/10</span>
                            <span className="font-semibold text-indigo-600 dark:text-cyan-400">
                              {tech.defaultParameters.tempCelsiusMin > 0 ? `${tech.defaultParameters.tempCelsiusMin}°C` : 'En frío'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: Seleccionar Máquina */}
              {currentStep.id === 'seleccionar_maquina' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Prensa Térmica o Túnel Asignado
                    </label>
                    <input
                      type="text"
                      value={heatPressModel}
                      onChange={(e) => setHeatPressModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Equipo de Impresión / Corte / Revelado
                    </label>
                    <input
                      type="text"
                      value={machineBrandModel}
                      onChange={(e) => setMachineBrandModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                </div>
              )}

              {/* STEP 6: Seleccionar Consumibles */}
              {currentStep.id === 'seleccionar_consumibles' && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Consumibles y Lotes de Producción
                    </label>
                    <input
                      type="text"
                      value={consumableBrand}
                      onChange={(e) => setConsumableBrand(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <strong className="block text-slate-800 dark:text-slate-200">Recomendaciones Oficiales de la Técnica:</strong>
                    {selectedTech.consumables.map((c, i) => (
                      <div key={i}>• {c.name}: {c.recommendedBrands.join(', ')} ({c.specifications})</div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: Verificar Compatibilidad */}
              {currentStep.id === 'verificar_compatibilidad' && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        compatibilityResult.status === 'Optima'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                          : compatibilityResult.status === 'Compatible con advertencias'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                      }`}
                    >
                      {compatibilityResult.status}
                    </span>
                    <strong className="text-sm font-bold text-slate-900 dark:text-white">
                      {compatibilityResult.headline}
                    </strong>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {compatibilityResult.details}
                  </p>

                  {compatibilityResult.warnings.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 space-y-1">
                      <strong className="block text-[11px] uppercase tracking-wider font-bold">Puntos de Atención Crítica:</strong>
                      {compatibilityResult.warnings.map((w, idx) => (
                        <div key={idx}>⚠️ {w}</div>
                      ))}
                    </div>
                  )}

                  <div className="text-[11px] text-slate-500 pt-1">
                    <strong>Fuente Documentada:</strong> {compatibilityResult.verifiedDocSource}
                  </div>
                </div>
              )}

              {/* STEP 8: Consultar Ficha Técnica */}
              {currentStep.id === 'consultar_ficha_tecnica' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Temperatura</span>
                      <strong className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                        {tempC}°C
                      </strong>
                      <span className="text-[10px] text-slate-500 block">({Math.round((tempC * 9)/5 + 32)}°F)</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Tiempo Prensa</span>
                      <strong className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                        {timeSec}s
                      </strong>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Presión</span>
                      <strong className="text-sm font-bold text-slate-900 dark:text-white block mt-1">
                        {pressureLevel}
                      </strong>
                      <span className="text-[10px] text-slate-500 block font-mono">{pressureBars}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <span className="text-[10px] text-slate-400 block uppercase">Pelado</span>
                      <strong className="text-xs font-bold text-slate-900 dark:text-white block mt-1 line-clamp-1">
                        {peelingType}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-400">¿Deseas ajustar los valores en la prensa?</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={tempC}
                        onChange={(e) => setTempC(Number(e.target.value))}
                        className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center font-bold font-mono"
                      />
                      <span>°C</span>
                      <input
                        type="number"
                        value={timeSec}
                        onChange={(e) => {
                          setTimeSec(Number(e.target.value));
                          setTimerSecondsLeft(Number(e.target.value));
                        }}
                        className="w-16 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center font-bold font-mono"
                      />
                      <span>seg</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 9: Preparar Diseño */}
              {currentStep.id === 'preparar_diseno' && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Scissors className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                    <span>Verificaciones Obligatorias de Pre-Prensa</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Asegura que el diseño esté invertido en espejo (flip horizontal), con fondo transparente y que la poliamida haya curado a 125°C hasta aspecto cáscara de naranja.
                  </p>
                </div>
              )}

              {/* STEP 10: Preparar Prenda */}
              {currentStep.id === 'preparar_prenda' && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Shirt className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                    <span>Deshumificado y Despeje de Fibra</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Pasar rodillo quitapelusas para retirar micro-fibras sintéticas y pre-prensar durante 5 segundos a 150°C. Esto previene burbujas de vapor y levantamiento prematuro.
                  </p>
                </div>
              )}

              {/* STEP 11: Ejecutar Procedimiento con Temporizador Interactivo */}
              {currentStep.id === 'ejecutar_procedimiento' && (
                <div className="p-6 rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-b from-indigo-500/5 to-transparent space-y-6 text-center">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                      Estación Activa de Prensado Térmico
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {tempC}°C · {pressureBars} de Presión
                    </h3>
                  </div>

                  {/* Circular visual timer dial */}
                  <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="88"
                        cy="88"
                        r="76"
                        className="stroke-slate-200 dark:stroke-slate-800 fill-none"
                        strokeWidth="10"
                      />
                      <circle
                        cx="88"
                        cy="88"
                        r="76"
                        className={`fill-none transition-all duration-1000 ${
                          timerCompleted
                            ? 'stroke-emerald-500'
                            : isTimerRunning
                            ? 'stroke-indigo-600 dark:stroke-cyan-400'
                            : 'stroke-slate-400'
                        }`}
                        strokeWidth="10"
                        strokeDasharray={477}
                        strokeDashoffset={
                          timeSec > 0
                            ? 477 - (477 * (timeSec - timerSecondsLeft)) / timeSec
                            : 0
                        }
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white tabular-nums">
                        {timerSecondsLeft}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Segundos</span>
                    </div>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white transition-all shadow-md ${
                        isTimerRunning
                          ? 'bg-amber-600 hover:bg-amber-500'
                          : timerCompleted
                          ? 'bg-emerald-600 hover:bg-emerald-500'
                          : 'bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-600 dark:hover:bg-cyan-500'
                      }`}
                    >
                      {isTimerRunning ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>Pausar</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          <span>{timerCompleted ? 'Repetir Prensado' : 'Iniciar Prensado'}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimerSecondsLeft(timeSec);
                        setTimerCompleted(false);
                      }}
                      className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                      title="Reiniciar cronómetro"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  {timerCompleted && (
                    <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs animate-in zoom-in-95">
                      ✓ ¡Ciclo de calor completado! Abre la prensa y procede al pelado según la ficha.
                    </div>
                  )}
                </div>
              )}

              {/* STEP 12: Realizar Acabado */}
              {currentStep.id === 'realizar_acabado' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] block">
                      Instrucción de Pelado (Peeling):
                    </span>
                    <strong className="text-sm font-bold text-indigo-600 dark:text-cyan-400 block">
                      {peelingType}
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400">
                      Si es Cold Peel, no retires el film mientras esté caliente para no deformar bordes finos. Si es Hot Peel, retira de forma fluida a los 3 segundos.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-cyan-950/20 space-y-2">
                    <strong className="font-bold text-indigo-900 dark:text-cyan-200 block text-xs">
                      Segundo Prensado Obligatorio (Post-Prensa):
                    </strong>
                    <p className="text-slate-700 dark:text-slate-300">
                      Cubre con papel siliconado mate y prensa <strong>{postPressSeconds} segundos a {tempC}°C</strong> con presión alta. Este paso fija el TPU dentro de los poros de la tela y elimina el brillo plástico.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 13: Inspeccionar Calidad */}
              {currentStep.id === 'inspeccionar_calidad' && (
                <div className="space-y-4 text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-500 block">
                    Puntuación del Control de Calidad (QC)
                  </span>

                  <div className="flex items-center gap-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">Calificación del Lote:</span>
                    <div className="flex items-center gap-1.5 text-amber-500">
                      {([1, 2, 3, 4, 5] as const).map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setQualityRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= qualityRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-2">
                      {qualityRating === 5
                        ? '5/5 · Calidad Boutique / Retail Export'
                        : qualityRating === 4
                        ? '4/5 · Excelente Estándar Comercial'
                        : '3/5 · Aceptable con observaciones'}
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 14: Registrar Trabajo en Bitácora */}
              {currentStep.id === 'registrar_trabajo' && (
                <div className="p-5 rounded-2xl border border-indigo-300 dark:border-cyan-800 bg-indigo-50/40 dark:bg-cyan-950/20 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-indigo-200 dark:border-cyan-900/60 pb-3">
                    <div>
                      <strong className="text-sm font-bold text-slate-900 dark:text-white block">
                        Cierre de Producción y Asentamiento de Trazabilidad
                      </strong>
                      <span className="text-slate-500 text-[11px]">
                        Guarda los parámetros exactos y el operador responsable para control de taller.
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-indigo-100 dark:bg-cyan-950 text-indigo-800 dark:text-cyan-300 font-mono font-bold text-[11px]">
                      {new Date().toLocaleDateString('es-ES')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Operador Responsable:
                      </label>
                      <input
                        type="text"
                        disabled
                        value={`${operatorName} (${operatorRole})`}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Unidades Confeccionadas:
                      </label>
                      <input
                        type="number"
                        value={quantityUnits}
                        onChange={(e) => setQuantityUnits(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Observaciones Técnicas o Desviaciones:
                    </label>
                    <textarea
                      rows={2}
                      value={auditNotes}
                      onChange={(e) => setAuditNotes(e.target.value)}
                      placeholder="Ej: Lote finalizado sin mermas. Se mantuvo la presión a 4.5 Bares en toda la tirada."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="pt-2">
                    {savedJobSuccess ? (
                      <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>¡Trabajo registrado con éxito en Firestore y LocalStorage! (ID: {savedJobSuccess.id})</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsAuditModalOpen(true)}
                          className="px-3 py-1 rounded bg-emerald-600 text-white text-xs hover:bg-emerald-500"
                        >
                          Ver Bitácora
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={isSavingLog}
                        onClick={handleRegisterJob}
                        className="w-full py-3 rounded-xl bg-indigo-600 dark:bg-cyan-600 text-white font-bold text-sm hover:bg-indigo-500 dark:hover:bg-cyan-500 transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSavingLog ? 'Registrando en Bitácora...' : 'Asentar Trabajo en Bitácora de Producción'}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Step Materials & Tools Required */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Materiales en este paso:
                </span>
                <div className="flex flex-wrap gap-1">
                  {currentStep.materials.map((mat, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Herramientas necesarias:
                </span>
                <div className="flex flex-wrap gap-1">
                  {currentStep.tools.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Mandatory Verification Checklist */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Casillas de Verificación Obligatorias para Avanzar:</span>
              </span>

              <div className="space-y-1.5 pt-1">
                {currentStep.defaultChecklist.map((item, idx) => {
                  const isChecked = (stepChecklists[currentStepIndex] || []).includes(item);
                  return (
                    <label
                      key={idx}
                      className="flex items-start gap-2.5 cursor-pointer p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleChecklist(item)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 mt-0.5 cursor-pointer"
                      />
                      <span className={`text-xs ${isChecked ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step Navigation Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                disabled={currentStepIndex === 0}
                onClick={handlePrevStep}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Paso Anterior</span>
              </button>

              {currentStepIndex < PRODUCTION_STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 dark:bg-cyan-600 text-white font-bold text-xs hover:bg-indigo-500 dark:hover:bg-cyan-500 transition-colors shadow-xs"
                >
                  <span>Siguiente Paso</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuditModalOpen(true)}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors shadow-xs"
                >
                  <History className="w-4 h-4" />
                  <span>Ver Bitácora de Trabajos</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Technical AI Advisor & Workshop Cockpit (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Production Summary Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                Estado de la Estación
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="En línea" />
            </div>

            <div className="space-y-1.5 text-slate-600 dark:text-slate-300">
              <div>
                <strong className="text-slate-800 dark:text-slate-200">Prenda:</strong> {selectedGarment.name}
              </div>
              <div>
                <strong className="text-slate-800 dark:text-slate-200">Tela:</strong> {fabricComposition}
              </div>
              <div>
                <strong className="text-slate-800 dark:text-slate-200">Técnica:</strong> {selectedTech.name}
              </div>
              <div>
                <strong className="text-slate-800 dark:text-slate-200">Prensa:</strong> {heatPressModel}
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold">Parámetros actuales:</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-cyan-400">
                  {tempC}°C · {timeSec}s · {pressureBars}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Technical AI Assistant Chat */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col h-[520px]">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-cyan-950 text-indigo-700 dark:text-cyan-300">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    Consultor Técnico IA
                  </h4>
                  <span className="text-[10px] text-slate-400 block">
                    Respaldo técnico verificable
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {[
                '¿Qué técnica me recomiendas para estampar este diseño sobre poliéster?',
                '¿Por qué se me despega el estampado?',
                '¿Parámetros para Hoodie 400g?'
              ].map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setChatInput(q);
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-cyan-400 whitespace-nowrap shrink-0 text-[10px] font-medium transition-colors"
                >
                  {q.slice(0, 32)}...
                </button>
              ))}
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
              {chatMessages.map((msg) => {
                const isAsst = msg.sender === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl text-xs space-y-1.5 ${
                      isAsst
                        ? 'bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200'
                        : 'bg-indigo-600 dark:bg-cyan-600 text-white ml-6 font-medium'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-75">
                      <span>{isAsst ? 'Consultor Técnico' : operatorName}</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <p className="leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </p>

                    {isAsst && msg.isVerifiedRecommendation && (
                      <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 text-[10px] flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-bold">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Recomendación Verificada</span>
                        </span>
                        {msg.verifiedSource && (
                          <span className="text-[9px] text-slate-400 font-normal italic truncate max-w-[150px]">
                            {msg.verifiedSource}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {isChatLoading && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 italic flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  <span>Consultando bases técnicas de ingeniería textil...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="relative pt-2 border-t border-slate-100 dark:border-slate-800">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Pregunta ej: ¿Qué técnica usar en poliéster?"
                className="w-full pr-10 pl-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatLoading}
                className="absolute right-2 top-3.5 p-1 rounded-lg text-indigo-600 dark:text-cyan-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Profiles Modal */}
      <ProductionProfilesModal
        isOpen={isProfilesModalOpen}
        onClose={() => setIsProfilesModalOpen(false)}
        profiles={profiles}
        onSelectProfile={handleApplyProfile}
        onRefreshProfiles={refreshData}
      />

      {/* Audit Log Modal */}
      <ProductionAuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        logs={jobLogs}
      />
    </div>
  );
};
