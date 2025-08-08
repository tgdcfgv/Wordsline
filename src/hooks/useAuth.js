import { useState, useEffect } from 'react';
import { AuthService } from '../services/firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
    } catch (error) {
      setError(error);
    }
  };

  return {
    user,
    userId: user?.uid || null,
    loading,
    error,
    signOut
  };
};

export default useAuth;
