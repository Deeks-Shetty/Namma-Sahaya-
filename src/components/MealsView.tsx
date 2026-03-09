import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { Coffee, Utensils, Moon } from 'lucide-react';

export default function MealsView() {
  const { t } = useLanguage();
  
  const [meals, setMeals] = useState({
    breakfast: '',
    lunch: '',
    dinner: ''
  });

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-serif font-semibold text-olive-900 mb-6">{t.meals.title}</h2>

      <div className="space-y-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-orange-100">
          <div className="flex items-center gap-3 mb-3 text-orange-700">
            <Coffee size={20} />
            <h3 className="font-medium">{t.meals.breakfast}</h3>
          </div>
          <textarea
            value={meals.breakfast}
            onChange={(e) => setMeals({...meals, breakfast: e.target.value})}
            placeholder="Idli, Dosa..."
            className="w-full p-3 bg-orange-50/50 rounded-xl border-none focus:ring-1 focus:ring-orange-200 resize-none"
            rows={2}
          />
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-green-100">
          <div className="flex items-center gap-3 mb-3 text-green-700">
            <Utensils size={20} />
            <h3 className="font-medium">{t.meals.lunch}</h3>
          </div>
          <textarea
            value={meals.lunch}
            onChange={(e) => setMeals({...meals, lunch: e.target.value})}
            placeholder="Rice, Sambar..."
            className="w-full p-3 bg-green-50/50 rounded-xl border-none focus:ring-1 focus:ring-green-200 resize-none"
            rows={2}
          />
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-indigo-100">
          <div className="flex items-center gap-3 mb-3 text-indigo-700">
            <Moon size={20} />
            <h3 className="font-medium">{t.meals.dinner}</h3>
          </div>
          <textarea
            value={meals.dinner}
            onChange={(e) => setMeals({...meals, dinner: e.target.value})}
            placeholder="Chapati, Curry..."
            className="w-full p-3 bg-indigo-50/50 rounded-xl border-none focus:ring-1 focus:ring-indigo-200 resize-none"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}
