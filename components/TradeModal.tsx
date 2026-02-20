
import React, { useEffect, useState } from 'react';
import { Trade, TradeType } from '../types';
import { CURRENCIES, EMOTIONS_LIST } from '../constants';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trade: Omit<Trade, 'id' | 'userId'>) => void;
  selectedDate: string;
  defaultCurrency: string;
}

const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose, onSave, selectedDate, defaultCurrency }) => {
  const [type, setType] = useState<TradeType>(TradeType.PROFIT);
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>(defaultCurrency || CURRENCIES[0]);
  const [emotions, setEmotions] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setCurrency(defaultCurrency || CURRENCIES[0]);
    }
  }, [isOpen, defaultCurrency]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    onSave({
      date: selectedDate,
      amount: Math.abs(Number(amount)),
      currency,
      type,
      emotions,
      description
    });
    
    // Reset
    setAmount('');
    setEmotions('');
    setDescription('');
    onClose();
  };

  const formattedDate = new Date(selectedDate).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Новая сделка: {formattedDate}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType(TradeType.PROFIT)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                type === TradeType.PROFIT ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Профит
            </button>
            <button
              type="button"
              onClick={() => setType(TradeType.LOSS)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                type === TradeType.LOSS ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Минус
            </button>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-500 mb-1">Сумма</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                required
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium text-slate-500 mb-1">Валюта</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Эмоции</label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS_LIST.map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmotions(e)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    emotions === e 
                      ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Описание / Заметки</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите ваши мысли и причины входа..."
              className="w-full h-24 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-95"
            >
              Сохранить сделку
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;
