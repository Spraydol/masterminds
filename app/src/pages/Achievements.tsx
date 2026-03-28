import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Trophy, Award, Zap, BookOpen, Users, Target,
  ArrowLeft, Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Achievements() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

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

  const achievements = [
    {
      id: 1,
      name: 'First Steps',
      description: 'Complete your first learning session',
      icon: '🚀',
      unlocked: true,
      unlockedDate: '2024-01-15',
      points: 10,
      category: 'Getting Started',
    },
    {
      id: 2,
      name: 'Week Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      unlocked: true,
      unlockedDate: '2024-02-01',
      points: 50,
      category: 'Streaks',
    },
    {
      id: 3,
      name: 'Month Master',
      description: 'Maintain a 30-day learning streak',
      icon: '👑',
      unlocked: true,
      unlockedDate: '2024-02-28',
      points: 200,
      category: 'Streaks',
    },
    {
      id: 4,
      name: 'Century',
      description: 'Reach a 100-day learning streak',
      icon: '💯',
      unlocked: false,
      points: 500,
      category: 'Streaks',
      progress: 45, // 45%
    },
    {
      id: 5,
      name: 'Document Collector',
      description: 'Download 10 documents',
      icon: '📚',
      unlocked: true,
      unlockedDate: '2024-01-20',
      points: 30,
      category: 'Learning',
    },
    {
      id: 6,
      name: 'Library Master',
      description: 'Download 50 documents',
      icon: '📖',
      unlocked: false,
      points: 150,
      category: 'Learning',
      progress: 60,
    },
    {
      id: 7,
      name: 'Community Helper',
      description: 'Get 5 of your answers marked as helpful',
      icon: '🤝',
      unlocked: true,
      unlockedDate: '2024-01-25',
      points: 40,
      category: 'Community',
    },
    {
      id: 8,
      name: 'Chat Expert',
      description: 'Have 50 conversations with AI assistant',
      icon: '🤖',
      unlocked: false,
      points: 100,
      category: 'AI',
      progress: 35,
    },
    {
      id: 9,
      name: 'Perfect Score',
      description: 'Get assigned 5 perfect community answers',
      icon: '✨',
      unlocked: false,
      points: 200,
      category: 'Community',
      progress: 20,
    },
    {
      id: 10,
      name: 'Speedrunner',
      description: 'Complete 5 learning sessions in one day',
      icon: '⚡',
      unlocked: false,
      points: 75,
      category: 'Learning',
      progress: 40,
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  const categories = ['All', 'Getting Started', 'Streaks', 'Learning', 'Community', 'AI'];

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredAchievements = selectedCategory === 'All' 
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

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
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span className="text-xl font-bold">Achievements</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition"
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
          <h1 className="text-4xl font-bold mb-2">Your Achievements</h1>
          <p className="text-white/60">Unlock badges and earn points by completing challenges</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/[0.03] border border-white/[0.08] p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60 text-sm">Achievements Unlocked</span>
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div className="text-4xl font-bold">{unlockedCount}</div>
            <p className="text-white/40 text-sm mt-2">of {achievements.length} total</p>
          </Card>

          <Card className="bg-white/[0.03] border border-white/[0.08] p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60 text-sm">Total Points</span>
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-4xl font-bold">{totalPoints}</div>
            <p className="text-white/40 text-sm mt-2">points earned</p>
          </Card>

          <Card className="bg-white/[0.03] border border-white/[0.08] p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60 text-sm">Completion</span>
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-4xl font-bold">{Math.round((unlockedCount / achievements.length) * 100)}%</div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
              <div
                className="bg-gradient-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
              />
            </div>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-gradient-accent text-white'
                  : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.1]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map(achievement => (
            <Card
              key={achievement.id}
              className={`p-6 border transition ${
                achievement.unlocked
                  ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.05]'
                  : 'bg-white/[0.02] border-white/[0.05] opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">{achievement.icon}</div>
                {!achievement.unlocked && (
                  <Lock className="w-5 h-5 text-white/40" />
                )}
              </div>

              <h3 className="font-semibold text-lg mb-2">{achievement.name}</h3>
              <p className="text-white/60 text-sm mb-4">{achievement.description}</p>

              {achievement.unlocked ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">Unlocked</span>
                    <span className="text-sm font-semibold text-yellow-400">+{achievement.points} pts</span>
                  </div>
                  <p className="text-xs text-white/30">{achievement.unlockedDate}</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/40">Progress</span>
                    <span className="text-sm font-semibold text-blue-400">{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-gradient-accent h-1 rounded-full transition-all duration-300"
                      style={{ width: `${achievement.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
