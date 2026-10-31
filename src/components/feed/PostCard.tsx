import { useState } from 'react';
import { Post } from '../../types';
import { User as FirebaseUser } from 'firebase/auth';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { likePost } from '../../api/database/postQueries';

interface PostCardProps {
  post: Post;
  currentUser: FirebaseUser | null;
}

export default function PostCard({ post, currentUser }: PostCardProps) {
  const likesArray = Array.isArray(post?.likes) ? post.likes : [];
  const [isLiked, setIsLiked] = useState(currentUser?.uid ? likesArray.includes(currentUser.uid) : false);
  const [likesCount, setLikesCount] = useState(likesArray.length);

  const handleLike = async () => {
    if (!currentUser) return;
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    try {
      await likePost(post.id, currentUser.uid, newLikedState);
    } catch (error) {
      setIsLiked(isLiked);
      setLikesCount(likesCount);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {post.authorPhoto ? (
              <img src={post.authorPhoto} alt={post.authorName} className="w-12 h-12 rounded-2xl object-cover border border-zinc-200 bg-white" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-12 h-12 rounded-2xl border border-zinc-200 bg-zinc-100 flex items-center justify-center">
                <User className="w-6 h-6 text-zinc-400" />
              </div>
            )}
            <div className="space-y-0.5">
              <h3 className="font-bold text-black hover:underline cursor-pointer">{post.authorName}</h3>
              <p className="text-xs text-zinc-500 font-medium">
                {post.createdAt?.toDate ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'just now'}
              </p>
            </div>
          </div>
          <button className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-all duration-200">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        <p className="text-black leading-relaxed text-lg whitespace-pre-wrap">{post.content}</p>

        {post.mediaUrl && (
          <div className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50">
            <img src={post.mediaUrl} alt="Post media" className="w-full h-auto max-h-[500px] object-contain" referrerPolicy="no-referrer" />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
          <div className="flex items-center gap-6">
            <button onClick={handleLike} className={`flex items-center gap-2 transition-all duration-300 group/btn ${isLiked ? 'text-rose-500' : 'text-zinc-500 hover:text-rose-500'}`}>
              <div className={`p-2 rounded-xl transition-all duration-300 ${isLiked ? 'bg-rose-50' : 'group-hover/btn:bg-rose-50'}`}>
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="font-bold text-sm">{likesCount}</span>
            </button>

            <button className="flex items-center gap-2 text-zinc-500 hover:text-black transition-all duration-300 group/btn">
              <div className="p-2 rounded-xl group-hover/btn:bg-zinc-100 transition-all duration-300">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm">{post.commentsCount}</span>
            </button>

            <button className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 transition-all duration-300 group/btn">
              <div className="p-2 rounded-xl group-hover/btn:bg-blue-50 transition-all duration-300">
                <Share2 className="w-5 h-5" />
              </div>
            </button>
          </div>

          <button className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl transition-all duration-300">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
