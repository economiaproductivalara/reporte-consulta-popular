import React, { useState, useMemo } from 'react';
import { KpiGrid } from './KpiGrid';
import { LaraMap } from './LaraMap';
import { ForeignParticipationAlert } from './ForeignParticipationAlert';
import { AdvancedFilters } from './AdvancedFilters';
import { EmployeesTable } from './EmployeesTable';
import { EmployeeRecord, FilterState, DashboardKpis } from '../../types';
import { apiService } from '../../services/api';
import { matchMunicipio } from '../../data/geoLara';
import { generatePendingReportPdf } from '../../services/pdfReport';
import { soundFX } from '../../services/audio';
import { Sparkles, FileText, RefreshCw, Radio } from 'lucide-react';

interface DashboardViewProps {
  employees: EmployeeRecord[];
  liveStats?: DashboardKpis | null;
  isRefreshing?: boolean;
  lastUpdated?: Date;
  onEmployeeUpdated: () => void;
  onRefresh?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  employees,
  liveStats,
  isRefreshing = false,
  lastUpdated,
  onEmployeeUpdated,
  onRefresh,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    institucion: '',
    municipio: '',
    estado: '',
    estatus: 'TODOS',
    busqueda: '',
    soloForaneos: false
  });

  // Cálculo de KPIs 100% dinámico combinando la lista y las estadísticas en vivo de Google Sheets
  const kpis = useMemo(() => {
    return apiService.calculateKpis(employees, liveStats);
  }, [employees, liveStats]);

  // Filtrado reactivo de trabajadores
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Filtro por institución
      if (filters.institucion && emp.institucion !== filters.institucion) {
        return false;
      }

      // Filtro inteligente por municipio (resuelve acentos, guiones bajos, mayúsculas y alias)
      if (filters.municipio && !matchMunicipio(emp.municipio, filters.municipio)) {
        return false;
      }

      // Filtro por estado
      if (filters.estado) {
        const empEst = emp.estado ? emp.estado.toUpperCase() : '';
        if (empEst !== filters.estado.toUpperCase()) {
          return false;
        }
      }

      // Filtro por estatus de participación
      if (filters.estatus !== 'TODOS') {
        if (emp.participo !== filters.estatus) {
          return false;
        }
      }

      // Filtro por solo foráneos
      if (filters.soloForaneos) {
        const isForeign = (emp.estado && emp.estado.toUpperCase() !== 'LARA') || emp.esForaneo;
        if (!isForeign) {
          return false;
        }
      }

      // Búsqueda en vivo de texto
      if (filters.busqueda.trim()) {
        const query = filters.busqueda.toLowerCase().trim();
        const cedulaMatch = emp.cedula.includes(query);
        const nameMatch = emp.apellidosNombres.toLowerCase().includes(query);
        const instMatch = emp.institucion.toLowerCase().includes(query);
        const munMatch = emp.municipio.toLowerCase().includes(query);
        const estMatch = emp.estado.toLowerCase().includes(query);
        if (!cedulaMatch && !nameMatch && !instMatch && !munMatch && !estMatch) {
          return false;
        }
      }

      return true;
    });
  }, [employees, filters]);

  const handleResetFilters = () => {
    setFilters({
      institucion: '',
      municipio: '',
      estado: '',
      estatus: 'TODOS',
      busqueda: '',
      soloForaneos: false
    });
  };

  const handleSelectMunicipioFromMap = (munId: string) => {
    setFilters(prev => ({
      ...prev,
      municipio: munId,
      soloForaneos: false,
      estado: munId ? 'LARA' : ''
    }));
  };

  const handleFilterForeign = (onlyForeign: boolean) => {
    setFilters(prev => ({
      ...prev,
      soloForaneos: onlyForeign,
      municipio: onlyForeign ? '' : prev.municipio
    }));
  };

  return (
    <div className="py-4 sm:py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-5 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header with Dynamic Sync Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase bg-blue-100 text-[#244BC5] dark:bg-blue-950 dark:text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Consola de Control Estratégico
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Padrón Dinámico: <strong className="font-mono font-black">{kpis.totalPadron}</strong></span>
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Dashboard Analítico de Participación
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
            <span>Métricas en vivo sincronizadas con la base de datos oficial.</span>
            {lastUpdated && (
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                (Última sync: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
              </span>
            )}
          </p>
        </div>

        {/* Quick Actions: Manual Sync & PDF Report */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 self-stretch sm:self-auto">
          {onRefresh && (
            <button
              type="button"
              disabled={isRefreshing}
              onClick={() => {
                soundFX.playClick();
                onRefresh();
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-black bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              title="Actualizar datos y consultar el padrón más reciente en la base de datos"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#244BC5] dark:text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Sincronizando...' : 'Actualizar Padrón'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundFX.playSuccess();
              generatePendingReportPdf({
                employees: filteredEmployees,
                filterContext: {
                  institucion: filters.institucion,
                  municipio: filters.municipio
                }
              });
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Generar y descargar reporte oficial en PDF de los trabajadores que faltan por votar"
          >
            <FileText className="w-4 h-4" />
            <span>Descargar PDF Pendientes</span>
          </button>
        </div>
      </div>

      {/* 1. KPIs Grid Cards */}
      <KpiGrid kpis={kpis} />

      {/* 2. Foreign Participation Alert */}
      <ForeignParticipationAlert
        employees={employees}
        onFilterForeign={handleFilterForeign}
        isOnlyForeignActive={filters.soloForaneos}
      />

      {/* 3. Lara Territorial Map (9 Municipalities) */}
      <LaraMap
        kpis={kpis}
        selectedMunicipio={filters.municipio}
        onSelectMunicipio={handleSelectMunicipioFromMap}
      />

      {/* 4. Advanced Reactive Filters */}
      <AdvancedFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        totalFiltered={filteredEmployees.length}
        totalAll={employees.length}
      />

      {/* 5. Employees Data Table */}
      <EmployeesTable
        employees={filteredEmployees}
        onEmployeeUpdated={onEmployeeUpdated}
      />

    </div>
  );
};
