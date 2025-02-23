import React, { createContext, useContext, useState } from 'react';
import { OrderItem, Product, SelectedCustomization } from '../types';

interface CartItem extends OrderItem {
  product: Product;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, customizations: SelectedCustomization[]) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number, customizations: SelectedCustomization[]) => {
    const price = calculateItemPrice(product, customizations);
    setItems([...items, { product, quantity, customizations, price, productId: product.id }]);
  };

  const removeFromCart = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const calculateItemPrice = (product: Product, customizations: SelectedCustomization[]) => {
    let price = product.basePrice;
    customizations.forEach(customization => {
      const productCustomization = product.customizations.find(c => c.id === customization.customizationId);
      customization.optionIds.forEach(optionId => {
        const option = productCustomization?.options.find(o => o.id === optionId);
        if (option) {
          price += option.price;
        }
      });
    });
    return price;
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}