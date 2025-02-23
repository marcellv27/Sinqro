import React, { useState } from 'react';
import { Product, ProductCustomization, CustomizationOption, SelectedCustomization } from '../types';

interface ProductCustomizerProps {
  product: Product;
  onAddToCart: (selections: SelectedCustomization[]) => void;
}

export default function ProductCustomizer({ product, onAddToCart }: ProductCustomizerProps) {
  const [selections, setSelections] = useState<SelectedCustomization[]>([]);

  const handleOptionSelect = (customization: ProductCustomization, optionId: string) => {
    setSelections(prev => {
      const existing = prev.find(s => s.customizationId === customization.id);
      
      if (existing) {
        if (customization.multiple) {
          // Toggle option for multiple selection
          const optionIds = existing.optionIds.includes(optionId)
            ? existing.optionIds.filter(id => id !== optionId)
            : [...existing.optionIds, optionId];
          
          return prev.map(s => 
            s.customizationId === customization.id
              ? { ...s, optionIds }
              : s
          );
        } else {
          // Replace option for single selection
          return prev.map(s =>
            s.customizationId === customization.id
              ? { ...s, optionIds: [optionId] }
              : s
          );
        }
      }

      // Add new selection
      return [...prev, {
        customizationId: customization.id,
        optionIds: [optionId]
      }];
    });
  };

  const isOptionSelected = (customizationId: string, optionId: string) => {
    const selection = selections.find(s => s.customizationId === customizationId);
    return selection?.optionIds.includes(optionId) || false;
  };

  const calculateTotal = () => {
    let total = product.basePrice;
    selections.forEach(selection => {
      const customization = product.customizations.find(c => c.id === selection.customizationId);
      selection.optionIds.forEach(optionId => {
        const option = customization?.options.find(o => o.id === optionId);
        if (option) {
          total += option.price;
        }
      });
    });
    return total;
  };

  const handleAddToCart = () => {
    // Validate required selections
    const missingRequired = product.customizations
      .filter(c => c.required)
      .some(c => !selections.find(s => s.customizationId === c.id));

    if (missingRequired) {
      alert('Please make all required selections');
      return;
    }

    onAddToCart(selections);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">{product.name}</h3>
      <p className="text-gray-600 mb-6">{product.description}</p>

      {product.customizations.map(customization => (
        <div key={customization.id} className="mb-6">
          <h4 className="font-semibold mb-2">
            {customization.name}
            {customization.required && <span className="text-red-500 ml-1">*</span>}
          </h4>
          <div className="space-y-2">
            {customization.options.map(option => (
              <label
                key={option.id}
                className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type={customization.multiple ? 'checkbox' : 'radio'}
                  checked={isOptionSelected(customization.id, option.id)}
                  onChange={() => handleOptionSelect(customization, option.id)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                />
                <span className="flex-1">{option.name}</span>
                {option.price > 0 && (
                  <span className="text-gray-600">+${option.price.toFixed(2)}</span>
                )}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-lg font-bold">
          Total: ${calculateTotal().toFixed(2)}
        </div>
        <button
          onClick={handleAddToCart}
          className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}