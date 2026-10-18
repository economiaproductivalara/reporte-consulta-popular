import React from 'react';
import { CheckCircle, Loader2, Sparkles, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../../services/audio';

interface EffectiveParticipationButtonProps {
  onConfirm: () => void;
  isSubmitting: boolean;
  isParticipated: boolean;
  canSubmit: boolean;
  validationError?: string | null;
}

export const EffectiveParticipationButton: React.FC<EffectiveParticipationButtonProps> = ({
  onConfirm,
  isSubmitting,
  isParticipated,
  canSubmit,
  validationError,
}) => {
  const handleClick = () => {
    if (!canSubmit || isSubmitting || isParticipated) return;

    // Disparar confetti festivo patrio (amarillo, azul, rojo, verde)
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#F5C500', '#244BC5', '#DE2719', '#10B981']
    });

    soundFX.playSuccess();
    onConfirm();
  };

  if (isParticipated) {
    return (
      <div className="w-full max-w-md mx-auto text-center mt-6">
        <div className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border-2 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200 font-black text-base shadow-lg shadow-emerald-500/10">
          <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <span>PARTICIPACIÓN YA REGISTRADA</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
          El voto de este trabajador ya fue asentado en la base de datos oficial.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto text-center mt-6">
      {validationError && (
        <div className="mb-3 flex items-center justify-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-4 h-4" />
          <span>{validationError}</span>
        </div>
      )}

      <button
        type="button"
        disabled={!canSubmit || isSubmitting}
        onClick={handleClick}
        className={`group relative w-full py-5 px-8 rounded-2xl font-black text-lg sm:text-xl tracking-wider uppercase text-white shadow-xl transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-3 ${
          canSubmit && !isSubmitting
            ? 'bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-500 hover:to-green-600 shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:-translate-y-0.5'
            : 'bg-slate-400 dark:bg-slate-700 opacity-60 cursor-not-allowed shadow-none'
        }`}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>PROCESANDO REPORTE...</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-7 h-7 text-white transition-transform group-hover:scale-110" />
            <span className="drop-shadow-sm">PARTICIPACIÓN EFECTIVA</span>
            <Sparkles className="w-5 h-5 text-amber-300 opacity-80 animate-pulse" />
          </>
        )}
      </button>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5">
        Al hacer clic se registrará el timestamp de votación y se marcará como <strong>PARTICIPÓ: SÍ</strong> en el sistema oficial.
      </p>
    </div>
  );
};
