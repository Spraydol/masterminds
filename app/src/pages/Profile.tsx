import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Save, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/services/api';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: null as File | null,
    previewUrl: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('edubuddy_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setFormData({
      name: parsedUser.name || '',
      email: parsedUser.email || '',
      profilePicture: null,
      previewUrl: parsedUser.profile_picture || '',
    });
  }, [navigate]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
        return;
      }
      
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        profilePicture: file,
        previewUrl,
      }));
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Create form data for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', user.id.toString());
      if (formData.name) formDataToSend.append('name', formData.name);
      if (formData.profilePicture) {
        formDataToSend.append('photo', formData.profilePicture);
      }

      // Call API to update profile using API_URL constant
      // DON'T set Content-Type header - browser sets it automatically for FormData
      const response = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        // Update localStorage with new user data - include all fields from result.user
        const updatedUser = { ...user, ...result.user };
        localStorage.setItem('edubuddy_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Clear the preview URL if it was a temporary object URL
        if (formData.previewUrl && formData.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(formData.previewUrl);
        }
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating profile' });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0B0E14' }}>
      {/* Navigation */}
      <nav className="border-b border-white/[0.08] sticky top-0 z-50" style={{ backgroundColor: '#0B0E14' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-edu-muted hover:text-edu-text transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-accent flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="text-edu-text font-heading font-bold text-xl">EduBuddy</span>
            </div>
            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold text-edu-text mb-2">
            Edit Profile
          </h1>
          <p className="text-edu-muted">
            Update your personal information and profile picture
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-2xl ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-accent flex items-center justify-center overflow-hidden border-4 border-white/10">
                {user.photo ? (
                  <img 
                    src={`${API_URL}${user.photo}`} 
                    alt="avatar" 
                    className="w-full h-full object-cover border-4 border-edu-blue/20"
                  />
                ) : formData.previewUrl ? (
                  <img 
                    src={formData.previewUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-4xl">
                    {formData.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleImageClick}
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-edu-blue flex items-center justify-center border-4 border-[#0B0E14] hover:bg-edu-blue/80 transition-colors"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <p className="mt-3 text-sm text-edu-muted">
              Click the camera icon to upload a new photo
            </p>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-edu-text mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-edu-muted" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/[0.08] text-edu-text placeholder:text-edu-muted/50 outline-none focus:border-edu-blue/50 transition-colors"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-edu-text mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/[0.08] text-edu-text placeholder:text-edu-muted/50 outline-none focus:border-edu-blue/50 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="flex-1 py-3 rounded-2xl border border-white/[0.08] text-edu-text hover:bg-white/5"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-2xl bg-gradient-accent text-white hover:opacity-90 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
