import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { getCurrentUser, signIn as authSignIn, signOut as authSignOut, signUp as authSignUp } from '../lib/auth';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Omit<User, 'id' | 'orders'>) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const user = await getCurrentUser();
        setUser(user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        if (session) {
          const user = await getCurrentUser();
          setUser(user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    signIn: async (email: string, password: string) => {
      try {
        await authSignIn(email, password);
        await checkUser();
      } catch (error) {
        console.error('Error en signIn:', error);
        throw error;
      }
    },
    signUp: async (email: string, password: string, userData: Omit<User, 'id' | 'orders'>) => {
      try {
        await authSignUp(email, password, userData);
        await checkUser();
      } catch (error) {
        console.error('Error en signUp:', error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        await authSignOut();
        setUser(null);
      } catch (error) {
        console.error('Error en signOut:', error);
        throw error;
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}