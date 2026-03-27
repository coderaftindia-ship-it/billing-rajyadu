import React, { useState } from 'react';
import { 
  Users as UsersIcon, Search, Plus, Phone, MapPin, 
  Wallet, History, Edit2, Trash2, CreditCard, X 
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useBilling } from '../../context/BillingContext';

export default function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, addToast } = useBilling();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', gst: '' });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
  );

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', phone: '', address: '', gst: '' });
    setShowModal(true);
  };

  const openEditModal = (customer) => {
    setEditingId(customer.id);
    setFormData({ ...customer });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCustomer(editingId, formData);
        addToast('Customer profile updated');
      } else {
        await addCustomer(formData);
        addToast('New customer added');
      }
      setShowModal(false);
    } catch (error) {
      addToast('Error saving customer', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      addToast('Customer deleted successfully');
      setShowDeleteConfirm(null);
    } catch (error) {
      addToast('Error deleting customer', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">Customer Management</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Manage profiles and credit.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-full md:w-96 group focus-within:bg-white focus-within:border-blue-500 transition-all">
            <Search className="text-slate-400 group-focus-within:text-blue-500" size={18} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="bg-transparent border-none outline-none w-full text-xs md:text-sm" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Credit</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">{customer.name[0]}</div>
                      <div><p className="text-sm font-bold text-slate-900">{customer.name}</p><p className="text-[10px] text-slate-400">Last visit: {customer.lastVisit}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{customer.phone}</td>
                  <td className="px-6 py-4"><span className={cn("text-sm font-bold px-3 py-1 rounded-full", customer.credit > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600")}>₹{customer.credit.toFixed(2)}</span></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(customer)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit"><Edit2 size={16} /></button>
                      <button onClick={() => setShowDeleteConfirm(customer)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <Trash2 size={40} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Delete Customer?</h3>
              <p className="text-slate-500 mt-2">Are you sure you want to delete <span className="font-bold text-slate-700">"{showDeleteConfirm.name}"</span>? This will also remove their credit history.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all">Cancel</button>
              <button onClick={() => handleDelete(showDeleteConfirm.id)} className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-200 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors"><X size={20} className="text-slate-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Full Name</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Phone Number</label>
                <input required type="tel" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Address</label>
                <textarea rows="3" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all resize-none" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98]">{editingId ? 'Save Changes' : 'Add Customer'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
