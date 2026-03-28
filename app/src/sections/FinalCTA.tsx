import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const heading = headingRef.current;
    const form = formRef.current;

    if (!section || !card || !heading || !form) return;

    const ctx = gsap.context(() => {
      // Card animation
      gsap.fromTo(card,
        { y: 100, scale: 0.98, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Heading animation
      gsap.fromTo(heading,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Form animation
      gsap.fromTo(form,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: form,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Store email and redirect to login
      localStorage.setItem('edubuddy_pending_email', email);
      navigate('/login');
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="relative w-full py-24 lg:py-32 overflow-hidden"
      style={{ backgroundColor: '#0B0E14' }}
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-30" />

      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-edu-blue/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Gradient CTA card */}
        <div 
          ref={cardRef}
          className="relative rounded-[40px] overflow-hidden p-10 lg:p-16"
          style={{
            background: 'linear-gradient(135deg, #2E5CFF, #A259FF)',
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

          <div className="relative z-10 text-center">
            <h2 
              ref={headingRef}
              className="font-heading text-[clamp(32px,4.5vw,56px)] font-bold text-white leading-tight mb-4"
            >
              Ready to succeed?
            </h2>

            <p className="text-white/80 text-lg lg:text-xl max-w-lg mx-auto mb-10">
              Join thousands of students studying smarter.
            </p>

            {/* Email form */}
            <form 
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Academic email"
                  className="w-full px-5 py-4 rounded-2xl bg-[#0B0E14] text-white placeholder:text-white/50 border border-white/20 outline-none focus:border-white/40 transition-colors"
                />
              </div>
              <Button 
                type="submit"
                size="lg"
                className="bg-white text-edu-blue font-semibold px-8 py-4 rounded-2xl hover:bg-white/90 transition-colors"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>

            <p className="text-white/60 text-sm mt-6">
              Free to start. No spam.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-white/[0.08]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-edu-text font-heading font-bold text-lg">EduBuddy</span>
            </div>

            {/* Links */}
            <nav className="flex gap-8">
              <a href="#" className="text-edu-muted hover:text-edu-text transition-colors text-sm">Features</a>
              <a href="#" className="text-edu-muted hover:text-edu-text transition-colors text-sm">Community</a>
              <a href="#" className="text-edu-muted hover:text-edu-text transition-colors text-sm">Login</a>
              <a href="#" className="text-edu-muted hover:text-edu-text transition-colors text-sm">Privacy</a>
            </nav>

            {/* Copyright */}
            <p className="text-edu-muted text-sm">
              © 2026 EduBuddy. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
