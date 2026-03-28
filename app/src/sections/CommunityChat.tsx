import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MessageCircle, Paperclip, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const chatMessages = [
  {
    id: 1,
    user: 'Ahmed',
    avatar: 'A',
    message: 'How do I understand derivatives?',
    isUser: true,
    color: 'bg-blue-500/20',
  },
  {
    id: 2,
    user: 'Sara',
    avatar: 'S',
    message: 'Simple explanation here',
    isUser: false,
    color: 'bg-violet-500/20',
  },
  {
    id: 3,
    user: 'Ahmed',
    avatar: 'A',
    message: 'Thanks—can you share a video too?',
    isUser: true,
    color: 'bg-blue-500/20',
  },
  {
    id: 4,
    user: 'Sara',
    avatar: 'S',
    message: 'Sent in chat',
    isUser: false,
    color: 'bg-violet-500/20',
    hasAttachment: true,
  },
];

export default function CommunityChat() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const newBadgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const card = cardRef.current;
    const messages = messagesRef.current;
    const newBadge = newBadgeRef.current;

    if (!section || !heading || !card || !messages || !newBadge) return;

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
        { y: 100, rotateX: 10, opacity: 0 },
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

      // Messages stagger animation
      const messageElements = messages.querySelectorAll('.chat-message');
      gsap.fromTo(messageElements,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: messages,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // NEW badge animation
      gsap.fromTo(newBadge,
        { scale: 0.7, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'back.out(1.6)',
          scrollTrigger: {
            trigger: card,
            start: 'top 60%',
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
      style={{ backgroundColor: '#0B0E14' }}
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="relative z-10 max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="font-heading text-[clamp(28px,3.6vw,48px)] font-bold text-edu-text mb-4">
            Ask. Answer.{' '}
            <span className="text-gradient">Level up.</span>
          </h2>
          <p className="text-edu-muted text-lg max-w-xl mx-auto">
            Join a community of students helping each other succeed.
          </p>
        </div>

        {/* Chat card */}
        <div 
          ref={cardRef}
          className="relative rounded-[34px] border border-white/[0.08] overflow-hidden card-shadow"
          style={{ backgroundColor: '#121A2B' }}
        >
          {/* NEW badge */}
          <div 
            ref={newBadgeRef}
            className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-gradient-accent text-white text-xs font-accent font-bold flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            NEW
          </div>

          {/* Chat header */}
          <div className="px-6 py-4 border-b border-white/[0.08] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-edu-text font-semibold">EduBuddy Community</h3>
              <p className="text-edu-muted text-sm">1,234 students online</p>
            </div>
          </div>

          {/* Chat messages */}
          <div ref={messagesRef} className="p-6 space-y-4">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`chat-message flex gap-3 ${msg.isUser ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm ${msg.color} text-edu-text`}>
                  {msg.avatar}
                </div>

                {/* Message bubble */}
                <div className={`max-w-[75%] ${msg.isUser ? 'items-start' : 'items-end'} flex flex-col`}>
                  <span className="text-edu-muted text-xs mb-1">{msg.user}</span>
                  <div 
                    className={`px-4 py-3 rounded-2xl ${
                      msg.isUser 
                        ? 'bg-white/10 text-edu-text rounded-tl-sm' 
                        : 'bg-gradient-accent text-white rounded-tr-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    {msg.hasAttachment && (
                      <div className="mt-2 flex items-center gap-2 text-xs opacity-80">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>video_lesson.mp4</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat input */}
          <div className="px-6 py-4 border-t border-white/[0.08]">
            <div className="flex gap-3">
              <div className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/[0.08] text-edu-muted text-sm">
                Type your question...
              </div>
              <Button className="bg-gradient-accent hover:opacity-90 rounded-xl px-6">
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button 
            size="lg"
            onClick={() => navigate('/community')}
            className="bg-white/10 hover:bg-white/15 text-edu-text border border-white/20 px-8 py-6 rounded-2xl"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Join the Community
          </Button>
        </div>
      </div>
    </section>
  );
}
