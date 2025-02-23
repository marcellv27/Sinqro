import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Order } from '../../types';
import { Clock, Package, Truck, Check } from 'lucide-react';

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          users (
            name,
            address,
            phone
          ),
          order_items (
            *,
            products (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error cargando órdenes:', error);
      alert('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, status: Order['status']) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      loadOrders();
    } catch (error) {
      console.error('Error actualizando estado:', error);
      alert('Error al actualizar el estado');
    }
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'preparing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'delivering':
        return <Truck className="h-5 w-5 text-orange-500" />;
      case 'completed':
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestión de Pedidos</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Pedido #{order.id.slice(0, 8)}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(order.status)}
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                  className="border rounded-md px-2 py-1 text-sm"
                >
                  <option value="pending">Pendiente</option>
                  <option value="preparing">Preparando</option>
                  <option value="delivering">En Entrega</option>
                  <option value="completed">Completado</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <h4 className="font-medium mb-2">Cliente</h4>
              <p>{order.users?.name}</p>
              <p className="text-sm text-gray-600">{order.users?.address}</p>
              <p className="text-sm text-gray-600">{order.users?.phone}</p>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Items</h4>
              <div className="space-y-2">
                {order.order_items?.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.products?.name}
                    </span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}