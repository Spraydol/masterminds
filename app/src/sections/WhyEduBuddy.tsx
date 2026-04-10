import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  'Simplified explanations',
  'Real student help',
  'All-in-one platform',
];

export default function WhyEduBuddy() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const checklistRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const content = contentRef.current;
    const heading = headingRef.current;
    const checklist = checklistRef.current;

    if (!section || !image || !content || !heading || !checklist) return;

    const ctx = gsap.context(() => {
      // Image animation
      gsap.fromTo(image,
        { x: '-12vw', scale: 1.06, opacity: 0 },
        {
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Heading animation
      gsap.fromTo(heading,
        { y: 50, rotateX: 18, opacity: 0 },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Checklist items animation
      const items = checklist.querySelectorAll('li');
      gsap.fromTo(items,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: checklist,
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
      className="relative w-full min-h-screen overflow-hidden"
      style={{ backgroundColor: '#121A2B' }}
    >
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left: Image */}
        <div 
          ref={imageRef}
          className="w-full lg:w-[52%] h-[50vh] lg:h-auto relative"
        >
          <img 
            src="/why_student.jpg" 
            alt="Student smiling while studying"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#121A2B] lg:hidden" />
          {/* Gradient overlay for desktop */}
          <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#121A2B]" />
        </div>

        {/* Right: Content */}
        <div 
          ref={contentRef}
          className="w-full lg:w-[48%] flex flex-col justify-center px-6 sm:px-10 lg:px-[6vw] py-16 lg:py-0"
        >
          <h2 
            ref={headingRef}
            className="font-heading text-[clamp(28px,3.6vw,48px)] font-bold text-edu-text leading-tight mb-6"
          >
            Not just studying—{' '}
            <span className="text-gradient">it's understanding.</span>
          </h2>

          <p className="text-edu-muted text-lg leading-relaxed mb-8">
            We break down hard topics into real explanations, built with students.
          </p>

          <ul ref={checklistRef} className="space-y-4">
            {benefits.map((benefit, index) => (
              <li 
                key={index}
                className="flex items-center gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-edu-text text-lg font-medium">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
