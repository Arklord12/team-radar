import { useState } from 'react';
import { LIMITS, VALUE_EXAMPLES } from '../constants';
import { button, field } from '../ui';
import Section from './Section';

export default function ValuesConfig({ values, onApply, onRename }) {
  const [count, setCount] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const n = Number(count);
    if (!Number.isInteger(n) || n < LIMITS.minValues || n > LIMITS.maxValues) {
      setError(`Ingresa un número entre ${LIMITS.minValues} y ${LIMITS.maxValues}.`);
      return;
    }
    setError('');
    onApply(n);
  };

  return (
    <Section step="1" title="Valores a evaluar" accent="bg-pastel-blue">
      <form onSubmit={submit} className="flex gap-2">
        <input
          type="number"
          min={LIMITS.minValues}
          max={LIMITS.maxValues}
          value={count}
          onChange={(e) => setCount(e.target.value)}
          placeholder={`Cantidad (${LIMITS.minValues}–${LIMITS.maxValues})`}
          aria-label="Cantidad de valores"
          className={field}
        />
        <button type="submit" className={button}>
          Generar
        </button>
      </form>
      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}

      {values.length > 0 && (
        <div className="mt-4 space-y-2">
          {values.map((v, i) => (
            <input
              key={v.id}
              type="text"
              value={v.name}
              onChange={(e) => onRename(v.id, e.target.value)}
              placeholder={`Valor ${i + 1} (ej. ${VALUE_EXAMPLES[i % VALUE_EXAMPLES.length]})`}
              aria-label={`Nombre del valor ${i + 1}`}
              className={field}
            />
          ))}
        </div>
      )}
    </Section>
  );
}
