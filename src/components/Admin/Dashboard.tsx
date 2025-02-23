import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { Settings, Package, ShoppingBag, Users, Palette } from 'lucide-react';
import ProductManager from './ProductManager';
import ThemeManager from './ThemeManager';
import OrderManager from './OrderManager';
import UserManager from './UserManager';

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Panel Administrativo</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/products"
                className="flex items-center p-2 text-gray-700 hover:bg-orange-50 rounded-lg"
              >
                <Package className="h-5 w-5 mr-3" />
                Productos
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="flex items-center p-2 text-gray-700 hover:bg-orange-50 rounded-lg"
              >
                <ShoppingBag className="h-5 w-5 mr-3" />
                Pedidos
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center p-2 text-gray-700 hover:bg-orange-50 rounded-lg"
              >
                <Users className="h-5 w-5 mr-3" />
                Usuarios
              </Link>
            </li>
            <li>
              <Link
                to="/admin/theme"
                className="flex items-center p-2 text-gray-700 hover:bg-orange-50 rounded-lg"
              >
                <Palette className="h-5 w-5 mr-3" />
                Tema
              </Link>
            </li>
            <li>
              <Link
                to="/admin/settings"
                className="flex items-center p-2 text-gray-700 hover:bg-orange-50 rounded-lg"
              >
                <Settings className="h-5 w-5 mr-3" />
                Configuración
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="/products" element={<ProductManager />} />
            <Route path="/theme" element={<ThemeManager />} />
            <Route path="/orders" element={<OrderManager />} />
            <Route path="/users" element={<UserManager />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}