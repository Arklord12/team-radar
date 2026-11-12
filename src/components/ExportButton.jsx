import { useState } from 'react';
import { LIMITS } from '../constants';

export default function ExportButton({ disabled, onExport }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onExport();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky bottom-0 -mx-6 mt-auto border-t border-slate-100 bg-white/90 px-6 py-4 backdrop-blur-sm">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading}
        className="w-full rounded-xl bg-pastel-mint px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:brightness-95 active:brightness-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Generando PDF…' : 'Imprimir resultados'}
      </button>
      {disabled && (
        <p className="mt-2 text-center text-xs text-slate-400">
          Genera al menos {LIMITS.minValues} valores para exportar el informe.
        </p>
      )}
    </div>
  );
}
