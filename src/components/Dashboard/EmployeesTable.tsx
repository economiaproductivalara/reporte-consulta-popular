import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Download, 
  FileText,
  ChevronLeft, 
  ChevronRight, 
  Globe2, 
  Vote, 
  Loader2 
} from 'lucide-react';
import { EmployeeRecord } from '../../types';
import { apiService } from '../../services/api';
import { soundFX } from '../../services/audio';
import { generatePendingReportPdf } from '../../services/pdfReport';

interface EmployeesTableProps {
  employees: EmployeeRecord[];
  onEmployeeUpdated: () => void;
}

export const EmployeesTable: React.FC<EmployeesTableProps> = ({
  employees,
  onEmployeeUpdated,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [updatingCedula, setUpdatingCedula] = useState<string | null>(null);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(employees.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentEmployees = employees.slice(startIndex, startIndex + pageSize);

  const handleQuickRegister = async (emp: EmployeeRecord) => {
    if (emp.participo === 'SÍ' || updatingCedula) return;

    setUpdatingCedula(emp.cedula);
    soundFX.playClick();

    const res = await apiService.registerParticipation({
      cedula: emp.cedula,
      estado: emp.estado || 'LARA',
      municipio: emp.municipio || 'IRIBARREN',
      telefono: emp.telefono
    });

    setUpdatingCedula(null);

    if (res.success) {
      soundFX.playSuccess();
      onEmployeeUpdated();
    }
  };

  const handleExportCsv = () => {
    soundFX.playClick();
    apiService.exportToCsv(employees);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
      
      {/* Table Toolbar */}
      <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Padrón de Trabajadores MPPAPT Lara
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Registro nominal con estatus de participación en tiempo real
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
          {/* Page size select */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Mostrar:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Export to CSV Button */}
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>CSV</span>
          </button>

          {/* Export Pending to PDF Button */}
          <button
            type="button"
            onClick={() => {
              soundFX.playSuccess();
              generatePendingReportPdf({ employees });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow-xs transition-all hover:scale-[1.02]"
            title="Descargar lista oficial de trabajadores pendientes por votar en formato PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Pendientes</span>
          </button>
        </div>
      </div>

      {/* Mobile Card View (Screens < 768px) */}
      <div className="block md:hidden p-3.5 space-y-3">
        {currentEmployees.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No se encontraron trabajadores con los filtros seleccionados.
          </div>
        ) : (
          currentEmployees.map((emp) => {
            const isForeign = (emp.estado && emp.estado.toUpperCase() !== 'LARA') || emp.esForaneo;
            const isParticipated = emp.participo === 'SÍ';

            return (
              <div 
                key={emp.cedula}
                className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-2.5"
              >
                {/* Header: Cédula & Estatus */}
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-xs text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    {emp.nacionalidad}-{emp.cedula}
                  </span>

                  {isParticipated ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      PARTICIPÓ
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                      <Clock className="w-3 h-3 text-slate-400" />
                      PENDIENTE
                    </span>
                  )}
                </div>

                {/* Name */}
                <div className="font-bold text-xs uppercase text-slate-900 dark:text-white leading-tight">
                  {emp.apellidosNombres}
                </div>

                {/* Institution & Location */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#244BC5] dark:text-blue-300 font-bold uppercase truncate max-w-[200px]">
                    {emp.institucion}
                  </span>

                  {isForeign ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      <Globe2 className="w-2.5 h-2.5" />
                      {emp.estado}
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-600 dark:text-slate-400 uppercase text-[10px]">
                      {emp.municipio || 'LARA'}
                    </span>
                  )}
                </div>

                {/* Footer Row: Phone & Action Button */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    {emp.telefono ? `Tlf: ${emp.telefono}` : (emp.fechaHoraReporte ? `Hora: ${emp.fechaHoraReporte.substring(11, 19)}` : 'Sin teléfono')}
                  </span>

                  {!isParticipated ? (
                    <button
                      type="button"
                      disabled={updatingCedula === emp.cedula}
                      onClick={() => handleQuickRegister(emp)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors min-h-[36px]"
                    >
                      {updatingCedula === emp.cedula ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Vote className="w-3.5 h-3.5" />
                          <span>Registrar</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Listo
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Table View (Screens >= 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <th className="py-3.5 px-4">Cédula</th>
              <th className="py-3.5 px-4">Apellidos y Nombres</th>
              <th className="py-3.5 px-4">Institución</th>
              <th className="py-3.5 px-4">Ubicación</th>
              <th className="py-3.5 px-4">Teléfono</th>
              <th className="py-3.5 px-4 text-center">Estatus</th>
              <th className="py-3.5 px-4 text-center">Fecha Reporte</th>
              <th className="py-3.5 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {currentEmployees.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  No se encontraron trabajadores con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              currentEmployees.map((emp) => {
                const isForeign = (emp.estado && emp.estado.toUpperCase() !== 'LARA') || emp.esForaneo;
                const isParticipated = emp.participo === 'SÍ';

                return (
                  <tr 
                    key={emp.cedula}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Cédula */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {emp.nacionalidad}-{emp.cedula}
                    </td>

                    {/* Nombre */}
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200 uppercase whitespace-nowrap">
                      {emp.apellidosNombres}
                    </td>

                    {/* Institución */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-semibold uppercase whitespace-nowrap max-w-xs truncate" title={emp.institucion}>
                      {emp.institucion}
                    </td>

                    {/* Ubicación */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {isForeign ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                            <Globe2 className="w-2.5 h-2.5" />
                            {emp.estado}
                          </span>
                        ) : (
                          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase">
                            {emp.municipio || 'LARA'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Teléfono */}
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {emp.telefono || '-'}
                    </td>

                    {/* Estatus */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {isParticipated ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          PARTICIPÓ
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          <Clock className="w-3 h-3 text-slate-400" />
                          PENDIENTE
                        </span>
                      )}
                    </td>

                    {/* Fecha Reporte */}
                    <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {emp.fechaHoraReporte ? emp.fechaHoraReporte.substring(11, 19) : '-'}
                    </td>

                    {/* Acción Rápida */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {!isParticipated ? (
                        <button
                          type="button"
                          disabled={updatingCedula === emp.cedula}
                          onClick={() => handleQuickRegister(emp)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                        >
                          {updatingCedula === emp.cedula ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <>
                              <Vote className="w-3.5 h-3.5" />
                              <span>Registrar</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          Listo
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500">
        <div>
          Página {currentPage} de {totalPages} ({employees.length} trabajadores)
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
