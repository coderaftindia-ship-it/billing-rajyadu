import React, { useState } from 'react';
import { 
  UserCog, Plus, Search, Shield, User as UserIcon, Lock, Key, 
  MoreVertical, Edit2, Trash2, ShieldCheck, ShieldAlert, ChevronRight, X, Save, CheckCircle2,
  Mail, Phone, Calendar, Clock
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useBilling } from '../../context/BillingContext';

const allModules = ['Dashboard', 'Billing / POS', 'Products', 'Categories', 'Inventory', 'Customers', 'Suppliers', 'Purchases', 'Reports', 'Expenses', 'User Management', 'Settings'];

export default function Users() {
  const { users, addUser, updateUser, deleteUser } = useBilling();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({ 
    username: '', 
    name: '', 
    email: '', 
    password: '', 
    role: 'Staff', 
    status: 'Active',
    permissions: 'Dashboard,Billing / POS' 
  });

  const filteredUsers = users.filter(u => 
    (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ 
      username: '', 
      name: '', 
      email: '', 
      password: '', 
      role: 'Staff', 
      status: 'Active',
      permissions: 'Dashboard,Billing / POS' 
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingId(user.id);
    setFormData({ 
      username: user.username || '', 
      name: user.name || '', 
      email: user.email || '', 
      password: '', // Don't show password
      role: user.role || 'Staff', 
      status: user.status || 'Active',
      permissions: user.permissions || '' 
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateUser(editingId, formData);
    } else {
      addUser({
        ...formData,
        lastActive: new Date().toISOString()
      });
    }
    setShowModal(false);
  };

  const handlePermissionToggle = (module) => {
    const currentPerms = formData.permissions ? formData.permissions.split(',') : [];
    const newPerms = currentPerms.includes(module)
      ? currentPerms.filter(p => p !== module)
      : [...currentPerms, module];
    setFormData({ ...formData, permissions: newPerms.join(',') });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm">Manage staff roles and access levels.</p>
        </div>
        <button 
          onClick={openAddModal} 
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          <Plus size={20} /> 
          Add New User
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-full md:w-96 group focus-within:bg-white focus-within:border-blue-500 transition-all">
            <Search className="text-slate-400 group-focus-within:text-blue-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, username or email..." 
              className="bg-transparent border-none outline-none w-full text-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Total Users: <span className="text-slate-900">{users.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-widest">
                <th className="px-8 py-5">User Details</th>
                <th className="px-6 py-5">Role & Status</th>
                <th className="px-6 py-5">Permissions</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-lg">
                        {user.name ? user.name[0].toUpperCase() : user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.name || user.username}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <Mail size={10} /> {user.email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1.5">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter",
                        user.role === 'Admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                      )}>
                        {user.role}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div className={cn("w-1.5 h-1.5 rounded-full", user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300')}></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{user.status || 'Active'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1 max-w-[300px]">
                      {user.permissions ? (
                        user.permissions.split(',').slice(0, 3).map(p => (
                          <span key={p} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold whitespace-nowrap">{p}</span>
                        ))
                      ) : user.role === 'Admin' ? (
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-500 rounded text-[9px] font-bold whitespace-nowrap">All Access</span>
                      ) : (
                        <span className="text-[9px] text-slate-400 italic">No permissions</span>
                      )}
                      {user.permissions && user.permissions.split(',').length > 3 && (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded text-[9px] font-bold">+{user.permissions.split(',').length - 3} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(user)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => { if(window.confirm('Delete this user?')) deleteUser(user.id); }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit User' : 'Add New User'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-2">Basic Information</h3>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Full Name</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      placeholder="e.g. Rahul Sharma" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700">Username</label>
                      <input 
                        required 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner" 
                        value={formData.username} 
                        onChange={(e) => setFormData({...formData, username: e.target.value})} 
                        placeholder="rahul_s" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700">Password</label>
                      <input 
                        required={!editingId} 
                        type="password" 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner" 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})} 
                        placeholder={editingId ? 'Leave blank to keep same' : '••••••••'} 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                      placeholder="rahul@example.com" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700">Role</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner appearance-none"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Staff">Staff</option>
                        <option value="Accountant">Accountant</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700">Account Status</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner appearance-none"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 pb-2">Module Access Permissions</h3>
                  
                  <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {allModules.map(module => {
                      const hasPermission = formData.permissions ? formData.permissions.split(',').includes(module) : false;
                      return (
                        <div 
                          key={module}
                          onClick={() => handlePermissionToggle(module)}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer group",
                            hasPermission ? "bg-blue-50 border-blue-600 shadow-md shadow-blue-100" : "bg-white border-slate-100 hover:border-slate-200"
                          )}
                        >
                          <div className={cn(
                            "w-5 h-5 rounded-lg flex items-center justify-center transition-all",
                            hasPermission ? "bg-blue-600 text-white" : "bg-slate-100 text-transparent group-hover:bg-slate-200"
                          )}>
                            <CheckCircle2 size={12} />
                          </div>
                          <span className={cn("text-xs font-bold", hasPermission ? "text-blue-700" : "text-slate-600")}>{module}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="mt-12 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {editingId ? 'Save Changes' : 'Create User Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
