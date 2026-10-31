import React from 'react';
import { useApp } from '../../context/AppContext';
import { APP_MODULES, MODULE_CATEGORIES } from '../../constants/modules';
import { AppIcon } from '../common/AppIcon';
import { X, Layers, Plus, Settings } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const {
    activeModuleId,
    setActiveModuleId,
    isMobileNavOpen,
    setIsMobileNavOpen,
    setIsNewProjectModalOpen,
    setIsSettingsModalOpen
  } = useApp();

  if (!isMobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsMobileNavOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                ESTAMPAPRO 360°
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Menú de Aplicación
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(false)}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick New Project Button inside drawer */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setIsMobileNavOpen(false);
              setIsNewProjectModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-indigo-600 dark:bg-cyan-600 rounded-lg shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Proyecto</span>
          </button>
        </div>

        {/* Nav List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {MODULE_CATEGORIES.map((category) => {
            const categoryModules = APP_MODULES.filter((m) => m.category === category.id);
            if (categoryModules.length === 0) return null;

            return (
              <div key={category.id} className="space-y-1">
                <div className="px-3 pb-1 text-[11px] font-bold tracking-wider uppercase text-slate-600 dark:text-slate-300">
                  {category.label}
                </div>
                {categoryModules.map((module) => {
                  const isActive = activeModuleId === module.id;
                  const isPending = module.status === 'pending_implementation';

                  return (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => {
                        setActiveModuleId(module.id);
                        setIsMobileNavOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-colors ${
                        isActive
                          ? 'bg-slate-900 text-white dark:bg-cyan-500/15 dark:text-cyan-400 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <AppIcon name={module.iconName} className="w-4 h-4" />
                        <span>{module.name}</span>
                      </div>
                      {isPending && (
                        <span className="text-[10px] font-mono font-medium text-slate-600 dark:text-slate-300">
                          P{module.plannedStagePrompt}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setIsMobileNavOpen(false);
              setIsSettingsModalOpen(true);
            }}
            className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <Settings className="w-4 h-4" />
            <span>Configuración</span>
          </button>
          <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300">v1.0</span>
        </div>
      </div>
    </div>
  );
};
