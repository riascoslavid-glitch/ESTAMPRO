import React from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  Workflow, 
  BarChart3, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface AdminHeaderNavProps {
  currentTab?: 'clientes' | 'pedidos' | 'inventario' | 'produccion' | 'reportes' | 'control_calidad';
  activeSection?: 'clientes' | 'pedidos' | 'inventario' | 'produccion' | 'reportes' | 'control_calidad';
  lowStockCount?: number;
  pendingOrdersCount?: number;
  inProductionCount?: number;
}

export const AdminHeaderNav: React.FC<AdminHeaderNavProps> = ({
  currentTab,
  activeSection,
  lowStockCount = 0,
  pendingOrdersCount = 0,
  inProductionCount = 0
}) => {
  const { setActiveModuleId } = useApp();
  const selected = activeSection || currentTab || 'pedidos';

  const tabs = [
    {
      id: 'pedidos',
      label: 'Pedidos y OTs',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined,
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
    },
    {
      id: 'produccion',
      label: 'Producción & Taller',
      icon: Workflow,
      badge: inProductionCount > 0 ? `${inProductionCount} activas` : undefined,
      badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300'
    },
    {
      id: 'control_calidad',
      label: 'Control de Calidad',
      icon: CheckCircle2
    },
    {
      id: 'inventario',
      label: 'Inventario Textil',
      icon: Package,
      badge: lowStockCount > 0 ? `${lowStockCount} alertas` : undefined,
      badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300 animate-pulse'
    },
    {
      id: 'clientes',
      label: 'Clientes (CRM)',
      icon: Users
    },
    {
      id: 'reportes',
      label: 'Reportes & Métricas',
      icon: BarChart3
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none w-full sm:w-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = selected === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveModuleId(tab.id === 'reportes' ? 'finanzas' : tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab.badgeClass}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {lowStockCount > 0 && currentTab !== 'inventario' && (
        <div 
          onClick={() => setActiveModuleId('inventario')}
          className="cursor-pointer hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs font-medium hover:bg-rose-100 transition-colors"
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{lowStockCount} ítems con existencias bajo el mínimo</span>
        </div>
      )}
    </div>
  );
};
