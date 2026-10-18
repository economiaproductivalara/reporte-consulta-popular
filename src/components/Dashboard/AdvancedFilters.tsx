import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, RotateCcw, X, Building, MapPin, CheckCircle2 } from 'lucide-react';
import { FilterState } from '../../types';
import { LARA_MUNICIPALITIES, VENEZUELA_STATES, MPPAPT_ENTITIES } from '../../data/geoLara';

interface AdvancedFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalFiltered: number;
  totalAll: number;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalFiltered,
  totalAll,
}) => {
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (field: keyof FilterState, value: string | boolean) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  const isFiltered = 
    filters.institucion !== '' ||
    filters.municipio !== '' ||
    filters.estado !== '' ||
    filters.estatus !== 'TODOS' ||
    filters.busqueda !== '' ||
    filters.soloForaneos;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
      
      {/* Search Bar & Result Counter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        
        {/* Live Search Input with Suggestions */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-xl">
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={filters.busqueda}
              onChange={(e) => {
                handleInputChange('busqueda', e.target.value);
                setSearchSuggestionsOpen(true);
              }}
              onFocus={() => setSearchSuggestionsOpen(true)}
              placeholder="Búsqueda: Cédula, Nombre o Institución..."
              className="w-full bg-transparent text-base sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
            {filters.busqueda && (
              <button
                type="button"
                onClick={() => handleInputChange('busqueda', '')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Counter & Clear Button */}
        <div className="flex items-center justify-between md:justify-start gap-2.5">
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">
            Mostrando <strong className="text-blue-600 dark:text-blue-400 font-black">{totalFiltered}</strong> de {totalAll}
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>

      </div>

      {/* Advanced Filter Selects Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
        
        {/* Institución / Ente Adscrito */}
        <div className="relative">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
            <Building className="w-3 h-3 text-blue-500" />
            Institución / Ente
          </label>
          <select
            value={filters.institucion}
            onChange={(e) => handleInputChange('institucion', e.target.value)}
            className="w-full min-h-[42px] px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
          >
            <option value="">TODAS LAS INSTITUCIONES</option>
            {MPPAPT_ENTITIES.map((ent) => (
              <option key={ent} value={ent}>
                {ent}
              </option>
            ))}
          </select>
        </div>

        {/* Municipio de Lara */}
        <div className="relative">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-500" />
            Municipio
          </label>
          <select
            value={filters.municipio}
            onChange={(e) => handleInputChange('municipio', e.target.value)}
            className="w-full min-h-[42px] px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">TODOS LOS MUNICIPIOS</option>
            {LARA_MUNICIPALITIES.map((mun) => (
              <option key={mun.id} value={mun.id}>
                {mun.nombre.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Estado Federal */}
        <div className="relative">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-500" />
            Estado
          </label>
          <select
            value={filters.estado}
            onChange={(e) => handleInputChange('estado', e.target.value)}
            className="w-full min-h-[42px] px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">TODOS LOS ESTADOS</option>
            {VENEZUELA_STATES.map((st) => (
              <option key={st} value={st}>
                {st} {st === 'LARA' ? '(LOCAL)' : '(FORÁNEO)'}
              </option>
            ))}
          </select>
        </div>

        {/* Estatus de Participación */}
        <div className="relative">
          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-red-500" />
            Estatus Voto
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl min-h-[42px] items-center">
            {(['TODOS', 'SÍ', 'NO'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleInputChange('estatus', status)}
                className={`h-8 text-[11px] font-black rounded-lg transition-all flex items-center justify-center ${
                  filters.estatus === status
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
