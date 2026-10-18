import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { RegistrationView } from './components/RegistrationModule/RegistrationView';
import { DashboardView } from './components/Dashboard/DashboardView';
import { RosterView } from './components/RosterView';
import { DashboardAuthModal } from './components/DashboardAuthModal';
import { LegalModal } from './components/LegalModals';
import { EmployeeRecord } from './types';
import { apiService } from './services/api';
import { authService } from './services/auth';

export function App() {
  const [activeTab, setActiveTab] = useState<'register' | 'dashboard' | 'roster'>('register');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authService.isAuthenticated());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [pendingTargetTab, setPendingTargetTab] = useState<'dashboard' | 'roster'>('dashboard');
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | null>(null);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('mppapt_theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);

  // Sincronizar clase dark en el elemento <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mppapt_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mppapt_theme', 'light');
    }
  }, [isDarkMode]);

  // Cargar datos de empleados
  const loadEmployees = useCallback(async () => {
    const data = await apiService.getAllEmployees();
    setEmployees(data);
  }, []);

  useEffect(() => {
    loadEmployees();
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

  // Cálculos rápidos para la barra de navegación
  const totalPadron = employees.length;
  const totalParticiparon = employees.filter(e => e.participo === 'SÍ').length;

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
      <main className="flex-1 w-full">
        {activeTab === 'register' && (
          <RegistrationView onRecordUpdated={loadEmployees} />
        )}

        {activeTab === 'dashboard' && (
          isAuthenticated ? (
            <DashboardView
              employees={employees}
              onEmployeeUpdated={loadEmployees}
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
              onEmployeeUpdated={loadEmployees}
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
