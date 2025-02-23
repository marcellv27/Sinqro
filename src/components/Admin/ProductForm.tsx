import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Product, ProductCustomization, CustomizationOption } from '../../types';
import { supabase } from '../../lib/supabase';

interface ProductFormProps {
  product?: Product;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: product?.name || '',
    description: product?.description || '',
    basePrice: product?.basePrice || 0,
    image: product?.image || '',
    category: product?.category || '',
    customizations: product?.customizations || []
  });

  const [newCustomization, setNewCustomization] = useState<Partial<ProductCustomization>>({
    name: '',
    required: false,
    multiple: false,
    options: []
  });

  const [newOption, setNewOption] = useState<Partial<CustomizationOption>>({
    name: '',
    price: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (product?.id) {
        // Actualizar producto existente
        const { error: productError } = await supabase
          .from('products')
          .update({
            name: formData.name,
            description: formData.description,
            base_price: formData.basePrice,
            image: formData.image,
            category: formData.category
          })
          .eq('id', product.id);

        if (productError) throw productError;

        // Actualizar personalizaciones
        for (const customization of formData.customizations || []) {
          if (customization.id) {
            // Actualizar personalización existente
            const { error: customError } = await supabase
              .from('customizations')
              .update({
                name: customization.name,
                required: customization.required,
                multiple: customization.multiple
              })
              .eq('id', customization.id);

            if (customError) throw customError;

            // Actualizar opciones
            for (const option of customization.options) {
              if (option.id) {
                const { error: optionError } = await supabase
                  .from('customization_options')
                  .update({
                    name: option.name,
                    price: option.price
                  })
                  .eq('id', option.id);

                if (optionError) throw optionError;
              } else {
                // Insertar nueva opción
                const { error: newOptionError } = await supabase
                  .from('customization_options')
                  .insert({
                    customization_id: customization.id,
                    name: option.name,
                    price: option.price
                  });

                if (newOptionError) throw newOptionError;
              }
            }
          } else {
            // Insertar nueva personalización
            const { data: newCustomization, error: newCustomError } = await supabase
              .from('customizations')
              .insert({
                product_id: product.id,
                name: customization.name,
                required: customization.required,
                multiple: customization.multiple
              })
              .select()
              .single();

            if (newCustomError) throw newCustomError;

            // Insertar opciones de la nueva personalización
            const { error: newOptionsError } = await supabase
              .from('customization_options')
              .insert(
                customization.options.map(option => ({
                  customization_id: newCustomization.id,
                  name: option.name,
                  price: option.price
                }))
              );

            if (newOptionsError) throw newOptionsError;
          }
        }
      } else {
        // Crear nuevo producto
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert({
            name: formData.name,
            description: formData.description,
            base_price: formData.basePrice,
            image: formData.image,
            category: formData.category
          })
          .select()
          .single();

        if (productError) throw productError;

        // Crear personalizaciones para el nuevo producto
        for (const customization of formData.customizations || []) {
          const { data: newCustomization, error: customError } = await supabase
            .from('customizations')
            .insert({
              product_id: newProduct.id,
              name: customization.name,
              required: customization.required,
              multiple: customization.multiple
            })
            .select()
            .single();

          if (customError) throw customError;

          // Crear opciones para la nueva personalización
          const { error: optionsError } = await supabase
            .from('customization_options')
            .insert(
              customization.options.map(option => ({
                customization_id: newCustomization.id,
                name: option.name,
                price: option.price
              }))
            );

          if (optionsError) throw optionsError;
        }
      }

      onSave();
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('Error al guardar el producto');
    }
  };

  const addCustomization = () => {
    if (!newCustomization.name) return;

    setFormData(prev => ({
      ...prev,
      customizations: [
        ...(prev.customizations || []),
        {
          ...newCustomization,
          options: []
        } as ProductCustomization
      ]
    }));

    setNewCustomization({
      name: '',
      required: false,
      multiple: false,
      options: []
    });
  };

  const addOption = (customizationIndex: number) => {
    if (!newOption.name) return;

    setFormData(prev => {
      const customizations = [...(prev.customizations || [])];
      customizations[customizationIndex].options = [
        ...customizations[customizationIndex].options,
        { ...newOption } as CustomizationOption
      ];
      return { ...prev, customizations };
    });

    setNewOption({
      name: '',
      price: 0
    });
  };

  const removeCustomization = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customizations: prev.customizations?.filter((_, i) => i !== index)
    }));
  };

  const removeOption = (customizationIndex: number, optionIndex: number) => {
    setFormData(prev => {
      const customizations = [...(prev.customizations || [])];
      customizations[customizationIndex].options = customizations[customizationIndex].options.filter(
        (_, i) => i !== optionIndex
      );
      return { ...prev, customizations };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Producto
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio Base
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.basePrice}
            onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL de la Imagen
        </label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="w-full px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
          required
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personalizaciones</h3>
        
        <div className="space-y-4">
          {formData.customizations?.map((customization, customizationIndex) => (
            <div key={customizationIndex} className="border rounded-md p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-medium">{customization.name}</h4>
                  <div className="flex space-x-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={customization.required}
                        onChange={(e) => {
                          const customizations = [...(formData.customizations || [])];
                          customizations[customizationIndex].required = e.target.checked;
                          setFormData({ ...formData, customizations });
                        }}
                        className="mr-2"
                      />
                      Requerido
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={customization.multiple}
                        onChange={(e) => {
                          const customizations = [...(formData.customizations || [])];
                          customizations[customizationIndex].multiple = e.target.checked;
                          setFormData({ ...formData, customizations });
                        }}
                        className="mr-2"
                      />
                      Selección Múltiple
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomization(customizationIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                {customization.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={option.name}
                      onChange={(e) => {
                        const customizations = [...(formData.customizations || [])];
                        customizations[customizationIndex].options[optionIndex].name = e.target.value;
                        setFormData({ ...formData, customizations });
                      }}
                      className="flex-1 px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Nombre de la opción"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={option.price}
                      onChange={(e) => {
                        const customizations = [...(formData.customizations || [])];
                        customizations[customizationIndex].options[optionIndex].price = parseFloat(e.target.value);
                        setFormData({ ...formData, customizations });
                      }}
                      className="w-32 px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Precio"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(customizationIndex, optionIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                <div className="flex items-center space-x-4 mt-2">
                  <input
                    type="text"
                    value={newOption.name}
                    onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Nueva opción"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={newOption.price}
                    onChange={(e) => setNewOption({ ...newOption, price: parseFloat(e.target.value) })}
                    className="w-32 px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Precio"
                  />
                  <button
                    type="button"
                    onClick={() => addOption(customizationIndex)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={newCustomization.name}
              onChange={(e) => setNewCustomization({ ...newCustomization, name: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
              placeholder="Nueva personalización"
            />
            <button
              type="button"
              onClick={addCustomization}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          {product ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </div>
    </form>
  );
}