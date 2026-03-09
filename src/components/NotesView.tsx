import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Save, Share2 } from 'lucide-react';

export default function NotesView() {
  const { t } = useLanguage();
  const [note, setNote] = useState('');

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-semibold text-olive-900">{t.notes.title}</h2>
        <button className="text-olive-600 hover:text-olive-900">
          <Share2 size={20} />
        </button>
      </div>

      <div className="flex-1 bg-yellow-50/50 rounded-2xl border border-yellow-100 p-4 shadow-sm relative overflow-hidden">
        {/* Lined paper effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10" 
          style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 32px', marginTop: '31px' }} 
        />
        
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t.notes.placeholder}
          className="w-full h-full bg-transparent resize-none focus:outline-none text-olive-900 leading-8 text-lg"
        />
      </div>

      <button className="mt-4 w-full bg-olive-800 text-white py-3 rounded-xl font-medium hover:bg-olive-900 transition-colors flex items-center justify-center gap-2">
        <Save size={18} />
        {t.notes.save}
      </button>
    </div>
  );
}
