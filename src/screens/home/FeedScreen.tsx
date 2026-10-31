import { useState, useEffect } from 'react';
import { Post } from '../../types';
import { subscribeToPosts } from '../../api/database/postQueries';
import { useAuth } from '../../hooks/useAuth';
import PostCard from '../../components/feed/PostCard';
import CreatePost from '../../components/feed/CreatePost';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Sparkles } from 'lucide-react';

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  useEffect(() => {
    const unsubscribe = subscribeToPosts((newPosts) => {
      setPosts(newPosts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter text-black flex items-center gap-2">
            Feed <Sparkles className="w-6 h-6 text-black" />
          </h1>
          <p className="text-zinc-500 text-sm">See what's happening around you.</p>
        </div>
      </motion.div>

      {user && profile && <CreatePost user={user} profile={profile} />}

      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-black animate-spin" />
            <p className="text-zinc-500 animate-pulse">Loading your feed...</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <motion.div key={post.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
                <PostCard post={post} currentUser={user} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="text-4xl">📭</div>
            <h3 className="text-xl font-bold text-black">No posts yet</h3>
            <p className="text-zinc-500">Be the first to share something with the world!</p>
          </div>
        )}
      </div>
    </div>
  );
}
