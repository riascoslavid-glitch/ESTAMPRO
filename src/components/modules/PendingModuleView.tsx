import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppModule } from '../../types';
import { AppIcon } from '../common/AppIcon';
import { 
  ArrowLeft, 
  Clock, 
  Layers, 
  Code2, 
  CheckCircle, 
  Cpu, 
  Sparkles,
  ExternalLink,
  Plus
} from 'lucide-react';

interface PendingModuleViewProps {
  module: AppModule;
}

export const PendingModuleView: React.FC<PendingModuleViewProps> = ({ module }) => {
  const { setActiveModuleId, setIsNewProjectModalOpen } = useApp();

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 sm:py-6 animate-in fade-in duration-200">
      {/* Top Header & Breadcrumb Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start sm:items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveModuleId('inicio')}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Volver al Inicio"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Módulo {module.orderNumber} · {module.categoryLabel}
              </span>
              <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Planificado · Próxima Etapa
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1 flex items-center gap-2.5">
              <AppIcon name={module.iconName} className="w-7 h-7 text-indigo-600 dark:text-cyan-400 shrink-0" />
              <span>{module.name}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveModuleId('inicio')}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Ir al Dashboard
          </button>
          <button
            type="button"
            onClick={() => setIsNewProjectModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 dark:bg-cyan-600 rounded-lg hover:bg-indigo-500 dark:hover:bg-cyan-500 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Proyecto</span>
          </button>
        </div>
      </div>

      {/* Hero Notice Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-900 dark:to-slate-850 border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-600 dark:text-cyan-400">
            <Clock className="w-4 h-4" />
            <span>ASIGNADO A: PROMPT CONSECUTIVO #{module.plannedStagePrompt || 'X'}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Arquitectura y estructura preparadas para desarrollo
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {module.description}
          </p>
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-slate-200">Nota de desarrollo: </span>
            Siguiendo las directrices del proyecto ESTAMPAPRO 360°, este módulo cuenta con su ruta de navegación, tipos de TypeScript y espacio de trabajo definidos. Su lógica especializada y motores gráficos se implementarán en el prompt correspondiente sin alterar la estructura base.
          </div>
        </div>
      </div>

      {/* Technical Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Capabilities */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Cpu className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <span>Requerimientos y Capacidades Técnicas</span>
          </div>
          <ul className="space-y-3">
            {module.technicalCapabilities.map((cap, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{cap}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Deliverables */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <span>Entregables Previstos de la Etapa</span>
          </div>
          <ul className="space-y-3">
            {module.deliverablesSummary.map((deliv, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-cyan-400 shrink-0 mt-1.5" />
                <span className="leading-snug">{deliv}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Blueprint Layout Preview placeholder container */}
      <div className="p-8 rounded-xl bg-slate-100/70 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
          <Code2 className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Lienzo de Trabajo Reservado
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Este contenedor montará la vista interactiva principal de <span className="font-medium text-slate-700 dark:text-slate-300">{module.name}</span> al ejecutar la etapa #{module.plannedStagePrompt}.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setActiveModuleId('inicio')}
            className="text-xs font-medium text-indigo-600 dark:text-cyan-400 hover:underline"
          >
            ← Volver al tablero principal de ESTAMPAPRO 360°
          </button>
        </div>
      </div>
    </div>
  );
};
