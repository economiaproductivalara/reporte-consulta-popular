import React from 'react';
import { ShieldCheck, Heart, FileSpreadsheet } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          
          <div className="flex items-center gap-3">
            <img 
              src="/icon.svg" 
              alt="Icono Consulta Popular" 
              className="w-8 h-8 rounded-lg shadow-xs" 
            />
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Ministerio del Poder Popular para la Agricultura Productiva y Tierras (MPPAPT - Lara)
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                2da Consulta Popular Nacional • Domingo 18 de Octubre de 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Sistema Seguro y Auditado
            </span>
            <a
              href="https://docs.google.com/spreadsheets/d/1NjErQyP-4q6uY495uG82PF73j7Q2rAviXYmFsodi-WY/edit"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#244BC5] dark:hover:text-blue-400 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Google Sheets ID: 1NjErQyP...</span>
            </a>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400 dark:text-slate-500">
          <span>Desarrollado para el Estado Lara • República Bolivariana de Venezuela</span>
          <span className="flex items-center gap-1">
            Plataforma de Alta Disponibilidad optimizada para Vercel Edge Runtime
          </span>
        </div>
      </div>
    </footer>
  );
};
