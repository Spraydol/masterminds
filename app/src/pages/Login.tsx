import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, GraduationCap, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { authAPI } from '@/services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devCode, setDevCode] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Check if already logged in
    const user = localStorage.getItem('edubuddy_user');
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.name) {
        navigate('/dashboard');
      } else {
        navigate('/signup');
      }
    }
  }, [navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const isEduEmail = (email: string) => {
    const eduDomains = ['.edu', '.ac.', '.edu.', 'student.', 'school.', 'college.', 'university.'];
    return eduDomains.some(domain => email.toLowerCase().includes(domain));
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!isEduEmail(email)) {
      setError('Please use a valid .edu or academic email address');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.sendCode(email);
      if (response.data.success) {
        setStep('code');
        setCountdown(60);
        if (response.data.dev_code) {
          setDevCode(response.data.dev_code);
        }
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code || code.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyCode(email, code);
      if (response.data.success) {
        localStorage.setItem('edubuddy_user', JSON.stringify(response.data.user));
        
        if (response.data.is_new_user) {
          navigate('/signup');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    try {
      const response = await authAPI.sendCode(email);
      if (response.data.success) {
        setCountdown(60);
        if (response.data.dev_code) {
          setDevCode(response.data.dev_code);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0B0E14' }}>
      {/* Background effects */}
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-edu-blue/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-edu-violet/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-accent flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <span className="text-edu-text font-heading font-bold text-2xl">EduBuddy</span>
        </div>

        {/* Card */}
        <div className="rounded-[32px] border border-white/[0.08] p-8 card-shadow" style={{ backgroundColor: '#121A2B' }}>
          {step === 'email' ? (
            <>
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl font-bold text-edu-text mb-2">
                  Welcome back!
                </h1>
                <p className="text-edu-muted">
                  Sign in with your academic email
                </p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-edu-text mb-2">
                    Academic Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-edu-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@university.edu"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/[0.08] text-edu-text placeholder:text-edu-muted/50 outline-none focus:border-edu-blue/50 transition-colors"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-edu-muted mt-2">
                    Must be a .edu or academic email address
                  </p>
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
                      Continue
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h1 className="font-heading text-2xl font-bold text-edu-text mb-2">
                  Check your email
                </h1>
                <p className="text-edu-muted">
                  We sent a code to <span className="text-edu-text">{email}</span>
                </p>
              </div>

              {/* Dev code display (for development) */}
              {devCode && (
                <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-yellow-400 text-sm text-center">
                    <strong>Development Mode</strong><br />
                    Your code: <span className="text-xl font-bold">{devCode}</span>
                  </p>
                </div>
              )}

              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-edu-text mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/[0.08] text-edu-text text-center text-2xl tracking-[0.5em] placeholder:text-edu-muted/30 outline-none focus:border-edu-blue/50 transition-colors"
                    disabled={loading}
                    maxLength={6}
                  />
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
                  disabled={loading || code.length !== 6}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Verify
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={countdown > 0 || loading}
                    className="text-sm text-edu-blue hover:text-edu-violet transition-colors disabled:opacity-50"
                  >
                    {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-sm text-edu-muted hover:text-edu-text transition-colors"
                  >
                    Use a different email
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-edu-muted hover:text-edu-text transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
