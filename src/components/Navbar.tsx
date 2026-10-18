import React from 'react';
import { 
  Vote, 
  BarChart3, 
  Users, 
  Sun, 
  Moon, 
  Calendar, 
  Radio,
  Lock,
  Unlock
} from 'lucide-react';
import { soundFX } from '../services/audio';

interface NavbarProps {
  activeTab: 'register' | 'dashboard' | 'roster';
  setActiveTab: (tab: 'register' | 'dashboard' | 'roster') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  totalParticiparon: number;
  totalPadron: number;
  isAuthenticated: boolean;
  onRequestAuth: (target: 'dashboard' | 'roster') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  totalParticiparon,
  totalPadron,
  isAuthenticated,
  onRequestAuth,
  onLogout,
}) => {
  const percentage = totalPadron > 0 ? ((totalParticiparon / totalPadron) * 100).toFixed(1) : '0';

  const handleTabClick = (tab: 'register' | 'dashboard' | 'roster') => {
    soundFX.playClick();
    if (tab === 'register') {
      setActiveTab('register');
      return;
    }

    if (!isAuthenticated) {
      onRequestAuth(tab);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/90 dark:border-slate-800 shadow-2xs transition-colors duration-200">
        {/* Top Patriotic Line - Yellow, Blue, Red */}
        <div className="h-1 sm:h-1.5 w-full flex">
          <div className="h-full w-1/3 bg-[#F5C500]" />
          <div className="h-full w-1/3 bg-[#244BC5]" />
          <div className="h-full w-1/3 bg-[#DE2719]" />
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-2 sm:py-3 min-h-[4rem] sm:min-h-[5.5rem]">
            
            {/* Logo Oficial Protagónico & Identidad Institucional */}
            <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
              <div 
                className="relative group cursor-pointer bg-white p-1 rounded-xl sm:rounded-2xl shadow-2xs border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md shrink-0" 
                onClick={() => setActiveTab('register')}
                title="Ir al inicio de reporte"
              >
                <img 
                  src="/logo.webp" 
                  alt="Logo Consulta Popular Nacional 2026" 
                  className="h-11 sm:h-16 md:h-20 w-auto object-contain drop-shadow transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/icon.svg';
                  }}
                />
              </div>
              
              <div className="border-l border-slate-200 dark:border-slate-700 pl-2.5 sm:pl-4 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-wide uppercase bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800/40">
                    <Radio className="w-2 h-2 sm:w-2.5 sm:h-2.5 animate-pulse text-red-600 dark:text-red-400" />
                    <span className="truncate">2da Consulta 2026</span>
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3 h-3 text-amber-500" />
                    18 de Octubre
                  </span>
                </div>
                <h1 className="text-sm sm:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight mt-0.5 truncate">
                  MPPAPT <span className="text-[#244BC5] dark:text-blue-400 font-extrabold">LARA</span>
                </h1>
                <p className="hidden md:block text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                  Ministerio del Poder Popular para la Agricultura Productiva y Tierras
                </p>
              </div>
            </div>

            {/* Desktop Tabs Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5 p-1.5 bg-slate-100/90 dark:bg-slate-800/70 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
              <button
                onClick={() => handleTabClick('register')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-blue-600 to-[#244BC5] text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/50'
                }`}
              >
                <Vote className="w-4 h-4" />
                <span>Registro Rápido</span>
              </button>

              <button
                onClick={() => handleTabClick('dashboard')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-gradient-to-r from-blue-600 to-[#244BC5] text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard & Mapa</span>
                {!isAuthenticated ? (
                  <Lock className="w-3 h-3 text-slate-400" />
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black">
                    {percentage}%
                  </span>
                )}
              </button>
            </nav>

            {/* Right Action Controls: Progress counter, Lock, Dark Mode */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Live Progress Pill */}
              <div className="flex flex-col items-end text-right bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Votos
                </span>
                <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono leading-none">
                  {totalParticiparon} <span className="text-[10px] font-normal text-slate-400">({percentage}%)</span>
                </span>
              </div>

              {/* Lock / Unlock Dashboard Action */}
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={onLogout}
                  title="Cerrar sesión de Dashboard / Bloquear"
                  className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 dark:bg-slate-800 dark:hover:bg-red-950/40 dark:text-slate-300 dark:hover:text-red-300 dark:border-slate-700 transition-colors"
                >
                  <Unlock className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">Bloquear</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onRequestAuth('dashboard')}
                  title="Acceder con contraseña al Dashboard"
                  className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-[#244BC5] border border-blue-200 dark:bg-slate-800 dark:hover:bg-blue-950/40 dark:text-blue-300 dark:border-slate-700 transition-colors"
                >
                  <Lock className="w-4 h-4 text-[#244BC5] dark:text-blue-400" />
                  <span className="hidden sm:inline">Acceso</span>
                </button>
              )}

              {/* Botón de cambio de tema: Claro / Oscuro */}
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setIsDarkMode(!isDarkMode);
                }}
                title={isDarkMode ? 'Cambiar a paleta de colores claros' : 'Cambiar a modo oscuro'}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-black transition-all border ${
                  isDarkMode
                    ? 'bg-slate-800 border-amber-500/40 text-amber-400 hover:bg-slate-700'
                    : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 hover:border-slate-400 shadow-2xs'
                }`}
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Modo Claro</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-blue-600" />
                    <span className="hidden sm:inline text-slate-700">Modo Oscuro</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Bottom App Navigation Bar for Mobile */}
      <nav 
        aria-label="Navegación Móvil"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 px-6 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-around"
        style={{ paddingBottom: 'max(0.4rem, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={() => handleTabClick('register')}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all ${
            activeTab === 'register'
              ? 'text-blue-600 dark:text-blue-400 font-black'
              : 'text-slate-500 dark:text-slate-400 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${activeTab === 'register' ? 'bg-blue-50 dark:bg-blue-950/60' : ''}`}>
            <Vote className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5">Registro</span>
        </button>

        <button
          onClick={() => handleTabClick('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl relative transition-all ${
            activeTab === 'dashboard'
              ? 'text-blue-600 dark:text-blue-400 font-black'
              : 'text-slate-500 dark:text-slate-400 font-medium'
          }`}
        >
          <div className={`p-1 rounded-xl transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 dark:bg-blue-950/60' : ''}`}>
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-[11px] mt-0.5 flex items-center gap-1">
            Dashboard
            {!isAuthenticated ? (
              <Lock className="w-2.5 h-2.5 text-slate-400" />
            ) : (
              <span className="text-[10px] font-bold text-amber-500">({percentage}%)</span>
            )}
          </span>
        </button>
      </nav>
    </>
  );
};
