import React, { useState, useMemo } from 'react';
import { EmployeeRecord, FilterState } from '../types';
import { AdvancedFilters } from './Dashboard/AdvancedFilters';
import { EmployeesTable } from './Dashboard/EmployeesTable';
import { matchMunicipio } from '../data/geoLara';
import { Users, PlusCircle } from 'lucide-react';

interface RosterViewProps {
  employees: EmployeeRecord[];
  onEmployeeUpdated: () => void;
  onOpenRegisterTab: () => void;
}

export const RosterView: React.FC<RosterViewProps> = ({
  employees,
  onEmployeeUpdated,
  onOpenRegisterTab,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    institucion: '',
    municipio: '',
    estado: '',
    estatus: 'TODOS',
    busqueda: '',
    soloForaneos: false
  });

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (filters.institucion && emp.institucion !== filters.institucion) return false;
      if (filters.municipio && !matchMunicipio(emp.municipio, filters.municipio)) return false;
      if (filters.estado && emp.estado.toUpperCase() !== filters.estado.toUpperCase()) return false;
      if (filters.estatus !== 'TODOS' && emp.participo !== filters.estatus) return false;
      if (filters.soloForaneos && !((emp.estado && emp.estado.toUpperCase() !== 'LARA') || emp.esForaneo)) return false;

      if (filters.busqueda.trim()) {
        const q = filters.busqueda.toLowerCase().trim();
        return (
          emp.cedula.includes(q) ||
          emp.apellidosNombres.toLowerCase().includes(q) ||
          emp.institucion.toLowerCase().includes(q) ||
          emp.municipio.toLowerCase().includes(q) ||
          emp.estado.toLowerCase().includes(q)
        );
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

  return (
    <div className="py-4 sm:py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase bg-blue-100 text-[#244BC5] dark:bg-blue-950 dark:text-blue-300 mb-2">
            <Users className="w-3.5 h-3.5" />
            Directorio Institucional Nominal
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Padrón General de Trabajadores
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Auditoría, búsqueda masiva y exportación de datos de trabajadores adscritos.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenRegisterTab}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors min-h-[42px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Consultar Cédula</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        totalFiltered={filteredEmployees.length}
        totalAll={employees.length}
      />

      {/* Employees Table */}
      <EmployeesTable
        employees={filteredEmployees}
        onEmployeeUpdated={onEmployeeUpdated}
      />

    </div>
  );
};
