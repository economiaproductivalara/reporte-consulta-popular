import React from 'react';
import { Users, CheckCircle2, TrendingUp, Building, Award } from 'lucide-react';
import { DashboardKpis } from '../../types';

interface KpiGridProps {
  kpis: DashboardKpis;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ kpis }) => {
  const getProgressColor = (pct: number) => {
    if (pct >= 80) return 'from-emerald-500 to-green-600';
    if (pct >= 50) return 'from-amber-500 to-yellow-500';
    return 'from-blue-600 to-[#244BC5]';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 4 Top KPI Cards - 2 Columns on Mobile, 4 Columns on Large Screens */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* Card 1: Total Meta Padrón (100% Dinámico) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-[#244BC5]" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Padrón Meta
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-black bg-blue-100 text-[#244BC5] dark:bg-blue-950 dark:text-blue-300">
                Dinámico
              </span>
            </div>
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#244BC5] dark:text-blue-400 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {kpis.totalPadron.toLocaleString()}
            </span>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 font-medium truncate flex items-center gap-1.5">
              <span>Trabajadores adscritos</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Sincronizado dinámicamente con la base de datos oficial" />
            </p>
          </div>
        </div>

        {/* Card 2: Participaciones Efectivas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-emerald-500" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Votos Efectivos
            </span>
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-2xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              {kpis.totalParticiparon.toLocaleString()}
            </span>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 font-medium truncate">
              Reportes confirmados
            </p>
          </div>
        </div>

        {/* Card 3: Porcentaje de Cumplimiento de Meta */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-[#F5C500]" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cumplimiento
            </span>
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
                {kpis.porcentajeTotal}%
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400">meta</span>
            </div>
            
            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 sm:h-3 mt-2 sm:mt-3 overflow-hidden p-0.5">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(kpis.porcentajeTotal)} transition-all duration-700 ease-out`}
                style={{ width: `${Math.min(kpis.porcentajeTotal, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Participación Foránea */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 sm:h-1.5 bg-[#DE2719]" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Voto Foráneo
            </span>
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Award className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <span className="text-2xl sm:text-4xl font-black text-red-600 dark:text-red-400">
              {kpis.totalForaneos.toLocaleString()}
            </span>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 sm:mt-1 font-medium truncate">
              {kpis.porcentajeForaneos}% reportado
            </p>
          </div>
        </div>

      </div>

      {/* Participación por Entes Adscritos (Horizontal Distribution Bars) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#244BC5] dark:text-blue-400 shrink-0">
              <Building className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Participación por Entes Adscritos
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Desglose comparativo de metas y votos efectivos por institución
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 sm:gap-y-4">
          {Object.entries(kpis.porInstitucion).map(([ente, data]) => {
            return (
              <div key={ente} className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 hover:border-slate-200 transition-colors">
                <div className="flex items-center justify-between text-xs font-black uppercase mb-1.5 text-slate-800 dark:text-slate-200">
                  <span className="truncate pr-2 text-[11px] sm:text-xs" title={ente}>{ente}</span>
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className="text-slate-500 font-mono text-[10px] sm:text-[11px]">
                      {data.participaron}/{data.total}
                    </span>
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-[#244BC5] dark:text-blue-300 font-black text-[10px] sm:text-xs">
                      {data.porcentaje}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 sm:h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(data.porcentaje)} transition-all duration-500`}
                    style={{ width: `${Math.min(data.porcentaje, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
