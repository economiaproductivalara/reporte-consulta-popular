import React, { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, ArrowRight, X, ShieldCheck } from 'lucide-react';
import { authService } from '../services/auth';
import { soundFX } from '../services/audio';

interface DashboardAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetTabName?: string;
}

export const DashboardAuthModal: React.FC<DashboardAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetTabName = 'el Dashboard',
}) => {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('Por favor ingrese la contraseña de acceso.');
      soundFX.playWarning();
      return;
    }

    const isValid = authService.login(password);
    if (isValid) {
      soundFX.playSuccess();
      setPassword('');
      onSuccess();
    } else {
      soundFX.playWarning();
      setError('Contraseña incorrecta. Verifique la clave de seguridad institucional o consulte a la coordinación del MPPAPT Lara.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 overflow-hidden">
        
        {/* Patriotic top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="h-full w-1/3 bg-[#F5C500]" />
          <div className="h-full w-1/3 bg-[#244BC5]" />
          <div className="h-full w-1/3 bg-[#DE2719]" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Icon */}
        <div className="text-center pt-2">
          <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-[#244BC5] dark:text-blue-400 shadow-sm mb-3 sm:mb-4">
            <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 mb-2">
            Área Restringida
          </span>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Acceso a {targetTabName}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Las métricas globales, el mapa electoral y el padrón general requieren autorización de la coordinación del MPPAPT Lara.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 sm:mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Contraseña de Seguridad
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                autoFocus
                placeholder="Ingrese contraseña..."
                className="w-full px-4 py-3 sm:py-3.5 pr-12 text-base sm:text-sm font-semibold bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-[#244BC5] focus:ring-4 focus:ring-blue-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl font-black text-sm tracking-wide uppercase text-white bg-gradient-to-r from-blue-600 to-[#244BC5] hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>Desbloquear Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Note */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Acceso seguro protegido institucionalmente
          </span>
        </div>

      </div>
    </div>
  );
};
