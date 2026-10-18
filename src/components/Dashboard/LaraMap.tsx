import React, { useState } from 'react';
import { 
  MapPin, 
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';
import { LARA_MUNICIPALITIES, MunicipalityMeta } from '../../data/geoLara';
import { DashboardKpis } from '../../types';
import { soundFX } from '../../services/audio';

interface LaraMapProps {
  kpis: DashboardKpis;
  selectedMunicipio: string;
  onSelectMunicipio: (munId: string) => void;
}

// Coordenadas calibradas con el mapa original oficial (1023 x 799 px)
const ORIGINAL_MAP_HOTSPOTS: Record<string, { x: number; y: number; align: 'top' | 'bottom' | 'left' | 'right' }> = {
  URDANETA: { x: 60.1, y: 16.3, align: 'bottom' },
  TORRES: { x: 35.2, y: 46.3, align: 'bottom' },
  CRESPO: { x: 81.2, y: 29.4, align: 'bottom' },
  IRIBARREN: { x: 68.9, y: 42.5, align: 'top' },
  PALAVECINO: { x: 78.2, y: 53.8, align: 'right' },
  SIMON_PLANAS: { x: 83.8, y: 65.1, align: 'left' },
  JIMENEZ: { x: 60.3, y: 63.8, align: 'left' },
  ANDRES_ELOY_BLANCO: { x: 64.9, y: 76.3, align: 'bottom' },
  MORAN: { x: 48.0, y: 72.6, align: 'bottom' },
};

export const LaraMap: React.FC<LaraMapProps> = ({
  kpis,
  selectedMunicipio,
  onSelectMunicipio,
}) => {
  const [hoveredMun, setHoveredMun] = useState<MunicipalityMeta | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const getMunStats = (mun: MunicipalityMeta) => {
    // 1. Direct match by id
    if (kpis.porMunicipio[mun.id]) return kpis.porMunicipio[mun.id];
    // 2. Match by uppercase name
    const upperName = mun.nombre.toUpperCase();
    if (kpis.porMunicipio[upperName]) return kpis.porMunicipio[upperName];
    // 3. Match by aliases
    if (mun.aliases) {
      for (const alias of mun.aliases) {
        if (kpis.porMunicipio[alias]) return kpis.porMunicipio[alias];
      }
    }
    // 4. Fuzzy match
    for (const key of Object.keys(kpis.porMunicipio)) {
      const cleanKey = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
      const cleanId = mun.id.replace(/_/g, ' ');
      if (cleanKey === cleanId || cleanKey.includes(mun.nombre.toUpperCase())) {
        return kpis.porMunicipio[key];
      }
    }
    return { total: 0, participaron: 0, porcentaje: 0 };
  };

  const getBadgeColor = (pct: number) => {
    if (pct >= 80) return 'bg-emerald-500 text-white';
    if (pct >= 40) return 'bg-amber-500 text-slate-950 font-black';
    return 'bg-blue-600 text-white';
  };

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 shadow-sm transition-all duration-300 ${
      isFullscreen ? 'fixed inset-2 sm:inset-4 z-50 overflow-y-auto max-h-[96vh] shadow-2xl' : ''
    }`}>
      
      {/* Header with Mode Toggle & Fullscreen */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 sm:p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#244BC5] dark:text-blue-400 shrink-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-1.5 sm:gap-2">
                <span>Mapa Territorial de Lara</span>
                <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-black uppercase">
                  9 Municipios
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Cartografía política oficial con telemetría de votos en tiempo real
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Fullscreen Expand Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title={isFullscreen ? 'Reducir tamaño' : 'Ver en pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Map Presentation Stage */}
      <div className="relative mt-6 flex items-center justify-center bg-slate-100/70 dark:bg-slate-950/70 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-2 sm:p-6 overflow-hidden">
        
        {/* RENDERIZADO DEL MAPA ORIGINAL CON DATA OVERLAY INTERACTIVO */}
        <div className="relative w-full max-w-4xl aspect-[1023/799] select-none rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-300 dark:border-slate-700 bg-white">
            
            {/* Imagen Original Oficial en Alta Definición */}
            <img
              src="/mapa-lara-original.jpg"
              alt="Mapa Político Territorial del Estado Lara - Oficial"
              className="w-full h-full object-contain pointer-events-none"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/mapa-lara.webp';
              }}
            />

            {/* Hotspots y Badges Interactivos sobre cada Municipio */}
            {LARA_MUNICIPALITIES.map((mun) => {
              const spot = ORIGINAL_MAP_HOTSPOTS[mun.id] || { x: 50, y: 50, align: 'top' };
              const stats = getMunStats(mun);
              const isSelected = selectedMunicipio === mun.id;
              const isHovered = hoveredMun?.id === mun.id;

              return (
                <div
                  key={mun.id}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                  onClick={() => {
                    soundFX.playClick();
                    onSelectMunicipio(isSelected ? '' : mun.id);
                  }}
                  onMouseEnter={() => setHoveredMun(mun)}
                  onMouseLeave={() => setHoveredMun(null)}
                >
                  {/* Pin Central con Efecto Radar / Pulso */}
                  <div className="relative flex items-center justify-center">
                    <span 
                      className={`absolute w-5 h-5 sm:w-8 sm:h-8 rounded-full animate-ping opacity-75 ${
                        isSelected ? 'bg-white' : 'bg-[#244BC5]'
                      }`}
                    />
                    
                    <div 
                      className={`relative w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg transition-transform transform group-hover:scale-125 ${
                        isSelected 
                          ? 'bg-white text-slate-900 ring-2 sm:ring-4 ring-blue-500 scale-125' 
                          : 'bg-slate-950 text-white border sm:border-2 border-white'
                      }`}
                    >
                      <MapPin className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-amber-400 drop-shadow" />
                    </div>

                    {/* Badge de Datos Integrado en el Mapa */}
                    <div className={`absolute whitespace-nowrap transition-all duration-200 pointer-events-none ${
                      spot.align === 'top' 
                        ? 'bottom-full mb-1 sm:mb-1.5' 
                        : spot.align === 'left' 
                          ? 'right-full mr-1.5 sm:mr-2' 
                          : spot.align === 'right' 
                            ? 'left-full ml-1.5 sm:ml-2' 
                            : 'top-full mt-1 sm:mt-1.5'
                    }`}>
                      <div className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl shadow-xl backdrop-blur-md border text-center flex items-center gap-1 sm:gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-400 ring-1 sm:ring-2 ring-white'
                          : 'bg-slate-950/90 text-white border-slate-700/80 group-hover:bg-slate-900'
                      }`}>
                        <span className="text-[8px] sm:text-xs font-black uppercase tracking-wider">
                          {mun.nombre}
                        </span>
                        <span className={`px-1 sm:px-1.5 py-0.2 rounded font-mono text-[8px] sm:text-[10px] font-black ${
                          getBadgeColor(stats.porcentaje)
                        }`}>
                          <span className="hidden sm:inline">{stats.participaron}/{stats.total} </span>
                          <span>{stats.porcentaje}%</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Tooltip Flotante de Detalle al Posar el Cursor */}
            {hoveredMun && (
              <div className="absolute bottom-2 left-2 right-2 sm:left-auto sm:right-3 sm:w-80 bg-slate-950/95 text-white backdrop-blur-md border border-slate-700/90 rounded-2xl p-3 sm:p-4 shadow-2xl pointer-events-none z-30 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: hoveredMun.colorBase }} />
                    <div>
                      <h4 className="text-sm font-black uppercase text-amber-400 tracking-wide">
                        Municipio {hoveredMun.nombre}
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        Capital Política: {hoveredMun.capital}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Lara
                  </span>
                </div>

                {(() => {
                  const s = getMunStats(hoveredMun);
                  return (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Meta Padrón Asignada:</span>
                        <span className="font-mono font-bold">{s.total} trabajadores</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Votos Efectivos Reportados:</span>
                        <span className="font-mono font-black text-emerald-400">{s.participaron}</span>
                      </div>
                      
                      <div className="pt-2 border-t border-slate-800">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-400 text-[11px]">Avance de Meta:</span>
                          <span className="font-mono font-black text-amber-400">{s.porcentaje}%</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                            style={{ width: `${Math.min(s.porcentaje, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Cartographic Watermark Badge */}
            <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-[10px] text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">Cartografía Oficial MPPAPT Lara</span>
            </div>

          </div>
      </div>

      {/* Selector Rápido de Municipios en Cuadrícula */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            Consolidado por Municipios de Lara (Haga clic para filtrar nómina)
          </span>
          {selectedMunicipio && (
            <button
              onClick={() => onSelectMunicipio('')}
              className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
            >
              Quitar filtro ({selectedMunicipio})
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
          {LARA_MUNICIPALITIES.map((mun) => {
            const stats = getMunStats(mun);
            const isSelected = selectedMunicipio === mun.id;

            return (
              <button
                key={mun.id}
                onClick={() => {
                  soundFX.playClick();
                  onSelectMunicipio(isSelected ? '' : mun.id);
                }}
                className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-[#244BC5] ring-2 ring-blue-500/30'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5 sm:mb-1">
                  <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0" style={{ backgroundColor: mun.colorBase }} />
                  <span className="text-[11px] sm:text-xs font-black uppercase truncate text-slate-900 dark:text-white">
                    {mun.nombre}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">
                    {stats.participaron}/{stats.total}
                  </span>
                  <span className="text-[11px] sm:text-xs font-black text-blue-600 dark:text-blue-400 font-mono">
                    {stats.porcentaje}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
