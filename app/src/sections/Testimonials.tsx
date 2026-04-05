import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "I finally understand calculus.",
    author: "The explanations feel like a friend teaching me.",
    image: "/masterminds/testimonial_1.jpg",
    name: "Alex M.",
    role: "Engineering Student",
  },
  {
    quote: "Exams feel less scary now.",
    author: "Past papers + corrections = confidence.",
    image: "/testimonial_2.jpg",
    name: "Maria K.",
    role: "Medical Student",
  },
  {
    quote: "The community helps instantly.",
    author: "I ask at midnight and get answers.",
    image: "/testimonial_3.jpg",
    name: "James L.",
    role: "Computer Science",
  },
];

export default function Testimonials() {
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

      // Cards animation
      const cardElements = cards.querySelectorAll('.testimonial-card');
      gsap.fromTo(cardElements,
        { y: 90, rotateZ: -2, opacity: 0 },
        {
          y: 0,
          rotateZ: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
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
      style={{ backgroundColor: '#121A2B' }}
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-20" />

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <h2 
          ref={headingRef}
          className="font-heading text-[clamp(28px,3.6vw,48px)] font-bold text-edu-text text-center mb-16"
        >
          Students are seeing{' '}
          <span className="text-gradient">real progress</span>
        </h2>

        {/* Testimonial cards */}
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card group relative p-6 lg:p-8 rounded-[32px] border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-white/[0.15]"
            >
              {/* Quote icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center mb-6">
                <Quote className="w-5 h-5 text-white" />
              </div>

              {/* Quote */}
              <p className="font-heading text-xl font-bold text-edu-text mb-3">
                "{testimonial.quote}"
              </p>

              {/* Author comment */}
              <p className="text-edu-muted text-base leading-relaxed mb-6">
                {testimonial.author}
              </p>

              {/* Profile */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-edu-text font-semibold">{testimonial.name}</p>
                  <p className="text-edu-muted text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
