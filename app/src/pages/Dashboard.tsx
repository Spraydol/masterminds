import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, FileText, Video, Upload, MessageSquare, 
  LogOut, Flame, Star, Trophy, Download, User, Settings,
  Search, Filter, Bot, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { documentAPI } from '@/services/api';

const sectors = [
  { value: '', label: 'All Sectors' },
  { value: 'web-design', label: 'Web Design' },
  { value: 'informatique-decisionnel-ia', label: 'Informatique Décisionnel et IA' },
  { value: 'genie-informatique', label: 'Génie Informatique' },
];

const years = [
  { value: '', label: 'All Years' },
  { value: '1ere-annee', label: '1ère année' },
  { value: '2eme-annee', label: '2ème année' },
];

const docTypes = [
  { value: '', label: 'All Types', icon: FileText },
  { value: 'cours', label: 'Cours', icon: BookOpen },
  { value: 'td', label: 'TD', icon: FileText },
  { value: 'tp', label: 'TP', icon: Video },
  { value: 'examens', label: 'Examens', icon: Trophy },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ sector: '', year: '', doc_type: '' });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('edubuddy_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    fetchDocuments();
  }, [navigate]);

  useEffect(() => {
    fetchDocuments();
  }, [filters]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const fetchDocuments = async () => {
    try {
      const response = await documentAPI.getDocuments(filters);
      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('edubuddy_user');
    navigate('/');
    setIsDropdownOpen(false);
  };

  const filteredDocuments = documents.filter(doc =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDocTypeIcon = (type: string) => {
    const docType = docTypes.find(dt => dt.value === type);
    const Icon = docType?.icon || FileText;
    return <Icon className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0B0E14' }}>
      {/* Navigation */}
      <nav className="border-b border-white/[0.08] sticky top-0 z-50" style={{ backgroundColor: '#0B0E14' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="text-edu-text font-heading font-bold text-xl">EduBuddy</span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <button className="px-4 py-2 rounded-xl bg-white/10 text-edu-text text-sm font-medium">
                Resources
              </button>
              <button 
                onClick={() => navigate('/community')}
                className="px-4 py-2 rounded-xl text-edu-muted hover:text-edu-text hover:bg-white/5 text-sm font-medium transition-colors"
              >
                Community
              </button>
              <button 
                onClick={() => navigate('/chat')}
                className="px-4 py-2 rounded-xl text-edu-muted hover:text-edu-text hover:bg-white/5 text-sm font-medium transition-colors"
              >
                AI Assistant
              </button>
            </div>

            {/* User & Actions */}
            <div className="flex items-center gap-4">
              {/* User Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-white/5 px-3 py-2 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-accent flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-edu-muted transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/[0.08] bg-[#0B0E14] shadow-xl overflow-hidden z-50">
                    {/* User Info Header */}
                    <div className="p-4 border-b border-white/[0.08]">
                      <p className="text-edu-text font-semibold">{user.name}</p>
                      <p className="text-edu-muted text-sm">{user.email}</p>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <button 
                        onClick={() => {
                          navigate('/profile');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-edu-muted hover:text-edu-text hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile Settings
                      </button>
                      <button 
                        onClick={() => {
                          navigate('/settings');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-edu-muted hover:text-edu-text hover:bg-white/5 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button 
                        onClick={() => {
                          navigate('/streaks');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-edu-muted hover:text-edu-text hover:bg-white/5 transition-colors"
                      >
                        <Flame className="w-4 h-4" />
                        My Streaks
                      </button>
                      <button 
                        onClick={() => {
                          navigate('/achievements');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-edu-muted hover:text-edu-text hover:bg-white/5 transition-colors"
                      >
                        <Trophy className="w-4 h-4" />
                        Achievements
                      </button>
                      <div className="flex items-center gap-3 px-4 py-2.5 text-sm">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold">{user.points || 0} Points</span>
                      </div>
                    </div>

                    {/* Logout */}
                    <div className="py-2 border-t border-white/[0.08]">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-edu-text mb-2">
            Welcome back, <span className="text-gradient">{user.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-edu-muted">
            Access all your study resources in one place
          </p>
        </div>

        {/* Quick Actions - Centered Grid with 3 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/upload')}
            className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-edu-text font-semibold">Upload</p>
            <p className="text-edu-muted text-sm">Share resources</p>
          </button>

          <button 
            onClick={() => navigate('/community')}
            className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-edu-text font-semibold">Community</p>
            <p className="text-edu-muted text-sm">Ask & help</p>
          </button>

          <button 
            onClick={() => navigate('/chat')}
            className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6 text-violet-400" />
            </div>
            <p className="text-edu-text font-semibold">AI Assistant</p>
            <p className="text-edu-muted text-sm">Get help 24/7</p>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-edu-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/[0.08] text-edu-text placeholder:text-edu-muted/50 outline-none focus:border-edu-blue/50 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-edu-muted" />
              <select
                value={filters.sector}
                onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
                className="pl-10 pr-8 py-3 rounded-2xl bg-white/5 border border-white/[0.08] text-edu-text text-sm outline-none focus:border-edu-blue/50 transition-colors appearance-none cursor-pointer"
              >
                {sectors.map(s => (
                  <option key={s.value} value={s.value} className="bg-[#121A2B]">{s.label}</option>
                ))}
              </select>
            </div>

            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="px-4 py-3 rounded-2xl bg-white/5 border border-white/[0.08] text-edu-text text-sm outline-none focus:border-edu-blue/50 transition-colors appearance-none cursor-pointer"
            >
              {years.map(y => (
                <option key={y.value} value={y.value} className="bg-[#121A2B]">{y.label}</option>
              ))}
            </select>

            <select
              value={filters.doc_type}
              onChange={(e) => setFilters({ ...filters, doc_type: e.target.value })}
              className="px-4 py-3 rounded-2xl bg-white/5 border border-white/[0.08] text-edu-text text-sm outline-none focus:border-edu-blue/50 transition-colors appearance-none cursor-pointer"
            >
              {docTypes.map(dt => (
                <option key={dt.value} value={dt.value} className="bg-[#121A2B]">{dt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-edu-blue border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-edu-muted" />
              </div>
              <p className="text-edu-text font-semibold mb-2">No documents found</p>
              <p className="text-edu-muted text-sm mb-4">Be the first to upload a resource!</p>
              <Button 
                onClick={() => navigate('/upload')}
                className="bg-gradient-accent text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </div>
          ) : (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-edu-blue/20 to-edu-violet/20 flex items-center justify-center flex-shrink-0">
                  {getDocTypeIcon(doc.doc_type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-edu-text font-semibold truncate">{doc.filename}</p>
                  <div className="flex items-center gap-3 text-sm text-edu-muted">
                    <span className="capitalize">{doc.doc_type}</span>
                    <span>•</span>
                    <span>{doc.sector.replace(/-/g, ' ')}</span>
                    <span>•</span>
                    <span>{doc.year.replace(/-/g, ' ')}</span>
                    <span>•</span>
                    <span>{formatFileSize(doc.file_size)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-edu-muted text-sm hidden sm:block">
                    by {doc.uploader_name}
                  </span>
                  <a
                    href={documentAPI.download(doc.id)}
                    className="w-10 h-10 rounded-xl bg-edu-blue/10 hover:bg-edu-blue/20 flex items-center justify-center transition-colors"
                  >
                    <Download className="w-5 h-5 text-edu-blue" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
