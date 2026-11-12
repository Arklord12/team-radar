import { useRef } from 'react';
import { LIMITS } from './constants';
import { useEvaluation } from './hooks/useEvaluation';
import { exportPdf } from './utils/exportPdf';
import ValuesConfig from './components/ValuesConfig';
import TeamConfig from './components/TeamConfig';
import EvaluationMatrix from './components/EvaluationMatrix';
import RadarPanel from './components/RadarPanel';
import ExportButton from './components/ExportButton';

export default function App() {
  const ev = useEvaluation();
  const chartRef = useRef(null);
  const ready = ev.values.length >= LIMITS.minValues;

  const handleExport = () =>
    exportPdf({
      image: chartRef.current.toBase64Image('image/png', 1), // imagen del radar actual
      values: ev.values,
      members: ev.members,
      getRating: ev.getRating,
      maxScore: ev.maxScore,
    });

  return (
    <div className="min-h-screen bg-white lg:flex lg:h-screen">
      {/* Panel izquierdo: 33 % */}
      <aside className="flex w-full flex-col gap-6 border-slate-100 px-6 pt-8 lg:w-1/3 lg:overflow-y-auto lg:border-r">
        <header>
          <h1 className="text-xl font-semibold text-slate-800">Evaluación de equipo</h1>
          <p className="mt-1 text-sm text-slate-400">
            Define los valores y el equipo, luego puntúa a cada persona.
          </p>
        </header>

        <ValuesConfig values={ev.values} onApply={ev.applyValueCount} onRename={ev.renameValue} />
        <TeamConfig
          members={ev.members}
          onApply={ev.applyPeerCount}
          onRename={ev.renameMember}
          onColor={ev.setMemberColor}
        />
        {ready && (
          <EvaluationMatrix
            values={ev.values}
            members={ev.members}
            maxScore={ev.maxScore}
            onMaxScore={ev.changeMaxScore}
            getRating={ev.getRating}
            takenFor={ev.takenFor}
            onScore={ev.setScore}
            onNote={ev.setNote}
          />
        )}
        <ExportButton disabled={!ready} onExport={handleExport} />
      </aside>

      {/* Panel derecho: 67 % */}
      <main className="flex w-full items-center justify-center p-6 lg:w-2/3 lg:overflow-y-auto lg:p-10">
        <RadarPanel
          values={ev.values}
          members={ev.members}
          maxScore={ev.maxScore}
          getRating={ev.getRating}
          chartRef={chartRef}
        />
      </main>
    </div>
  );
}
