export const uid = () => Math.random().toString(36).slice(2, 9);

export const hexToRgba = (hex, alpha = 1) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Nombres con respaldo cuando el campo está vacío
export const valueLabel = (value, index) => value.name.trim() || `Valor ${index + 1}`;
export const memberLabel = (member, index) => member.name.trim() || `Persona ${index}`;
