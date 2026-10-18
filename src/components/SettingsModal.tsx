import React, { useState } from 'react';
import { 
  X, 
  Settings2, 
  Link, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink, 
  FileSpreadsheet, 
  RotateCcw,
  Check
} from 'lucide-react';
import { apiService } from '../services/api';
import { soundFX } from '../services/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsSaved,
}) => {
  const [gasUrl, setGasUrl] = useState<string>(apiService.getGasUrl());
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [hasSaved, setHasSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    soundFX.playClick();
    apiService.setGasUrl(gasUrl);
    setHasSaved(true);
    setTimeout(() => {
      setHasSaved(false);
      onSettingsSaved();
      onClose();
    }, 900);
  };

  const handleTestConnection = async () => {
    if (!gasUrl.trim()) {
      setTestResult({
        success: false,
        message: 'Por favor ingrese la URL de su Web App de Google Apps Script antes de probar.'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`${gasUrl.trim()}?action=ping`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTestResult({
            success: true,
            message: '¡Conexión exitosa! Google Apps Script respondió correctamente.'
          });
          soundFX.playSuccess();
        } else {
          setTestResult({
            success: false,
            message: data.message || 'La API respondió pero reportó un estado no exitoso.'
          });
        }
      } else {
        setTestResult({
          success: false,
          message: `El servidor respondió con código HTTP ${res.status}. Verifique permisos ("Anyone").`
        });
      }
    } catch (err: unknown) {
      setTestResult({
        success: false,
        message: 'No se pudo conectar con la Web App. Si es la primera vez, asegúrese de haber seleccionado "Quién tiene acceso: Cualquier usuario (Anyone)" en la implementación.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleResetData = () => {
    if (confirm('¿Desea restaurar la base de datos de demostración a su estado inicial?')) {
      apiService.resetData();
      soundFX.playClick();
      onSettingsSaved();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#244BC5] dark:text-blue-400">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Configuración del Backend
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Conexión con Google Sheets y Google Apps Script
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 my-6">
          
          {/* Spreadsheet ID Reference */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Hoja de Cálculo Conectada
              </span>
              <a
                href="https://docs.google.com/spreadsheets/d/1NjErQyP-4q6uY495uG82PF73j7Q2rAviXYmFsodi-WY/edit"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Abrir en Sheets</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 break-all select-all">
              1NjErQyP-4q6uY495uG82PF73j7Q2rAviXYmFsodi-WY
            </div>
          </div>

          {/* Web App URL Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Link className="w-4 h-4 text-[#244BC5]" />
              URL de la Web App (Google Apps Script)
            </label>
            <input
              type="url"
              value={gasUrl}
              onChange={(e) => setGasUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full px-4 py-3 text-xs font-mono font-medium bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Obtenga esta URL en Google Sheets: <em>Extensiones &gt; Apps Script &gt; Implementar &gt; Nueva implementación &gt; Aplicación Web (Acceso: Anyone)</em>.
            </p>
          </div>

          {/* Test Connection Button & Result */}
          <div>
            <button
              type="button"
              disabled={isTesting}
              onClick={handleTestConnection}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Verificando conectividad con Google Apps Script...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Probar Conexión con Google Sheets</span>
                </>
              )}
            </button>

            {testResult && (
              <div className={`mt-3 p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          {/* Fallback & Offline note */}
          <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-900 dark:text-blue-300">
            <strong>Arquitectura Dual Resiliente:</strong> Si no se configura una URL o si la conexión a internet es inestable, el sistema opera de forma autónoma con la base de datos local y sincronización optimista, asegurando cero interrupciones en la mesa de votación.
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar datos demo</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
            >
              {hasSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <span>Guardar Cambios</span>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
