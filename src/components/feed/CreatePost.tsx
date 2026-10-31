import { useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { UserProfile } from '../../types';
import { createPost } from '../../api/database/postQueries';
import { Image, Send, Loader2, User } from 'lucide-react';

interface CreatePostProps {
  user: FirebaseUser;
  profile: UserProfile;
}

export default function CreatePost({ user, profile }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await createPost({
        authorId: user.uid,
        authorName: profile.displayName,
        authorPhoto: profile.photoURL,
        content: content.trim(),
        likes: [],
        commentsCount: 0
      });
      setContent('');
    } catch (error) {
      console.error('Post creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 p-6 rounded-3xl shadow-sm space-y-4">
      <div className="flex gap-4">
        {profile.photoURL ? (
          <img src={profile.photoURL} alt={profile.displayName} className="w-12 h-12 rounded-2xl object-cover border border-zinc-200" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-12 h-12 rounded-2xl border border-zinc-200 bg-zinc-100 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-zinc-400" />
          </div>
        )}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent border-none focus:ring-0 text-black placeholder-zinc-400 resize-none text-lg min-h-[100px] outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
        <div className="flex gap-2">
          <button className="p-2.5 text-zinc-500 hover:bg-zinc-100 hover:text-black rounded-xl transition-all duration-200">
            <Image className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={handlePost}
          disabled={loading || !content.trim()}
          className="flex items-center gap-2 bg-black text-white font-bold px-6 py-2.5 rounded-2xl hover:bg-zinc-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span className="text-sm">Post</span><Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
        </button>
      </div>
    </div>
  );
}
