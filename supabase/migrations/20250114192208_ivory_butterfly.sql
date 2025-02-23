/*
  # Initial Schema Setup for Food Delivery App

  1. New Tables
    - users
      - Custom user data extending auth.users
    - themes
      - Store theme configuration
    - products
      - Store product information
    - customizations
      - Product customization options
    - customization_options
      - Individual options for customizations
    - orders
      - Customer orders
    - order_items
      - Items within orders
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  address text,
  phone text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo text NOT NULL,
  primary_color text NOT NULL,
  secondary_color text NOT NULL,
  accent_color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  base_price decimal NOT NULL,
  image text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  required boolean DEFAULT false,
  multiple boolean DEFAULT false,
  max_selections int,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customization_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customization_id uuid REFERENCES customizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  price decimal NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  total decimal NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity int NOT NULL,
  customizations jsonb,
  price decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customization_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all products" 
  ON public.products FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can read all customizations" 
  ON public.customizations FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can read all customization options" 
  ON public.customization_options FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can read their own orders" 
  ON public.orders FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own orders" 
  ON public.orders FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read their own order items" 
  ON public.order_items FOR SELECT 
  TO authenticated 
  USING (order_id IN (
    SELECT id FROM public.orders WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own order items" 
  ON public.order_items FOR INSERT 
  TO authenticated 
  WITH CHECK (order_id IN (
    SELECT id FROM public.orders WHERE user_id = auth.uid()
  ));

-- Insert sample data
INSERT INTO public.products (name, description, base_price, image, category) VALUES
('Classic Burger', 'Our signature burger with your choice of protein', 12.99, 'https://images.unsplash.com/photo-1513104890138-7c749659a591', 'Burgers'),
('Deluxe Burger', 'Premium burger with special sauce', 15.99, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add', 'Burgers');

-- Add customizations for burgers
INSERT INTO public.customizations (product_id, name, required, multiple, max_selections)
SELECT 
  p.id,
  'Choose your protein',
  true,
  false,
  1
FROM public.products p
WHERE p.category = 'Burgers';

-- Add protein options
INSERT INTO public.customization_options (customization_id, name, price)
SELECT 
  c.id,
  unnest(ARRAY['Beef', 'Chicken', 'Pork']),
  0
FROM public.customizations c
WHERE c.name = 'Choose your protein';

-- Add extras customization
INSERT INTO public.customizations (product_id, name, required, multiple, max_selections)
SELECT 
  p.id,
  'Add extras',
  false,
  true,
  5
FROM public.products p
WHERE p.category = 'Burgers';

-- Add extras options
INSERT INTO public.customization_options (customization_id, name, price)
SELECT 
  c.id,
  unnest(ARRAY['Bacon', 'Extra Cheese', 'Fried Egg', 'Avocado', 'Caramelized Onions']),
  unnest(ARRAY[2.50, 1.50, 2.00, 2.50, 1.00])
FROM public.customizations c
WHERE c.name = 'Add extras';