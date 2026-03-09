/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './LanguageContext';
import { translations, Language } from './translations';
import HomeView from './components/HomeView';
import AssistantView from './components/AssistantView';
import ServicesView from './components/ServicesView';
import RemindersView from './components/RemindersView';
import WeatherView from './components/WeatherView';
import NotesView from './components/NotesView';
import MealsView from './components/MealsView';
import AlarmView from './components/AlarmView';
import BusTimingsView from './components/BusTimingsView';
import { Home, MessageSquare, Grid, Settings, Menu, Globe, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppIcon } from './hooks/useAppIcon';

function AppContent() {
  const { language, setLanguage, t } = useLanguage();
  const [currentView, setCurrentView] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { iconUrl, isLoading: isIconLoading } = useAppIcon();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onSelect={setCurrentView} />;
      case 'assistant':
        return <AssistantView />;
      case 'services':
        return <ServicesView />;
      case 'reminders':
        return <RemindersView />;
      case 'weather':
        return <WeatherView />;
      case 'notes':
        return <NotesView />;
      case 'meals':
        return <MealsView />;
      case 'bus':
        return <BusTimingsView />;
      case 'alarm':
        return <AlarmView />;
      default:
        return <HomeView onSelect={setCurrentView} />;
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-olive-50 flex flex-col shadow-2xl overflow-hidden relative font-sans text-olive-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-olive-100 p-4 flex items-center justify-between sticky top-0 z-20 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-olive-900/10 bg-olive-100 flex items-center justify-center relative group">
            {iconUrl ? (
              <img src={iconUrl} alt="App Icon" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-olive-600 to-olive-800 flex items-center justify-center text-white font-serif font-bold text-xl">
                {isIconLoading ? <Loader2 className="animate-spin" size={16} /> : 'N'}
              </div>
            )}
          </div>
          <span className="font-serif font-bold text-xl text-olive-900 tracking-tight leading-none">
            {t.appTitle}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-olive-100/50 hover:bg-olive-100 text-olive-800 transition-all border border-olive-200/50 hover:border-olive-200"
            >
              <Globe size={14} />
              <span className="text-xs font-bold uppercase tracking-wide">
                {language === 'tulu' ? 'Tu' : language.toUpperCase()}
              </span>
            </button>
            
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl shadow-olive-900/10 border border-olive-100 p-2 min-w-[160px] z-50 origin-top-right overflow-hidden"
                >
                  {(Object.keys(translations) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm mb-1 last:mb-0 transition-all flex items-center justify-between group ${
                        language === lang 
                          ? 'bg-olive-50 text-olive-900 font-semibold' 
                          : 'text-olive-600 hover:bg-olive-50 hover:text-olive-800'
                      }`}
                    >
                      {lang === 'en' ? 'English' : lang === 'kn' ? 'ಕನ್ನಡ' : 'ತುಳು'}
                      {language === lang && (
                        <motion.div 
                          layoutId="lang-dot"
                          className="w-1.5 h-1.5 rounded-full bg-olive-600" 
                        />
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative bg-gradient-to-b from-olive-50 to-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-t border-olive-100 px-6 py-2 pb-5 flex justify-between items-center z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <NavButton 
          active={currentView === 'home'} 
          onClick={() => setCurrentView('home')} 
          icon={Home} 
          label={t.home} 
        />
        <NavButton 
          active={currentView === 'services'} 
          onClick={() => setCurrentView('services')} 
          icon={Grid} 
          label={t.services} 
        />
        <NavButton 
          active={currentView === 'assistant'} 
          onClick={() => setCurrentView('assistant')} 
          icon={MessageSquare} 
          label="AI" 
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all duration-300 w-16 group ${
        active ? 'text-olive-900' : 'text-olive-400 hover:text-olive-600'
      }`}
    >
      <div className={`p-2 rounded-2xl transition-all duration-500 relative ${
        active ? 'bg-olive-100 -translate-y-2 shadow-sm shadow-olive-900/5' : 'bg-transparent group-hover:bg-olive-50'
      }`}>
        <Icon size={24} strokeWidth={active ? 2.5 : 2} className="transition-transform duration-300 group-hover:scale-110" />
        {active && (
          <motion.div 
            layoutId="nav-indicator"
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-olive-800 rounded-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </div>
      <span className={`text-[10px] font-medium transition-all duration-300 ${
        active ? 'opacity-100 font-bold translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
      }`}>
        {label}
      </span>
    </button>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
