import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  where,
  Timestamp,
  serverTimestamp,
  limit,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../firebase';
import { Post } from '../../types';
import { handleFirestoreError, OperationType } from './errorHandlers';

const POSTS_COLLECTION = 'posts';

export const createPost = async (postData: Omit<Post, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...postData,
      createdAt: serverTimestamp(),
      likes: [],
      commentsCount: 0
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, POSTS_COLLECTION);
  }
};

export const subscribeToPosts = (callback: (posts: Post[]) => void) => {
  const q = query(collection(db, POSTS_COLLECTION), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Post));
    callback(posts);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, POSTS_COLLECTION);
  });
};

export const subscribeToUserPosts = (userId: string, callback: (posts: Post[]) => void) => {
  const q = query(
    collection(db, POSTS_COLLECTION), 
    where('authorId', '==', userId),
    orderBy('createdAt', 'desc'), 
    limit(50)
  );
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Post));
    callback(posts);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, POSTS_COLLECTION);
  });
};

export const likePost = async (postId: string, userId: string, isLiked: boolean) => {
  const postRef = doc(db, POSTS_COLLECTION, postId);
  try {
    await updateDoc(postRef, {
      likes: isLiked ? arrayUnion(userId) : arrayRemove(userId)
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${POSTS_COLLECTION}/${postId}`);
  }
};
