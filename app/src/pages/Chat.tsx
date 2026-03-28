import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Send, Bot, User, Sparkles, 
  Loader2, Trash2, BookOpen, Code, Calculator, Lightbulb
} from 'lucide-react';
import { chatAPI } from '@/services/api';

const quickPrompts = [
  { icon: BookOpen, text: 'Explain derivatives', color: 'text-blue-400' },
  { icon: Code, text: 'Python basics', color: 'text-emerald-400' },
  { icon: Calculator, text: 'Solve equation', color: 'text-violet-400' },
  { icon: Lightbulb, text: 'Study tips', color: 'text-yellow-400' },
];

interface Message {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export default function Chat() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('edubuddy_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    
    // Add welcome message
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm EduBuddy, your AI study assistant. I can help you understand concepts, solve problems, and learn more effectively. What would you like to learn today?",
        timestamp: new Date().toISOString(),
      }
    ]);
  }, [navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatAPI.sendMessage(userMessage.content, user?.id);
      
      if (response.data.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I encountered an error. Please try again in a moment.",
          timestamp: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Hello! I'm EduBuddy, your AI study assistant. I can help you understand concepts, solve problems, and learn more effectively. What would you like to learn today?",
        timestamp: new Date().toISOString(),
      }
    ]);
  };

  const useQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) return null;

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#0B0E14' }}>
      {/* Header */}
      <nav className="border-b border-white/[0.08] flex-shrink-0" style={{ backgroundColor: '#0B0E14' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-edu-muted hover:text-edu-text transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-heading font-bold text-edu-text">EduBuddy AI</h1>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Online
                </p>
              </div>
            </div>

            <button 
              onClick={clearChat}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-colors"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5 text-edu-muted hover:text-red-400" />
            </button>
          </div>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Info Banner */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-edu-blue/10 to-edu-violet/10 border border-edu-blue/20 mb-6">
            <Sparkles className="w-5 h-5 text-edu-blue" />
            <p className="text-edu-muted text-sm">
              <span className="text-edu-text font-semibold">Free & Unlimited!</span> Ask me anything about your studies.
            </p>
          </div>

          {/* Quick Prompts */}
          {messages.length <= 1 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => useQuickPrompt(prompt.text)}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all text-left"
                >
                  <prompt.icon className={`w-5 h-5 ${prompt.color}`} />
                  <span className="text-edu-text text-sm">{prompt.text}</span>
                </button>
              ))}
            </div>
          )}

          {/* Chat Messages */}
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-gradient-accent' 
                    : 'bg-white/10'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-edu-blue" />
                  )}
                </div>

                {/* Message */}
                <div className={`max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div
                    className={`px-5 py-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-accent text-white rounded-tr-sm'
                        : 'bg-white/5 text-edu-text rounded-tl-sm border border-white/[0.08]'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  <span className="text-xs text-edu-muted mt-1 px-1">
                    {message.timestamp && formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-edu-blue" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white/5 border border-white/[0.08] rounded-tl-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-edu-blue animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-edu-blue animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-edu-blue animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/[0.08] flex-shrink-0 p-4" style={{ backgroundColor: '#0B0E14' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your studies..."
                rows={1}
                className="w-full px-5 py-4 pr-12 rounded-2xl bg-white/5 border border-white/[0.08] text-edu-text placeholder:text-edu-muted/50 outline-none focus:border-edu-blue/50 transition-colors resize-none"
                style={{ minHeight: '56px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-14 h-14 rounded-2xl bg-gradient-accent flex items-center justify-center disabled:opacity-50 transition-transform hover:scale-105"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
          <p className="text-center text-edu-muted text-xs mt-3">
            EduBuddy AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </div>
    </div>
  );
}
