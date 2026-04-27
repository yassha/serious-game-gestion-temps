import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  step?: { current: number; total: number; label?: string };
  right?: ReactNode;
  onBack?: () => void;
  title?: string;
}

export function Layout({ children, step, right, onBack, title }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200/70">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-3">
          {onBack ? (
            <button
              onClick={onBack}
              className="rounded-lg p-2 hover:bg-slate-100 text-slate-600"
              aria-label="Retour"
            >
              ←
            </button>
          ) : (
            <div className="rounded-xl bg-brand-600 text-white w-9 h-9 flex items-center justify-center font-bold">
              ⏱
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wider text-slate-500">
              Serious Game
            </div>
            <div className="font-semibold truncate">
              {title || "Gestion du temps"}
            </div>
          </div>
          {right}
        </div>
        {step && (
          <div className="mx-auto max-w-3xl px-4 pb-3">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{step.label || "Progression"}</span>
              <span>
                {step.current} / {step.total}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all"
                style={{
                  width: `${Math.round((step.current / step.total) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </header>
      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-6">
        {children}
      </main>
      <footer className="text-center text-xs text-slate-400 py-4">
        © Serious Game · Gestion du temps – Web app pédagogique
      </footer>
    </div>
  );
}
