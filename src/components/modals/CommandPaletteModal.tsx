import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_MODULES } from '../../constants/modules';
import { PRINTING_TECHNIQUES } from '../../constants/techniques';
import { AppIcon } from '../common/AppIcon';
import { 
  Search, 
  X, 
  Plus, 
  Sun, 
  Moon, 
  Settings, 
  Layers, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const CommandPaletteModal: React.FC = () => {
  const {
    isSearchPaletteOpen,
    setIsSearchPaletteOpen,
    setActiveModuleId,
    setIsNewProjectModalOpen,
    setIsSettingsModalOpen,
    toggleDarkMode,
    darkMode
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchPaletteOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isSearchPaletteOpen]);

  if (!isSearchPaletteOpen) return null;

  // Filter modules
  const filteredModules = APP_MODULES.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter techniques
  const filteredTechniques = PRINTING_TECHNIQUES.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectModule = (id: string) => {
    setActiveModuleId(id);
    setIsSearchPaletteOpen(false);
  };

  const handleAction = (callback: () => void) => {
    setIsSearchPaletteOpen(false);
    callback();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchPaletteOpen(false)}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Escribe para buscar módulos, herramientas o técnicas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Quick Actions (when query is empty or matches) */}
          {(!searchQuery || 'nuevo proyecto'.includes(searchQuery.toLowerCase()) || 'tema'.includes(searchQuery.toLowerCase()) || 'configuracion'.includes(searchQuery.toLowerCase())) && (
            <div className="space-y-1">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Acciones Rápidas
              </div>
              <button
                type="button"
                onClick={() => handleAction(() => setIsNewProjectModalOpen(true))}
                className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-cyan-950/40 text-indigo-600 dark:text-cyan-400 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">Crear Nuevo Proyecto</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-2">Registrar prenda y técnica</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleAction(() => toggleDarkMode())}
                className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">Alternar Modo Claro / Oscuro</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-2">
                      Actualmente: {darkMode ? 'Oscuro' : 'Claro'}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleAction(() => setIsSettingsModalOpen(true))}
                className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                    <Settings className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">Ajustes del Taller & Perfiles</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-2">DPI, moneda e impuestos</span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          )}

          {/* Modules List */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center justify-between">
              <span>Módulos de la Plataforma ({filteredModules.length})</span>
            </div>

            {filteredModules.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No se encontraron módulos con el término "{searchQuery}".
              </div>
            ) : (
              filteredModules.map((module) => (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => handleSelectModule(module.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AppIcon name={module.iconName} className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 flex items-center gap-2">
                        <span>{module.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                          · {module.categoryLabel}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {module.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {module.status === 'active' ? (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Activo
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Fase {module.plannedStagePrompt}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-cyan-400" />
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Techniques matches */}
          {filteredTechniques.length > 0 && searchQuery && (
            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Técnicas Textiles Coincidentes
              </div>
              {filteredTechniques.map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => handleSelectModule('tecnicas_estampado')}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-cyan-500 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{tech.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{tech.idealFor}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>↑↓ para navegar</span>
            <span>↵ para seleccionar</span>
          </div>
          <span>Buscador ESTAMPAPRO 360°</span>
        </div>
      </div>
    </div>
  );
};
