import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/i18n/translations';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  
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

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

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
                {t.nav.features}
              </button>
              <button 
                onClick={() => scrollToSection('community')}
                className="text-edu-muted hover:text-edu-text transition-colors text-sm font-medium"
              >
                {t.nav.community}
              </button>
              <button 
                onClick={() => scrollToSection('login')}
                className="text-edu-muted hover:text-edu-text transition-colors text-sm font-medium"
              >
                {t.nav.login}
              </button>
            </div>

            {/* Language Selector & CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Globe className="w-4 h-4 text-edu-muted" />
                  <span className="text-sm font-medium text-edu-text">
                    {languages.find(l => l.code === language)?.flag}
                  </span>
                </button>
                
                {showLangMenu && (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[#121A2B] border border-white/10 shadow-xl overflow-hidden z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-white/5 transition-colors ${
                          language === lang.code ? 'bg-white/10 text-edu-text' : 'text-edu-muted'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                onClick={handleStartLearning}
                className="bg-gradient-accent text-white font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                {t.nav.startLearning}
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
        <div className={`fixed inset-0 z-40 bg-[#0B0E14]/98 backdrop-blur-xl pt-20 md:hidden`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="flex flex-col items-center gap-6 p-8">
            {/* Language Selector for Mobile */}
            <div className="flex gap-2 mb-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    language === lang.code
                      ? 'bg-gradient-accent text-white'
                      : 'bg-white/5 text-edu-muted hover:bg-white/10'
                  }`}
                >
                  {lang.flag} {lang.label}
                </button>
              ))}
            </div>

            <button 
              onClick={() => scrollToSection('features')}
              className="text-edu-text text-lg font-medium"
            >
              {t.nav.features}
            </button>
            <button 
              onClick={() => scrollToSection('community')}
              className="text-edu-text text-lg font-medium"
            >
              {t.nav.community}
            </button>
            <button 
              onClick={() => scrollToSection('login')}
              className="text-edu-text text-lg font-medium"
            >
              {t.nav.login}
            </button>
            <Button 
              onClick={handleStartLearning}
              className="bg-gradient-accent text-white font-semibold px-8 py-3 rounded-xl w-full mt-4"
            >
              {t.nav.startLearning}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
