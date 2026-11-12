import { useState } from 'react';
import { LIMITS, YOU_ID } from '../constants';
import { memberLabel } from '../utils/helpers';
import { button, field, fieldReadonly } from '../ui';
import Section from './Section';

export default function TeamConfig({ members, onApply, onRename, onColor }) {
  const [count, setCount] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const n = Number(count);
    if (!Number.isInteger(n) || n < LIMITS.minPeers || n > LIMITS.maxPeers) {
      setError(`Ingresa un número entre ${LIMITS.minPeers} y ${LIMITS.maxPeers}, sin contarte a ti.`);
      return;
    }
    setError('');
    onApply(n);
  };

  return (
    <Section step="2" title="Equipo" accent="bg-pastel-lilac">
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="number"
          min={LIMITS.minPeers}
          max={LIMITS.maxPeers}
          value={count}
          onChange={(e) => setCount(e.target.value)}
          placeholder={`Compañeros (${LIMITS.minPeers}–${LIMITS.maxPeers})`}
          aria-label="Cantidad de compañeros a evaluar"
          className={field}
        />
        <button type="submit" className={button}>
          Generar
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}

      <div className="mt-4 space-y-2">
        {members.map((m, i) => (
          <div key={m.id} className="flex items-center gap-2">
            <input
              type="color"
              value={m.color}
              onChange={(e) => onColor(m.id, e.target.value)}
              aria-label={`Color de ${memberLabel(m, i)}`}
              className="h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white p-0.5"
            />
            {m.id === YOU_ID ? (
              <input type="text" value={m.name} readOnly aria-label="Tú (autoevaluación)" className={fieldReadonly} />
            ) : (
              <input
                type="text"
                value={m.name}
                onChange={(e) => onRename(m.id, e.target.value)}
                placeholder={`Persona ${i}`}
                aria-label={`Nombre de la persona ${i}`}
                className={field}
              />
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-400">«Tú» es tu autoevaluación y siempre está incluido.</p>
    </Section>
  );
}
