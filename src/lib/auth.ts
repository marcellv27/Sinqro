import { supabase } from './supabase';
import { User } from '../types';

export async function signUp(email: string, password: string, userData: Omit<User, 'id' | 'orders'>) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          address: userData.address,
          phone: userData.phone,
        }
      }
    });

    if (authError) {
      console.error('Auth error during signup:', authError);
      if (authError.message.includes('already registered')) {
        throw new Error('Este email ya está registrado');
      }
      throw new Error('Error al crear la cuenta: ' + authError.message);
    }

    if (!authData.user) {
      throw new Error('No se pudo crear el usuario');
    }

    const { error: profileError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email: authData.user.email,
        name: userData.name,
        address: userData.address,
        phone: userData.phone,
      }]);

    if (profileError) {
      console.error('Profile error during signup:', profileError);
      throw new Error('Error al crear el perfil de usuario');
    }

    return authData;
  } catch (error: any) {
    console.error('Error en signUp:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      console.error('Auth error during signin:', error);
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Email o contraseña incorrectos');
      }
      throw new Error('Error al iniciar sesión: ' + error.message);
    }

    if (!data.user) {
      throw new Error('No se pudo iniciar sesión');
    }

    return data;
  } catch (error: any) {
    console.error('Error en signIn:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Auth error during signout:', error);
      throw new Error('Error al cerrar sesión: ' + error.message);
    }
  } catch (error: any) {
    console.error('Error en signOut:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return null;
    }
    
    if (!session?.user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select(`
        *,
        orders (
          id,
          total,
          status,
          created_at
        )
      `)
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
}