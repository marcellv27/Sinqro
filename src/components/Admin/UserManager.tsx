import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User } from '../../types';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          orders (
            id,
            total,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      alert('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">{user.name}</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {user.email}
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {user.phone}
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {user.address}
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Estadísticas</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Total Pedidos</p>
                  <p className="text-lg font-semibold">{user.orders?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gasto Total</p>
                  <p className="text-lg font-semibold">
                    ${user.orders?.reduce((sum, order) => sum + order.total, 0).toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}