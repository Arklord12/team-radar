export default function Section({ step, title, accent, children }) {
  return (
    <section className="border-t border-slate-100 pt-6">
      <h2 className="mb-4 flex items-center gap-3 text-sm font-semibold text-slate-700">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-slate-600 ${accent}`}
        >
          {step}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
