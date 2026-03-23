import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Plus, Search, Calendar, Truck, DollarSign, FileText, 
  ChevronRight, MoreVertical, Download, Filter, CheckCircle2, Clock, X
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useBilling } from '../../context/BillingContext';

export default function Purchases() {
  const { purchases, suppliers, products, addPurchase, updatePurchase, deletePurchase, adjustStock } = useBilling();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [formData, setFormData] = useState({ 
    purchaseOrderNumber: '', supplierId: '', totalAmount: 0, 
    status: 'PENDING', paymentStatus: 'UNPAID', purchaseDate: new Date().toISOString().split('T')[0]
  });

  const filteredPurchases = useMemo(() => 
    purchases.filter(p => {
      const matchesSearch = p.purchaseOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suppliers.find(s => s.id === p.supplierId)?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchesPayment = paymentFilter === 'ALL' || p.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    }), [purchases, suppliers, searchQuery, statusFilter, paymentFilter]);

  const handleExport = () => {
    const headers = ['PO Number,Supplier,Amount,Status,Payment,Date\n'];
    const rows = filteredPurchases.map(p => {
      const supplier = suppliers.find(s => s.id === p.supplierId)?.name || 'N/A';
      return `${p.purchaseOrderNumber},${supplier},${p.totalAmount},${p.status},${p.paymentStatus},${new Date(p.purchaseDate).toLocaleDateString()}\n`;
    });
    
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchases_report_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  const openAddModal = () => {
    setEditingId(null);
    const nextPoNumber = `PUR-${(purchases.length + 1).toString().padStart(3, '0')}`;
    setFormData({ 
      purchaseOrderNumber: nextPoNumber, supplierId: '', totalAmount: 0, 
      status: 'PENDING', paymentStatus: 'UNPAID', purchaseDate: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const openEditModal = (purchase) => {
    setEditingId(purchase.id);
    setFormData({ ...purchase, purchaseDate: new Date(purchase.purchaseDate).toISOString().split('T')[0] });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure purchaseDate is a full ISO string for LocalDateTime in backend
    const submissionDate = new Date(formData.purchaseDate);
    submissionDate.setHours(new Date().getHours(), new Date().getMinutes(), new Date().getSeconds());
    
    const dataToSubmit = { 
      ...formData, 
      totalAmount: Number(formData.totalAmount), 
      supplierId: Number(formData.supplierId),
      purchaseDate: submissionDate.toISOString()
    };
    
    if (editingId) {
      updatePurchase(editingId, dataToSubmit);
    } else {
      addPurchase(dataToSubmit);
    }
    setShowModal(false);
  };

  const totalPurchases = purchases.reduce((acc, p) => acc + p.totalAmount, 0);
  const receivedOrders = purchases.filter(p => p.status === 'RECEIVED').length;
  const pendingOrders = purchases.filter(p => p.status === 'PENDING').length;
  const totalOutstanding = purchases.filter(p => p.paymentStatus !== 'PAID').reduce((acc, p) => acc + p.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Purchase Module</h1>
          <p className="text-slate-500 text-sm">Manage and track inventory purchases from suppliers.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg transition-all"><Plus size={18} /> New Purchase Order</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4"><ShoppingBag size={24} /></div><p className="text-sm font-medium text-slate-500">Total Purchases</p><h3 className="text-2xl font-bold text-slate-900">₹{totalPurchases.toLocaleString()}</h3></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4"><CheckCircle2 size={24} /></div><p className="text-sm font-medium text-slate-500">Received Orders</p><h3 className="text-2xl font-bold text-slate-900">{receivedOrders}</h3></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"><div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit mb-4"><Clock size={24} /></div><p className="text-sm font-medium text-slate-500">Pending Orders</p><h3 className="text-2xl font-bold text-slate-900">{pendingOrders}</h3></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm ring-2 ring-rose-500/10"><div className="p-3 bg-rose-50 text-rose-600 rounded-xl w-fit mb-4"><DollarSign size={24} /></div><p className="text-sm font-medium text-slate-500">Total Outstanding</p><h3 className="text-2xl font-bold text-rose-600">₹{totalOutstanding.toLocaleString()}</h3></div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center relative">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-full md:w-96 group focus-within:bg-white focus-within:border-blue-500 transition-all">
            <Search className="text-slate-400 group-focus-within:text-blue-500" size={18} />
            <input type="text" placeholder="Search by order ID or supplier..." className="bg-transparent border-none outline-none w-full text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition-all"
            >
              <Download size={18} />
              <span>Export</span>
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  showFilters ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                )}
              >
                <Filter size={18} />
                <span>Filter</span>
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-2 bg-white border border-slate-200 shadow-2xl rounded-2xl p-5 z-[100] min-w-[240px] space-y-5 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-sm font-bold text-slate-900">Filter Purchases</h4>
                    <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Order Status</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="ALL">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="RECEIVED">Received</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Payment Status</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl text-xs p-3 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                    >
                      <option value="ALL">All Payments</option>
                      <option value="PAID">Paid</option>
                      <option value="UNPAID">Unpaid</option>
                      <option value="PARTIAL">Partial</option>
                    </select>
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={() => { setStatusFilter('ALL'); setPaymentFilter('ALL'); setShowFilters(false); }}
                      className="w-full py-2.5 text-[10px] font-black uppercase text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-b-2xl">
          <table className="w-full text-left">
            <thead><tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider"><th className="px-6 py-4">Purchase Order</th><th className="px-6 py-4">Supplier</th><th className="px-6 py-4">Total Amount</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Payment</th><th className="px-6 py-4 text-right">Date</th></tr></thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPurchases.map((purchase) => {
                const supplier = suppliers.find(s => s.id === purchase.supplierId);
                return (
                  <tr key={purchase.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => openEditModal(purchase)}>
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><FileText size={20} /></div><p className="text-sm font-bold text-slate-900">{purchase.purchaseOrderNumber}</p></div></td>
                    <td className="px-6 py-4"><div className="flex items-center gap-2"><Truck size={14} className="text-slate-400" /><p className="text-sm font-medium text-slate-600">{supplier?.name || 'N/A'}</p></div></td>
                    <td className="px-6 py-4"><p className="text-sm font-bold text-slate-900">₹{purchase.totalAmount.toFixed(2)}</p></td>
                    <td className="px-6 py-4"><span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter", purchase.status === 'RECEIVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>{purchase.status}</span></td>
                    <td className="px-6 py-4"><span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter", purchase.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : purchase.paymentStatus === 'PARTIAL' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600')}>{purchase.paymentStatus}</span></td>
                    <td className="px-6 py-4 text-right"><p className="text-sm text-slate-500 font-medium">{new Date(purchase.purchaseDate).toLocaleDateString()}</p></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"><h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Purchase Order' : 'New Purchase Order'}</h2><button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-xl"><X size={20} /></button></div>
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2"><label className="text-xs font-black uppercase text-slate-500">PO Number</label><input required type="text" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm" value={formData.purchaseOrderNumber} onChange={(e) => setFormData({...formData, purchaseOrderNumber: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-xs font-black uppercase text-slate-500">Supplier</label><select required className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm" value={formData.supplierId} onChange={(e) => setFormData({...formData, supplierId: e.target.value})}><option value="">Select Supplier</option>{suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
              <div className="space-y-2"><label className="text-xs font-black uppercase text-slate-500">Total Amount</label><input required type="number" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm" value={formData.totalAmount} onChange={(e) => setFormData({...formData, totalAmount: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-xs font-black uppercase text-slate-500">Purchase Date</label><input required type="date" className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm" value={formData.purchaseDate} onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-xs font-black uppercase text-slate-500">Order Status</label><select className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}><option value="PENDING">Pending</option><option value="RECEIVED">Received</option></select></div>
              <div className="space-y-2"><label className="text-xs font-black uppercase text-slate-500">Payment Status</label><select className="w-full bg-slate-50 rounded-xl px-4 py-3 text-sm" value={formData.paymentStatus} onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})}><option value="UNPAID">Unpaid</option><option value="PARTIAL">Partial</option><option value="PAID">Paid</option></select></div>
              <div className="md:col-span-2 pt-4 flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg">{editingId ? 'Save Changes' : 'Create Order'}</button>
                {editingId && <button type="button" onClick={() => {deletePurchase(editingId); setShowModal(false);}} className="py-4 px-6 bg-rose-50 text-rose-600 rounded-2xl font-bold">Delete</button>}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
