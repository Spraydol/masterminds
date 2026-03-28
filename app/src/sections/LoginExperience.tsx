import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, KeyRound, ShieldCheck, PartyPopper, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { icon: Mail, label: 'Enter academic email', color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  { icon: KeyRound, label: 'Code sent', color: 'text-violet-400', bgColor: 'bg-violet-500/20' },
  { icon: ShieldCheck, label: 'Verify', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  { icon: PartyPopper, label: 'Welcome', color: 'text-pink-400', bgColor: 'bg-pink-500/20' },
];

export default function LoginExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const leftContent = leftContentRef.current;
    const phone = phoneRef.current;
    const stepsContainer = stepsRef.current;

    if (!section || !leftContent || !phone || !stepsContainer) return;

    const ctx = gsap.context(() => {
      // Left content animation
      gsap.fromTo(leftContent,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Phone animation
      gsap.fromTo(phone,
        { x: '18vw', rotateY: -18, opacity: 0 },
        {
          x: 0,
          rotateY: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Steps animation
      const stepElements = stepsContainer.querySelectorAll('.step-pill');
      gsap.fromTo(stepElements,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stepsContainer,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Step progression animation based on scroll
      ScrollTrigger.create({
        trigger: section,
        start: 'top 40%',
        end: 'bottom 60%',
        onUpdate: (self) => {
          const progress = self.progress;
          const newStep = Math.min(Math.floor(progress * 4), 3);
          setActiveStep(newStep);
        }
      });
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

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Content */}
          <div ref={leftContentRef} className="w-full lg:w-1/2">
            <h2 className="font-heading text-[clamp(28px,3.6vw,48px)] font-bold text-edu-text leading-tight mb-6">
              Get started in{' '}
              <span className="text-gradient">seconds</span>
            </h2>

            <p className="text-edu-muted text-lg leading-relaxed mb-8">
              One email. One code. No passwords to forget.
            </p>

            <div className="space-y-4">
              {['Enter academic email', 'Get your code', 'Verify and go'].map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index <= activeStep ? 'bg-gradient-accent text-white' : 'bg-white/10 text-edu-muted'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`text-lg ${index <= activeStep ? 'text-edu-text' : 'text-edu-muted'}`}>
                    {step}
                  </span>
                  {index < 2 && (
                    <ChevronRight className="w-5 h-5 text-edu-muted ml-auto" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Phone mock + steps */}
          <div className="w-full lg:w-1/2 flex flex-col sm:flex-row items-center gap-8">
            {/* Phone mock */}
            <div 
              ref={phoneRef}
              className="relative w-[280px] h-[560px] rounded-[40px] p-2 border border-white/[0.15]"
              style={{ backgroundColor: '#1a1f2e' }}
            >
              {/* Screen */}
              <div className="w-full h-full rounded-[32px] overflow-hidden" style={{ backgroundColor: '#0B0E14' }}>
                {/* Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black" />
                
                {/* Screen content */}
                <div className="pt-16 px-6">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-accent mx-auto mb-4 flex items-center justify-center">
                      {activeStep === 3 ? (
                        <PartyPopper className="w-8 h-8 text-white" />
                      ) : (
                        (() => {
                          const IconComponent = steps[activeStep].icon;
                          return <IconComponent className="w-8 h-8 text-white" />;
                        })()
                      )}
                    </div>
                    <h3 className="text-edu-text font-heading font-bold text-xl mb-2">
                      {activeStep === 3 ? 'Welcome!' : steps[activeStep].label}
                    </h3>
                    <p className="text-edu-muted text-sm">
                      {activeStep === 0 && 'Enter your school email'}
                      {activeStep === 1 && 'Check your inbox'}
                      {activeStep === 2 && 'Enter the 6-digit code'}
                      {activeStep === 3 && 'You\'re all set!'}
                    </p>
                  </div>

                  {/* Input mock */}
                  <div className="space-y-4">
                    {activeStep < 3 && (
                      <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/[0.08] text-edu-muted text-sm">
                        {activeStep === 0 && 'student@school.edu'}
                        {activeStep === 1 && '••••••'}
                        {activeStep === 2 && '3 8 4 9 2 1'}
                      </div>
                    )}
                    <button className="w-full py-3 rounded-xl bg-gradient-accent text-white font-semibold text-sm">
                      {activeStep === 0 && 'Continue'}
                      {activeStep === 1 && 'Resend code'}
                      {activeStep === 2 && 'Verify'}
                      {activeStep === 3 && 'Start Learning'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step pills */}
            <div ref={stepsRef} className="flex sm:flex-col gap-3">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`step-pill flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 ${
                    index === activeStep 
                      ? 'border-white/20 bg-white/5' 
                      : 'border-white/[0.08] bg-transparent opacity-60'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg ${step.bgColor} flex items-center justify-center`}>
                    <step.icon className={`w-4 h-4 ${step.color}`} />
                  </div>
                  <span className="text-edu-text text-sm font-medium whitespace-nowrap">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
