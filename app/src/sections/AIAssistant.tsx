import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bot, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const sampleMessages = [
  { type: 'user', text: 'Explain this chapter in 3 lines.' },
  { type: 'assistant', text: 'Here is a simple summary' },
];

export default function AIAssistant() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const card = cardRef.current;
    const avatar = avatarRef.current;

    if (!section || !heading || !card || !avatar) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(heading,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Card animation
      gsap.fromTo(card,
        { y: 90, rotateX: 8, opacity: 0 },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Message bubbles animation
      const messages = card.querySelectorAll('.chat-bubble');
      gsap.fromTo(messages,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Avatar animation
      gsap.fromTo(avatar,
        { scale: 0.6, rotate: -8, opacity: 0 },
        {
          scale: 1,
          rotate: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'back.out(1.6)',
          scrollTrigger: {
            trigger: avatar,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 overflow-hidden"
      style={{ backgroundColor: '#121A2B' }}
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-20" />

      <div className="relative z-10 max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="font-heading text-[clamp(28px,3.6vw,48px)] font-bold text-edu-text mb-4">
            Stuck? Ask the{' '}
            <span className="text-gradient">assistant.</span>
          </h2>
          <p className="text-edu-muted text-lg max-w-xl mx-auto">
            Get explanations, summaries, and next steps—in seconds.
          </p>
        </div>

        {/* Chat card */}
        <div 
          ref={cardRef}
          className="relative rounded-[34px] border border-white/[0.08] overflow-hidden card-shadow"
          style={{ backgroundColor: '#0B0E14' }}
        >
          {/* Chat header */}
          <div className="px-6 py-4 border-b border-white/[0.08] flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex-1 flex items-center justify-center gap-2">
              <Bot className="w-5 h-5 text-edu-blue" />
              <span className="text-edu-text font-semibold">EduBuddy Assistant</span>
              <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs">Online</span>
            </div>
          </div>

          {/* Chat messages */}
          <div className="p-6 space-y-4 min-h-[200px]">
            {sampleMessages.map((msg, index) => (
              <div 
                key={index}
                className={`chat-bubble flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div 
                  className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-gradient-accent text-white rounded-tr-sm'
                      : 'bg-white/10 text-edu-text rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  {msg.type === 'assistant' && (
                    <div className="mt-2 flex items-center gap-2 text-xs opacity-80">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI-generated</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div className="px-6 py-4 border-t border-white/[0.08]">
            <div className="flex gap-3">
              <div className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/[0.08] text-edu-muted text-sm flex items-center">
                Ask anything about your studies...
              </div>
              <button className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Floating assistant avatar */}
          <div 
            ref={avatarRef}
            className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full p-1"
            style={{
              background: 'linear-gradient(135deg, #2E5CFF, #A259FF)',
            }}
          >
            <div className="w-full h-full rounded-full bg-[#0B0E14] flex items-center justify-center relative">
              <Bot className="w-8 h-8 text-edu-blue" />
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0B0E14]" />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Button 
            size="lg"
            onClick={() => navigate('/chat')}
            className="bg-gradient-accent hover:opacity-90 text-white px-8 py-6 rounded-2xl shadow-glow-blue"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Try the Assistant
          </Button>
        </div>
      </div>

      {/* Floating chat button (persistent) */}
      <button
        onClick={() => navigate('/chat')}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-accent flex items-center justify-center shadow-glow-blue z-50 hover:scale-110 transition-transform"
        title="Open AI Chat"
      >
        <Bot className="w-6 h-6 text-white" />
      </button>
    </section>
  );
}
