import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Trash2, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationsDrawerOpen,
    setIsNotificationsDrawerOpen,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setActiveModuleId
  } = useApp();

  if (!isNotificationsDrawerOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-cyan-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsNotificationsDrawerOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Centro de Notificaciones
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsNotificationsDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            {notifications.length} notificaciones
          </span>
          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAllNotifications}
                className="text-slate-500 hover:text-rose-500 flex items-center gap-1 transition-colors"
                title="Limpiar todas"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2 text-slate-400">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                No tienes notificaciones pendientes
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                Los eventos de producción, impresiones y proyectos aparecerán aquí.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.moduleId) {
                    setActiveModuleId(notif.moduleId);
                    setIsNotificationsDrawerOpen(false);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  notif.read
                    ? 'border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40 opacity-75'
                    : 'border-indigo-200 dark:border-slate-700 bg-white dark:bg-slate-850 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {notif.title}
                      </span>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-mono">
                      <span>{notif.timestamp}</span>
                      {notif.moduleId && (
                        <span className="hover:underline flex items-center gap-1 text-indigo-500 dark:text-cyan-400">
                          Ver módulo
                          <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
