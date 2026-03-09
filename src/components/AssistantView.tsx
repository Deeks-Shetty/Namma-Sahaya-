import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { generateResponseStream, AIMode } from '../services/gemini';
import { Send, Bot, User, Loader2, Sparkles, Zap, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export default function AssistantView() {
  const { t, language } = useLanguage();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: t.welcome }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AIMode>('balanced');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Create a placeholder message for AI
    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMessageId,
      role: 'assistant',
      text: ''
    }]);

    try {
      const stream = generateResponseStream(input, language, mode);
      let fullText = '';
      let isFirstChunk = true;

      for await (const chunk of stream) {
        if (isFirstChunk) {
          setIsLoading(false);
          isFirstChunk = false;
        }
        fullText += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, text: fullText } : msg
        ));
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId ? { ...msg, text: "Sorry, I encountered an error." } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-olive-100 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-olive-100 flex items-center justify-center text-olive-700">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-serif font-semibold text-olive-900">{t.assistant}</h2>
            <p className="text-xs text-olive-500">Always here to help</p>
          </div>
        </div>
        
        {/* Mode Selector */}
        <div className="flex bg-olive-50 p-1 rounded-xl">
          <button
            onClick={() => setMode('fast')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
              mode === 'fast' ? 'bg-white text-olive-900 shadow-sm' : 'text-olive-500 hover:text-olive-700'
            }`}
          >
            <Zap size={12} />
            {t.aiModes.fast}
          </button>
          <button
            onClick={() => setMode('balanced')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
              mode === 'balanced' ? 'bg-white text-olive-900 shadow-sm' : 'text-olive-500 hover:text-olive-700'
            }`}
          >
            <Bot size={12} />
            {t.aiModes.balanced}
          </button>
          <button
            onClick={() => setMode('thinking')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-all ${
              mode === 'thinking' ? 'bg-white text-olive-900 shadow-sm' : 'text-olive-500 hover:text-olive-700'
            }`}
          >
            <Brain size={12} />
            {t.aiModes.thinking}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-auto ${
                msg.role === 'user' ? 'bg-olive-800 text-white' : 'bg-white border border-olive-200 text-olive-600'
              }`}>
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              
              <div
                className={`p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-olive-800 text-white rounded-br-none'
                    : 'bg-white text-olive-900 border border-olive-100 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed text-[15px] min-h-[1.5em]">
                  {msg.text}
                  {msg.role === 'assistant' && msg.id === messages[messages.length - 1].id && isLoading && !msg.text && (
                    <span className="animate-pulse">...</span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
        
        {isLoading && messages[messages.length - 1].role === 'user' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-white border border-olive-200 text-olive-600 flex items-center justify-center mt-auto">
                <Bot size={14} />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-olive-100 flex items-center gap-2">
                <Loader2 className="animate-spin text-olive-600" size={16} />
                <span className="text-olive-600 text-sm font-medium">{t.loading}</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-olive-100 absolute bottom-0 left-0 right-0 z-20">
        <div className="flex gap-2 items-end">
          <div className="flex-1 bg-olive-50 rounded-2xl border border-olive-200 focus-within:border-olive-400 focus-within:ring-2 focus-within:ring-olive-500/10 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t.aiPlaceholder}
              rows={1}
              className="w-full p-3 bg-transparent focus:outline-none resize-none max-h-32 text-olive-900 placeholder:text-olive-400"
              style={{ minHeight: '48px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 bg-olive-900 text-white rounded-full flex items-center justify-center hover:bg-olive-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-olive-900/20 hover:scale-105 active:scale-95"
          >
            <Send size={20} className={input.trim() ? "ml-1" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
}
