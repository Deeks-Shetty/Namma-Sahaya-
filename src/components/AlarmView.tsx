import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Bell, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function AlarmView() {
  const { t } = useLanguage();
  const [time, setTime] = useState('06:00');
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="p-6 h-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-serif font-semibold text-olive-900 mb-8">{t.alarm.title}</h2>

      <div className="bg-white p-8 rounded-full shadow-xl border-4 border-olive-50 w-64 h-64 flex flex-col items-center justify-center mb-8 relative overflow-hidden">
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="text-5xl font-bold text-olive-800 bg-transparent text-center w-full focus:outline-none z-10"
        />
        <p className="text-olive-400 mt-2 font-medium">{isActive ? 'Alarm On' : 'Alarm Off'}</p>
        
        {isActive && (
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-olive-500/5 rounded-full"
          />
        )}
      </div>

      <button
        onClick={() => setIsActive(!isActive)}
        className={`w-full max-w-xs py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
          isActive 
            ? 'bg-red-50 text-red-600 border border-red-100' 
            : 'bg-olive-800 text-white shadow-lg shadow-olive-900/20'
        }`}
      >
        <Bell size={24} className={isActive ? 'animate-bounce' : ''} />
        {isActive ? 'Turn Off' : t.alarm.set}
      </button>

      <div className="mt-8 p-4 bg-olive-50 rounded-xl flex items-center gap-3 text-olive-700 w-full max-w-xs">
        <Volume2 size={20} />
        <p className="text-sm font-medium">Voice: "{t.alarm.message}"</p>
      </div>
    </div>
  );
}
