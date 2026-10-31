import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export const processImageForUpload = async (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          reject(new Error("Failed to get canvas context"));
        }
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const uploadImageToStorage = async (base64String: string): Promise<string> => {
  if (!base64String.startsWith('data:image')) return base64String; // Already a URL
  const fileName = `profile_images/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
  const storageRef = ref(storage, fileName);
  await uploadString(storageRef, base64String, 'data_url');
  return await getDownloadURL(storageRef);
};
