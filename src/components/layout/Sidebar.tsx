import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { APP_MODULES, MODULE_CATEGORIES } from '../../constants/modules';
import { AppIcon } from '../common/AppIcon';
import { 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle,
  Sparkles,
  Lock
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeModuleId,
    setActiveModuleId,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    addNotification
  } = useApp();

  const { canAccessModule, currentRole } = useAuth();

  const handleModuleClick = (moduleId: string, moduleName: string) => {
    if (!canAccessModule(moduleId)) {
      addNotification(
        'Acceso Restringido por Rol',
        `Tu rol actual (${currentRole}) no tiene permisos para acceder a "${moduleName}". Cambia de rol en la barra superior si eres administrador.`,
        'warning',
        'configuracion'
      );
      return;
    }
    setActiveModuleId(moduleId);
  };

  return (
    <aside
      className={`hidden md:flex flex-col bg-slate-50 dark:bg-slate-900/90 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 select-none ${
        isSidebarCollapsed ? 'w-18' : 'w-72'
      }`}
    >
      {/* Navigation List - Categorized */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {MODULE_CATEGORIES.map((category) => {
          const categoryModules = APP_MODULES.filter((m) => m.category === category.id);
          if (categoryModules.length === 0) return null;

          return (
            <div key={category.id} className="space-y-1">
              {!isSidebarCollapsed && (
                <div className="px-3 pb-1.5 text-[11px] font-bold tracking-wider uppercase text-slate-600 dark:text-slate-300">
                  {category.label}
                </div>
              )}

              {categoryModules.map((module) => {
                const isActive = activeModuleId === module.id;
                const isPending = module.status === 'pending_implementation';
                const hasAccess = canAccessModule(module.id);

                return (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => handleModuleClick(module.id, module.name)}
                    title={
                      isSidebarCollapsed
                        ? `${module.name} ${!hasAccess ? '(Bloqueado por Rol)' : isPending ? '(Fase ' + module.plannedStagePrompt + ')' : '(Activo)'}`
                        : undefined
                    }
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer group relative ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-cyan-500/15 dark:text-cyan-400 shadow-xs'
                        : !hasAccess
                        ? 'opacity-40 text-slate-400 hover:opacity-70'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`shrink-0 ${isActive ? 'text-white dark:text-cyan-400' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'}`}>
                      <AppIcon name={module.iconName} className="w-4 h-4" />
                    </div>

                    {/* Text Label */}
                    {!isSidebarCollapsed && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="truncate">{module.name}</span>
                        {!hasAccess ? (
                          <Lock className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                        ) : isPending ? (
                          <span className="text-[10px] font-mono font-medium text-slate-600 dark:text-slate-300 tabular-nums shrink-0 ml-1">
                            P{module.plannedStagePrompt}
                          </span>
                        ) : null}
                      </div>
                    )}

                    {/* Indicator pill when collapsed */}
                    {isSidebarCollapsed && isActive && (
                      <div className="absolute right-1 w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer / Toggle & System Status */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40">
        <div className="flex items-center justify-between gap-2">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-mono text-slate-600 dark:text-slate-300">v1.2.0</span>
              <span aria-hidden="true">·</span>
              <span>Firestore Conectado</span>
            </div>
          )}

          {/* Collapse/Expand Toggle */}
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
              isSidebarCollapsed ? 'mx-auto' : ''
            }`}
            title={isSidebarCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};
