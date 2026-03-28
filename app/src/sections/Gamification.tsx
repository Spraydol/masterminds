import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flame, Trophy, Star, Target, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const badges = [
  { icon: Trophy, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', label: 'First Win' },
  { icon: Star, color: 'text-purple-400', bgColor: 'bg-purple-500/20', label: 'Rising Star' },
  { icon: Target, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', label: 'Goal Crusher' },
];

export default function Gamification() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftContentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const leftContent = leftContentRef.current;
    const stats = statsRef.current;
    const progressCircle = progressRef.current;

    if (!section || !leftContent || !stats) return;

    const ctx = gsap.context(() => {
      // Left content animation
      gsap.fromTo(leftContent,
        { x: '-8vw', opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Stats cards animation
      const statCards = stats.querySelectorAll('.stat-card');
      gsap.fromTo(statCards,
        { x: '10vw', scale: 0.98, opacity: 0 },
        {
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stats,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Progress circle animation
      if (progressCircle) {
        const circumference = 2 * Math.PI * 45;
        gsap.fromTo(progressCircle,
          { strokeDashoffset: circumference },
          {
            strokeDashoffset: circumference * 0.35,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: stats,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }
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
              Study more.{' '}
              <span className="text-gradient">Earn more.</span>
            </h2>

            <p className="text-edu-muted text-lg leading-relaxed mb-8">
              Points for progress. Badges for milestones. Streaks for consistency.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30">
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-edu-text font-semibold">5-day streak</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-edu-text font-semibold">Level 12</span>
              </div>
            </div>
          </div>

          {/* Right: Stats cards */}
          <div ref={statsRef} className="w-full lg:w-1/2 space-y-4">
            {/* Points card */}
            <div className="stat-card p-6 rounded-[28px] border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
              <div className="flex items-center gap-6">
                {/* Circular progress */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                    />
                    <circle
                      ref={progressRef}
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 45}
                      strokeDashoffset={2 * Math.PI * 45}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2E5CFF" />
                        <stop offset="100%" stopColor="#A259FF" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-edu-text font-heading">65%</span>
                  </div>
                </div>

                <div>
                  <p className="text-3xl font-bold text-edu-text font-heading mb-1">1,250</p>
                  <p className="text-edu-muted">points earned</p>
                  <p className="text-sm text-edu-blue mt-1">+150 this week</p>
                </div>
              </div>
            </div>

            {/* Badges card */}
            <div className="stat-card p-6 rounded-[28px] border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
              <p className="text-edu-muted text-sm mb-4">Badges unlocked</p>
              <div className="flex gap-4">
                {badges.map((badge, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div className={`w-14 h-14 rounded-2xl ${badge.bgColor} border border-white/10 flex items-center justify-center`}>
                      <badge.icon className={`w-7 h-7 ${badge.color}`} />
                    </div>
                    <span className="text-xs text-edu-muted">{badge.label}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 border-dashed flex items-center justify-center">
                    <span className="text-edu-muted text-lg">+5</span>
                  </div>
                  <span className="text-xs text-edu-muted">more</span>
                </div>
              </div>
            </div>

            {/* Streak card */}
            <div className="stat-card p-6 rounded-[28px] border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                    <Flame className="w-7 h-7 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-edu-text font-heading">5-day streak</p>
                    <p className="text-edu-muted text-sm">Keep it up!</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((day) => (
                    <div 
                      key={day}
                      className={`w-3 h-8 rounded-full ${
                        day <= 5 ? 'bg-gradient-to-t from-orange-500 to-yellow-400' : 'bg-white/10'
                      }`}
                    />
                  ))}
                  <div className="w-3 h-8 rounded-full bg-white/10" />
                  <div className="w-3 h-8 rounded-full bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
