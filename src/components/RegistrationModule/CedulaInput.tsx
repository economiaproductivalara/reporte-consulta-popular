import React, { useRef, useEffect } from 'react';
import { Search, Loader2, X, AlertCircle } from 'lucide-react';

interface CedulaInputProps {
  nacionalidad: 'V' | 'E';
  setNacionalidad: (nac: 'V' | 'E') => void;
  cedula: string;
  setCedula: (val: string) => void;
  onSearch: (forcedCedula?: string) => void;
  isLoading: boolean;
  errorMessage?: string | null;
  onClear: () => void;
}

export const CedulaInput: React.FC<CedulaInputProps> = ({
  nacionalidad,
  setNacionalidad,
  cedula,
  setCedula,
  onSearch,
  isLoading,
  errorMessage,
  onClear,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Autoenfoque al cargar
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Filtro numérico estricto: solo dígitos
    const value = e.target.value.replace(/\D/g, '');
    setCedula(value);

    // Consulta reactiva si alcanza una longitud estándar de cédula venezolana (7 u 8 dígitos)
    if (value.length >= 7 && value.length <= 9) {
      onSearch(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (cedula.trim()) {
        onSearch(cedula);
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 text-center">
          Ingrese el Número de Cédula de Identidad
        </label>

        {/* Big centered search input box */}
        <div className="relative flex items-center bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 focus-within:border-[#244BC5] dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 rounded-2xl shadow-lg transition-all duration-200 overflow-hidden">
          
          {/* Nationality Selector (V / E) */}
          <div className="flex border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-1.5 self-stretch items-center">
            {(['V', 'E'] as const).map((nac) => (
              <button
                key={nac}
                type="button"
                onClick={() => setNacionalidad(nac)}
                className={`px-3 py-2 text-sm font-black rounded-lg transition-all ${
                  nacionalidad === nac
                    ? 'bg-[#244BC5] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {nac}
              </button>
            ))}
          </div>

          {/* Numeric Input */}
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={cedula}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Ej: 14234567"
              maxLength={10}
              className="w-full py-4 px-4 text-2xl sm:text-3xl font-black tracking-widest text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none bg-transparent text-center"
            />

            {/* Clear Button */}
            {cedula && (
              <button
                type="button"
                onClick={onClear}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 mr-2 transition-colors"
                title="Limpiar campo"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Action Button */}
          <button
            type="button"
            disabled={!cedula || isLoading}
            onClick={() => onSearch(cedula)}
            className="flex items-center justify-center gap-2 px-5 sm:px-7 py-4 bg-gradient-to-r from-blue-600 to-[#244BC5] hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide transition-all duration-150 self-stretch"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span className="hidden sm:inline">Buscar</span>
              </>
            )}
          </button>
        </div>

        {/* Quick hint instructions */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
          Solo números sin puntos ni letras. La búsqueda se ejecuta automáticamente al completar los dígitos.
        </p>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="mt-4 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-300 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <p className="flex-1 font-medium">{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};
