import React from 'react';
import { 
  Vote, 
  BarChart3, 
  Users, 
  Settings2, 
  Sun, 
  Moon, 
  Calendar, 
  Radio,
  Lock,
  Unlock,
  LogOut
} from 'lucide-react';
import { soundFX } from '../services/audio';

interface NavbarProps {
  activeTab: 'register' | 'dashboard' | 'roster';
  setActiveTab: (tab: 'register' | 'dashboard' | 'roster') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenSettings: () => void;
  isGasConnected: boolean;
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
  onOpenSettings,
  isGasConnected,
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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      {/* Top Patriotic Line - Yellow, Blue, Red */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#F5C500]" />
        <div className="h-full w-1/3 bg-[#244BC5]" />
        <div className="h-full w-1/3 bg-[#DE2719]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Entity Branding */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('register')}>
              <img 
                src="/logo.webp" 
                alt="Logo Consulta Popular 2026" 
                className="h-14 sm:h-16 w-auto object-contain drop-shadow transition-transform group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icon.svg';
                }}
              />
            </div>
            
            <div className="border-l border-slate-200 dark:border-slate-700 pl-3 sm:pl-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800/40">
                  <Radio className="w-2.5 h-2.5 animate-pulse text-red-600 dark:text-red-400" />
                  2da Consulta Popular 2026
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3 h-3 text-amber-500" />
                  18 de Octubre de 2026
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-tight mt-0.5">
                MPPAPT <span className="text-[#244BC5] dark:text-blue-400 font-extrabold">LARA</span>
              </h1>
              <p className="hidden sm:block text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-1">
                Ministerio del Poder Popular para la Agricultura Productiva y Tierras y Entes Adscritos
              </p>
            </div>
          </div>

          {/* Center Tabs Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => handleTabClick('register')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-blue-600 to-[#244BC5] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
            >
              <Vote className="w-4 h-4" />
              <span>Registro / Reporte Rápido</span>
            </button>

            <button
              onClick={() => handleTabClick('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-600 to-[#244BC5] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard & Mapa</span>
              {!isAuthenticated ? (
                <Lock className="w-3 h-3 text-slate-400" />
              ) : (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black">
                  {percentage}%
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('roster')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'roster'
                  ? 'bg-gradient-to-r from-blue-600 to-[#244BC5] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Padrón Completo ({totalPadron})</span>
              {!isAuthenticated && <Lock className="w-3 h-3 text-slate-400" />}
            </button>
          </nav>

          {/* Right Action Controls: Lock status, GAS status, Dark Mode, Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Progress Pill */}
            <div className="hidden sm:flex flex-col items-end mr-1 text-right">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Participación
              </span>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                {totalParticiparon} / {totalPadron} ({percentage}%)
              </span>
            </div>

            {/* Lock / Unlock Dashboard Action */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={onLogout}
                title="Cerrar sesión de Dashboard / Bloquear"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 dark:bg-slate-800 dark:hover:bg-red-950/40 dark:text-slate-300 dark:hover:text-red-300 dark:border-slate-700 transition-colors"
              >
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden xl:inline">Bloquear</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onRequestAuth('dashboard')}
                title="Acceder con contraseña al Dashboard"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 dark:bg-slate-800 dark:hover:bg-blue-950/40 dark:text-slate-300 dark:hover:text-blue-300 dark:border-slate-700 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden xl:inline">Acceso</span>
              </button>
            )}

            {/* Google Sheets Connection Status */}
            <button
              onClick={onOpenSettings}
              title={isGasConnected ? 'Conectado a Google Sheets' : 'Modo Local / Configurar Sheets'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isGasConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isGasConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="hidden md:inline font-bold">
                {isGasConnected ? 'Sheets Conectado' : 'Base Local'}
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                soundFX.playClick();
                setIsDarkMode(!isDarkMode);
              }}
              aria-label="Alternar modo oscuro"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Settings Modal Trigger */}
            <button
              onClick={() => {
                soundFX.playClick();
                onOpenSettings();
              }}
              title="Configuración de Backend Google Sheets"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 gap-1">
          <button
            onClick={() => handleTabClick('register')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold ${
              activeTab === 'register'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Vote className="w-3.5 h-3.5" />
            <span>Registro</span>
          </button>
          <button
            onClick={() => handleTabClick('dashboard')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
            {!isAuthenticated && <Lock className="w-2.5 h-2.5 text-slate-400" />}
          </button>
          <button
            onClick={() => handleTabClick('roster')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold ${
              activeTab === 'roster'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Padrón</span>
            {!isAuthenticated && <Lock className="w-2.5 h-2.5 text-slate-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
