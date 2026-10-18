import React from 'react';
import { X, ShieldCheck, FileText, Lock, Building2 } from 'lucide-react';

interface LegalModalProps {
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[88vh] flex flex-col overflow-hidden">
        
        {/* Patriotic top bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="h-full w-1/3 bg-[#F5C500]" />
          <div className="h-full w-1/3 bg-[#244BC5]" />
          <div className="h-full w-1/3 bg-[#DE2719]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#244BC5] dark:text-blue-400">
              {type === 'terms' ? <FileText className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {type === 'terms' ? 'Términos y Condiciones de Uso' : 'Política de Privacidad y Protección de Datos'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                MPPAPT Lara • 2da Consulta Popular Nacional 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Legal Body */}
        <div className="overflow-y-auto py-5 pr-2 space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {type === 'terms' ? (
            <>
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/40 text-blue-900 dark:text-blue-300">
                <strong>Marco Institucional:</strong> El presente sistema informático es una herramienta de coordinación y seguimiento operativo del <em>Ministerio del Poder Popular para la Agricultura Productiva y Tierras (MPPAPT - Lara)</em> y sus entes adscritos para la jornada democrática de la 2da Consulta Popular Nacional del 18 de octubre de 2026.
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 uppercase text-xs mb-1">
                  1. Finalidad y Ámbito de Aplicación
                </h4>
                <p>
                  La plataforma tiene como único objeto el cómputo y registro del cumplimiento de metas de participación de la fuerza trabajadora del sector agrícola y sus organismos desconcentrados (INTI, INSAI, CIARA, INDER, BAV, FONDAS, Pedro Camejo, Agropatria, entre otros).
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 uppercase text-xs mb-1">
                  2. Responsabilidad del Operador de Registro
                </h4>
                <p>
                  El personal autorizado para asentar la <strong>PARTICIPACIÓN EFECTIVA</strong> se compromete a ingresar información veraz, verificada y oportuna, certificando que el trabajador ha ejercido su derecho al voto de manera libre y soberana en el centro de votación correspondiente.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 uppercase text-xs mb-1">
                  3. Tratamiento de Datos en MAYÚSCULAS y Normalización
                </h4>
                <p>
                  Por estándar de integración institucional, toda información capturada o actualizada (estados, municipios, observaciones) se procesa bajo sanitización estricta a letras mayúsculas y queda vinculada a la Hoja de Control Oficial en Google Sheets.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 uppercase text-xs mb-1">
                  4. Control de Acceso y Clave de Seguridad
                </h4>
                <p>
                  El acceso a las métricas gerenciales y al mapa territorial consolidado está restringido mediante credenciales seguras. El usuario se compromete a no divulgar la clave de acceso a personas no autorizadas por la Dirección General del MPPAPT Lara.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300">
                <strong>Garantía Constitucional de Hábeas Data:</strong> De conformidad con el Artículo 28 de la Constitución de la República Bolivariana de Venezuela y las normativas de la Ley de Infogobierno, se garantiza la protección, integridad y uso estrictamente institucional de los datos personales.
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 uppercase text-xs mb-1">
                  1. Datos Objeto de Tratamiento
                </h4>
                <p>
                  El sistema trata exclusivamente: Cédula de Identidad, Nombres y Apellidos, Institución de adscripción, Teléfono de contacto institucional/personal, y la Ubicación político-territorial (Estado y Municipio) donde el trabajador emite su sufragio.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 uppercase text-xs mb-1">
                  2. Destino y Custodia de la Información
                </h4>
                <p>
                  Los registros se almacenan en infraestructura segura de Google Workspace Institucional bajo control del Ministerio. Ningún dato es transferido, cedido ni comercializado con entidades terceras privadas.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 uppercase text-xs mb-1">
                  3. Confidencialidad y Voto Secreto
                </h4>
                <p>
                  El sistema <strong>únicamente registra el hecho de la participación ciudadana</strong> (SÍ / NO y marca de tiempo). Bajo ningún concepto se registra, indaga ni vulnera el carácter secreto y soberano de la opción electoral sufragada por el ciudadano en la Consulta Popular.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 uppercase text-xs mb-1">
                  4. Seguridad Técnica
                </h4>
                <p>
                  Las comunicaciones entre la aplicación web, el Edge de Vercel y la API de Google Apps Script se realizan bajo canales cifrados con protocolo TLS/HTTPS de última generación con bloqueos seguros de concurrencia.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Vigencia: Octubre de 2026
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Entendido y Aceptar
          </button>
        </div>

      </div>
    </div>
  );
};
