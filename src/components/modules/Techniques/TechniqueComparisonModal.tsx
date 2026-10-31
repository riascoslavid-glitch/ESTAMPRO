import React from 'react';
import { DetailedTechniqueSheet } from '../../../types/techniques';
import { TECHNIQUES_ENCYCLOPEDIA } from '../../../constants/techniquesEncyclopedia';
import { 
  X, 
  Scale, 
  Check, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  Layers, 
  Gauge, 
  Cpu, 
  HelpCircle 
} from 'lucide-react';

interface TechniqueComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedTechniques: DetailedTechniqueSheet[];
  onAddTechnique: (tech: DetailedTechniqueSheet) => void;
  onRemoveTechnique: (techId: string) => void;
  onSelectTechniqueForDetail: (techId: string) => void;
}

export const TechniqueComparisonModal: React.FC<TechniqueComparisonModalProps> = ({
  isOpen,
  onClose,
  comparedTechniques,
  onAddTechnique,
  onRemoveTechnique,
  onSelectTechniqueForDetail
}) => {
  if (!isOpen) return null;

  const availableToAdd = TECHNIQUES_ENCYCLOPEDIA.filter(
    (t) => !comparedTechniques.some((ct) => ct.id === t.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-6xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-cyan-950/60 text-indigo-700 dark:text-cyan-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Comparador Técnico de Estampado</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300">
                  {comparedTechniques.length} / 4 técnicas
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Análisis comparativo riguroso basado en estándares y métricas textiles reales.
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

        {/* Quick Add Bar */}
        {comparedTechniques.length < 4 && availableToAdd.length > 0 && (
          <div className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
            <span className="font-semibold text-slate-500 shrink-0">Agregar técnica:</span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {availableToAdd.slice(0, 8).map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => onAddTechnique(tech)}
                  className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-cyan-400 transition-all font-medium whitespace-nowrap flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>{tech.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Body Matrix: Side by side columns */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {comparedTechniques.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Scale className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No has seleccionado ninguna técnica para comparar
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Selecciona al menos 2 técnicas desde la lista o haz click en los botones superiores para agregarlas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
              {comparedTechniques.map((tech) => (
                <div
                  key={tech.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 space-y-5 flex flex-col justify-between shadow-xs relative"
                >
                  {/* Remove pill */}
                  <button
                    type="button"
                    onClick={() => onRemoveTechnique(tech.id)}
                    className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Quitar de comparación"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="space-y-4">
                    {/* Header */}
                    <div className="pr-6">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">
                        {tech.id}
                      </span>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight">
                        {tech.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {tech.shortDesc}
                      </p>
                    </div>

                    {/* Section 1: Compatibilidad */}
                    <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                          1. Compatibilidad
                        </span>
                        <span className="font-bold text-indigo-600 dark:text-cyan-400 text-xs">
                          {tech.comparisonMetrics.fabricCompatibilityScore} / 10
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                        <div>
                          <strong>Fibras óptimas:</strong> {tech.defaultParameters.primaryMaterials.slice(0, 2).join(', ')}
                        </div>
                        <div>
                          <strong>Prendas oscuras:</strong> {tech.finishing.opacityDarkFabrics}
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Durabilidad */}
                    <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                          2. Durabilidad
                        </span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                          {tech.comparisonMetrics.durabilityScore} / 10
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                        <div>
                          <strong>Lavados certificados:</strong> {tech.care.certifiedWashCycles}+ ciclos
                        </div>
                        <div>
                          <strong>Elasticidad:</strong> {tech.finishing.elasticity}
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Cantidad y Tiradas */}
                    <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                          3. Cantidad / Tirada
                        </span>
                        <span className="font-bold text-amber-600 dark:text-amber-400 text-xs">
                          {tech.comparisonMetrics.quantityFlexibilityScore} / 10
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                        <div>
                          <strong>Tirada mínima sugerida:</strong> {tech.comparisonMetrics.quantityFlexibilityScore >= 9 ? '1 unidad' : (tech.comparisonMetrics.quantityFlexibilityScore >= 7 ? '12 unidades' : '24-50 unidades')}
                        </div>
                        <div>
                          <strong>Tirada corta (1-20u):</strong> {tech.comparisonMetrics.costPerUnitSmallRun}
                        </div>
                        <div>
                          <strong>Tirada masiva (&gt;100u):</strong> {tech.comparisonMetrics.costPerUnitBulkRun}
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Costos */}
                    <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                          4. Costo
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {tech.comparisonMetrics.initialInvestmentCost.split(' ')[0]}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                        <div>
                          <strong>Inversión inicial:</strong> {tech.comparisonMetrics.initialInvestmentCost}
                        </div>
                      </div>
                    </div>

                    {/* Section 5: Materiales e Insumos */}
                    <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        5. Material e Insumos
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                        {tech.consumables.map((c) => c.name).slice(0, 2).join(' + ')}
                      </div>
                    </div>

                    {/* Section 6: Complejidad */}
                    <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                          6. Complejidad
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                          {tech.comparisonMetrics.operationalComplexity}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                        <div>
                          <strong>Espacio taller:</strong> {tech.comparisonMetrics.spaceRequirement}
                        </div>
                        <div>
                          <strong>Tacto:</strong> {tech.finishing.touch}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action bottom button */}
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTechniqueForDetail(tech.id);
                      onClose();
                    }}
                    className="w-full mt-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors text-center"
                  >
                    Ver Ficha Completa
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Comparativa calibrada de estándares industriales FESPA &amp; SGIA</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cerrar Comparador
          </button>
        </div>
      </div>
    </div>
  );
};
