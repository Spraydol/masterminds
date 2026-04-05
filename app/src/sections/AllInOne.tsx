import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function AllInOne() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const headline = headlineRef.current;
    const subhead = subheadRef.current;
    const cta = ctaRef.current;

    if (!section || !card || !headline || !subhead || !cta) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=125%',
          pin: true,
          scrub: 0.6,
        }
      });

      // ENTRANCE (0-30%)
      scrollTl
        .fromTo(card,
          { y: '110vh', scale: 0.92, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(headline,
          { x: '-18vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.05
        )
        .fromTo(subhead,
          { x: '-10vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.1
        )
        .fromTo(cta,
          { y: 40, scale: 0.96, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, ease: 'none' },
          0.15
        );

      // SETTLE (30-70%) - Hold position

      // EXIT (70-100%)
      scrollTl
        .to(card,
          { y: '-35vh', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .to(headline,
          { x: '-10vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .to(subhead,
          { x: '-8vw', opacity: 0, ease: 'power2.in' },
          0.72
        )
        .to(cta,
          { y: 20, opacity: 0, ease: 'power2.in' },
          0.75
        );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden z-20"
      style={{ backgroundColor: '#0B0E14' }}
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-30" />

      {/* Large media card */}
      <div 
        ref={cardRef}
        className="relative w-[min(90vw,1280px)] h-[min(62vh,580px)] rounded-[34px] overflow-hidden card-shadow"
      >
        {/* Background image */}
        <img 
          src="/masterminds/platform_student.jpg" 
          alt="Student working"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E14]/95 via-[#0B0E14]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14]/80 via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute left-[5%] bottom-[10%] max-w-[min(42vw,520px)]">
          <h2 
            ref={headlineRef}
            className="font-heading text-[clamp(28px,4vw,56px)] font-bold text-edu-text leading-tight mb-4"
          >
            All your study tools.{' '}
            <span className="text-gradient">One place.</span>
          </h2>
          
          <p 
            ref={subheadRef}
            className="text-edu-muted text-lg lg:text-xl leading-relaxed mb-6"
          >
            Courses, videos, exams, and a community that actually answers.
          </p>

          <div ref={ctaRef}>
            <Button 
              size="lg"
              className="bg-gradient-accent text-white font-semibold px-8 py-6 rounded-2xl hover:opacity-90 transition-opacity shadow-glow-blue"
            >
              Join EduBuddy
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
