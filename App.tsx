import React, { useMemo, useState } from 'react';

type Company = {
  name: string;
  ticker: string;
  cap: string;
  stock: string;
  trend: string;
  description: string;
};

const keyCompanies: Company[] = [
  {
    name: 'Mazel Inc Group',
    ticker: 'MZIGR',
    cap: '79.04T USD (group valuation)',
    stock: '187,657 pts',
    trend: '⬆️⬆️⬆️⬆️⬆️',
    description: 'Глобальный конгломерат: fintech, banking, telecom, AI, health, education, logistics.',
  },
  {
    name: 'FAST System',
    ticker: 'FAST',
    cap: '15T USD ecosystem value',
    stock: '18,956 USD',
    trend: '⬆️⬆️⬆️⬆️⬆️',
    description: 'Instant cross-border settlement network for fiat, crypto and tokenized assets.',
  },
  {
    name: 'Maze Bank',
    ticker: 'MZBK',
    cap: '20T USD',
    stock: '41,499 USD',
    trend: '⬆️⬆️⬆️⬆️',
    description: 'Крупнейшая банковская сеть с глобальными хабами в Европе, Азии, Африке и Америке.',
  },
  {
    name: 'Bank of Bennet',
    ticker: 'BNKBNT',
    cap: '2.6T USD',
    stock: '26,937 USD',
    trend: '⬆️⬆️⬆️⬆️',
    description: 'Универсальный частный банк для граждан и бизнеса, включая программу BOB Aid.',
  },
  {
    name: 'Mazel Infinity Corporation',
    ticker: 'MZINF',
    cap: '7.2T USD',
    stock: '12,348 USD',
    trend: '⬆️⬆️⬆️',
    description: 'Hardware, chips, gadgets, transport and advanced manufacturing.',
  },
  {
    name: 'Bennqx (ex-EMayBit)',
    ticker: 'BNQX',
    cap: '2.9T USD',
    stock: '32,765 USD',
    trend: '⬆️⬆️⬆️⬆️',
    description: 'Криптобиржа и экосистема кошельков с прямой интеграцией по FAST ID.',
  },
];

const boardMembers = [
  { role: 'Founder & Group CEO', name: 'Daniel Bennet' },
  { role: 'CEO, Maze Bank', name: 'Sofia Kravchenko' },
  { role: 'CEO, Bank of Bennet', name: 'Ruby Matthews' },
  { role: 'CEO, FAST System', name: 'Ares Cross' },
  { role: 'CEO, Bennqx', name: 'Michael Stone' },
  { role: 'Vice President', name: 'Matteo Balsano' },
];

const majorStats = [
  ['Connected Countries', '200+'],
  ['FAST Transfer Speed', '0.001 sec'],
  ['Combined Banking Capitalization', '27.8T USD'],
  ['Subscribers Reach', '3.6B+'],
];

const App: React.FC = () => {
  const [showExchange, setShowExchange] = useState(false);

  const mexcChartPoints = useMemo(() => {
    return [8, 14, 12, 22, 27, 31, 29, 38, 46, 54, 63, 78]
      .map((v, i) => `${i * 64},${220 - v * 2.2}`)
      .join(' ');
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
        <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <p className="mb-3 inline-flex items-center rounded-full border border-cyan-300/25 bg-cyan-400/10 px-4 py-1 text-xs uppercase tracking-wider text-cyan-200">
            Global Conglomerate Profile · RU interface
          </p>
          <h1 className="text-3xl font-black leading-tight md:text-6xl">Mazel Inc Group & FAST Ecosystem</h1>
          <p className="mt-4 max-w-3xl text-slate-300 md:text-lg">
            Современный презентационный сайт о структурах Mazel Inc Group: дочерние компании, капитализация, акции,
            руководство, инфраструктура FAST и демо-окно биржи MEXC с графиком.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {majorStats.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
                <p className="mt-1 text-xl font-bold text-cyan-300">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-extrabold">Ключевые компании и акции</h2>
          <button
            onClick={() => setShowExchange(true)}
            className="rounded-xl border border-emerald-300/40 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
          >
            Открыть окно MEXC Exchange
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {keyCompanies.map((company) => (
            <article key={company.ticker} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">{company.name}</h3>
                  <p className="text-xs uppercase tracking-widest text-slate-400">{company.ticker}</p>
                </div>
                <span className="rounded-lg bg-slate-800 px-2 py-1 text-xs">{company.trend}</span>
              </div>
              <p className="mt-3 text-sm text-slate-300">{company.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl bg-slate-800/70 p-3">
                  <p className="text-slate-400">Capitalization</p>
                  <p className="font-semibold text-cyan-300">{company.cap}</p>
                </div>
                <div className="rounded-xl bg-slate-800/70 p-3">
                  <p className="text-slate-400">Stock Price</p>
                  <p className="font-semibold text-emerald-300">{company.stock}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="mb-6 text-2xl font-extrabold">Совет руководителей</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {boardMembers.map((m) => (
            <article key={m.name} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-4 flex h-44 items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-800/60">
                <span className="text-sm text-slate-400">Photo Placeholder</span>
              </div>
              <p className="text-xs uppercase tracking-widest text-slate-500">{m.role}</p>
              <p className="mt-1 text-lg font-bold">{m.name}</p>
            </article>
          ))}
        </div>
      </section>

      {showExchange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black">MEXC · Mazel Market Window</h3>
                <p className="text-sm text-slate-400">Демо-график индекса конгломерата (MZIGR)</p>
              </div>
              <button onClick={() => setShowExchange(false)} className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm hover:bg-slate-700">
                Закрыть
              </button>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
              <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
                <span>Pair: MZIGR / FASTTISI</span>
                <span className="font-semibold text-emerald-300">+5.82% (24h)</span>
              </div>
              <svg viewBox="0 0 740 240" className="h-72 w-full rounded-lg bg-slate-900">
                <defs>
                  <linearGradient id="line" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
                <polyline fill="none" stroke="url(#line)" strokeWidth="4" points={mexcChartPoints} />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
