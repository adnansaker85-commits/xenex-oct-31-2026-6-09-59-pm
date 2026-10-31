import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserProfile, Post } from '../../types';
import { getUserProfile } from '../../api/database/userQueries';
import { subscribeToUserPosts } from '../../api/database/postQueries';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'motion/react';
import { Settings, Calendar, MapPin, Link as LinkIcon, Loader2, Grid, Bookmark, Heart, MessageCircle, User } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfileScreen() {
  const { uid } = useParams<{ uid: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isOwnProfile = user?.uid === uid;

  useEffect(() => {
    if (uid) {
      getUserProfile(uid).then((data) => {
        setProfile(data);
        setLoading(false);
      });
      
      const unsubscribe = subscribeToUserPosts(uid, (userPosts) => {
        setPosts(userPosts);
      });
      return () => unsubscribe();
    }
  }, [uid]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <Loader2 className="w-8 h-8 text-black animate-spin" />
        <p className="text-zinc-500 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-40 space-y-4">
        <div className="text-4xl">👤</div>
        <h3 className="text-xl font-bold text-black">User not found</h3>
        <p className="text-zinc-500">The user you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
      <div className="relative">
        <div className="h-48 md:h-64 bg-zinc-100 rounded-[2.5rem] border border-zinc-200 shadow-inner overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-200 via-transparent to-transparent opacity-50" />
        </div>
        
        <div className="px-8 -mt-16 md:-mt-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative group">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt={profile.displayName} className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] object-cover border-4 border-white shadow-xl ring-1 ring-zinc-200 bg-white" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-4 border-white shadow-xl ring-1 ring-zinc-200 bg-zinc-100 flex items-center justify-center">
                  <User className="w-16 h-16 text-zinc-400" />
                </div>
              )}
              {isOwnProfile && (
                <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm">
                  <Settings className="w-8 h-8 text-white" />
                </div>
              )}
            </motion.div>
            
            <div className="space-y-2 pb-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-black">{profile.displayName}</h1>
              <p className="text-zinc-500 font-medium">@{profile.email ? profile.email.split('@')[0] : profile.displayName.toLowerCase().replace(/\s+/g, '')}</p>
            </div>
          </div>

          <div className="flex gap-3 pb-2">
            {isOwnProfile ? (
              <button className="bg-black text-white font-bold px-8 py-3 rounded-2xl hover:bg-zinc-800 transition-all duration-300 shadow-md">
                Edit Profile
              </button>
            ) : (
              <>
                <button className="bg-black text-white font-bold px-8 py-3 rounded-2xl hover:bg-zinc-800 transition-all duration-300 shadow-md">
                  Follow
                </button>
                <button className="bg-white border border-zinc-200 text-black font-bold px-8 py-3 rounded-2xl hover:bg-zinc-50 transition-all duration-300">
                  Message
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-black tracking-tight">About</h3>
            <p className="text-zinc-600 leading-relaxed">{profile.bio || "No bio yet. This user is a mystery! ✨"}</p>
            
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div className="flex items-center gap-3 text-zinc-500 text-sm font-medium">
                <MapPin className="w-4 h-4 text-black" />
                <span>Earth, Solar System</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-500 text-sm font-medium">
                <LinkIcon className="w-4 h-4 text-black" />
                <span className="hover:text-black cursor-pointer transition-colors">xenex.app/{profile.displayName.toLowerCase()}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-500 text-sm font-medium">
                <Calendar className="w-4 h-4 text-black" />
                <span>Joined {profile.createdAt?.toDate ? format(profile.createdAt.toDate(), 'MMMM yyyy') : 'Recently'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] flex justify-around shadow-sm">
            <div className="text-center space-y-1">
              <p className="text-2xl font-black text-black">{profile.followers?.length || 0}</p>
              <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase">Followers</p>
            </div>
            <div className="w-px h-10 bg-zinc-200 self-center" />
            <div className="text-center space-y-1">
              <p className="text-2xl font-black text-black">{profile.following?.length || 0}</p>
              <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase">Following</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="flex gap-8 border-b border-zinc-200 pb-4">
            <button className="flex items-center gap-2 text-black font-bold border-b-2 border-black pb-4 -mb-[18px]">
              <Grid className="w-5 h-5" />
              <span>Posts</span>
            </button>
            <button className="flex items-center gap-2 text-zinc-400 font-bold hover:text-black transition-all duration-200">
              <Bookmark className="w-5 h-5" />
              <span>Saved</span>
            </button>
            <button className="flex items-center gap-2 text-zinc-400 font-bold hover:text-black transition-all duration-200">
              <Heart className="w-5 h-5" />
              <span>Liked</span>
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20 bg-zinc-50 rounded-3xl border border-zinc-200">
              <Grid className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-black">No posts yet</h3>
              <p className="text-zinc-500">When {profile.displayName} posts something, it will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {posts.map((post) => (
                <motion.div key={post.id} whileHover={{ scale: 1.02 }} className="aspect-square bg-zinc-100 border border-zinc-200 rounded-2xl overflow-hidden group cursor-pointer shadow-sm relative">
                  {post.mediaUrl ? (
                    <img src={post.mediaUrl} alt="Post" className="w-full h-full object-cover group-hover:opacity-50 transition-all duration-500" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full p-4 flex items-center justify-center text-center bg-white group-hover:bg-zinc-50 transition-colors">
                      <p className="text-sm font-medium text-zinc-800 line-clamp-4">{post.content}</p>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20">
                    <div className="flex gap-4 text-white font-bold drop-shadow-md">
                      <div className="flex items-center gap-1"><Heart className="w-5 h-5 fill-current" /><span>{Array.isArray(post.likes) ? post.likes.length : 0}</span></div>
                      <div className="flex items-center gap-1"><MessageCircle className="w-5 h-5 fill-current" /><span>{post.commentsCount || 0}</span></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
