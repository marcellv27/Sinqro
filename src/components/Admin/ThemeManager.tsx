import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Theme } from '../../types';

export default function ThemeManager() {
  const [theme, setTheme] = useState<Theme>({
    logo: '',
    primaryColor: '#f97316',
    secondaryColor: '#ffffff',
    accentColor: '#000000'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  async function loadTheme() {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .single();

      if (error) throw error;
      if (data) setTheme(data);
    } catch (error) {
      console.error('Error cargando tema:', error);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('themes')
        .upsert([theme]);

      if (error) throw error;
      alert('Tema guardado exitosamente');
    } catch (error) {
      console.error('Error guardando tema:', error);
      alert('Error al guardar el tema');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Configuración del Tema</h2>

      <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL del Logo
          </label>
          <input
            type="url"
            value={theme.logo}
            onChange={(e) => setTheme({ ...theme, logo: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color Primario
          </label>
          <div className="flex space-x-2">
            <input
              type="color"
              value={theme.primaryColor}
              onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
              className="h-10 w-20"
            />
            <input
              type="text"
              value={theme.primaryColor}
              onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
              pattern="^#[0-9A-Fa-f]{6}$"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color Secundario
          </label>
          <div className="flex space-x-2">
            <input
              type="color"
              value={theme.secondaryColor}
              onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
              className="h-10 w-20"
            />
            <input
              type="text"
              value={theme.secondaryColor}
              onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
              pattern="^#[0-9A-Fa-f]{6}$"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color de Acento
          </label>
          <div className="flex space-x-2">
            <input
              type="color"
              value={theme.accentColor}
              onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
              className="h-10 w-20"
            />
            <input
              type="text"
              value={theme.accentColor}
              onChange={(e) => setTheme({ ...theme, accentColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
              pattern="^#[0-9A-Fa-f]{6}$"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-400"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}