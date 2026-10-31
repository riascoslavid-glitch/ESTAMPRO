import React from 'react';
import { CalculationSimulationRow } from '../../../types/finance';
import { Layers, TrendingUp, DollarSign, Percent, ShieldCheck } from 'lucide-react';

interface VolumePricingMatrixProps {
  rows: CalculationSimulationRow[];
  currencySymbol: string;
  customQuantity: number;
  onCustomQuantityChange: (val: number) => void;
  onSelectTier?: (qty: number) => void;
}

export const VolumePricingMatrix: React.FC<VolumePricingMatrixProps> = ({
  rows,
  currencySymbol,
  customQuantity,
  onCustomQuantityChange,
  onSelectTier
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              Escala de Precios por Volumen & Simulación
            </h3>
            <p className="text-xs text-slate-400">
              Cálculo de economías de escala y amortización de costos fijos
            </p>
          </div>
        </div>

        {/* Entrada de cantidad personalizada */}
        <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <label className="text-xs text-slate-300 font-medium">Cant. Personalizada:</label>
          <input
            type="number"
            min="1"
            max="10000"
            value={customQuantity}
            onChange={(e) => onCustomQuantityChange(Math.max(1, Number(e.target.value)))}
            className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-center font-mono text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
          />
          <span className="text-xs text-slate-400">uds</span>
        </div>
      </div>

      {/* Tabla Comparativa de Simulación */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              <th className="py-2.5 px-3">Tirada / Lote</th>
              <th className="py-2.5 px-2 text-right">Costo Unit.</th>
              <th className="py-2.5 px-2 text-right">Costo Pedido</th>
              <th className="py-2.5 px-2 text-center">Desc. Vol.</th>
              <th className="py-2.5 px-2 text-right">PVP Unit.</th>
              <th className="py-2.5 px-2 text-right font-bold text-slate-200">Total Pedido</th>
              <th className="py-2.5 px-2 text-right text-emerald-400 font-bold">Ganancia Total</th>
              <th className="py-2.5 px-3 text-right">Margen Real</th>
              <th className="py-2.5 px-2 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
            {rows.map((row) => {
              const isSelected = row.quantity === customQuantity;
              return (
                <tr
                  key={row.quantity}
                  className={`transition-colors ${
                    isSelected
                      ? 'bg-cyan-950/30 text-cyan-200 font-semibold'
                      : 'hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <td className="py-2.5 px-3 font-sans">
                    <span className="font-medium text-slate-200">{row.label}</span>
                    {row.isCustom && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">
                        Personalizada
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-400">
                    {currencySymbol}{row.unitCost.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-400">
                    {currencySymbol}{row.batchCost.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    {row.discountPercent > 0 ? (
                      <span className="px-1.5 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                        -{row.discountPercent}%
                      </span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-right text-slate-200 font-bold">
                    {currencySymbol}{row.finalUnitPrice.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-cyan-300 font-bold">
                    {currencySymbol}{row.totalOrderPrice.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-emerald-400 font-bold">
                    +{currencySymbol}{row.totalProfit.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-1.5 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-300">
                      {row.marginPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-center font-sans">
                    {onSelectTier && (
                      <button
                        type="button"
                        onClick={() => onSelectTier(row.quantity)}
                        className="px-2 py-1 rounded text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                      >
                        Cotizar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-400 border-t border-slate-800/80">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          Los precios por escala amortizan los costos de puesta a punto de máquina (revelados, ponchados) y optimizan el desperdicio textil.
        </span>
        <span className="font-mono text-slate-300">
          Margen de seguridad mínimo garantizado: <strong>5%</strong>
        </span>
      </div>
    </div>
  );
};
