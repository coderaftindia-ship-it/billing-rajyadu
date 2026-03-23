import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Tags, 
  History, 
  Users, 
  Truck, 
  ShoppingBag, 
  BarChart3, 
  Wallet, 
  UserCog, 
  Settings,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { cn } from '../utils/cn';

import { useBilling } from '../context/BillingContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ShoppingCart, label: 'Billing / POS', path: '/pos' },
  { icon: History, label: 'Billing History', path: '/billing-history' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: Tags, label: 'Categories', path: '/categories' },
  { icon: History, label: 'Inventory', path: '/inventory' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: Truck, label: 'Suppliers', path: '/suppliers' },
  { icon: ShoppingBag, label: 'Purchases', path: '/purchases' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Wallet, label: 'Expenses', path: '/expenses' },
  { icon: UserCog, label: 'User Management', path: '/users' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { currentUser, logout, settings } = useBilling();

  const companyName = settings.find(s => s.key === 'companyName')?.value || 'SmartBill';
  const companyLogo = settings.find(s => s.key === 'companyLogo')?.value;

  const filteredMenuItems = menuItems.filter(item => {
    if (!currentUser) return false;
    
    // Admins see everything
    if (currentUser.role === 'Admin') return true;
    
    // Others need explicit permission
    if (!currentUser.permissions) return false;
    
    const userPermissions = currentUser.permissions.split(',').map(p => p.trim());
    return userPermissions.includes(item.label);
  });

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 print:hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {companyLogo ? (
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
              <img src={companyLogo} alt="Logo" className="w-full h-full object-contain" />
            </div>
          ) : null}
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent truncate">
            {companyName}
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-blue-50 text-blue-600 font-semibold" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={cn(
                  "transition-colors",
                  isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                )} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="mb-4 px-3">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Logged in as</p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center text-[10px] font-bold">
              {currentUser?.name ? currentUser.name[0] : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-700 truncate">{currentUser?.name || 'Admin User'}</p>
              <p className="text-[9px] text-slate-400 font-medium">{currentUser?.role || 'Admin'}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 w-full text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
