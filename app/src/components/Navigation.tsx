import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const handleStartLearning = () => {
    navigate('/login');
  };

  // Don't show navigation on auth pages
  if (location.pathname !== '/') return null;

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0B0E14]/90 backdrop-blur-xl border-b border-white/[0.08]' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="text-edu-text font-heading font-bold text-xl">EduBuddy</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-edu-muted hover:text-edu-text transition-colors text-sm font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('community')}
                className="text-edu-muted hover:text-edu-text transition-colors text-sm font-medium"
              >
                Community
              </button>
              <button 
                onClick={() => scrollToSection('login')}
                className="text-edu-muted hover:text-edu-text transition-colors text-sm font-medium"
              >
                Login
              </button>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button 
                onClick={handleStartLearning}
                className="bg-gradient-accent text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                Start Learning
              </Button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-edu-text" />
              ) : (
                <Menu className="w-5 h-5 text-edu-text" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0B0E14]/98 backdrop-blur-xl pt-20 md:hidden">
          <div className="flex flex-col items-center gap-6 p-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-edu-text text-lg font-medium"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('community')}
              className="text-edu-text text-lg font-medium"
            >
              Community
            </button>
            <button 
              onClick={() => scrollToSection('login')}
              className="text-edu-text text-lg font-medium"
            >
              Login
            </button>
            <Button 
              onClick={handleStartLearning}
              className="bg-gradient-accent text-white font-semibold px-8 py-3 rounded-xl w-full mt-4"
            >
              Start Learning
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
