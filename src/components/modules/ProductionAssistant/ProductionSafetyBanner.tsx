import React, { useState } from 'react';
import { 
  Flame, 
  Wind, 
  Zap, 
  ShieldAlert, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const ProductionSafetyBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-amber-300/80 dark:border-amber-900/50 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 space-y-3 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Protocolo de Seguridad Industrial en Taller
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200">
                Norma OSHA / ISO 45001
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Advertencias activas sobre calor extremo (150°C - 200°C), ventilación forzada, electricidad y manipulación de prensas.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-white/60 dark:bg-slate-900/60 transition-colors"
        >
          <span>{isExpanded ? 'Ocultar Normas' : 'Ver Reglas de Seguridad'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs border-t border-amber-200 dark:border-amber-900/50 animate-in fade-in duration-200">
          {/* 1. Calor */}
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
              <Flame className="w-4 h-4 shrink-0" />
              <span>1. Calor y Quemaduras</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Los platos térmicos superan los 200°C. Utilizar guantes ignífugos de kevlar y jamás tocar superficies metálicas sin protección.
            </p>
          </div>

          {/* 2. Ventilación */}
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold">
              <Wind className="w-4 h-4 shrink-0" />
              <span>2. Ventilación y Vapores</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              La polimerización de poliamidas DTF y tintas de descarga libera vapores de condensación. Mantener encendida la campana extractora o filtros de carbón.
            </p>
          </div>

          {/* 3. Electricidad */}
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
              <Zap className="w-4 h-4 shrink-0" />
              <span>3. Electricidad y Carga</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              Prensas térmicas de 2200W demandan alta intensidad. Prohibido el uso de regletas domésticas de plástico; usar línea con tierra de 16A exclusiva.
            </p>
          </div>

          {/* 4. Manipulación de Equipos */}
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-cyan-400 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>4. Atrapamiento Mecánico</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              En prensas neumáticas o electromagnéticas de cierre automático, mantener ambas manos en los pulsadores de seguridad fuera del plato.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
