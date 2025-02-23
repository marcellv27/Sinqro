import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { Search, ShoppingCart, Menu, MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import CartPage from './components/Cart/CartPage';
import CheckoutPage from './components/Checkout/CheckoutPage';
import Dashboard from './components/Admin/Dashboard';

// Componente de protección para rutas administrativas
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  // Aquí puedes agregar la lógica para verificar si el usuario es administrador
  const isAdmin = user?.email === 'admin@example.com'; // Ejemplo simple

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { user, signOut } = useAuth();
  const { items } = useCart();
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Menu className="h-6 w-6 mr-4 lg:hidden" />
              <Link to="/" className="text-xl font-bold">FoodDelivery</Link>
              <div className="hidden lg:flex items-center ml-8">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span className="ml-2">{user?.address || 'Seleccionar ubicación'}</span>
                <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
              </div>
            </div>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar restaurantes y platos"
                  className="w-full px-4 py-2 pl-10 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="flex items-center">
              {user ? (
                <>
                  <span className="mr-4">{user.name}</span>
                  {user.email === 'admin@example.com' && (
                    <Link
                      to="/admin"
                      className="px-4 py-2 text-gray-700 hover:text-gray-900"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-gray-900">
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/register"
                    className="ml-4 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800"
                  >
                    Registrarse
                  </Link>
                </>
              )}
              <Link to="/cart" className="ml-4 relative">
                <ShoppingCart className="h-6 w-6 text-gray-700" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route path="/" element={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Contenido de la página principal */}
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;