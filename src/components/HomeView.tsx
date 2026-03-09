import React from 'react';
import { useLanguage } from '../LanguageContext';
import { 
  Home, Sparkles, AlertCircle, 
  Calendar, Cloud, FileText, Coffee, Bell, Bus, ArrowRight,
  Phone
} from 'lucide-react';
import { motion } from 'motion/react';

type CategoryProps = {
  onSelect: (view: string) => void;
};

export default function HomeView({ onSelect }: CategoryProps) {
  const { t } = useLanguage();

  const features = [
    { id: 'reminders', label: t.features.reminders, icon: Calendar, color: 'bg-blue-50 text-blue-700 border-blue-100', span: 'col-span-1' },
    { id: 'weather', label: t.features.weather, icon: Cloud, color: 'bg-sky-50 text-sky-700 border-sky-100', span: 'col-span-1' },
    { id: 'notes', label: t.features.notes, icon: FileText, color: 'bg-yellow-50 text-yellow-700 border-yellow-100', span: 'col-span-1' },
    { id: 'meals', label: t.features.meals, icon: Coffee, color: 'bg-orange-50 text-orange-700 border-orange-100', span: 'col-span-1' },
    { id: 'bus', label: t.features.bus, icon: Bus, color: 'bg-teal-50 text-teal-700 border-teal-100', span: 'col-span-2' },
    { id: 'alarm', label: t.features.alarm, icon: Bell, color: 'bg-indigo-50 text-indigo-700 border-indigo-100', span: 'col-span-1' },
    { id: 'services', label: t.emergencyTitle, icon: Phone, color: 'bg-red-50 text-red-700 border-red-100', span: 'col-span-1' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 pb-24 overflow-y-auto h-full bg-gradient-to-b from-olive-50/50 to-white">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 mt-2"
      >
        <h1 className="text-4xl font-serif font-bold text-olive-900 mb-2 leading-tight">{t.appTitle}</h1>
        <p className="text-olive-600 text-lg font-light">{t.welcome}</p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <motion.button
          variants={item}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('assistant')}
          className="col-span-2 bg-gradient-to-br from-olive-800 to-olive-900 text-white p-6 rounded-3xl shadow-xl shadow-olive-900/10 flex items-center justify-between relative overflow-hidden group"
        >
          <div className="relative z-10 text-left max-w-[70%]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-yellow-200" />
              <span className="text-xs font-medium uppercase tracking-wider text-olive-200">AI Assistant</span>
            </div>
            <h3 className="text-2xl font-serif font-semibold mb-2">{t.assistant}</h3>
            <p className="text-olive-100 text-sm opacity-90 leading-relaxed">{t.aiPrompt}</p>
          </div>
          
          <div className="relative z-10 bg-white/10 p-4 rounded-full backdrop-blur-sm group-hover:bg-white/20 transition-colors">
            <ArrowRight size={24} />
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-black/10 to-transparent" />
        </motion.button>

        {features.map((feat) => (
          <motion.button
            key={feat.id}
            variants={item}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(feat.id)}
            className={`p-5 rounded-3xl shadow-sm border flex flex-col items-start justify-between gap-4 transition-all hover:shadow-md ${feat.color} bg-white ${feat.span} ${feat.span === 'col-span-2' ? 'flex-row items-center' : 'aspect-[4/3]'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-sm`}>
              <feat.icon size={20} />
            </div>
            <span className="font-medium text-olive-900 text-left leading-tight text-lg">{feat.label}</span>
            {feat.span === 'col-span-2' && (
              <ArrowRight size={18} className="ml-auto opacity-50" />
            )}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
