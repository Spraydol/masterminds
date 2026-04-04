import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Flame, Calendar, Target, TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Streaks() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [streakData, setStreakData] = useState({
    currentStreak: 12,
    longestStreak: 45,
    totalDaysActive: 89,
    thisWeek: 6,
    thisMonth: 24,
  });

  useEffect(() => {
    const userData = localStorage.getItem('edubuddy_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('edubuddy_user');
    navigate('/');
  };
  
  const refreshStreakData = () => {
    // Simulate fetching updated streak data
      const updatedData = {
        currentStreak: streakData.currentStreak + (Math.random() > 0.7 ? 1 : 0),
        longestStreak: Math.max(streakData.longestStreak, streakData.currentStreak),
        totalDaysActive: streakData.totalDaysActive + (Math.random() > 0.5 ? 1 : 0),
        thisWeek: Math.min(7, streakData.thisWeek + (Math.random() > 0.8 ? 1 : 0)),
        thisMonth: Math.min(30, streakData.thisMonth + (Math.random() > 0.9 ? 1 : 0)),
      };
      setStreakData(updatedData);
  };

  // Generate calendar data for the last 12 weeks
  const generateCalendarData = () => {
    const weeks = [];
    const today = new Date();
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      weeks.push({
        date,
        active: Math.random() > 0.3, // 70% chance of activity
        intensity: Math.floor(Math.random() * 4), // 0-3 intensity
      });
    }
    return weeks;
  };

  const calendarDays = generateCalendarData();

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-700';
    if (intensity === 1) return 'bg-blue-900';
    if (intensity === 2) return 'bg-blue-600';
    return 'bg-blue-400';
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#0B0E14]/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-white/[0.05] rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-400" />
                <span className="text-xl font-bold">Streaks</span>
              </div>
            </div>
            <div className="ml-4 flex items-center gap-2 text-sm text-white/60 border-l border-white/20 pl-4">
              <span>{user?.name || 'Student'}</span>
            </div>
            <button
              onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold">Your Learning Streaks</h1>
            <Button
               onClick={refreshStreakData}
               variant="outline"
               size="sm"
               className="border-white/[0.2] hover:bg-white/[0.1] text-sm"
            >
               🔄 Refresh
             </Button>
           </div>
           <p className="text-white/60">Keep your momentum going and maintain your learning streaks</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {/* Current Streak */}
          <Card className="bg-white/[0.03] border border-white/[0.08] p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60 text-sm">Current Streak</span>
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div className="text-3xl font-bold mb-2">{streakData.currentStreak}</div>
            <p className="text-white/40 text-sm">days</p>
          </Card>

          {/* Longest Streak */}
          <Card className="bg-white/[0.03] border border-white/[0.08] p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60 text-sm">Longest Streak</span>
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold mb-2">{streakData.longestStreak}</div>
            <p className="text-white/40 text-sm">days</p>
          </Card>

          {/* Total Days Active */}
          <Card className="bg-white/[0.03] border border-white/[0.08] p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60 text-sm">Total Days Active</span>
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-bold mb-2">{streakData.totalDaysActive}</div>
            <p className="text-white/40 text-sm">days</p>
          </Card>

          {/* This Week */}
          <Card className="bg-white/[0.03] border border-white/[0.08] p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60 text-sm">This Week</span>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-bold mb-2">{streakData.thisWeek}</div>
            <p className="text-white/40 text-sm">days active</p>
          </Card>

          {/* This Month */}
          <Card className="bg-white/[0.03] border border-white/[0.08] p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60 text-sm">This Month</span>
              <Calendar className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-3xl font-bold mb-2">{streakData.thisMonth}</div>
            <p className="text-white/40 text-sm">days active</p>
          </Card>
        </div>

        {/* Activity Calendar */}
        <Card className="bg-white/[0.03] border border-white/[0.08] p-8">
          <h2 className="text-2xl font-bold mb-6">Your Activity Calendar</h2>
          
          <div className="overflow-x-auto">
            <div className="flex gap-1 pb-4">
              {calendarDays.map((day, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-sm cursor-pointer transition hover:scale-150 ${
                    day.active ? getIntensityColor(day.intensity) : 'bg-gray-800'
                  }`}
                  title={`${day.date.toLocaleDateString()}: ${day.active ? 'Active' : 'Inactive'}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4 text-sm text-white/60">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-gray-800 rounded-sm" />
              <div className="w-3 h-3 bg-blue-900 rounded-sm" />
              <div className="w-3 h-3 bg-blue-600 rounded-sm" />
              <div className="w-3 h-3 bg-blue-400 rounded-sm" />
            </div>
            <span>More</span>
          </div>
        </Card>

        {/* Tips */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-orange-900/20 to-orange-900/5 border border-orange-500/20 p-6">
            <div className="flex gap-4">
              <Flame className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Keep It Going</h3>
                <p className="text-white/60 text-sm">
                  You're on a {streakData.currentStreak} day streak! Visit every day to maintain your momentum.
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/20 to-purple-900/5 border border-purple-500/20 p-6">
            <div className="flex gap-4">
              <Target className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Challenge Goal</h3>
                <p className="text-white/60 text-sm">
                  {streakData.currentStreak < 30
                    ? `Only ${30 - streakData.currentStreak} more days to reach 30-day streak!`
                    : 'Awesome! You\'ve reached 30+ days. Keep pushing for 100!'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
