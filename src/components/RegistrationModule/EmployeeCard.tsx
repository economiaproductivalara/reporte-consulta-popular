import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Globe2, 
  Edit3
} from 'lucide-react';
import { EmployeeRecord } from '../../types';
import { LARA_MUNICIPALITIES, VENEZUELA_STATES } from '../../data/geoLara';

interface EmployeeCardProps {
  employee: EmployeeRecord;
  onUpdateFields: (fields: { estado: string; municipio: string; telefono?: string }) => void;
  isParticipated: boolean;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onUpdateFields,
  isParticipated,
}) => {
  // Estado local para los campos potencialmente editables
  const [isEditing, setIsEditing] = useState<boolean>(!employee.estado || !employee.municipio);
  const [selectedEstado, setSelectedEstado] = useState<string>(
    employee.estado ? employee.estado.toUpperCase() : 'LARA'
  );
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>(
    employee.municipio ? employee.municipio.toUpperCase() : ''
  );
  const [telefono, setTelefono] = useState<string>(employee.telefono || '');

  const isLara = selectedEstado === 'LARA';
  const isForeign = selectedEstado !== '' && !isLara;

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEstado = e.target.value.toUpperCase();
    setSelectedEstado(newEstado);
    if (newEstado === 'LARA' && !LARA_MUNICIPALITIES.some(m => m.id === selectedMunicipio)) {
      setSelectedMunicipio(LARA_MUNICIPALITIES[0].id);
    } else if (newEstado !== 'LARA') {
      setSelectedMunicipio('');
    }
    onUpdateFields({ estado: newEstado, municipio: selectedMunicipio, telefono });
  };

  const handleMunicipioChange = (value: string) => {
    const cleanMun = value.toUpperCase();
    setSelectedMunicipio(cleanMun);
    onUpdateFields({ estado: selectedEstado, municipio: cleanMun, telefono });
  };

  const handleTelefonoChange = (value: string) => {
    setTelefono(value);
    onUpdateFields({ estado: selectedEstado, municipio: selectedMunicipio, telefono: value });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-md relative overflow-hidden transition-all duration-300">
      
      {/* Decorative top ribbon */}
      <div className={`absolute top-0 left-0 right-0 h-2 ${
        isParticipated 
          ? 'bg-gradient-to-r from-emerald-500 to-green-600' 
          : isForeign 
            ? 'bg-gradient-to-r from-amber-500 to-orange-600' 
            : 'bg-gradient-to-r from-blue-600 via-[#244BC5] to-amber-400'
      }`} />

      {/* Header with Name & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center shrink-0 text-[#244BC5] dark:text-blue-400 shadow-2xs">
            <User className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded-md text-[11px] sm:text-xs font-black bg-slate-900 text-white dark:bg-white dark:text-slate-900 tracking-wider">
                {employee.nacionalidad}-{employee.cedula}
              </span>

              {isForeign && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-black bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 tracking-wide uppercase">
                  <Globe2 className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  Foráneo
                </span>
              )}

              {isParticipated ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  PARTICIPÓ
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <Clock className="w-3 h-3 text-slate-400" />
                  PENDIENTE
                </span>
              )}
            </div>

            <h2 className="text-base sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight break-words">
              {employee.apellidosNombres}
            </h2>
          </div>
        </div>

        {/* Edit toggle button */}
        {!isParticipated && (
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Bloquear edición' : 'Editar ubicación'}</span>
          </button>
        )}
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 my-4 sm:my-6">
        
        {/* Institución / Ente Adscrito */}
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 sm:gap-3">
          <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Institución / Ente
            </span>
            <span className="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 uppercase break-words">
              {employee.institucion || 'NO DEFINIDA'}
            </span>
          </div>
        </div>

        {/* Teléfono */}
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 sm:gap-3">
          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Teléfono de Contacto
            </span>
            {isEditing && !isParticipated ? (
              <input
                type="text"
                value={telefono}
                onChange={(e) => handleTelefonoChange(e.target.value)}
                placeholder="0414-0000000"
                className="w-full mt-1 px-3 py-2 text-base sm:text-sm font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <span className="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 font-mono">
                {telefono || 'NO REGISTRADO'}
              </span>
            )}
          </div>
        </div>

        {/* Estado Territorial */}
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 sm:gap-3">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Estado de Votación
            </span>
            {isEditing && !isParticipated ? (
              <select
                value={selectedEstado}
                onChange={handleEstadoChange}
                className="w-full mt-1 px-3 py-2 text-base sm:text-sm font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {VENEZUELA_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st} {st === 'LARA' ? '(LOCAL)' : '(FORÁNEO)'}
                  </option>
                ))}
              </select>
            ) : (
              <span className="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 uppercase truncate">
                {selectedEstado || 'NO DEFINIDO'}
              </span>
            )}
          </div>
        </div>

        {/* Municipio */}
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5 sm:gap-3">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Municipio
            </span>
            {isEditing && !isParticipated ? (
              isLara ? (
                <select
                  value={selectedMunicipio}
                  onChange={(e) => handleMunicipioChange(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-base sm:text-sm font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- SELECCIONE MUNICIPIO --</option>
                  {LARA_MUNICIPALITIES.map((mun) => (
                    <option key={mun.id} value={mun.id}>
                      {mun.nombre.toUpperCase()} ({mun.capital.toUpperCase()})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={selectedMunicipio}
                  onChange={(e) => handleMunicipioChange(e.target.value)}
                  placeholder="Ingrese Municipio Foráneo"
                  className="w-full mt-1 px-3 py-2 text-base sm:text-sm font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )
            ) : (
              <span className="block text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 uppercase truncate">
                {selectedMunicipio || (
                  <span className="text-amber-600 dark:text-amber-400 font-bold inline-flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Falta Municipio
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Participated Timestamp Feedback */}
      {isParticipated && employee.fechaHoraReporte && (
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">Participación confirmada en el padrón</span>
          </div>
          <span className="font-mono font-semibold text-[11px] sm:text-xs">{employee.fechaHoraReporte}</span>
        </div>
      )}
    </div>
  );
};
