import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, ArrowLeft, FileText, CheckCircle, AlertCircle, 
  Loader2, X, Star, BookOpen, FileDigit, Video, Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { documentAPI } from '@/services/api';

const sectors = [
  { value: 'web-design', label: 'Web Design' },
  { value: 'informatique-decisionnel-ia', label: 'Informatique Décisionnel et IA' },
  { value: 'genie-informatique', label: 'Génie Informatique' },
];

const years = [
  { value: '1ere-annee', label: '1ère année' },
  { value: '2eme-annee', label: '2ème année' },
];

const docTypes = [
  { value: 'cours', label: 'Cours', icon: BookOpen, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
  { value: 'td', label: 'TD (Travaux Dirigés)', icon: FileDigit, color: 'text-violet-400', bgColor: 'bg-violet-500/20' },
  { value: 'tp', label: 'TP (Travaux Pratiques)', icon: Video, color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' },
  { value: 'examens', label: 'Examens', icon: Trophy, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
];

export default function UploadPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sector, setSector] = useState('');
  const [year, setYear] = useState('');
  const [docType, setDocType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem('edubuddy_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    if (!sector) {
      setError('Please select a sector');
      return;
    }
    if (!year) {
      setError('Please select a year');
      return;
    }
    if (!docType) {
      setError('Please select a document type');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', user.id);
    formData.append('sector', sector);
    formData.append('year', year);
    formData.append('doc_type', docType);

    try {
      const response = await documentAPI.upload(formData);
      if (response.data.success) {
        setSuccess(true);
        setPointsEarned(response.data.document.points_earned);
        
        // Update user in localStorage
        const updatedUser = { ...user, points: response.data.document.total_points };
        localStorage.setItem('edubuddy_user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        // Reset form
        setFile(null);
        setSector('');
        setYear('');
        setDocType('');
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError('');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0B0E14' }}>
      {/* Header */}
      <nav className="border-b border-white/[0.08]" style={{ backgroundColor: '#0B0E14' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-edu-muted hover:text-edu-text transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-edu-text font-semibold">{user.points || 0} points</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {success ? (
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-edu-text mb-4">
              Upload Successful!
            </h1>
            <p className="text-edu-muted mb-6">
              Thank you for contributing to the community!
            </p>
            
            <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 mb-8">
              <div className="flex items-center justify-center gap-3">
                <Star className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-3xl font-bold text-yellow-400">+{pointsEarned}</p>
                  <p className="text-edu-muted text-sm">points earned!</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => {
                  setSuccess(false);
                  setPointsEarned(0);
                }}
                variant="outline"
                className="border-white/20 text-edu-text"
              >
                Upload Another
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-accent text-white"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl font-bold text-edu-text mb-2">
                Upload a Resource
              </h1>
              <p className="text-edu-muted">
                Share your notes, exercises, or exams with the community
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-edu-text mb-2">
                  Document
                </label>
                {!file ? (
                  <label className="flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed border-white/[0.15] bg-white/[0.02] hover:bg-white/[0.05] hover:border-edu-blue/50 transition-all cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="w-14 h-14 rounded-2xl bg-edu-blue/10 flex items-center justify-center mb-4">
                        <Upload className="w-7 h-7 text-edu-blue" />
                      </div>
                      <p className="text-edu-text font-semibold mb-1">Click to upload</p>
                      <p className="text-edu-muted text-sm">PDF, DOC, DOCX, or images</p>
                      <p className="text-edu-muted text-xs mt-2">Max 50MB</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-edu-text font-semibold truncate">{file.name}</p>
                      <p className="text-edu-muted text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button 
                      type="button"
                      onClick={clearFile}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                    >
                      <X className="w-4 h-4 text-edu-muted hover:text-red-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-edu-text mb-2">
                  Document Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {docTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setDocType(type.value)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                        docType === type.value
                          ? 'border-edu-blue bg-edu-blue/10'
                          : 'border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl ${type.bgColor} flex items-center justify-center`}>
                        <type.icon className={`w-5 h-5 ${type.color}`} />
                      </div>
                      <span className="text-edu-text text-sm font-medium text-left">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sector */}
              <div>
                <label className="block text-sm font-medium text-edu-text mb-2">
                  Sector
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/[0.08] text-edu-text outline-none focus:border-edu-blue/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#121A2B]">Select your sector</option>
                  {sectors.map((s) => (
                    <option key={s.value} value={s.value} className="bg-[#121A2B]">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-edu-text mb-2">
                  Academic Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/[0.08] text-edu-text outline-none focus:border-edu-blue/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#121A2B]">Select your year</option>
                  {years.map((y) => (
                    <option key={y.value} value={y.value} className="bg-[#121A2B]">
                      {y.label}
                    </option>
                  ))}
                </select>
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
                disabled={loading || !file || !sector || !year || !docType}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Document
                  </>
                )}
              </Button>

              {/* Points info */}
              <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-edu-text font-semibold">Earn 100 points per upload!</p>
                    <p className="text-edu-muted text-sm">Contribute to the community and climb the leaderboard</p>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
