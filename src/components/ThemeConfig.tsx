import React, { useState } from 'react';
import { Theme } from '../types';

interface ThemeConfigProps {
  currentTheme: Theme;
  onSave: (theme: Theme) => void;
}

export default function ThemeConfig({ currentTheme, onSave }: ThemeConfigProps) {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  const handleChange = (key: keyof Theme, value: string) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(theme);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Theme Configuration</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo URL
        </label>
        <input
          type="url"
          value={theme.logo}
          onChange={e => handleChange('logo', e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={theme.primaryColor}
            onChange={e => handleChange('primaryColor', e.target.value)}
            className="h-10 w-20"
          />
          <input
            type="text"
            value={theme.primaryColor}
            onChange={e => handleChange('primaryColor', e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
            pattern="^#[0-9A-Fa-f]{6}$"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Secondary Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={theme.secondaryColor}
            onChange={e => handleChange('secondaryColor', e.target.value)}
            className="h-10 w-20"
          />
          <input
            type="text"
            value={theme.secondaryColor}
            onChange={e => handleChange('secondaryColor', e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
            pattern="^#[0-9A-Fa-f]{6}$"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Accent Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={theme.accentColor}
            onChange={e => handleChange('accentColor', e.target.value)}
            className="h-10 w-20"
          />
          <input
            type="text"
            value={theme.accentColor}
            onChange={e => handleChange('accentColor', e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
            pattern="^#[0-9A-Fa-f]{6}$"
            required
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Save Theme
        </button>
      </div>
    </form>
  );
}