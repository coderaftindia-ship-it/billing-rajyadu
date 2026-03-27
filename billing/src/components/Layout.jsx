import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Bell, User, Search, X, Check, Trash2, Menu, UserCog, Lock } from 'lucide-react';
import { useBilling } from '../context/BillingContext';
import { ToastContainer } from './ToastContainer';

export function Layout() {
  const { 
    currentUser, notifications, markNotificationAsRead, 
    clearNotifications, products, customers, suppliers 
  } = useBilling();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredResults = {
    products: products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
    customers: customers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
    suppliers: suppliers.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
  };

  const hasResults = searchQuery.length > 0 && (
    filteredResults.products.length > 0 || 
    filteredResults.customers.length > 0 || 
    filteredResults.suppliers.length > 0
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close sidebar on navigation in mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [navigate]);

  const handleSearchItemClick = (type, id) => {
    setSearchQuery('');
    setShowSearchResults(false);
    navigate(`/${type}`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/25 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col print:ml-0 transition-all duration-300 max-w-full overflow-x-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-3 md:px-8 sticky top-0 z-30 shadow-sm print:hidden">
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden"
            >
              <Menu size={20} />
            </button>
            
            <div className="relative flex-1 md:flex-none" ref={searchRef}>
              <div className="flex items-center gap-2 md:gap-4 bg-slate-100 px-3 md:px-4 py-1.5 md:py-2 rounded-xl w-full md:w-64 lg:w-96 group focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                <Search className="text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none w-full text-xs md:text-sm text-slate-700 placeholder:text-slate-400"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}>
                    <X size={14} className="text-slate-400 hover:text-slate-600" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && hasResults && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  {filteredResults.products.length > 0 && (
                    <div className="p-2 border-b border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase px-3 mb-1">Products</p>
                      {filteredResults.products.map(p => (
                        <button 
                          key={p.id}
                          onClick={() => handleSearchItemClick('products', p.id)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded-lg flex justify-between items-center"
                        >
                          <span className="text-slate-700">{p.name}</span>
                          <span className="text-xs text-slate-400">Stock: {p.stock}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {filteredResults.customers.length > 0 && (
                    <div className="p-2 border-b border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase px-3 mb-1">Customers</p>
                      {filteredResults.customers.map(c => (
                        <button 
                          key={c.id}
                          onClick={() => handleSearchItemClick('customers', c.id)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded-lg"
                        >
                          <span className="text-slate-700">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {filteredResults.suppliers.length > 0 && (
                    <div className="p-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase px-3 mb-1">Suppliers</p>
                      {filteredResults.suppliers.map(s => (
                        <button 
                          key={s.id}
                          onClick={() => handleSearchItemClick('suppliers', s.id)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 rounded-lg"
                        >
                          <span className="text-slate-700">{s.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative" ref={notificationRef}>
              <button 
                className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                    <button 
                      onClick={clearNotifications}
                      className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={12} /> Clear all
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400">
                        <Bell size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors relative group ${!n.read ? 'bg-blue-50/30' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm font-medium ${!n.read ? 'text-blue-600' : 'text-slate-900'}`}>{n.title}</h4>
                            {!n.read && (
                              <button 
                                onClick={() => markNotificationAsRead(n.id)}
                                className="text-slate-400 hover:text-green-600 transition-colors"
                                title="Mark as read"
                              >
                                <Check size={14} />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative pl-3 md:pl-6 border-l border-slate-200" ref={userMenuRef}>
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 md:gap-3"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900 leading-tight">
                    {currentUser?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {currentUser?.role || 'Business Owner'}
                  </p>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white border border-blue-100 shadow-sm">
                  <User size={18} />
                </div>
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-2">
                    <button 
                      onClick={() => {
                        navigate('/profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3"
                    >
                      <UserCog size={16} className="text-slate-400" />
                      <span>Edit Profile</span>
                    </button>
                    <button 
                      onClick={() => {
                        navigate('/forgot-password');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-3"
                    >
                      <Lock size={16} className="text-slate-400" />
                      <span>Change Password</span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-slate-100">
                    <button 
                      onClick={() => {
                        // Implement logout logic here
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-3"
                    >
                      <User size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <div className="p-4 md:p-8 flex-1">
          <Outlet />
        </div>
        <ToastContainer />
      </main>
    </div>
  );
}
