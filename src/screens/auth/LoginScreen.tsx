import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { loginWithPhone, loginWithGoogle } from '../../api/auth/firebaseAuth';
import { createUserProfile } from '../../api/database/userQueries';
import { motion } from 'motion/react';
import { ArrowRight, Phone, Lock } from 'lucide-react';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      const user = await loginWithGoogle();
      await createUserProfile(user.uid, {
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

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await loginWithPhone(phone, password);
      // Ensure profile exists
      try {
        await createUserProfile(user.uid, {
          displayName: user.displayName || phone,
          email: user.email || '',
          photoURL: user.photoURL || '',
          bio: 'Joined Xenex'
        });
      } catch (profileErr) {
        console.error('Failed to ensure profile exists:', profileErr);
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setError('ACTION REQUIRED: You must enable "Email/Password" authentication in your Firebase Console to use this feature. Go to Authentication -> Sign-in method -> Email/Password and enable it.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Incorrect phone number or password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid phone number format.');
      } else {
        setError('Invalid phone number or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6">
      <div className="max-w-md w-full relative">
        {/* Premium Margin Line */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-0 bottom-0 w-[2px] bg-black origin-top"
        />

        <div className="pl-10 py-8 space-y-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter text-black uppercase">Xenex</h1>
            <p className="text-zinc-500 text-lg">Sign in to your universe.</p>
          </motion.div>

          <motion.form
            onSubmit={handleLogin}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
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
              <Phone className="absolute left-0 top-4 w-5 h-5 text-zinc-400 group-focus-within:text-black transition-colors" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number (+880...)"
                className="w-full bg-transparent border-b-2 border-zinc-200 py-4 pl-10 pr-4 text-black focus:border-black outline-none transition-all placeholder-zinc-400 text-lg"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-0 top-4 w-5 h-5 text-zinc-400 group-focus-within:text-black transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent border-b-2 border-zinc-200 py-4 pl-10 pr-4 text-black focus:border-black outline-none transition-all placeholder-zinc-400 text-lg"
              />
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-between bg-black text-white font-bold py-5 px-8 rounded-full hover:bg-zinc-800 transition-all duration-300 disabled:opacity-50 group"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  <>
                    <span className="text-lg tracking-wide">Log In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
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
              Don't have an account? <Link to="/register" className="text-black font-bold hover:underline">Create one</Link>
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
