import React from 'react';
import { Globe, MapPin, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { EmployeeRecord } from '../../types';

interface ForeignParticipationAlertProps {
  employees: EmployeeRecord[];
  onFilterForeign: (onlyForeign: boolean) => void;
  isOnlyForeignActive: boolean;
}

export const ForeignParticipationAlert: React.FC<ForeignParticipationAlertProps> = ({
  employees,
  onFilterForeign,
  isOnlyForeignActive,
}) => {
  // Filtrar los que votaron en otro estado
  const foreignEmployees = employees.filter(
    (e) => (e.estado && e.estado.toUpperCase() !== 'LARA') || e.esForaneo === true
  );

  const foreignVoted = foreignEmployees.filter((e) => e.participo === 'SÍ');

  // Agrupar por estado foráneo
  const stateCounts: Record<string, { total: number; voted: number }> = {};
  foreignEmployees.forEach((e) => {
    const st = e.estado ? e.estado.toUpperCase() : 'OTRO ESTADO';
    if (!stateCounts[st]) {
      stateCounts[st] = { total: 0, voted: 0 };
    }
    stateCounts[st].total++;
    if (e.participo === 'SÍ') {
      stateCounts[st].voted++;
    }
  });

  if (foreignEmployees.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-2 border-amber-300 dark:border-amber-700/60 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
      
      {/* Decorative background watermark */}
      <div className="absolute right-0 -bottom-6 opacity-5 dark:opacity-10 pointer-events-none">
        <Globe className="w-56 h-56 text-amber-600" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Distinctive Badge & Alert Info */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
            <Globe className="w-7 h-7" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {/* Mandatory Official Label */}
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-500 text-white shadow-sm flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                PARTICIPACIÓN FORÁNEA
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {foreignVoted.length} de {foreignEmployees.length} reportados
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Trabajadores Adscritos a Lara Votando en Otros Estados
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Monitoreo especial de personal del MPPAPT Lara y entes adscritos que se encuentran en comisión de servicio o residencia en otras entidades federales del país durante la Consulta Popular.
            </p>
          </div>
        </div>

        {/* Right Action: Filter table button */}
        <div className="shrink-0 self-start md:self-center">
          <button
            type="button"
            onClick={() => onFilterForeign(!isOnlyForeignActive)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 shadow-md ${
              isOnlyForeignActive
                ? 'bg-amber-600 text-white ring-4 ring-amber-500/30'
                : 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 hover:bg-amber-50'
            }`}
          >
            <span>{isOnlyForeignActive ? 'Viendo Solo Foráneos' : 'Filtrar Padrón Foráneo'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* State Breakdown Chips */}
      <div className="mt-6 pt-6 border-t border-amber-200/60 dark:border-amber-800/40">
        <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
          Distribución de Votos en Entidades Federales Foráneas:
        </span>

        <div className="flex flex-wrap gap-2">
          {Object.entries(stateCounts).map(([stateName, count]) => {
            return (
              <div
                key={stateName}
                className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-800/80 text-xs flex items-center gap-2 shadow-xs"
              >
                <span className="font-black text-slate-800 dark:text-slate-200 uppercase">
                  {stateName}
                </span>
                <span className="px-2 py-0.2 rounded-full font-mono font-bold text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  {count.voted} / {count.total}
                </span>
                {count.voted === count.total && count.total > 0 && (
                  <span title="100% de participación reportada">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
