import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { USER_ROLES } from '../../constants/roles';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Layers,
  KeyRound
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginWithEmail,
    registerWithEmail,
    sendPasswordReset
  } = useAuth();

  const { addNotification } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('disenador');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      if (authModalMode === 'login') {
        await loginWithEmail(email, password);
        addNotification('Sesión Iniciada', `Bienvenido nuevamente a ESTAMPAPRO 360°.`, 'success');
        setIsAuthModalOpen(false);
      } else if (authModalMode === 'register') {
        if (!name.trim()) {
          throw new Error('Por favor ingresa tu nombre completo.');
        }
        await registerWithEmail(email, password, name.trim(), selectedRole);
        addNotification('Cuenta Creada', `Registro exitoso con rol "${USER_ROLES[selectedRole].label}".`, 'success');
        setIsAuthModalOpen(false);
      } else if (authModalMode === 'forgot_password') {
        await sendPasswordReset(email);
        setSuccessMessage('Se ha enviado un enlace de recuperación a tu correo electrónico.');
        addNotification('Recuperación Enviada', `Revisa tu bandeja de entrada en ${email}.`, 'info');
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Ocurrió un error en la autenticación.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'Correo electrónico o contraseña incorrectos.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Ya existe una cuenta registrada con este correo.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (err.code === 'auth/user-not-found') {
        msg = 'No existe una cuenta registrada con este correo.';
      }
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {authModalMode === 'login' && 'Iniciar Sesión'}
                {authModalMode === 'register' && 'Crear Cuenta en ESTAMPAPRO'}
                {authModalMode === 'forgot_password' && 'Recuperar Contraseña'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Plataforma de Taller Textil & Producción
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-700 dark:text-emerald-300">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Name field for registration */}
          {authModalMode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nombre y Apellido *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Roberto Díaz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Correo Electrónico *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="ejemplo@estampapro.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Password field */}
          {authModalMode !== 'forgot_password' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Contraseña *
                </label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setAuthModalMode('forgot_password');
                    }}
                    className="text-[11px] text-indigo-600 dark:text-cyan-400 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-500"
                />
              </div>
            </div>
          )}

          {/* Role selector on registration (Section 2: Roles) */}
          {authModalMode === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Perfil y Rol en el Taller</span>
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {Object.values(USER_ROLES).map((r) => (
                  <option key={r.role} value={r.role}>
                    {r.label} — {r.description.slice(0, 48)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-lg shadow-sm transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Procesando...</span>
            ) : (
              <>
                <span>
                  {authModalMode === 'login' && 'Entrar al Sistema'}
                  {authModalMode === 'register' && 'Crear Cuenta y Asignar Rol'}
                  {authModalMode === 'forgot_password' && 'Enviar Correo de Recuperación'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Toggle modes */}
          <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
            {authModalMode === 'login' && (
              <p>
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setAuthModalMode('register');
                  }}
                  className="font-semibold text-indigo-600 dark:text-cyan-400 hover:underline"
                >
                  Regístrate aquí
                </button>
              </p>
            )}

            {authModalMode === 'register' && (
              <p>
                ¿Ya tienes una cuenta registrada?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setAuthModalMode('login');
                  }}
                  className="font-semibold text-indigo-600 dark:text-cyan-400 hover:underline"
                >
                  Inicia sesión aquí
                </button>
              </p>
            )}

            {authModalMode === 'forgot_password' && (
              <p>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setAuthModalMode('login');
                  }}
                  className="font-semibold text-indigo-600 dark:text-cyan-400 hover:underline"
                >
                  ← Volver a inicio de sesión
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
