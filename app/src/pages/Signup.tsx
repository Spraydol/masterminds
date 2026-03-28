import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Calendar, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authAPI } from '@/services/api';

const sectors = [
  { value: 'web-design', label: 'Web Design' },
  { value: 'informatique-decisionnel-ia', label: 'Informatique Décisionnel et IA' },
  { value: 'genie-informatique', label: 'Génie Informatique' },
];

const years = [
  { value: '1ere-annee', label: '1ère année' },
  { value: '2eme-annee', label: '2ème année' },
];

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [sector, setSector] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('edubuddy_user');
    if (!user) {
      navigate('/login');
      return;
    }
    
    const parsed = JSON.parse(user);
    if (parsed.name) {
      navigate('/dashboard');
      return;
    }
    
    setUserEmail(parsed.email);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!sector) {
      setError('Please select your sector');
      return;
    }
    if (!year) {
      setError('Please select your year');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.completeProfile({
        email: userEmail,
        name: name.trim(),
        sector,
        year,
      });

      if (response.data.success) {
        localStorage.setItem('edubuddy_user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0B0E14' }}>
      {/* Background effects */}
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-edu-blue/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-edu-violet/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
          <div className="w-16 h-1 bg-gradient-accent rounded-full" />
          <div className="w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center text-white font-bold text-sm">
            2
          </div>
          <div className="w-16 h-1 bg-white/10 rounded-full" />
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-edu-muted font-bold text-sm">
            3
          </div>
        </div>

        {/* Card */}
        <div className="rounded-[32px] border border-white/[0.08] p-8 card-shadow" style={{ backgroundColor: '#121A2B' }}>
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl font-bold text-edu-text mb-2">
              Complete your profile
            </h1>
            <p className="text-edu-muted">
              Tell us a bit about yourself
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-edu-text mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-edu-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/[0.08] text-edu-text placeholder:text-edu-muted/50 outline-none focus:border-edu-blue/50 transition-colors"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Sector */}
            <div>
              <label className="block text-sm font-medium text-edu-text mb-2">
                Sector / Field of Study
              </label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-edu-muted" />
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/[0.08] text-edu-text outline-none focus:border-edu-blue/50 transition-colors appearance-none cursor-pointer"
                  disabled={loading}
                >
                  <option value="" className="bg-[#121A2B]">Select your sector</option>
                  {sectors.map((s) => (
                    <option key={s.value} value={s.value} className="bg-[#121A2B]">
                      {s.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-edu-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-edu-text mb-2">
                Academic Year
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-edu-muted" />
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/[0.08] text-edu-text outline-none focus:border-edu-blue/50 transition-colors appearance-none cursor-pointer"
                  disabled={loading}
                >
                  <option value="" className="bg-[#121A2B]">Select your year</option>
                  {years.map((y) => (
                    <option key={y.value} value={y.value} className="bg-[#121A2B]">
                      {y.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-edu-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-accent text-white font-semibold py-4 rounded-2xl hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Complete Profile
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Points preview */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <span className="text-xl">🎁</span>
              </div>
              <div>
                <p className="text-edu-text font-semibold">Complete your profile</p>
                <p className="text-edu-muted text-sm">Earn <span className="text-yellow-400 font-bold">+50 points</span> bonus!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
