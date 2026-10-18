import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RegistrationView } from './components/RegistrationModule/RegistrationView';
import { DashboardView } from './components/Dashboard/DashboardView';
import { RosterView } from './components/RosterView';
import { DashboardAuthModal } from './components/DashboardAuthModal';
import { LegalModal } from './components/LegalModals';
import { EmployeeRecord, DashboardKpis } from './types';
import { apiService } from './services/api';
import { authService } from './services/auth';

export function App() {
  const [activeTab, setActiveTab] = useState<'register' | 'dashboard' | 'roster'>('register');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authService.isAuthenticated());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [pendingTargetTab, setPendingTargetTab] = useState<'dashboard' | 'roster'>('dashboard');
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);

  // Paleta de colores claros por defecto garantizada al 100%
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        // Limpiar cualquier preferencia oscura anterior en la caché del navegador del usuario
        if (localStorage.getItem('mppapt_theme') === 'dark') {
          localStorage.removeItem('mppapt_theme');
        }
        const savedTheme = localStorage.getItem('mppapt_theme_v2');
        if (savedTheme === 'dark') return true;
        return false; // Por defecto siempre paleta de colores claros
      } catch {
        return false;
      }
    }
    return false;
  });

  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [liveStats, setLiveStats] = useState<DashboardKpis | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Sincronizar clase dark en el elemento <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('mppapt_theme_v2', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('mppapt_theme_v2', 'light');
      } catch {}
    }
  }, [isDarkMode]);

  // Cargar datos y estadísticas en vivo del padrón dinámico
  const loadEmployees = useCallback(async (isBackground = false) => {
    if (!isBackground) setIsRefreshing(true);

    try {
      // 1. Estadísticas en vivo de alta velocidad directamente de Google Sheets (action=stats)
      const statsPromise = apiService.getLiveStats().then((stats) => {
        if (stats && stats.totalPadron > 0) {
          setLiveStats(stats);
        }
      });

      // 2. Nómina completa para filtros territoriales y tabla (action=list)
      const listPromise = apiService.getAllEmployees().then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEmployees(data);
        }
      });

      await Promise.allSettled([statsPromise, listPromise]);
      setLastUpdated(new Date());
    } finally {
      if (!isBackground) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();

    // Polling reactivo cada 30 segundos para garantizar datos dinámicos en vivo
    const timer = setInterval(() => {
      loadEmployees(true);
    }, 30000);

    return () => clearInterval(timer);
  }, [loadEmployees]);

  // Manejo de solicitud de autenticación para Dashboard o Padrón
  const handleRequestAuth = (target: 'dashboard' | 'roster') => {
    setPendingTargetTab(target);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setActiveTab(pendingTargetTab);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    if (activeTab !== 'register') {
      setActiveTab('register');
    }
  };

  // Cálculos 100% dinámicos para la barra de navegación
  const totalPadron = Math.max(employees.length, liveStats?.totalPadron || 0);
  const totalParticiparon = Math.max(
    employees.filter(e => e.participo === 'SÍ').length,
    liveStats?.totalParticiparon || 0
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Header & Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        totalParticiparon={totalParticiparon}
        totalPadron={totalPadron}
        isAuthenticated={isAuthenticated}
        onRequestAuth={handleRequestAuth}
        onLogout={handleLogout}
      />

      {/* Main App Viewport */}
      <main className="flex-1 w-full pb-20 lg:pb-0">
        {activeTab === 'register' && (
          <RegistrationView onRecordUpdated={() => loadEmployees(false)} />
        )}

        {activeTab === 'dashboard' && (
          isAuthenticated ? (
            <DashboardView
              employees={employees}
              liveStats={liveStats}
              isRefreshing={isRefreshing}
              lastUpdated={lastUpdated}
              onEmployeeUpdated={() => loadEmployees(false)}
              onRefresh={() => loadEmployees(false)}
            />
          ) : (
            <div className="py-20 text-center space-y-4">
              <p className="text-slate-500">Debe ingresar la contraseña para ver el Dashboard.</p>
              <button
                onClick={() => handleRequestAuth('dashboard')}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm"
              >
                Ingresar Contraseña
              </button>
            </div>
          )
        )}

        {activeTab === 'roster' && (
          isAuthenticated ? (
            <RosterView
              employees={employees}
              totalMetaPadron={totalPadron}
              onEmployeeUpdated={() => loadEmployees(false)}
              onOpenRegisterTab={() => setActiveTab('register')}
            />
          ) : (
            <div className="py-20 text-center space-y-4">
              <p className="text-slate-500">Debe ingresar la contraseña para ver el Padrón General.</p>
              <button
                onClick={() => handleRequestAuth('roster')}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm"
              >
                Ingresar Contraseña
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer onOpenLegal={(type) => setLegalModalType(type)} />

      {/* Dashboard Password Protected Gate Modal */}
      <DashboardAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        targetTabName={pendingTargetTab === 'dashboard' ? 'el Dashboard y Mapa' : 'el Padrón General'}
      />

      {/* Terms of Use and Privacy Policy Modal */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}

export default App;
