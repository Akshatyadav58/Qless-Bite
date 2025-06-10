import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const { currentUser, logout, userProfile } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const cartItemsCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await logout();
      setProfileMenuOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <ShoppingBag className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">QLess Bites</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
              Home
            </Link>
            
            {currentUser && (
              <>
                <Link to="/orders" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                  My Orders
                </Link>
                
                {userProfile?.role === 'admin' || userProfile?.role === 'vendor' ? (
                  <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">
                    Dashboard
                  </Link>
                ) : null}
              </>
            )}

            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/cart" 
                  className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <ShoppingBag className="h-5 w-5 text-gray-600" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                
                <div className="relative">
                  <button 
                    className="flex items-center focus:outline-none"
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {currentUser.photoURL ? (
                        <img 
                          src={currentUser.photoURL} 
                          alt="Profile" 
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                  </button>
                  
                  {profileMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                      onMouseLeave={() => setProfileMenuOpen(false)}
                    >
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <span className="flex items-center">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            {currentUser && (
              <Link 
                to="/cart" 
                className="relative p-2 mr-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <ShoppingBag className="h-5 w-5 text-gray-600" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}
            
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            
            {currentUser && (
              <>
                <Link
                  to="/orders"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                
                {userProfile?.role === 'admin' || userProfile?.role === 'vendor' ? (
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : null}
                
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign out
                </button>
              </>
            )}
            
            {!currentUser && (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" fullWidth>
                    Sign in
                  </Button>
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="primary" fullWidth>
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;