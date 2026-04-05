import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, BookOpen, Brain, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const floatingIconsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const badge = badgeRef.current;
    const headline = headlineRef.current;
    const subhead = subheadRef.current;
    const cta = ctaRef.current;
    const floatingIcons = floatingIconsRef.current;

    if (!section || !card || !badge || !headline || !subhead || !cta || !floatingIcons) return;

    const ctx = gsap.context(() => {
      // Initial load animation
      const loadTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      loadTl
        .fromTo(card, 
          { y: 40, scale: 0.98, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.9 }
        )
        .fromTo(headline,
          { y: 60, rotateX: 25, opacity: 0 },
          { y: 0, rotateX: 0, opacity: 1, duration: 0.7 },
          '-=0.5'
        )
        .fromTo(subhead,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.4'
        )
        .fromTo(badge,
          { scale: 0.6, rotate: -10, opacity: 0 },
          { scale: 1, rotate: 0, opacity: 1, duration: 0.65, ease: 'back.out(1.6)' },
          '-=0.5'
        )
        .fromTo(cta,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          '-=0.3'
        )
        .fromTo(floatingIcons.children,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.8)' },
          '-=0.3'
        );

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set([card, badge, headline, subhead, cta], { 
              clearProps: 'all'
            });
            loadTl.progress(1);
          }
        }
      });

      scrollTl
        .fromTo(card,
          { x: 0, opacity: 1 },
          { x: '-55vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(badge,
          { x: 0, rotate: 0, opacity: 1 },
          { x: '55vw', rotate: 18, opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(headline,
          { y: 0, opacity: 1 },
          { y: '-18vh', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(subhead,
          { y: 0, opacity: 1 },
          { y: '-12vh', opacity: 0, ease: 'power2.in' },
          0.72
        )
        .fromTo(cta,
          { y: 0, opacity: 1 },
          { y: '12vh', opacity: 0, ease: 'power2.in' },
          0.75
        )
        .fromTo(floatingIcons,
          { opacity: 1 },
          { opacity: 0, ease: 'power2.in' },
          0.75
        );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden z-10"
      style={{ backgroundColor: '#0B0E14' }}
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-50" />
      
      {/* Floating icons */}
      <div ref={floatingIconsRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[15%] left-[10%] animate-float" style={{ animationDelay: '0s' }}>
          <div className="w-14 h-14 rounded-2xl bg-edu-blue/10 border border-edu-blue/30 flex items-center justify-center">
            <BookOpen className="w-7 h-7 text-edu-blue" />
          </div>
        </div>
        <div className="absolute top-[25%] right-[12%] animate-float" style={{ animationDelay: '0.5s' }}>
          <div className="w-12 h-12 rounded-2xl bg-edu-violet/10 border border-edu-violet/30 flex items-center justify-center">
            <Brain className="w-6 h-6 text-edu-violet" />
          </div>
        </div>
        <div className="absolute bottom-[20%] left-[8%] animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-edu-muted" />
          </div>
        </div>
      </div>

      {/* Main content card */}
      <div 
        ref={cardRef}
        className="relative w-[min(86vw,1120px)] h-[min(62vh,560px)] rounded-[34px] border border-white/[0.08] overflow-hidden card-shadow"
        style={{ backgroundColor: '#121A2B' }}
      >
        <div className="flex h-full">
          {/* Left: Image */}
          <div className="w-[55%] h-full relative">
            <img 
              src="/masterminds/hero_student.jpg" 
              alt="Student studying"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#121A2B]" />
          </div>

          {/* Right: Content */}
          <div className="w-[45%] h-full flex flex-col justify-center px-8 lg:px-12">
            <h1 
              ref={headlineRef}
              className="font-heading text-[clamp(28px,3vw,48px)] font-extrabold text-edu-text leading-tight mb-4"
            >
              Your Smart Study Partner{' '}
              <span className="text-2xl">🎓</span>
            </h1>
            
            <p 
              ref={subheadRef}
              className="text-edu-muted text-base lg:text-lg leading-relaxed mb-6"
            >
              Edubuddy helps you understand faster, revise smarter, and succeed with confidence.
            </p>

            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 rounded-full bg-edu-blue/10 border border-edu-blue/30 text-edu-blue text-sm font-medium">
                Courses
              </span>
              <span className="px-4 py-2 rounded-full bg-edu-violet/10 border border-edu-violet/30 text-edu-violet text-sm font-medium">
                Exams
              </span>
              <span className="px-4 py-2 rounded-full bg-white/5 border border-white/20 text-edu-text text-sm font-medium">
                Community
              </span>
            </div>
          </div>
        </div>

        {/* Streak badge */}
        <div 
          ref={badgeRef}
          className="absolute right-[2%] top-[5%] w-[140px] h-[140px] rounded-full flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #0B0E14, #121A2B)',
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
            boxShadow: '0 0 0 2px linear-gradient(135deg, #2E5CFF, #A259FF), 0 0 40px rgba(46, 92, 255, 0.35)',
          }}
        >
          <div className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-br from-edu-blue to-edu-violet" style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
          <Flame className="w-10 h-10 text-orange-500 mb-1" />
          <span className="text-2xl font-bold text-edu-text font-heading">3</span>
          <span className="text-xs text-edu-muted text-center px-2">days in a row</span>
        </div>
      </div>

      {/* CTA buttons below card */}
      <div 
        ref={ctaRef}
        className="absolute bottom-[12%] left-1/2 -translate-x-1/2 flex gap-4"
      >
        <Button 
          size="lg"
          onClick={() => navigate('/login')}
          className="bg-gradient-accent text-white font-semibold px-8 py-6 rounded-2xl hover:opacity-90 transition-opacity shadow-glow-blue"
        >
          <RocketIcon className="w-5 h-5 mr-2" />
          Start Learning
        </Button>
        <Button 
          variant="outline"
          size="lg"
          onClick={() => navigate('/community')}
          className="border-white/20 text-edu-text hover:bg-white/5 px-8 py-6 rounded-2xl"
        >
          Join Community
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </section>
  );
}

function RocketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}
