import { useState } from 'react';
import { LIMITS, YOU_ID } from '../constants';
import { memberLabel, valueLabel } from '../utils/helpers';
import { field, scoreField } from '../ui';
import Section from './Section';

const SCALES = Array.from(
  { length: LIMITS.maxScale - LIMITS.minScale + 1 },
  (_, i) => LIMITS.minScale + i
);

export default function EvaluationMatrix({
  values, members, maxScore, onMaxScore, getRating, takenFor, onScore, onNote,
}) {
  const [errors, setErrors] = useState({}); // errores de validación por campo
  const peers = members.length - 1;

  const handleScore = (key, memberId, valueId, raw) => {
    const message = onScore(memberId, valueId, raw); // null si se aceptó
    setErrors((prev) => ({ ...prev, [key]: message }));
  };

  return (
    <Section step="3" title="Evaluación" accent="bg-pastel-peach">
      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
        <label htmlFor="scale">Escala de notas, de 1 a</label>
        <select
          id="scale"
          value={maxScore}
          onChange={(e) => onMaxScore(Number(e.target.value))}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
        >
          {SCALES.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {maxScore < peers && (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-600">
          Con {peers} compañeros, sube la escala a {peers} o más para que cada uno pueda tener una nota distinta en cada valor.
        </p>
      )}

      <div className="space-y-6">
        {members.map((m, mi) => (
          <div key={m.id} className="border-l-4 pl-4" style={{ borderLeftColor: m.color }}>
            <h3 className="text-sm font-semibold text-slate-700">
              {memberLabel(m, mi)}
              {m.id === YOU_ID && (
                <span className="ml-2 text-xs font-normal text-slate-400">
                  Autoevaluación: puedes repetir notas.
                </span>
              )}
            </h3>

            <div className="mt-3 space-y-4">
              {values.map((v, vi) => {
                const key = `${m.id}:${v.id}`;
                const { score, note } = getRating(m.id, v.id);
                const taken = takenFor(m.id, v.id)
                  .map((t) => t.score)
                  .sort((a, b) => a - b);

                return (
                  <div key={v.id}>
                    <div className="flex items-center justify-between gap-3">
                      <label htmlFor={key} className="text-sm text-slate-600">
                        {valueLabel(v, vi)}
                      </label>
                      <input
                        id={key}
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={maxScore}
                        step={1}
                        value={score}
                        onChange={(e) => handleScore(key, m.id, v.id, e.target.value)}
                        onBlur={() => setErrors((prev) => ({ ...prev, [key]: null }))}
                        className={scoreField}
                      />
                    </div>
                    {taken.length > 0 && (
                      <p className="mt-1 text-right text-xs text-slate-400">
                        Ocupadas por compañeros: {taken.join(', ')}
                      </p>
                    )}
                    {errors[key] && <p className="mt-1 text-right text-xs text-rose-400">{errors[key]}</p>}
                    <textarea
                      rows={2}
                      value={note}
                      onChange={(e) => onNote(m.id, v.id, e.target.value)}
                      placeholder="Justifica esta nota"
                      aria-label={`Justificación de ${valueLabel(v, vi)} para ${memberLabel(m, mi)}`}
                      className={`mt-2 resize-none ${field}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
