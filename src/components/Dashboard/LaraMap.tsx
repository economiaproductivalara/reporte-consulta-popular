import React, { useState } from 'react';
import { MapPin, Info, Layers, Eye } from 'lucide-react';
import { LARA_MUNICIPALITIES, MunicipalityMeta } from '../../data/geoLara';
import { DashboardKpis } from '../../types';
import { soundFX } from '../../services/audio';

interface LaraMapProps {
  kpis: DashboardKpis;
  selectedMunicipio: string;
  onSelectMunicipio: (munId: string) => void;
}

export const LaraMap: React.FC<LaraMapProps> = ({
  kpis,
  selectedMunicipio,
  onSelectMunicipio,
}) => {
  const [hoveredMun, setHoveredMun] = useState<MunicipalityMeta | null>(null);
  const [viewMode, setViewMode] = useState<'svg' | 'image'>('svg');

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

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
      
      {/* Header with Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#244BC5] dark:text-blue-400">
              <MapPin className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Mapa Territorial del Estado Lara (9 Municipios)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pase el cursor o toque cualquier municipio para consultar el avance del padrón electoral.
          </p>
        </div>

        {/* View Mode Toggle: Interactive SVG vs Satellite/Cartographic Image */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setViewMode('svg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'svg'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mapa Político SVG</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('image')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'image'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Cartografía Oficial</span>
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative mt-6 min-h-[460px] flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-4 overflow-hidden">
        
        {viewMode === 'svg' ? (
          <div className="relative w-full max-w-2xl aspect-[4/3] flex items-center justify-center">
            <svg
              viewBox="0 0 900 900"
              className="w-full h-full drop-shadow-md select-none transition-transform"
            >
              {/* Outer boundary shadow/glow */}
              <defs>
                <filter id="lara-glow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Surrounding states outline labels for geographic context */}
              <text x="210" y="45" fill="#94A3B8" fontSize="22" fontWeight="700" letterSpacing="2">FALCÓN</text>
              <text x="40" y="380" fill="#94A3B8" fontSize="22" fontWeight="700" letterSpacing="2">ZULIA</text>
              <text x="180" y="870" fill="#94A3B8" fontSize="22" fontWeight="700" letterSpacing="2">TRUJILLO</text>
              <text x="750" y="900" fill="#94A3B8" fontSize="22" fontWeight="700" letterSpacing="2">PORTUGUESA</text>
              <text x="820" y="440" fill="#94A3B8" fontSize="22" fontWeight="700" letterSpacing="2">YARACUY</text>

              {/* Render the 9 Municipalities */}
              {LARA_MUNICIPALITIES.map((mun) => {
                const stats = getMunStats(mun);
                const isSelected = selectedMunicipio === mun.id;
                const isHovered = hoveredMun?.id === mun.id;

                return (
                  <g
                    key={mun.id}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredMun(mun)}
                    onMouseLeave={() => setHoveredMun(null)}
                    onClick={() => {
                      soundFX.playClick();
                      onSelectMunicipio(isSelected ? '' : mun.id);
                    }}
                  >
                    {/* Municipality Polygon */}
                    <path
                      d={mun.svgPath}
                      fill={mun.colorBase}
                      stroke={isSelected ? '#FFFFFF' : isHovered ? '#1E293B' : mun.colorBorder}
                      strokeWidth={isSelected ? 4 : isHovered ? 3 : 1.5}
                      strokeLinejoin="round"
                      className="transition-all duration-150 hover:brightness-110 active:scale-[0.99] origin-center"
                      style={{
                        filter: isSelected ? 'url(#lara-glow)' : 'none',
                        opacity: selectedMunicipio && !isSelected ? 0.45 : 1
                      }}
                    />

                    {/* Municipality Name & Stat Badge in SVG */}
                    <text
                      x={mun.labelPos.x}
                      y={mun.labelPos.y - 12}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="17"
                      fontWeight="900"
                      className="pointer-events-none drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)] tracking-wide uppercase"
                    >
                      {mun.nombre}
                    </text>

                    <text
                      x={mun.labelPos.x}
                      y={mun.labelPos.y + 6}
                      textAnchor="middle"
                      fill="#F8FAFC"
                      fontSize="12"
                      fontWeight="700"
                      className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
                    >
                      {mun.capital}
                    </text>

                    {/* Live participation pill inside map */}
                    <rect
                      x={mun.labelPos.x - 36}
                      y={mun.labelPos.y + 14}
                      width="72"
                      height="20"
                      rx="10"
                      fill="#0F172A"
                      fillOpacity="0.85"
                      className="pointer-events-none"
                    />
                    <text
                      x={mun.labelPos.x}
                      y={mun.labelPos.y + 28}
                      textAnchor="middle"
                      fill="#F5C500"
                      fontSize="11"
                      fontWeight="800"
                      className="pointer-events-none font-mono"
                    >
                      {stats.participaron} ({stats.porcentaje}%)
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Floating Interactive Tooltip */}
            {hoveredMun && (
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 bg-slate-900/95 text-white backdrop-blur-md border border-slate-700 rounded-2xl p-4 shadow-2xl pointer-events-none animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <div>
                    <h4 className="text-sm font-black uppercase text-amber-400 tracking-wide">
                      {hoveredMun.nombre}
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      Capital: {hoveredMun.capital}
                    </p>
                  </div>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: hoveredMun.colorBase }} />
                </div>

                {(() => {
                  const s = getMunStats(hoveredMun);
                  return (
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Padrón asignado:</span>
                        <span className="font-mono font-bold">{s.total} trabajadores</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Votos reportados:</span>
                        <span className="font-mono font-bold text-emerald-400">{s.participaron}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                        <span className="text-slate-400">Cumplimiento:</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-black bg-blue-600 text-white font-mono">
                          {s.porcentaje}%
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : (
          /* Official Image View with Data Overlays */
          <div className="relative w-full max-w-xl aspect-[4/3] flex items-center justify-center">
            <img
              src="/mapa-lara.webp"
              alt="Mapa Político Territorial del Estado Lara"
              className="w-full h-full object-contain rounded-xl shadow-md border border-slate-200 dark:border-slate-700"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/mapa-lara.jpg';
              }}
            />
            {/* Overlay hint banner */}
            <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-xs flex items-center justify-between">
              <span className="font-medium">Cartografía de Referencia Oficial de Lara</span>
              <button
                onClick={() => setViewMode('svg')}
                className="text-amber-400 hover:underline font-bold text-[11px]"
              >
                Volver a Mapa Interactivo
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Municipality Grid Quick Selector */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Detalle por Municipios (Haga clic para filtrar lista de trabajadores)
          </span>
          {selectedMunicipio && (
            <button
              onClick={() => onSelectMunicipio('')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Quitar filtro ({selectedMunicipio})
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
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
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-[#244BC5] ring-2 ring-blue-500/30'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: mun.colorBase }} />
                  <span className="text-xs font-black uppercase truncate text-slate-900 dark:text-white">
                    {mun.nombre}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {stats.participaron}/{stats.total}
                  </span>
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">
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
