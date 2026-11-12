import { useState } from 'react';
import { DEFAULT_MAX_SCORE, PASTEL_COLORS, YOU_ID } from '../constants';
import { memberLabel, uid } from '../utils/helpers';

const EMPTY = { score: '', note: '' };

export function useEvaluation() {
  const [values, setValues] = useState([]); // [{ id, name }]
  const [members, setMembers] = useState([
    { id: YOU_ID, name: 'Tú', color: PASTEL_COLORS[0] }, // "Tú" siempre es el primero
  ]);
  const [maxScore, setMaxScore] = useState(DEFAULT_MAX_SCORE);
  const [ratings, setRatings] = useState({}); // ratings[memberId][valueId] = { score, note }

  // ---------- Valores ----------
  // Conserva los nombres ya escritos al cambiar la cantidad
  const applyValueCount = (n) =>
    setValues(Array.from({ length: n }, (_, i) => values[i] ?? { id: uid(), name: '' }));

  const renameValue = (id, name) =>
    setValues((list) => list.map((v) => (v.id === id ? { ...v, name } : v)));

  // ---------- Equipo ----------
  const applyPeerCount = (n) => {
    const peers = members.slice(1);
    const next = Array.from({ length: n }, (_, i) =>
      peers[i] ?? { id: uid(), name: '', color: PASTEL_COLORS[(i + 1) % PASTEL_COLORS.length] }
    );
    setMembers([members[0], ...next]);
  };

  const updateMember = (id, patch) =>
    setMembers((list) => list.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  const renameMember = (id, name) => updateMember(id, { name });
  const setMemberColor = (id, color) => updateMember(id, { color });

  // ---------- Notas y justificaciones ----------
  const getRating = (memberId, valueId) => ratings[memberId]?.[valueId] ?? EMPTY;

  const patchRating = (memberId, valueId, patch) =>
    setRatings((all) => {
      const current = all[memberId]?.[valueId] ?? EMPTY;
      return { ...all, [memberId]: { ...all[memberId], [valueId]: { ...current, ...patch } } };
    });

  // Notas que otros compañeros ya usaron en un valor.
  // "Tú" queda fuera de la regla: no bloquea a nadie y puede repetir cualquier nota.
  const takenFor = (memberId, valueId) =>
    memberId === YOU_ID
      ? []
      : members
          .filter((m) => m.id !== YOU_ID && m.id !== memberId)
          .map((m) => ({
            score: Number(getRating(m.id, valueId).score),
            owner: memberLabel(m, members.indexOf(m)),
          }))
          .filter((t) => t.score > 0);

  // Devuelve un mensaje de error si la nota se rechaza, o null si se acepta
  const setScore = (memberId, valueId, raw) => {
    if (raw === '') {
      patchRating(memberId, valueId, { score: '' });
      return null;
    }
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 1 || n > maxScore) {
      return `Escribe un número entero del 1 al ${maxScore}.`;
    }
    const clash = takenFor(memberId, valueId).find((t) => t.score === n);
    if (clash) return `El ${n} ya lo tiene ${clash.owner} en este valor. Elige otra nota.`;
    patchRating(memberId, valueId, { score: n });
    return null;
  };

  const setNote = (memberId, valueId, note) => patchRating(memberId, valueId, { note });

  // Al bajar la escala se borran las notas que quedan fuera del nuevo rango
  const changeMaxScore = (n) => {
    setMaxScore(n);
    setRatings((all) =>
      Object.fromEntries(
        Object.entries(all).map(([memberId, byValue]) => [
          memberId,
          Object.fromEntries(
            Object.entries(byValue).map(([valueId, r]) => [
              valueId,
              r.score > n ? { ...r, score: '' } : r,
            ])
          ),
        ])
      )
    );
  };

  return {
    values, members, maxScore,
    applyValueCount, renameValue,
    applyPeerCount, renameMember, setMemberColor,
    getRating, takenFor, setScore, setNote, changeMaxScore,
  };
}
