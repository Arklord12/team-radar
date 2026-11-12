import html2pdf from 'html2pdf.js';
import { YOU_ID } from '../constants';
import { memberLabel, valueLabel } from './helpers';

// Escapa el texto del usuario antes de insertarlo en el HTML del informe
const esc = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const avoidBreak = 'break-inside:avoid;page-break-inside:avoid;';

// Informe con estilos en línea: no depende de Tailwind ni de que el panel esté visible
function buildReport({ image, values, members, getRating, maxScore }) {
  const date = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  const sections = members
    .map((m, mi) => {
      const heading = `
        <h2 style="margin:0 0 6px;font-size:16px;color:#1e293b;">
          <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${m.color};margin-right:8px;"></span>${esc(memberLabel(m, mi))}${m.id === YOU_ID ? ' <span style="font-size:12px;font-weight:400;color:#94a3b8;">(Autoevaluación)</span>' : ''}
        </h2>`;

      const rows = values
        .map((v, vi) => {
          const { score, note } = getRating(m.id, v.id);
          return `
            <div style="${avoidBreak}padding:8px 0;border-bottom:1px solid #eef2f7;">
              ${vi === 0 ? heading : ''}
              <table style="width:100%;border-collapse:collapse;"><tr>
                <td style="font-size:13px;font-weight:600;color:#334155;">${esc(valueLabel(v, vi))}</td>
                <td style="text-align:right;font-size:13px;font-weight:700;color:#334155;">Nota: ${score === '' ? '—' : `${score} / ${maxScore}`}</td>
              </tr></table>
              <p style="margin:4px 0 0;font-size:12px;line-height:1.5;color:#64748b;white-space:pre-wrap;">${note.trim() ? esc(note.trim()) : 'Sin justificación.'}</p>
            </div>`;
        })
        .join('');

      return `<section style="margin-bottom:20px;">${rows}</section>`;
    })
    .join('');

  return `
    <div style="font-family:Helvetica,Arial,sans-serif;color:#334155;">
      <div style="page-break-after:always;">
        <h1 style="margin:0;font-size:24px;color:#1e293b;">Evaluación de equipo</h1>
        <p style="margin:4px 0 16px;font-size:12px;color:#94a3b8;">${date}</p>
        <img src="${image}" alt="Gráfico de radar" style="display:block;width:100%;max-width:560px;margin:0 auto;" />
      </div>
      ${sections}
    </div>`;
}

export async function exportPdf(data) {
  await html2pdf()
    .set({
      margin: 14,
      filename: 'evaluacion-de-equipo.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    })
    .from(buildReport(data), 'string')
    .save();
}
