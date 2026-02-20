
import React, { useState, useEffect, useMemo } from 'react';
import { Trade, TradeType, DayStats, User } from './types';
import { MONTHS_RU, DAYS_RU, MOTIVATIONAL_QUOTES } from './constants';
import TradeModal from './components/TradeModal';
import Auth from './components/Auth';

const App: React.FC = () => {
  const normalizeDateInput = (value?: string) => {
    if (!value) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const parsed = new Date(`${value}T00:00:00`);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
      const [day, month, yearValue] = value.split('.').map(Number);
      const parsed = new Date(yearValue, month - 1, day);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('trader_diary_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse current user:', e);
      return null;
    }
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser?.startDate) return;
    const preferredDate = normalizeDateInput(currentUser.startDate);
    if (preferredDate) {
      setCurrentDate(preferredDate);
    }
  }, [currentUser]);

  // Daily quote logic based on date hash
  const dailyQuote = useMemo(() => {
    const dateStr = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
      hash = (hash << 5) - hash + dateStr.charCodeAt(i);
      hash |= 0; 
    }
    const index = Math.abs(hash) % MOTIVATIONAL_QUOTES.length;
    return MOTIVATIONAL_QUOTES[index];
  }, []);

  // Load trades for current user
  useEffect(() => {
    if (currentUser) {
      try {
        const rawTrades = localStorage.getItem('trader_diary_trades');
        const savedTrades = rawTrades ? JSON.parse(rawTrades) : [];
        const userTrades = savedTrades.filter((t: any) => t.userId === currentUser.username);
        setTrades(userTrades);
      } catch (e) {
        console.error('Failed to load trades:', e);
        setTrades([]);
      }
    }
  }, [currentUser]);

  // Save trades globally but tagged by user
  const syncTradesToLocal = (updatedTrades: Trade[]) => {
    if (!currentUser) return;
    try {
      const rawAll = localStorage.getItem('trader_diary_trades');
      const allTrades = rawAll ? JSON.parse(rawAll) : [];
      const otherTrades = allTrades.filter((t: any) => t.userId !== currentUser.username);
      localStorage.setItem('trader_diary_trades', JSON.stringify([...otherTrades, ...updatedTrades]));
    } catch (e) {
      console.error('Failed to sync trades:', e);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('trader_diary_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('trader_diary_current_user');
    setTrades([]);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleMonthPick = (monthIndex: number) => setCurrentDate(new Date(year, monthIndex, 1));

  const handleJumpToDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setCurrentDate(date);
    }
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = [];
    for (let i = 0; i < offset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  }, [year, month, offset, daysInMonth]);

  const statsByDate = useMemo(() => {
    const stats: Record<string, DayStats> = {};
    trades.forEach(trade => {
      const dateKey = new Date(trade.date).toDateString();
      if (!stats[dateKey]) {
        stats[dateKey] = {
          date: trade.date,
          totalProfit: 0,
          totalLoss: 0,
          netResult: 0,
          trades: []
        };
      }
      stats[dateKey].trades.push(trade);
      if (trade.type === TradeType.PROFIT) {
        stats[dateKey].totalProfit += trade.amount;
      } else {
        stats[dateKey].totalLoss += trade.amount;
      }
      stats[dateKey].netResult = stats[dateKey].totalProfit - stats[dateKey].totalLoss;
    });
    return stats;
  }, [trades]);

  const monthlyStats = useMemo(() => {
    const monthTrades = trades.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const profit = monthTrades.reduce((acc, t) => t.type === TradeType.PROFIT ? acc + t.amount : acc, 0);
    const loss = monthTrades.reduce((acc, t) => t.type === TradeType.LOSS ? acc + t.amount : acc, 0);

    return {
      profit,
      loss,
      total: profit - loss,
      count: monthTrades.length
    };
  }, [trades, month, year]);

  const yearlyTotals = useMemo(() => {
    return MONTHS_RU.map((_, monthIndex) => {
      const monthTrades = trades.filter(t => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() === monthIndex;
      });

      const monthProfit = monthTrades.reduce((acc, t) => t.type === TradeType.PROFIT ? acc + t.amount : acc, 0);
      const monthLoss = monthTrades.reduce((acc, t) => t.type === TradeType.LOSS ? acc + t.amount : acc, 0);

      return monthProfit - monthLoss;
    });
  }, [trades, year]);

  const handleDayClick = (date: Date) => {
    setSelectedDay(date.toISOString());
    setIsModalOpen(true);
  };

  const handleAddTrade = (newTrade: Omit<Trade, 'id' | 'userId'>) => {
    if (!currentUser) return;
    const trade: Trade = {
      ...newTrade,
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.username
    };
    const updated = [...trades, trade];
    setTrades(updated);
    syncTradesToLocal(updated);
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto text-slate-800">
      {/* Header */}
      <header className="flex flex-col lg:flex-row items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
        
        <div className="flex items-center gap-4 z-10 w-full lg:w-auto">
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Trader's Insight</h1>
            <p className="text-slate-500 text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ID: <span className="font-bold text-blue-600">@{currentUser.username}</span>
            </p>
          </div>
        </div>

        <div className="flex-1 flex justify-center px-4 z-10">
          <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 shadow-inner max-w-xl text-center">
            <p className="text-slate-600 font-bold italic text-base md:text-lg leading-snug">
              <span className="text-blue-500 mr-2 not-italic">⚡</span>
              "{dailyQuote}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 z-10 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600 group">
              <svg className="w-5 h-5 group-active:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-lg font-black min-w-[140px] text-center text-slate-700 uppercase tracking-tight">
              {MONTHS_RU[month]} {year}
            </div>
            <button onClick={handleNextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600 group">
              <svg className="w-5 h-5 group-active:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <input
            type="date"
            value={new Date(year, month, 1).toISOString().split('T')[0]}
            onChange={handleJumpToDate}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Перейти к дате"
          />

          <button 
            onClick={handleLogout}
            className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all border border-rose-100 flex items-center gap-2 group"
            title="Выйти из терминала"
          >
            <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-xs font-bold uppercase hidden sm:inline">Выход</span>
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
        {MONTHS_RU.map((monthName, monthIndex) => {
          const total = yearlyTotals[monthIndex];
          const isActive = monthIndex === month;
          return (
            <button
              key={monthName}
              onClick={() => handleMonthPick(monthIndex)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isActive ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:border-blue-200'
              }`}
            >
              <p className={`text-xs font-bold uppercase ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{monthName}</p>
              <p className={`text-lg font-black ${total >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {total > 0 ? '+' : ''}{total.toFixed(0)}{currentUser.currency}
              </p>
            </button>
          );
        })}
      </section>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <main className="flex-1 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col w-full">
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
            {DAYS_RU.map(day => (
              <div key={day} className="py-4 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 flex-1">
            {calendarDays.map((date, idx) => {
              if (!date) return <div key={`empty-${idx}`} className="bg-slate-50/50 border-r border-b border-slate-100" />;
              
              const stats = statsByDate[date.toDateString()];
              const isToday = new Date().toDateString() === date.toDateString();

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDayClick(date)}
                  className={`group min-h-[100px] md:min-h-[140px] p-3 border-r border-b border-slate-100 hover:bg-blue-50/50 transition-all flex flex-col relative text-left ${
                    isToday ? 'bg-blue-50/30' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                      isToday ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 group-hover:text-blue-600'
                    }`}>
                      {date.getDate()}
                    </span>
                  </div>

                  {stats && (
                    <div className="flex flex-col gap-1.5 mt-auto">
                      {stats.netResult !== 0 && (
                        <div className={`text-sm md:text-base font-extrabold truncate ${
                          stats.netResult > 0 ? 'text-emerald-500' : 'text-rose-500'
                        }`}>
                          {stats.netResult > 0 ? '+' : ''}{stats.netResult.toFixed(0)}{currentUser.currency}
                        </div>
                      )}
                      <div className="flex gap-1 flex-wrap">
                         {stats.trades.slice(0, 5).map(t => (
                           <div 
                             key={t.id} 
                             className={`w-2 h-2 rounded-full border border-white shadow-sm ${t.type === TradeType.PROFIT ? 'bg-emerald-400' : 'bg-rose-400'}`}
                           />
                         ))}
                         {stats.trades.length > 5 && <span className="text-[10px] font-bold text-slate-300">+{stats.trades.length - 5}</span>}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </main>

        <aside className="w-full lg:w-80 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Статистика за месяц</h3>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col">
                <p className="text-emerald-600 text-xs font-bold uppercase mb-1">Профит</p>
                <p className="text-3xl font-black text-emerald-600">+{monthlyStats.profit.toLocaleString()}{currentUser.currency}</p>
              </div>

              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex flex-col">
                <p className="text-rose-600 text-xs font-bold uppercase mb-1">Убыток</p>
                <p className="text-3xl font-black text-rose-600">-{monthlyStats.loss.toLocaleString()}{currentUser.currency}</p>
              </div>

              <div className={`p-5 rounded-2xl border-2 shadow-sm transition-all ${
                monthlyStats.total >= 0 
                  ? 'bg-blue-600 border-blue-500 text-white' 
                  : 'bg-amber-500 border-amber-400 text-white'
              }`}>
                <p className="text-white/70 text-xs font-bold uppercase mb-1">Итоговый результат</p>
                <p className="text-4xl font-black">
                  {monthlyStats.total > 0 ? '+' : ''}{monthlyStats.total.toLocaleString()}{currentUser.currency}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Аналитика</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center py-2 border-b border-slate-50">
                 <span className="text-sm text-slate-500 font-medium">Сделок:</span>
                 <span className="text-sm font-bold text-slate-700">{monthlyStats.count}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-slate-50">
                 <span className="text-sm text-slate-500 font-medium">Win Rate:</span>
                 <span className={`text-sm font-bold ${monthlyStats.count > 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                   {monthlyStats.count > 0 ? ((trades.filter(t => t.type === TradeType.PROFIT).length / trades.length) * 100).toFixed(1) : 0}%
                 </span>
               </div>
            </div>
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
               <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                 <span className="font-bold text-slate-500 block mb-1">Где мои данные?</span>
                 Данные хранятся в LocalStorage твоего браузера. Они пропадут, если ты очистишь историю или зайдешь с другого устройства.
               </p>
            </div>
          </div>
        </aside>
      </div>

      <TradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddTrade}
        selectedDate={selectedDay || new Date().toISOString()}
        defaultCurrency={currentUser.currency}
      />
    </div>
  );
};

export default App;
