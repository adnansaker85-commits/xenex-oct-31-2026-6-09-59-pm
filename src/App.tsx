import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import FeedScreen from './screens/home/FeedScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import InboxScreen from './screens/chat/InboxScreen';
import Navbar from './components/common/Navbar';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <Loader2 className="w-8 h-8 text-black animate-spin" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-white text-black selection:bg-black/10">
          {user && <Navbar />}
          <main className={user ? "pt-16 pb-20 md:pb-0" : ""}>
            <Routes>
              <Route path="/login" element={!user ? <LoginScreen /> : <Navigate to="/" />} />
              <Route path="/register" element={!user ? <RegisterScreen /> : <Navigate to="/" />} />
              <Route path="/" element={user ? <FeedScreen /> : <Navigate to="/login" />} />
              <Route path="/profile/:uid" element={user ? <ProfileScreen /> : <Navigate to="/login" />} />
              <Route path="/chat" element={user ? <InboxScreen /> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
