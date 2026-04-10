import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MessageSquare, Plus, Search, 
  ThumbsUp, CheckCircle, MessageCircle,
  Send, X, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { communityAPI, API_URL } from '@/services/api';

const sectors = [
  { value: '', label: 'All Sectors' },
  { value: 'web-design', label: 'Web Design' },
  { value: 'informatique-decisionnel-ia', label: 'Informatique Décisionnel et IA' },
  { value: 'genie-informatique', label: 'Génie Informatique' },
];

export default function Community() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sector, setSector] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostSector, setNewPostSector] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [deletingReplyId, setDeletingReplyId] = useState<number | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('edubuddy_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsed = JSON.parse(userData);
    setUser(parsed);
    setNewPostSector(parsed.sector || '');
    
    // Log API_URL for debugging
    console.log('API URL:', API_URL);
    
    // Fetch posts on mount
    fetchPosts();
  }, [navigate]);

  useEffect(() => {
    // Refetch posts when sector changes
    fetchPosts();
  }, [sector]);

  useEffect(() => {
    if (expandedPost) {
      setLoadingPost(true);
      communityAPI.getPostDetails(expandedPost)
        .then(response => {
          if (response.data.success) {
            setSelectedPost(response.data.post);
          }
        })
        .catch(error => {
          console.error('Failed to fetch post details:', error);
        })
        .finally(() => {
          setLoadingPost(false);
        });
    } else {
      setSelectedPost(null);
    }
  }, [expandedPost]);

  const fetchPosts = async () => {
    try {
      const response = await communityAPI.getPosts(sector || undefined);
      if (response.data.success) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    setSubmitting(true);
    try {
      const response = await communityAPI.createPost({
        title: newPostTitle,
        content: newPostContent,
        author_id: user.id,
        sector: newPostSector,
      });

      if (response.data.success) {
        setNewPostTitle('');
        setNewPostContent('');
        setShowNewPostModal(false);
        
        // Update user points
        const updatedUser = { ...user, points: response.data.post.total_points };
        localStorage.setItem('edubuddy_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Refresh posts list
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (postId: number) => {
    if (!replyContent.trim()) return;

    try {
      const response = await communityAPI.createReply({
        post_id: postId,
        content: replyContent,
        author_id: user.id,
      });

      if (response.data.success) {
        setReplyContent('');
        
        // Update user points
        const updatedUser = { ...user, points: response.data.total_points };
        localStorage.setItem('edubuddy_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Refresh the expanded post details to show the new reply
        communityAPI.getPostDetails(postId).then(res => {
          if (res.data.success) {
            setSelectedPost(res.data.post);
          }
        });
      }
    } catch (error) {
      console.error('Failed to reply:', error);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const response = await communityAPI.upvotePost(postId, user.id);

      if (response.data.success) {
        // Update user points
        const updatedUser = { ...user, points: response.data.total_points };
        localStorage.setItem('edubuddy_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        // Update the specific post's upvotes in the list
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, upvotes: response.data.upvotes }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await communityAPI.deletePost(postId, user.id);

      if (response.data.success) {
        // Refresh posts list
        fetchPosts();
        if (expandedPost === postId) {
          setExpandedPost(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. You can only delete your own posts.');
    }
  };

  const handleDeleteReply = async (replyId: number, postId: number) => {
    if (!confirm('Are you sure you want to delete this reply?')) return;

    try {
      setDeletingReplyId(replyId);
      
      const response = await communityAPI.deleteReply(replyId, user.id);
      
      if (response.data.success) {
        // Refresh posts list
        fetchPosts();
        
        // Update expanded post if viewing it
        if (expandedPost === postId) {
          const post = posts.find(p => p.id === postId);
          if (post && post.replies) {
            setExpandedPost(postId);
          }
        }
      } else {
        alert(response.data.message || 'Failed to delete reply');
      }
    } catch (error) {
      console.error('Failed to delete reply:', error);
      alert('Failed to delete reply');
    } finally {
      setDeletingReplyId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0B0E14' }}>
      {/* Header */}
      <nav className="border-b border-white/[0.08] sticky top-0 z-40" style={{ backgroundColor: '#0B0E14' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-edu-muted hover:text-edu-text transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <h1 className="font-heading text-xl font-bold text-edu-text">Community</h1>

            <button 
              onClick={() => setShowNewPostModal(true)}
              className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search & Filter */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-edu-muted" />
            <input
              id="community-search" 
              name="search"                
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/[0.08] text-edu-text placeholder:text-edu-muted/50 outline-none focus:border-edu-blue/50 transition-colors"
            />
          </div>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="px-4 py-3 rounded-2xl bg-white/5 border border-white/[0.08] text-edu-text text-sm outline-none focus:border-edu-blue/50 transition-colors appearance-none cursor-pointer"
          >
            {sectors.map(s => (
              <option key={s.value} value={s.value} className="bg-[#121A2B]">{s.label}</option>
            ))}
          </select>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-edu-blue border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-white/[0.08] bg-white/[0.02]">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-edu-muted" />
              </div>
              <p className="text-edu-text font-semibold mb-2">No questions yet</p>
              <p className="text-edu-muted text-sm mb-4">Be the first to ask a question!</p>
              <Button 
                onClick={() => setShowNewPostModal(true)}
                className="bg-gradient-accent text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ask a Question
              </Button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold">
                        {post.author_name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-edu-text font-semibold">{post.author_name}</span>
                        <span className="text-edu-muted text-sm">•</span>
                        <span className="text-edu-muted text-sm">{formatDate(post.created_at)}</span>
                        {post.sector && (
                          <>
                            <span className="text-edu-muted text-sm">•</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-edu-muted">
                              {post.sector.replace(/-/g, ' ')}
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="text-edu-text font-semibold text-lg mb-2">{post.title}</h3>
                      <p className="text-edu-muted">{post.content}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.08]">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-2 text-edu-muted hover:text-edu-text transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{post.upvotes || 0}</span>
                    </button>
                    <button 
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      className="flex items-center gap-2 text-edu-muted hover:text-edu-text transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.reply_count || 0} replies</span>
                    </button>
                    {post.author_id === user.id && (
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Delete</span>
                      </button>
                    )}
                    {post.is_resolved && (
                      <span className="flex items-center gap-1 text-green-400 text-sm ml-auto">
                        <CheckCircle className="w-4 h-4" />
                        Resolved
                      </span>
                    )}
                  </div>
                </div>

                {/* Replies Section */}
                {expandedPost === post.id && (
                  <div className="border-t border-white/[0.08] bg-white/[0.02] p-5">
                    {/* Loading State */}
                    {loadingPost ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="w-6 h-6 border-2 border-edu-blue border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : selectedPost && selectedPost.id === post.id ? (
                      <>
                        {/* Replies List */}
                        {selectedPost.replies && selectedPost.replies.length > 0 ? (
                          <div className="space-y-4 mb-4">
                            {selectedPost.replies.map((reply: any) => {
                              const isReplyAuthor = user && user.id === reply.author_id;
                              const isPostAuthor = user && user.id === post.author_id;
                              const canDelete = isReplyAuthor || isPostAuthor;
                              
                              return (
                                <div key={reply.id} className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-edu-text text-sm font-semibold">
                                      {reply.author_name?.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-edu-text text-sm font-semibold">{reply.author_name}</span>
                                        <span className="text-edu-muted text-xs">{formatDate(reply.created_at)}</span>
                                      </div>
                                      
                                      {canDelete && (
                                        <button
                                          onClick={() => handleDeleteReply(reply.id, post.id)}
                                          disabled={deletingReplyId === reply.id}
                                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                          title="Delete reply"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-edu-muted text-sm">{reply.content}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-edu-muted text-sm mb-4">No replies yet. Be the first to help!</p>
                        )}

                        {/* Reply Input */}
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write a helpful reply..."
                            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/[0.08] text-edu-text placeholder:text-edu-muted/50 outline-none focus:border-edu-blue/50 transition-colors text-sm"
                          />
                          <button
                            onClick={() => handleReply(post.id)}
                            disabled={!replyContent.trim()}
                            className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center disabled:opacity-50"
                          >
                            <Send className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[32px] border border-white/[0.08] p-6 card-shadow" style={{ backgroundColor: '#121A2B' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold text-edu-text">Ask a Question</h2>
              <button 
                onClick={() => setShowNewPostModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-edu-muted" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-edu-text mb-2">Title</label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="What's your question?"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/[0.08] text-edu-text placeholder:text-edu-muted/50 outline-none focus:border-edu-blue/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-edu-text mb-2">Details</label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Describe your problem in detail..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/[0.08] text-edu-text placeholder:text-edu-muted/50 outline-none focus:border-edu-blue/50 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-edu-text mb-2">Sector (optional)</label>
                <select
                  value={newPostSector}
                  onChange={(e) => setNewPostSector(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/[0.08] text-edu-text outline-none focus:border-edu-blue/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#121A2B]">All sectors</option>
                  {sectors.filter(s => s.value).map((s) => (
                    <option key={s.value} value={s.value} className="bg-[#121A2B]">{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  variant="outline"
                  className="flex-1 border-white/20 text-edu-text"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-accent text-white"
                  disabled={submitting || !newPostTitle.trim() || !newPostContent.trim()}
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Post Question
                    </>
                  )}
                </Button>
              </div>

              <p className="text-center text-edu-muted text-sm">
                Earn <span className="text-yellow-400 font-semibold">+25 points</span> for posting!
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
