// Clases de Tailwind reutilizables (cada variante es independiente para evitar conflictos)
const base =
  'rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition placeholder:text-slate-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100';

export const field = `w-full bg-white text-slate-700 ${base}`;
export const fieldReadonly = `w-full bg-slate-50 text-slate-500 ${base}`;
export const scoreField = `no-spin w-16 shrink-0 bg-white text-center text-slate-700 ${base}`;
export const button =
  'shrink-0 rounded-lg bg-pastel-blue px-4 py-2 text-sm font-medium text-slate-700 transition hover:brightness-95 active:brightness-90';
