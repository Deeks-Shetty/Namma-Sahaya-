import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { Bus, Clock, Plus, Trash2, MapPin, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateResponse } from '../services/gemini';

type BusTiming = {
  id: string;
  route: string;
  time: string;
};

export default function BusTimingsView() {
  const { t, language } = useLanguage();
  const [timings, setTimings] = useState<BusTiming[]>(() => {
    const saved = localStorage.getItem('busTimings');
    return saved ? JSON.parse(saved) : [];
  });
  const [route, setRoute] = useState('');
  const [time, setTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    localStorage.setItem('busTimings', JSON.stringify(timings));
  }, [timings]);

  const addTiming = () => {
    if (!route.trim() || !time.trim()) return;
    const newTiming = {
      id: Date.now().toString(),
      route,
      time
    };
    setTimings([...timings, newTiming]);
    setRoute('');
    setTime('');
  };

  const deleteTiming = (id: string) => {
    setTimings(timings.filter(t => t.id !== id));
  };

  const searchBusTimings = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResult(null);
    try {
      const prompt = `Find bus timings for: ${searchQuery}. 
      Provide a list of available buses with times. 
      Reply in ${language}. Keep it concise.`;
      
      const response = await generateResponse(prompt, language);
      setSearchResult(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-2xl font-serif font-semibold text-olive-900 mb-6">{t.features.bus}</h2>

      {/* Search Section */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-olive-600 uppercase tracking-wider mb-2">Check Online</h3>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search route (e.g., Udupi to Mangalore)"
            className="w-full pl-10 pr-4 py-3 bg-white border border-olive-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500/20"
            onKeyDown={(e) => e.key === 'Enter' && searchBusTimings()}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-olive-400" size={18} />
          <button 
            onClick={searchBusTimings}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-olive-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
          >
            Search
          </button>
        </div>
        
        {isSearching && (
          <div className="flex items-center gap-2 mt-2 text-olive-500 text-sm">
            <Loader2 className="animate-spin" size={14} />
            <span>Searching schedules...</span>
          </div>
        )}

        {searchResult && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 bg-teal-50 p-4 rounded-xl border border-teal-100 text-teal-900 text-sm whitespace-pre-wrap"
          >
            {searchResult}
          </motion.div>
        )}
      </div>

      {/* Saved Timings Section */}
      <h3 className="text-sm font-semibold text-olive-600 uppercase tracking-wider mb-2">Saved Timings</h3>
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-olive-100 mb-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-olive-50 p-3 rounded-xl">
            <MapPin size={18} className="text-olive-500" />
            <input
              type="text"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              placeholder={t.bus.routePlaceholder}
              className="bg-transparent w-full focus:outline-none text-olive-900 placeholder:text-olive-400"
            />
          </div>
          <div className="flex items-center gap-2 bg-olive-50 p-3 rounded-xl">
            <Clock size={18} className="text-olive-500" />
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder={t.bus.timePlaceholder}
              className="bg-transparent w-full focus:outline-none text-olive-900 placeholder:text-olive-400"
            />
          </div>
          <button
            onClick={addTiming}
            disabled={!route.trim() || !time.trim()}
            className="w-full bg-olive-800 text-white p-3 rounded-xl font-medium hover:bg-olive-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Plus size={18} />
            {t.bus.add}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        <AnimatePresence>
          {timings.map((timing) => (
            <motion.div
              key={timing.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="bg-white p-4 rounded-xl border border-olive-100 shadow-sm flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Bus size={20} />
                </div>
                <div>
                  <p className="font-medium text-olive-900">{timing.route}</p>
                  <div className="flex items-center gap-1 text-sm text-olive-500">
                    <Clock size={12} />
                    <span>{timing.time}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteTiming(timing.id)}
                className="text-olive-300 hover:text-red-500 transition-colors p-2"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {timings.length === 0 && (
          <div className="text-center py-10 text-olive-400">
            <p>{t.bus.empty}</p>
          </div>
        )}
      </div>
    </div>
  );
}
