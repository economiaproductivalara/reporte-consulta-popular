import React from 'react';
import { ShieldCheck, FileText, Lock, ExternalLink, Code } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (type: 'terms' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          {/* Logo & Entity Info */}
          <div className="flex items-center gap-3.5">
            <img 
              src="/icon.svg" 
              alt="Icono Consulta Popular 2026" 
              className="w-9 h-9 rounded-xl shadow-xs" 
            />
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Ministerio del Poder Popular para la Agricultura Productiva y Tierras (MPPAPT - Lara)
              </p>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                2da Consulta Popular Nacional • Domingo 18 de Octubre de 2026
              </p>
            </div>
          </div>

          {/* Legal and Security links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="inline-flex items-center gap-1.5 hover:text-[#244BC5] dark:hover:text-blue-400 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>Términos de Uso</span>
            </button>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="inline-flex items-center gap-1.5 hover:text-[#244BC5] dark:hover:text-blue-400 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Política de Privacidad</span>
            </button>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sistema Seguro Oficial</span>
            </span>
          </div>

        </div>

        {/* Bottom copyright line with Designer / Developer credit */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span>República Bolivariana de Venezuela • Gobernación del Estado Lara</span>
          
          {/* Active credit requested by user */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
            <Code className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-slate-600 dark:text-slate-300">Diseño y Desarrollo:</span>
            <a
              href="https://linktr.ee/ejavierds"
              target="_blank"
              rel="noreferrer"
              className="font-black text-[#244BC5] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline inline-flex items-center gap-1"
            >
              <span>ejavierds</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
