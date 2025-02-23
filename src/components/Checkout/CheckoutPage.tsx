import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // Crear la orden en la base de datos
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            total: total,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Crear los items de la orden
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        customizations: item.customizations,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      navigate('/order-confirmation', { state: { orderId: order.id } });
    } catch (error) {
      console.error('Error al procesar la orden:', error);
      alert('Error al procesar la orden. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Finalizar Compra</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="font-semibold mb-4">Resumen del Pedido</h3>
        {items.map((item, index) => (
          <div key={index} className="flex justify-between mb-2">
            <span>{item.quantity}x {item.product.name}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="font-semibold mb-4">Método de Pago</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-orange-500 focus:ring-orange-500"
            />
            <span>Efectivo</span>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold mb-4">Dirección de Entrega</h3>
        <p>{user?.address}</p>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full mt-6 bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 disabled:bg-gray-400"
      >
        {loading ? 'Procesando...' : 'Confirmar Pedido'}
      </button>
    </div>
  );
}