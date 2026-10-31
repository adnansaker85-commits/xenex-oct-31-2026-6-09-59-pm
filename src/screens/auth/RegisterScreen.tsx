import { useState, FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { registerWithPhone, loginWithGoogle } from '../../api/auth/firebaseAuth';
import { updateUserProfile } from '../../api/database/userQueries';
import { processImageForUpload, uploadImageToStorage } from '../../api/storage/imageUtils';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Phone, Mail, Globe, Lock, User, FileText, Camera, ArrowLeft } from 'lucide-react';

export default function RegisterScreen() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    country: '',
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    bio: '',
    photoURL: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError('');
      const url = await processImageForUpload(file);
      setFormData({ ...formData, photoURL: url });
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleNext = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.phone || !formData.country || !formData.email || !formData.password) {
      setError('Please fill all fields');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const user = await loginWithGoogle();
      // Only update profile if it's a new user or we want to ensure they exist in DB
      await updateUserProfile(user.uid, {
        displayName: user.displayName || 'Xenex User',
        email: user.email || '',
        photoURL: user.photoURL || '',
        bio: 'Joined via Google'
      });
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setError(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.displayName) {
      setError('Profile name is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const user = await registerWithPhone(formData.phone, formData.password);
      
      let finalPhotoURL = '';
      if (formData.photoURL && formData.photoURL.startsWith('data:image')) {
        try {
          finalPhotoURL = await uploadImageToStorage(formData.photoURL);
        } catch (uploadErr) {
          console.error('Image upload failed, using base64:', uploadErr);
          finalPhotoURL = formData.photoURL;
        }
      } else if (formData.photoURL) {
        finalPhotoURL = formData.photoURL;
      }

      await updateUserProfile(user.uid, {
        displayName: formData.displayName,
        email: formData.email,
        photoURL: finalPhotoURL,
        bio: formData.bio || `From ${formData.country}`
      });
    } catch (err: any) {
      console.error('Registration failed:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('ACTION REQUIRED: You must enable "Email/Password" authentication in your Firebase Console to use this feature. Go to Authentication -> Sign-in method -> Email/Password and enable it.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This phone number is already registered. Please log in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid phone number format.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6 py-12 overflow-hidden">
      <div className="max-w-md w-full relative">
        {/* Premium Margin Line */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 bottom-0 w-[2px] bg-black origin-top"
        />

        <div className="pl-10 py-8 space-y-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-black uppercase">
              {step === 1 ? 'Join Xenex' : 'Profile'}
            </h1>
            <p className="text-zinc-500 text-lg">
              {step === 1 ? 'Begin your journey.' : 'Tell us about yourself.'}
            </p>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {error && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                      <p className="text-red-600 text-sm font-medium">{error}</p>
                      {error.includes('ACTION REQUIRED') && (
                        <a 
                          href="https://console.firebase.google.com/project/_/authentication/providers" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-red-700 underline text-sm font-bold"
                        >
                          Open Firebase Console &rarr;
                        </a>
                      )}
                    </div>
                  )}

                  <div className="relative group">
                    <Globe className="absolute left-0 top-4 w-5 h-5 text-zinc-400 group-focus-within:text-black transition-colors" />
                    <input type="text" name="country" required value={formData.country} onChange={handleChange} placeholder="Country" className="w-full bg-transparent border-b-2 border-zinc-200 py-4 pl-10 pr-4 text-black focus:border-black outline-none transition-all placeholder-zinc-400 text-lg" />
                  </div>

                  <div className="relative group">
                    <Phone className="absolute left-0 top-4 w-5 h-5 text-zinc-400 group-focus-within:text-black transition-colors" />
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="Mobile Number (+880...)" className="w-full bg-transparent border-b-2 border-zinc-200 py-4 pl-10 pr-4 text-black focus:border-black outline-none transition-all placeholder-zinc-400 text-lg" />
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-0 top-4 w-5 h-5 text-zinc-400 group-focus-within:text-black transition-colors" />
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full bg-transparent border-b-2 border-zinc-200 py-4 pl-10 pr-4 text-black focus:border-black outline-none transition-all placeholder-zinc-400 text-lg" />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-0 top-4 w-5 h-5 text-zinc-400 group-focus-within:text-black transition-colors" />
                    <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Password" className="w-full bg-transparent border-b-2 border-zinc-200 py-4 pl-10 pr-4 text-black focus:border-black outline-none transition-all placeholder-zinc-400 text-lg" />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-0 top-4 w-5 h-5 text-zinc-400 group-focus-within:text-black transition-colors" />
                    <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="w-full bg-transparent border-b-2 border-zinc-200 py-4 pl-10 pr-4 text-black focus:border-black outline-none transition-all placeholder-zinc-400 text-lg" />
                  </div>

                  <div className="pt-4 space-y-4">
                    <button onClick={handleNext} className="w-full flex items-center justify-between bg-black text-white font-bold py-5 px-8 rounded-full hover:bg-zinc-800 transition-all duration-300 group">
                      <span className="text-lg tracking-wide">Next</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                    
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-zinc-200"></div>
                      <span className="flex-shrink-0 mx-4 text-zinc-400 text-sm font-medium">OR</span>
                      <div className="flex-grow border-t border-zinc-200"></div>
                    </div>

                    <button 
                      type="button" 
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 bg-white border-2 border-zinc-200 text-black font-bold py-4 px-8 rounded-full hover:bg-zinc-50 transition-all duration-300 disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span className="text-lg tracking-wide">Continue with Google</span>
                    </button>
                  </div>

                  <p className="text-left text-sm text-zinc-500 mt-8">
                    Already have an account? <Link to="/login" className="text-black font-bold hover:underline">Log in</Link>
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="step2"
                  onSubmit={handleRegister}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {error && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                      <p className="text-red-600 text-sm font-medium">{error}</p>
                      {error.includes('ACTION REQUIRED') && (
                        <a 
                          href="https://console.firebase.google.com/project/_/authentication/providers" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-red-700 underline text-sm font-bold"
                        >
                          Open Firebase Console &rarr;
                        </a>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-4 mb-6">
                    <div className="relative w-24 h-24 rounded-full bg-zinc-200 overflow-hidden flex items-center justify-center border-2 border-zinc-300">
                      {formData.photoURL ? (
                        <img src={formData.photoURL} alt="Profile preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-zinc-400" />
                      )}
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <label className="cursor-pointer text-sm font-medium text-black hover:underline flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      {formData.photoURL ? 'Change Photo' : 'Upload Photo'}
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploadingImage} />
                    </label>
                  </div>

                  <div className="relative group">
                    <User className="absolute left-0 top-4 w-5 h-5 text-zinc-400 group-focus-within:text-black transition-colors" />
                    <input type="text" name="displayName" required value={formData.displayName} onChange={handleChange} placeholder="Profile Name" className="w-full bg-transparent border-b-2 border-zinc-200 py-4 pl-10 pr-4 text-black focus:border-black outline-none transition-all placeholder-zinc-400 text-lg" />
                  </div>

                  <div className="relative group">
                    <FileText className="absolute left-0 top-4 w-5 h-5 text-zinc-400 group-focus-within:text-black transition-colors" />
                    <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio (Optional)" rows={3} className="w-full bg-transparent border-b-2 border-zinc-200 py-4 pl-10 pr-4 text-black focus:border-black outline-none transition-all placeholder-zinc-400 text-lg resize-none" />
                  </div>

                  <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setStep(1)} disabled={loading} className="flex items-center justify-center bg-zinc-200 text-black font-bold py-5 px-6 rounded-full hover:bg-zinc-300 transition-all duration-300 disabled:opacity-50">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button type="submit" disabled={loading} className="flex-1 flex items-center justify-between bg-black text-white font-bold py-5 px-8 rounded-full hover:bg-zinc-800 transition-all duration-300 disabled:opacity-50 group">
                      {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" /> : <><span className="text-lg tracking-wide">Create Account</span><ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></>}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
