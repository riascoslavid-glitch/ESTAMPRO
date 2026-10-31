import React from 'react';
import { StoreProduct } from '../../../types/store';
import { X, Ruler, Shirt, CheckCircle, Info, ShieldAlert } from 'lucide-react';

interface GarmentSizesModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: StoreProduct;
}

export const GarmentSizesModal: React.FC<GarmentSizesModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Guía de Tallas y Ficha Técnica
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {product.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Quick Specs Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Gramaje</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{product.weightGsm}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Composición</span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{product.composition}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Técnica Ideal</span>
              <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 line-clamp-1">{product.defaultTechnique}</span>
            </div>
          </div>

          {/* Measurements Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>Tabla de Medidas Reales en Centímetros (cm)</span>
            </h4>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Talla</th>
                    <th className="py-2.5 px-3">Ancho Pecho (A)</th>
                    <th className="py-2.5 px-3">Largo Total (B)</th>
                    <th className="py-2.5 px-3">Largo Manga (C)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                  {product.measurements.map((m) => (
                    <tr key={m.size} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-bold font-sans text-slate-900 dark:text-white">{m.size}</td>
                      <td className="py-2.5 px-3">{m.chestCm} cm</td>
                      <td className="py-2.5 px-3">{m.lengthCm} cm</td>
                      <td className="py-2.5 px-3">{m.sleeveCm || '-'} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 italic">
              * Tolerancia de confección industrial textil de ±1.5 cm. Medidas tomadas en prenda extendida sobre superficie plana.
            </p>
          </div>

          {/* Washing & Care instructions */}
          <div className="p-4 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
            <div className="font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              Recomendaciones de Cuidado para Estampados
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
              <li>Lavar siempre con la prenda al revés con agua fría o máximo 30°C.</li>
              <li>No planchar directamente sobre el estampado; planchar por el revés o con paño de algodón.</li>
              <li>No usar blanqueadores agresivos ni secadora a alta temperatura.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
