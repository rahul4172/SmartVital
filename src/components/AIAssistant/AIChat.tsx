import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, Loader2, Brain } from 'lucide-react';
import { api } from '../../api/axios'; // Or use native fetch if preferred
import { useUiStore } from '../../store/ui.store';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(prev => !prev);
  
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleToggle = () => setIsOpen(prev => !prev);
    
    window.addEventListener('open-ai-chat', handleOpen);
    window.addEventListener('toggle-ai-chat', handleToggle);
    
    return () => {
      window.removeEventListener('open-ai-chat', handleOpen);
      window.removeEventListener('toggle-ai-chat', handleToggle);
    };
  }, []);
  
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm SmartVital AI. I can explain your risk scores, answer medical questions, or help you understand your vitals. How can I help you today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Build chat history from the last 6 messages (excluding the new user message we just added)
      const chatHistory = messages.slice(-6);
      
      // TODO: In a real implementation, pull patient_context from global state or context
      const patient_context = {
        name: "Current Patient",
      };

      // Use the axios api instance which correctly handles the Vite proxy and auth tokens
      const response = await api.post('/api/ai/chat', {
        message: userMessage,
        patient_context,
        chat_history: chatHistory
      });

      // Axios automatically throws for non-2xx status codes
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);

    } catch (error: any) {
      console.error('AI Chat Error:', error);
      
      if (error.response?.status === 429) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'AI assistant is temporarily unavailable due to rate limits. Please try again in a moment.' 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'I encountered an error connecting to my servers. Please check your connection and try again.' 
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleIsOpen}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-[var(--primary)] text-white rounded-full flex items-center justify-center shadow-2xl z-[999999] hover:scale-105 transition-transform duration-200"
        >
          <Brain size={28} />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div 
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-32px)] sm:w-[380px] h-[calc(100vh-100px)] sm:h-[600px] max-h-[800px] bg-white flex flex-col rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] z-[999999] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[var(--primary)] text-white p-4 rounded-t-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Brain size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">SmartVital AI</h3>
                <p className="text-xs text-blue-100">Medical Assistant</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm text-sm ${
                  msg.role === 'user' 
                    ? 'bg-[var(--primary)] text-white rounded-br-sm' 
                    : 'bg-white border border-gray-100 text-[var(--text-primary)] rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm p-4 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white rounded-b-2xl">
            <div className="flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2 focus-within:border-[var(--primary)] transition-colors">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="flex-1 max-h-32 min-h-[40px] bg-transparent resize-none outline-none text-sm p-2 text-[var(--text-primary)]"
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                className="p-2.5 bg-[var(--primary)] hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors flex-shrink-0 shadow-sm"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2">
              SmartVital AI can make mistakes. Consult your doctor for medical advice.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
