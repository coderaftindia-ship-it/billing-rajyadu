import React, { useState } from 'react';
import { 
  Truck, Search, Plus, Phone, Mail, Package, Wallet, 
  History, Edit2, Trash2, Download, Filter, ArrowRight, X 
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useBilling } from '../../context/BillingContext';

export default function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier, supplierSummaries, purchases, updateSupplierStatus, recordPurchasePayment } = useBilling();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', productsSupplied: '' });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({ supplierId: null, purchaseId: null, amount: '' });

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.phone && s.phone.includes(searchQuery))
  );

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', phone: '', email: '', productsSupplied: '' });
    setShowModal(true);
  };

  const openEditModal = (supplier) => {
    setEditingId(supplier.id);
    setFormData({ 
      name: supplier.name || '', 
      phone: supplier.phone || '', 
      email: supplier.email || '', 
      productsSupplied: supplier.productsSupplied || '' 
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateSupplier(editingId, formData);
    } else {
      addSupplier(formData);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">Supplier Management</h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium">Manage suppliers and orders.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-full md:w-96 group focus-within:bg-white focus-within:border-blue-500 transition-all">
            <Search className="text-slate-400 group-focus-within:text-blue-500" size={18} />
            <input 
              type="text" 
              placeholder="Search suppliers..." 
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
                <th className="px-6 py-4">Supplier</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Products</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Total Purchased</th>
                <th className="px-6 py-4">Paid</th>
                <th className="px-6 py-4">Outstanding</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">{(supplier.name && supplier.name[0]) || 'S'}</div>
                      <div><p className="text-sm font-bold text-slate-900">{supplier.name}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{supplier.phone}</td>
                  <td className="px-6 py-4"><span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{supplier.productsSupplied}</span></td>
                  <td className="px-6 py-4">{supplierSummaries.find(s => s.supplierId === supplier.id)?.totalQuantity || 0}</td>
                  <td className="px-6 py-4">₹{(supplierSummaries.find(s => s.supplierId === supplier.id)?.totalPurchasedAmount || 0).toFixed(2)}</td>
                  <td className="px-6 py-4">₹{(supplierSummaries.find(s => s.supplierId === supplier.id)?.totalPaidAmount || 0).toFixed(2)}</td>
                  <td className="px-6 py-4">₹{(supplierSummaries.find(s => s.supplierId === supplier.id)?.totalOutstandingAmount || 0).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <select className="bg-slate-50 rounded-lg px-3 py-2 text-sm" value={supplier.status || 'ACTIVE'} onChange={(e) => updateSupplierStatus(supplier.id, e.target.value)}>
                      <option value="PENDING">PENDING</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="DEACTIVATED">DEACTIVATED</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(supplier)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                      <button onClick={() => deleteSupplier(supplier.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                      <button onClick={() => { setPaymentForm({ supplierId: supplier.id, purchaseId: null, amount: '' }); setShowPaymentModal(true); }} className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg">₹</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Record Payment</h2>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors"><X size={20} className="text-slate-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-500">Purchase</label>
                <select value={paymentForm.purchaseId || ''} onChange={(e) => setPaymentForm({...paymentForm, purchaseId: e.target.value})} className="w-full bg-slate-50 rounded-xl px-4 py-3">
                  <option value="">Select purchase</option>
                  {purchases.filter(p => p.supplierId === paymentForm.supplierId).map(p => (
                    <option key={p.id} value={p.id}>{p.productName || p.description || `Purchase #${p.id}`} - Outstanding: ₹{((p.totalAmount || 0) - (p.paidAmount || 0)).toFixed(2)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-500">Amount</label>
                <input type="number" value={paymentForm.amount} onChange={(e) => setPaymentForm({...paymentForm, amount: e.target.value})} className="w-full bg-slate-50 rounded-xl px-4 py-3" />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowPaymentModal(false)} className="px-4 py-3 rounded-lg bg-slate-100">Cancel</button>
                <button onClick={async () => {
                  if (!paymentForm.purchaseId || !paymentForm.amount) return;
                  await recordPurchasePayment(paymentForm.purchaseId, paymentForm.amount);
                  setShowPaymentModal(false);
                }} className="px-4 py-3 rounded-lg bg-blue-600 text-white">Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Supplier' : 'Add New Supplier'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors"><X size={20} className="text-slate-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Supplier Name</label>
                <input required type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Contact Number</label>
                <input required type="tel" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Email</label>
                <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Products Supplied</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all" value={formData.productsSupplied} onChange={(e) => setFormData({...formData, productsSupplied: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98]">{editingId ? 'Save Changes' : 'Add Supplier'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
