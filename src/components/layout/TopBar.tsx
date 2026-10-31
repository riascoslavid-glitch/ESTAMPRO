import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { APP_MODULES } from '../../constants/modules';
import { USER_ROLES } from '../../constants/roles';
import { UserRole } from '../../types';
import { 
  Search, 
  Plus, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  Settings, 
  SlidersHorizontal,
  ChevronRight,
  Layers,
  ShieldCheck,
  LogOut,
  LogIn,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  ShoppingBag
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    activeModuleId,
    setActiveModuleId,
    darkMode,
    toggleDarkMode,
    setIsNewProjectModalOpen,
    setIsSearchPaletteOpen,
    setIsSettingsModalOpen,
    setIsNotificationsDrawerOpen,
    setIsMobileNavOpen,
    unreadNotificationsCount,
    workshopProfile
  } = useApp();

  const {
    currentUser,
    userProfile,
    currentRole,
    setCurrentRole,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useAuth();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const currentModule = APP_MODULES.find((m) => m.id === activeModuleId) || APP_MODULES[0];
  const roleConfig = USER_ROLES[currentRole] || USER_ROLES.administrador;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Zone 1: Brand & Breadcrumb */}
      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setIsMobileNavOpen(true)}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 md:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Mark */}
        <button
          type="button"
          onClick={() => setActiveModuleId('inicio')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tight text-slate-900 dark:text-white text-base leading-none">
                ESTAMPAPRO
              </span>
              <span className="text-xs font-semibold px-1 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                360°
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
              Estudio Textil & Producción
            </p>
          </div>
        </button>

        {/* Breadcrumb Separator & Location */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 pl-3 border-l border-slate-200 dark:border-slate-800">
          <span>{currentModule.categoryLabel}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {currentModule.name}
          </span>
        </div>
      </div>

      {/* Zone 2: Tool Finder / Command Palette Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          type="button"
          onClick={() => setIsSearchPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Buscar herramientas, técnicas o módulos...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Actions, Role Selector & Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Tienda & Personalizador 3D Shortcut */}
        <button
          type="button"
          onClick={() => setActiveModuleId('catalogos_comerciales')}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeModuleId === 'catalogos_comerciales'
              ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-xs'
              : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
          }`}
          title="Abrir Tienda y Personalizador 3D de Clientes"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
          <span>Tienda & 3D</span>
        </button>

        {/* Role Selector Badge & Switcher (Section 2: Roles) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title="Cambiar rol activo para probar permisos del sistema"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
            <span>{roleConfig.label.split(' ')[0]}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Role Dropdown */}
          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in duration-150">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Cambiar Rol Activo (Permisos)
              </div>
              <div className="space-y-1 mt-1">
                {Object.values(USER_ROLES).map((r) => {
                  const isCurrent = currentRole === r.role;
                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => {
                        setCurrentRole(r.role as UserRole);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-start gap-2 p-2 rounded-lg text-left text-xs transition-colors ${
                        isCurrent
                          ? 'bg-indigo-50 dark:bg-cyan-950/40 text-indigo-700 dark:text-cyan-300 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <UserCheck className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isCurrent ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                      <div>
                        <div>{r.label}</div>
                        <div className="text-[10px] font-normal text-slate-400 line-clamp-1">
                          {r.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button: Nuevo Proyecto */}
        <button
          type="button"
          onClick={() => setIsNewProjectModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-lg shadow-sm transition-all hover:shadow-md cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden sm:inline">Nuevo Proyecto</span>
          <span className="sm:hidden">Nuevo</span>
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => setIsNotificationsDrawerOpen(true)}
          className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white shadow-xs">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={darkMode ? 'Modo claro' : 'Modo oscuro'}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
        </button>

        {/* User / Workshop Profile & Authentication Trigger */}
        <div className="flex items-center gap-1.5">
          {currentUser ? (
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer"
              title="Ajustes de cuenta"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 shrink-0">
                <img
                  src={userProfile?.photoURL || workshopProfile.avatarUrl}
                  alt={userProfile?.displayName || workshopProfile.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden xl:block text-left text-xs leading-none">
                <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {userProfile?.displayName || currentUser.email}
                </div>
                <div className="text-[10px] text-cyan-600 dark:text-cyan-400 mt-1 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>{roleConfig.label.split(' ')[0]}</span>
                </div>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
            >
              <LogIn className="w-4 h-4 text-cyan-500" />
              <span className="hidden sm:inline">Iniciar Sesión</span>
            </button>
          )}

          {currentUser && (
            <button
              type="button"
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
