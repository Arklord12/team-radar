import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import { LIMITS } from '../constants';
import { hexToRgba, memberLabel, valueLabel } from '../utils/helpers';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RadarPanel({ values, members, maxScore, getRating, chartRef }) {
  if (values.length < LIMITS.minValues) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-pastel-lilac" />
        <p className="text-sm text-slate-400">
          Genera al menos {LIMITS.minValues} valores para ver el gráfico de radar.
        </p>
      </div>
    );
  }

  const data = {
    labels: values.map(valueLabel),
    datasets: members.map((m, i) => ({
      id: m.id, // evita que Chart.js mezcle datasets con el mismo nombre
      label: memberLabel(m, i),
      data: values.map((v) => Number(getRating(m.id, v.id).score) || 0),
      backgroundColor: hexToRgba(m.color, 0.4),
      borderColor: m.color,
      borderWidth: 2,
      pointBackgroundColor: m.color,
      pointBorderColor: '#ffffff',
      pointRadius: 4,
      pointHoverRadius: 7,
      pointHitRadius: 10,
      fill: true,
    })),
  };

  const options = {
    responsive: true,
    animation: { duration: 250 },
    scales: {
      r: {
        min: 0,
        max: maxScore,
        ticks: { stepSize: 1, showLabelBackdrop: false, color: '#94a3b8' },
        grid: { color: '#e2e8f0' },
        angleLines: { color: '#e2e8f0' },
        pointLabels: { color: '#475569', font: { size: 13, weight: '500' } },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, boxWidth: 8, padding: 18, color: '#475569' },
      },
      tooltip: { backgroundColor: '#334155' },
    },
  };

  return (
    <div className="w-full max-w-[min(100%,75vh)]">
      <Radar ref={chartRef} datasetIdKey="id" data={data} options={options} />
    </div>
  );
}
