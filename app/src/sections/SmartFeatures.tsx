import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, FileText, Video, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: BookOpen,
    title: 'Courses',
    description: 'Organized, simple, easy to follow.',
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
  },
  {
    icon: FileText,
    title: 'Exams',
    description: 'Past exams + corrections.',
    color: 'from-violet-500/20 to-purple-500/20',
    borderColor: 'border-violet-500/30',
    iconColor: 'text-violet-400',
  },
  {
    icon: Video,
    title: 'Videos',
    description: 'Motivation + lessons.',
    color: 'from-pink-500/20 to-rose-500/20',
    borderColor: 'border-pink-500/30',
    iconColor: 'text-pink-400',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Ask & help real students.',
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    iconColor: 'text-emerald-400',
  },
];

export default function SmartFeatures() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current;

    if (!section || !heading || !cards) return;

    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(heading,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Cards animation with stagger
      const cardElements = cards.querySelectorAll('.feature-card');
      gsap.fromTo(cardElements,
        { y: 80, scale: 0.96, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cards,
            start: 'top 70%',
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

      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 
          ref={headingRef}
          className="font-heading text-[clamp(28px,3.6vw,48px)] font-bold text-edu-text text-center mb-16"
        >
          Everything you need to{' '}
          <span className="text-gradient">study smarter</span>
        </h2>

        {/* Feature cards grid */}
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6"
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group relative p-7 lg:p-8 rounded-[30px] border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-white/[0.15] cursor-pointer"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 rounded-[30px] bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} ${feature.borderColor} border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="font-heading text-xl font-bold text-edu-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-edu-muted text-base leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
