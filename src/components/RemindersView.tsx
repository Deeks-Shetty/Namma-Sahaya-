import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Plus, Trash2, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Reminder = {
  id: string;
  text: string;
  completed: boolean;
  time?: string;
};

export default function RemindersView() {
  const { t } = useLanguage();
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: '1', text: 'Blood Pressure Tablet', completed: false, time: '09:00' },
    { id: '2', text: 'Drink Water', completed: true, time: '10:00' },
  ]);
  const [newReminder, setNewReminder] = useState('');

  const addReminder = () => {
    if (!newReminder.trim()) return;
    setReminders([
      ...reminders,
      { id: Date.now().toString(), text: newReminder, completed: false }
    ]);
    setNewReminder('');
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-2xl font-serif font-semibold text-olive-900 mb-6">{t.reminders.title}</h2>
      
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newReminder}
          onChange={(e) => setNewReminder(e.target.value)}
          placeholder={t.reminders.placeholder}
          className="flex-1 p-3 rounded-xl border border-olive-200 focus:outline-none focus:ring-2 focus:ring-olive-500/20"
          onKeyDown={(e) => e.key === 'Enter' && addReminder()}
        />
        <button 
          onClick={addReminder}
          className="bg-olive-800 text-white p-3 rounded-xl hover:bg-olive-900 transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        <AnimatePresence>
          {reminders.map((reminder) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={`p-4 rounded-xl border flex items-center justify-between group transition-all ${
                reminder.completed 
                  ? 'bg-olive-50 border-olive-100 opacity-70' 
                  : 'bg-white border-olive-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    reminder.completed
                      ? 'bg-olive-600 border-olive-600 text-white'
                      : 'border-olive-300 text-transparent hover:border-olive-500'
                  }`}
                >
                  <Check size={14} />
                </button>
                <div className={reminder.completed ? 'line-through text-olive-400' : 'text-olive-900'}>
                  <p className="font-medium">{reminder.text}</p>
                  {reminder.time && (
                    <div className="flex items-center gap-1 text-xs text-olive-500 mt-0.5">
                      <Clock size={10} />
                      <span>{reminder.time}</span>
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => deleteReminder(reminder.id)}
                className="text-olive-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {reminders.length === 0 && (
          <div className="text-center py-10 text-olive-400">
            <p>{t.reminders.empty}</p>
          </div>
        )}
      </div>
    </div>
  );
}
