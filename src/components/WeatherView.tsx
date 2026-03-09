import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { getWeather } from '../services/gemini';
import { Cloud, Sun, CloudRain, Search, Loader2, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function WeatherView() {
  const { t, language } = useLanguage();
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Default cities for quick access
  const defaultCities = [t.weather.mangalore, t.weather.udupi, t.weather.bangalore];

  const fetchWeather = async (cityName: string) => {
    setIsLoading(true);
    setWeatherData(null);
    try {
      const data = await getWeather(cityName, language);
      setWeatherData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h2 className="text-2xl font-serif font-semibold text-olive-900 mb-6">{t.weather.title}</h2>

      <div className="relative mb-6">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-olive-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive-500/20"
          onKeyDown={(e) => e.key === 'Enter' && city.trim() && fetchWeather(city)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-olive-400" size={18} />
        <button 
          onClick={() => city.trim() && fetchWeather(city)}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-olive-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
        >
          Check
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {defaultCities.map((c) => (
          <button
            key={c}
            onClick={() => {
              setCity(c);
              fetchWeather(c);
            }}
            className="px-4 py-2 bg-olive-100 text-olive-700 rounded-full text-sm font-medium whitespace-nowrap hover:bg-olive-200 transition-colors"
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-40 text-olive-500">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>{t.loading}</p>
          </div>
        ) : weatherData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-sky-50 to-blue-50 p-6 rounded-3xl border border-sky-100 shadow-sm"
          >
            <div className="flex items-center gap-2 text-sky-800 mb-4">
              <MapPin size={20} />
              <h3 className="text-xl font-semibold capitalize">{city}</h3>
            </div>
            <div className="prose prose-olive text-olive-800">
              <p className="whitespace-pre-wrap leading-relaxed text-lg">{weatherData}</p>
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-olive-400 mt-10">
            <Cloud size={48} className="mx-auto mb-4 opacity-50" />
            <p>Search for a city to see real-time weather</p>
          </div>
        )}
      </div>
    </div>
  );
}
