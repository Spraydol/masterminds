import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

// Landing Page Sections
import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import SmartFeatures from './sections/SmartFeatures';
import WhyEduBuddy from './sections/WhyEduBuddy';
import CommunityChat from './sections/CommunityChat';
import LoginExperience from './sections/LoginExperience';
import AllInOne from './sections/AllInOne';
import Testimonials from './sections/Testimonials';
import Gamification from './sections/Gamification';
import AIAssistant from './sections/AIAssistant';
import FinalCTA from './sections/FinalCTA';

// Auth & App Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Community from './pages/Community';
import Chat from './pages/Chat';
import Streaks from './pages/Streaks';
import Achievements from './pages/Achievements';

gsap.registerPlugin(ScrollTrigger);

// Landing Page Component
function LandingPage() {
  useEffect(() => {
    // Wait for all ScrollTriggers to be created
    const timeout = setTimeout(() => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;
            const target = pinnedRanges.reduce((closest, r) =>
              Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#0B0E14' }}>
      <div className="grain-overlay" />
      <Navigation />
      <main className="relative">
        <div className="relative z-10"><Hero /></div>
        <div id="features" className="relative z-20"><SmartFeatures /></div>
        <div className="relative z-30"><WhyEduBuddy /></div>
        <div id="community" className="relative z-40"><CommunityChat /></div>
        <div id="login" className="relative z-50"><LoginExperience /></div>
        <div className="relative z-[60]"><AllInOne /></div>
        <div className="relative z-[70]"><Testimonials /></div>
        <div className="relative z-[80]"><Gamification /></div>
        <div className="relative z-[90]"><AIAssistant /></div>
        <div className="relative z-[100]"><FinalCTA /></div>
      </main>
    </div>
  );
}

// Scroll to top on route change
function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Kill all ScrollTriggers when leaving landing page
    if (location.pathname !== '/') {
      ScrollTrigger.getAll().forEach(st => st.kill());
    }
  }, [location]);
  return null;
}

function App() {
  return (
    <Router basename="/masterminds">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/community" element={<Community />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/streaks" element={<Streaks />} />
        <Route path="/achievements" element={<Achievements />} />
      </Routes>
    </Router>
  );
}

export default App;
