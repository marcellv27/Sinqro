import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { items, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
        >
          Ver Menú
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Tu Carrito</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div>
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
              <p className="text-sm text-gray-600">
                Personalizaciones:
                {item.customizations.map(customization => {
                  const productCustomization = item.product.customizations.find(
                    c => c.id === customization.customizationId
                  );
                  return customization.optionIds.map(optionId => {
                    const option = productCustomization?.options.find(o => o.id === optionId);
                    return option?.name;
                  }).join(', ');
                }).filter(Boolean).join('; ')}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              <button
                onClick={() => removeFromCart(index)}
                className="text-red-500 hover:text-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total:</span>
          <span className="text-xl font-bold">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
        >
          Proceder al Pago
        </button>
      </div>
    </div>
  );
}