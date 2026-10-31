import React, { useState } from 'react';
import { DetailedTechniqueSheet, TechnicalParameters } from '../../../types/techniques';
import { TechniqueParametersPanel } from './TechniqueParametersPanel';
import { openPrintableTechnicalSheet, exportSheetAsJson } from '../../../services/techniquesStorageService';
import {
  FileText,
  Sliders,
  Cpu,
  Scissors,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Flame,
  Printer,
  Download,
  Plus,
  Scale,
  Sparkles,
  ShieldCheck,
  Shirt,
  Layers,
  Wrench,
  Clock,
  Thermometer,
  Eye,
  HeartHandshake
} from 'lucide-react';

interface TechniqueSheetDetailProps {
  technique: DetailedTechniqueSheet;
  onStartProject: (techId: string) => void;
  onAddToComparison: (tech: DetailedTechniqueSheet) => void;
  isCompared: boolean;
  onOpenCustomSheetModal: (initialParams: Partial<TechnicalParameters>) => void;
}

export const TechniqueSheetDetail: React.FC<TechniqueSheetDetailProps> = ({
  technique,
  onStartProject,
  onAddToComparison,
  isCompared,
  onOpenCustomSheetModal
}) => {
  const [activeTab, setActiveTab] = useState<
    'parametros' | 'procedimiento' | 'maquinaria' | 'telas' | 'diseno' | 'acabado' | 'soluciones'
  >('parametros');

  return (
    <div className="space-y-6">
      {/* Top Card: Title, Badges and Actions */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300 border border-indigo-200 dark:border-cyan-800/50">
                Ficha Técnica Certificada
              </span>
              <span className="text-xs text-slate-500 font-mono">
                ID: {technique.id}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              {technique.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onAddToComparison(technique)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                isCompared
                  ? 'border-indigo-600 dark:border-cyan-400 bg-indigo-50 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'En Comparación ✓' : 'Comparar Técnica'}</span>
            </button>

            <button
              type="button"
              onClick={() => openPrintableTechnicalSheet(technique)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
              title="Generar hoja de taller para imprimir"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Hoja de Taller</span>
            </button>

            <button
              type="button"
              onClick={() => exportSheetAsJson(technique)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Descargar Ficha en JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onStartProject(technique.id)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 dark:bg-cyan-600 hover:bg-indigo-500 dark:hover:bg-cyan-500 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Iniciar Proyecto</span>
            </button>
          </div>
        </div>

        {/* Short & Full Description */}
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {technique.shortDesc}
        </p>

        {/* Funcionamiento Físico-Químico y Mecánico */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
            <span>Principio de Funcionamiento y Anclaje Físico-Químico</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {technique.functioning}
          </p>
        </div>

        {/* Quick Highlights: Advantages vs Disadvantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-xs space-y-2">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Ventajas Competitivas</span>
            </span>
            <ul className="space-y-1 text-slate-700 dark:text-slate-300">
              {technique.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold shrink-0">•</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs space-y-2">
            <span className="font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" />
              <span>Limitaciones y Desventajas</span>
            </span>
            <ul className="space-y-1 text-slate-700 dark:text-slate-300">
              {technique.disadvantages.map((dis, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold shrink-0">•</span>
                  <span>{dis}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for In-Depth Modules */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('parametros')}
          className={`flex items-center gap-1.5 px-3.5 py-2 font-bold rounded-t-lg transition-all border-b-2 ${
            activeTab === 'parametros'
              ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Parámetros Calibrados</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('procedimiento')}
          className={`flex items-center gap-1.5 px-3.5 py-2 font-bold rounded-t-lg transition-all border-b-2 ${
            activeTab === 'procedimiento'
              ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Procedimiento Paso a Paso</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('maquinaria')}
          className={`flex items-center gap-1.5 px-3.5 py-2 font-bold rounded-t-lg transition-all border-b-2 ${
            activeTab === 'maquinaria'
              ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Máquinas y Consumibles</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('telas')}
          className={`flex items-center gap-1.5 px-3.5 py-2 font-bold rounded-t-lg transition-all border-b-2 ${
            activeTab === 'telas'
              ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>Compatibilidad de Telas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('diseno')}
          className={`flex items-center gap-1.5 px-3.5 py-2 font-bold rounded-t-lg transition-all border-b-2 ${
            activeTab === 'diseno'
              ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Preparación del Diseño</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('acabado')}
          className={`flex items-center gap-1.5 px-3.5 py-2 font-bold rounded-t-lg transition-all border-b-2 ${
            activeTab === 'acabado'
              ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Acabado y Cuidados</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('soluciones')}
          className={`flex items-center gap-1.5 px-3.5 py-2 font-bold rounded-t-lg transition-all border-b-2 ${
            activeTab === 'soluciones'
              ? 'border-indigo-600 dark:border-cyan-400 text-indigo-600 dark:text-cyan-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Problemas y Soluciones ({technique.commonProblems.length})</span>
        </button>
      </div>

      {/* Tab 1: Configurable Parameters */}
      {activeTab === 'parametros' && (
        <TechniqueParametersPanel
          technique={technique}
          onOpenCustomSheetModal={onOpenCustomSheetModal}
        />
      )}

      {/* Tab 2: Chronological Step-by-Step Procedure */}
      {activeTab === 'procedimiento' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Protocolo de Operación Cronológica en Taller
          </div>

          <div className="space-y-3">
            {technique.procedure.map((step) => (
              <div
                key={step.stepNumber}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-cyan-950/60 text-indigo-700 dark:text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {step.phase}
                    </span>
                  </div>
                  {step.durationOrTemp && (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {step.durationOrTemp}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.description}
                </p>

                {step.criticalWarning && (
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                    <span>{step.criticalWarning}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Machinery, Tools & Consumables */}
      {activeTab === 'maquinaria' && (
        <div className="space-y-6">
          {/* Machines */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
              <span>Maquinaria Industrial y Equipamiento Recomendado</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {technique.machines.map((mach, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs"
                >
                  <strong className="text-slate-900 dark:text-white font-bold block text-sm">
                    {mach.type}
                  </strong>
                  <div>
                    <span className="text-slate-500 font-semibold text-[11px] block">Modelos y Marcas de Referencia:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {mach.recommendedBrandsModels.map((brand, bIdx) => (
                        <span
                          key={bIdx}
                          className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] italic">
                    {mach.specsNotes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Consumables */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Consumibles Técnicos Certificados</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {technique.consumables.map((con, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 dark:text-white font-bold text-sm">
                      {con.name}
                    </strong>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {con.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold text-[11px] block">Marcas Recomendadas:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {con.recommendedBrands.map((b, bIdx) => (
                        <span
                          key={bIdx}
                          className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-medium"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    {con.specifications}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Workshop Tools */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-amber-500" />
              <span>Herramientas e Instrumentación de Taller</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {technique.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>{tool}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Fabric Compatibility */}
      {activeTab === 'telas' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Matriz de Compatibilidad Textil y Adherencia
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {technique.compatibleFabrics.map((cf, idx) => {
              const isExcellent = cf.rating === 'Excelente';
              const isAdjust = cf.rating === 'Compatible con ajuste';
              const isBad = cf.rating === 'No recomendado' || cf.rating === 'Incompatible';

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 dark:text-white font-bold text-sm">
                      {cf.fabric}
                    </strong>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isExcellent
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : isAdjust
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {cf.rating}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {cf.notes}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: Design Preparation */}
      {activeTab === 'diseno' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Requisitos Técnicos de Pre-Impresión y Diseño Gráfico
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Resolución Mínima
              </span>
              <strong className="text-sm font-extrabold text-slate-900 dark:text-white block font-mono">
                {technique.designPreparation.resolutionDpi}
              </strong>
              <span className="text-slate-500 text-[11px]">
                Siempre a escala 1:1 sin interpolación
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Trazo / Línea Mínima
              </span>
              <strong className="text-sm font-extrabold text-slate-900 dark:text-white block font-mono">
                {technique.designPreparation.minLineWeightMm}
              </strong>
              <span className="text-slate-500 text-[11px]">
                Trazos menores pueden desvanecerse o no transferir
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Formato Obligatorio
              </span>
              <strong className="text-sm font-extrabold text-slate-900 dark:text-white block">
                {technique.designPreparation.vectorRequired ? 'Vectorial (Curvas)' : 'Vector o Bitmap de Alta Calidad'}
              </strong>
              <span className="text-slate-500 text-[11px]">
                Formatos: {technique.designPreparation.fileFormats.join(', ')}
              </span>
            </div>
          </div>

          {/* Underbase & Color management */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 text-xs">
            <div>
              <strong className="text-slate-900 dark:text-white font-bold block mb-1">
                Gestión de Base Blanca (Underbase & Choke)
              </strong>
              <p className="text-slate-600 dark:text-slate-300">
                {technique.designPreparation.whiteUnderbaseReq}
              </p>
            </div>

            <div>
              <strong className="text-slate-900 dark:text-white font-bold block mb-1">
                Espacios de Color Aceptados
              </strong>
              <div className="flex flex-wrap gap-2">
                {technique.designPreparation.colorModes.map((cm, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold"
                  >
                    {cm}
                  </span>
                ))}
              </div>
            </div>

            {technique.designPreparation.criticalTips.length > 0 && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white font-bold block mb-2">
                  Consejos Críticos para el Diseñador:
                </strong>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  {technique.designPreparation.criticalTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold shrink-0">→</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 6: Finishing & Care Protocol */}
      {activeTab === 'acabado' && (
        <div className="space-y-6">
          {/* Finishing Properties */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Propiedades de Acabado y Textura Sensorial</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-500 text-[11px] block">Tacto Textil</span>
                <strong className="text-slate-900 dark:text-white font-bold mt-1 block">
                  {technique.finishing.touch}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-500 text-[11px] block">Nivel de Brillo</span>
                <strong className="text-slate-900 dark:text-white font-bold mt-1 block">
                  {technique.finishing.gloss}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-500 text-[11px] block">Elasticidad</span>
                <strong className="text-slate-900 dark:text-white font-bold mt-1 block">
                  {technique.finishing.elasticity}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-500 text-[11px] block">Opacidad en Oscuros</span>
                <strong className="text-slate-900 dark:text-white font-bold mt-1 block">
                  {technique.finishing.opacityDarkFabrics}
                </strong>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <span className="text-slate-500 text-[11px] block">Transpirabilidad</span>
                <strong className="text-slate-900 dark:text-white font-bold mt-1 block">
                  {technique.finishing.breathability}
                </strong>
              </div>
            </div>
          </div>

          {/* Care Protocol */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Protocolo de Cuidados y Mantenimiento de la Prenda</span>
            </h3>

            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block">Temperatura Máxima Lavado:</span>
                <strong className="text-slate-900 dark:text-white text-sm font-bold">
                  {technique.care.washTempMaxC > 0 ? `${technique.care.washTempMaxC}°C` : 'Lavado estándar'}
                </strong>
                <p className="text-slate-500 text-[11px] mt-0.5">{technique.care.washCycle}</p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block">Secadora:</span>
                <strong className="text-slate-900 dark:text-white text-sm font-bold">
                  {technique.care.tumbleDry}
                </strong>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block">Instrucciones de Plancha:</span>
                <strong className="text-slate-900 dark:text-white text-sm font-bold">
                  {technique.care.ironing}
                </strong>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block">Lavado del Revés:</span>
                <strong className="text-slate-900 dark:text-white text-sm font-bold">
                  {technique.care.turnInsideOut ? 'Obligatorio lavar al revés' : 'Opcional'}
                </strong>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block">Uso de Blanqueador / Cloro:</span>
                <strong className="text-slate-900 dark:text-white text-sm font-bold">
                  {technique.care.bleachAllowed ? 'Permitido' : 'Terminantemente prohibido'}
                </strong>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block">Ciclos de Lavado Certificados:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                  {technique.care.certifiedWashCycles}+ lavados certificados
                </strong>
                {technique.care.curationTimeBeforeFirstWashHours > 0 && (
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Esperar {technique.care.curationTimeBeforeFirstWashHours} horas antes del 1er lavado
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Troubleshooting (Common Problems & Solutions) */}
      {activeTab === 'soluciones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Diagnóstico de Fallas Comunes y Protocolos Correctivos de Taller
            </span>
            <span className="text-xs text-slate-500">
              {technique.commonProblems.length} casos registrados
            </span>
          </div>

          <div className="space-y-3">
            {technique.commonProblems.map((prob) => (
              <div
                key={prob.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        prob.severity === 'Crítico'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                          : prob.severity === 'Moderado'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                      }`}
                    >
                      {prob.severity}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {prob.symptom}
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30">
                    <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider block mb-1">
                      Causa Raíz Probable:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {prob.probableCause}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30">
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block mb-1">
                      Protocolo de Solución Técnica:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {prob.technicalSolution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
