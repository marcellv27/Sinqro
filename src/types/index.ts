export interface Theme {
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  address: string;
  phone: string;
  orders: Order[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: string;
  customizations: ProductCustomization[];
}

export interface ProductCustomization {
  id: string;
  name: string;
  options: CustomizationOption[];
  required: boolean;
  multiple: boolean;
  maxSelections?: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'delivering' | 'completed';
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  customizations: SelectedCustomization[];
  price: number;
}

export interface SelectedCustomization {
  customizationId: string;
  optionIds: string[];
}