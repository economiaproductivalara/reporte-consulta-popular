import React, { useState } from 'react';
import { CedulaInput } from './CedulaInput';
import { EmployeeCard } from './EmployeeCard';
import { EffectiveParticipationButton } from './EffectiveParticipationButton';
import { EmployeeRecord } from '../../types';
import { apiService } from '../../services/api';
import { CheckCircle2, RotateCcw, Sparkles, Check, ArrowRight } from 'lucide-react';

interface RegistrationViewProps {
  onRecordUpdated: () => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({ onRecordUpdated }) => {
  const [nacionalidad, setNacionalidad] = useState<'V' | 'E'>('V');
  const [cedula, setCedula] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeRecord | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // Campos editables durante la consulta
  const [editableFields, setEditableFields] = useState<{
    estado: string;
    municipio: string;
    telefono?: string;
  }>({
    estado: 'LARA',
    municipio: '',
    telefono: ''
  });

  const handleSearch = async (forcedCedula?: string) => {
    const cedulaToSearch = forcedCedula || cedula;
    if (!cedulaToSearch.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setFeedbackSuccess(null);

    const result = await apiService.searchEmployee(cedulaToSearch);
    setIsLoading(false);

    if (result.success && result.data) {
      setCurrentEmployee(result.data);
      setEditableFields({
        estado: result.data.estado || 'LARA',
        municipio: result.data.municipio || '',
        telefono: result.data.telefono || ''
      });
      setNacionalidad(result.data.nacionalidad || 'V');
    } else {
      setCurrentEmployee(null);
      setErrorMessage(result.message || 'Cédula no encontrada en el padrón.');
    }
  };

  const handleClear = () => {
    setCedula('');
    setCurrentEmployee(null);
    setErrorMessage(null);
    setFeedbackSuccess(null);
  };

  const handleUpdateFields = (fields: { estado: string; municipio: string; telefono?: string }) => {
    setEditableFields(fields);
  };

  // Validación: si el estado es Lara, requiere municipio
  const isLara = editableFields.estado.toUpperCase() === 'LARA';
  const hasValidLocation = isLara ? editableFields.municipio.trim().length > 0 : editableFields.estado.trim().length > 0;
  const validationError = !hasValidLocation 
    ? (isLara ? 'Por favor indique el municipio de Lara para continuar' : 'Por favor indique el estado foráneo') 
    : null;

  const handleConfirmParticipation = async () => {
    if (!currentEmployee) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await apiService.registerParticipation({
      cedula: currentEmployee.cedula,
      estado: editableFields.estado,
      municipio: editableFields.municipio,
      telefono: editableFields.telefono
    });

    setIsSubmitting(false);

    if (result.success && result.data) {
      setCurrentEmployee(result.data);
      setFeedbackSuccess(result.message || '¡Participación registrada exitosamente!');
      onRecordUpdated();
    } else {
      setErrorMessage(result.error || 'Error al registrar la participación');
    }
  };

  return (
    <div className="py-4 sm:py-10 px-3 sm:px-6 max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Streamlined Hero Header with Large Prominent Official Logo */}
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="inline-flex items-center justify-center p-2.5 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-md border border-slate-200/80 dark:border-slate-800 transition-transform hover:scale-[1.02]">
          <img 
            src="/logo.webp" 
            alt="Logo Consulta Popular Nacional 2026" 
            className="h-20 sm:h-36 md:h-40 w-auto object-contain mx-auto drop-shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/icon.svg';
            }}
          />
        </div>
        
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-blue-50 text-[#244BC5] dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900 mb-2">
            Plataforma Oficial de Seguimiento
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Reporte de Participación
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            2da Consulta Popular Nacional 2026 • MPPAPT Lara
          </p>
        </div>
      </div>

      {/* Cédula Search Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm">
        <CedulaInput
          nacionalidad={nacionalidad}
          setNacionalidad={setNacionalidad}
          cedula={cedula}
          setCedula={setCedula}
          onSearch={handleSearch}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onClear={handleClear}
        />
      </div>

      {/* Success Notification Alert */}
      {feedbackSuccess && (
        <div className="p-4 sm:p-6 bg-emerald-500 text-white rounded-2xl sm:rounded-3xl shadow-xl shadow-emerald-500/20 text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 bg-white/20 rounded-full mx-auto flex items-center justify-center">
            <Check className="w-7 h-7 text-white stroke-[3]" />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight">
              ¡Voto Registrado con Éxito!
            </h3>
            <p className="text-sm text-emerald-50 font-medium mt-1">
              {currentEmployee?.apellidosNombres} ({currentEmployee?.nacionalidad}-{currentEmployee?.cedula})
            </p>
            <p className="text-xs text-emerald-100 font-mono mt-0.5">
              Reportado a las: {currentEmployee?.fechaHoraReporte || 'Ahora'}
            </p>
          </div>

          <button
            onClick={handleClear}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-white text-emerald-700 hover:bg-emerald-50 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-md transition-all inline-flex items-center justify-center gap-2"
          >
            <span>Registrar Siguiente Trabajador</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Employee Data Card & Action Button */}
      {currentEmployee && !feedbackSuccess && (
        <div className="space-y-6 animate-in slide-in-from-bottom-3 duration-200">
          <EmployeeCard
            employee={currentEmployee}
            onUpdateFields={handleUpdateFields}
            isParticipated={currentEmployee.participo === 'SÍ'}
          />

          <EffectiveParticipationButton
            onConfirm={handleConfirmParticipation}
            isSubmitting={isSubmitting}
            isParticipated={currentEmployee.participo === 'SÍ'}
            canSubmit={hasValidLocation}
            validationError={validationError}
          />

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar / Nueva Búsqueda</span>
            </button>
          </div>
        </div>
      )}

      {/* Discrete shortcuts for demonstration */}
      {!currentEmployee && (
        <div className="pt-4 text-center">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">
            Cédulas de demostración para pruebas:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { c: '18456123', l: 'INTI (Pendiente)' },
              { c: '20345678', l: 'CIARA (Sin Mun)' },
              { c: '11223344', l: 'Foráneo (Caracas)' },
              { c: '14234567', l: 'MPPAPT (Ya votó)' }
            ].map((s) => (
              <button
                key={s.c}
                type="button"
                onClick={() => {
                  setCedula(s.c);
                  handleSearch(s.c);
                }}
                className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-slate-100 hover:bg-blue-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              >
                {s.c} <span className="text-[10px] font-sans font-normal text-slate-400">({s.l})</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
