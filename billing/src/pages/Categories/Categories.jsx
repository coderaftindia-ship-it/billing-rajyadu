import React, { useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Tags, ChevronRight,
  MoreVertical, Package, Layers, ArrowRight, X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useBilling } from '../../context/BillingContext';

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useBilling();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', icon: '🛒', color: 'bg-blue-500'
  });

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', icon: '🛒', color: 'bg-blue-500' });
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat.id);
    setFormData({ ...cat });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateCategory(editingId, formData);
    } else {
      addCategory(formData);
    }
    setShowModal(false);
  };

  const icons = ['🫙', '🍯', '🌿', '🌶️', '🌾', '🛒', '📦', '🍎', '🧴', '🧼'];
  const colors = [
    { name: 'Blue', class: 'bg-blue-500' },
    { name: 'Amber', class: 'bg-amber-500' },
    { name: 'Emerald', class: 'bg-emerald-500' },
    { name: 'Rose', class: 'bg-rose-500' },
    { name: 'Orange', class: 'bg-orange-400' },
    { name: 'Yellow', class: 'bg-yellow-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Category Management</h1>
          <p className="text-slate-500 text-sm">Organize products into groups.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg transition-all"><Plus size={18} /> Add New Category</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-transform group-hover:scale-110", category.color, "bg-opacity-10 shadow-current/20")}>
                  {category.icon}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(category)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"><Edit2 size={16} /></button>
                  <button onClick={() => deleteCategory(category.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"><Trash2 size={16} /></button>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{category.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{category.description}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Package size={16} className="text-slate-400" />
                <span className="text-sm font-bold">{category.items} Products</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors"><X size={20} className="text-slate-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Category Name</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Description</label>
                <textarea rows="3" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all resize-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Icon</label>
                  <div className="grid grid-cols-5 gap-2">
                    {icons.map(icon => <button key={icon} type="button" onClick={() => setFormData({...formData, icon})} className={cn("w-10 h-10 flex items-center justify-center rounded-lg text-xl transition-all", formData.icon === icon ? "bg-blue-600 shadow-lg" : "bg-slate-50 hover:bg-slate-100")}>{icon}</button>)}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Color Theme</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map(color => <button key={color.class} type="button" onClick={() => setFormData({...formData, color: color.class})} className={cn("w-8 h-8 rounded-full transition-all border-2", formData.color === color.class ? "border-slate-900 scale-110" : "border-transparent", color.class)} />)}
                  </div>
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-[0.98]">{editingId ? 'Save Changes' : 'Add Category'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
