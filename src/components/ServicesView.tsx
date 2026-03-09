import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Phone, ShieldAlert, Truck, Zap, Droplet, Stethoscope, Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ServicesView() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    {
      category: t.categories.household,
      items: [
        { name: "Plumber (Ramesh)", phone: "+91 98765 43210", icon: Droplet },
        { name: "Electrician (Suresh)", phone: "+91 98765 12345", icon: Zap },
      ]
    },
    {
      category: t.categories.health,
      items: [
        { name: "City Hospital", phone: "0824 222 3333", icon: Stethoscope },
        { name: "Ambulance", phone: "108", icon: Truck },
      ]
    },
    {
      category: t.categories.emergency,
      items: [
        { name: "Police", phone: "100", icon: ShieldAlert },
        { name: "Fire", phone: "101", icon: Phone },
      ]
    }
  ];

  const filteredServices = services.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery)
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-2 sticky top-0 bg-olive-50/95 backdrop-blur-sm z-10">
        <h2 className="text-2xl font-serif font-semibold text-olive-900 mb-4">{t.services}</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-olive-400" size={18} />
          <input 
            type="text"
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-olive-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500/20 focus:border-olive-500 transition-all shadow-sm"
          />
        </div>
      </div>
      
      <div className="p-6 pt-2 space-y-6 overflow-y-auto pb-24">
        <AnimatePresence>
          {filteredServices.map((section, idx) => (
            <motion.div 
              key={section.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-3xl p-1 shadow-sm border border-olive-100 overflow-hidden"
            >
              <div className="px-5 py-3 bg-olive-50/50 border-b border-olive-100">
                <h3 className="text-sm font-semibold text-olive-600 uppercase tracking-wider">
                  {section.category}
                </h3>
              </div>
              <div className="divide-y divide-olive-50">
                {section.items.map((item, i) => (
                  <div key={i} className="p-4 flex items-center justify-between group hover:bg-olive-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-olive-100 flex items-center justify-center text-olive-700 group-hover:scale-105 transition-transform">
                        <item.icon size={22} />
                      </div>
                      <div>
                        <p className="font-medium text-olive-900 text-lg">{item.name}</p>
                        <p className="text-sm text-olive-500 font-mono tracking-wide">{item.phone}</p>
                      </div>
                    </div>
                    <a 
                      href={`tel:${item.phone.replace(/\s/g, '')}`}
                      className="w-10 h-10 rounded-full bg-olive-900 text-white flex items-center justify-center hover:bg-olive-800 hover:scale-110 shadow-md shadow-olive-900/20 transition-all"
                    >
                      <Phone size={18} />
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredServices.length === 0 && (
          <div className="text-center py-10 text-olive-400">
            <p>No services found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
