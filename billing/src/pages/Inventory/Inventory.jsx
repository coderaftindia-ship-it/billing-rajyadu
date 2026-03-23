import React, { useState } from 'react';
import { 
  History, ArrowUpCircle, ArrowDownCircle, AlertTriangle, 
  Search, Filter, Download, Settings2, Package, Calendar, 
  MoreVertical, Plus, X 
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useBilling } from '../../context/BillingContext';

export default function Inventory() {
  const { products, inventoryHistory, adjustStock } = useBilling();
  const [activeTab, setActiveTab] = useState('History');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustmentData, setAdjustmentData] = useState({ productId: '', amount: 0, type: 'Stock In' });

  const lowStockItems = products.filter(p => p.stock < 20);

  const handleAdjust = (e) => {
    e.preventDefault();
    if (!adjustmentData.productId) return;
    const amount = adjustmentData.type === 'Stock Out' ? -adjustmentData.amount : adjustmentData.amount;
    adjustStock(parseInt(adjustmentData.productId), amount, adjustmentData.type);
    setShowAdjustModal(false);
    setAdjustmentData({ productId: '', amount: 0, type: 'Stock In' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
          <p className="text-slate-500 text-sm">Track movements and adjust stock.</p>
        </div>
        <button onClick={() => setShowAdjustModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg transition-all"><Settings2 size={18} /> Adjust Stock</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4"><Package size={24} /></div>
          <p className="text-sm font-medium text-slate-500">Total Stock Items</p>
          <h3 className="text-2xl font-bold text-slate-900">{products.reduce((acc, p) => acc + p.stock, 0).toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm ring-2 ring-rose-500/20">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl w-fit mb-4"><AlertTriangle size={24} /></div>
          <p className="text-sm font-medium text-slate-500">Low Stock Items</p>
          <h3 className="text-2xl font-bold text-rose-600">{lowStockItems.length}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 font-bold text-slate-900">Movement History</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Transaction</th>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Qty</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {inventoryHistory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", item.type === 'Stock In' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600')}>
                            {item.type === 'Stock In' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                          </div>
                          <span className="text-sm font-bold">{item.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600">{item.product}</td>
                      <td className="px-6 py-4"><span className={cn("text-sm font-bold", item.quantity > 0 ? "text-emerald-600" : "text-rose-600")}>{item.quantity > 0 ? '+' : ''}{item.quantity}</span></td>
                      <td className="px-6 py-4 text-xs text-slate-400">{item.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm ring-1 ring-rose-500/10">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><AlertTriangle className="text-rose-500" size={20} /> Low Stock Alert</h3>
            <div className="space-y-4">
              {lowStockItems.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start font-bold text-slate-900"><span>{item.name}</span><span className="text-rose-600">{item.stock}</span></div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden"><div className="h-full bg-rose-500 rounded-full" style={{ width: `${(item.stock / 20) * 100}%` }}></div></div>
                </div>
              ))}
              {lowStockItems.length === 0 && <p className="text-center text-slate-400 py-4">All stock levels are good!</p>}
            </div>
          </div>
        </div>
      </div>

      {showAdjustModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">Manual Stock Adjustment</h2>
              <button onClick={() => setShowAdjustModal(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors"><X size={20} className="text-slate-500" /></button>
            </div>
            <form onSubmit={handleAdjust} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Select Product</label>
                <select required className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all appearance-none" value={adjustmentData.productId} onChange={(e) => setAdjustmentData({...adjustmentData, productId: e.target.value})}>
                  <option value="">Choose Product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (Current: {p.stock})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Stock In', 'Stock Out'].map(type => (
                    <button key={type} type="button" onClick={() => setAdjustmentData({...adjustmentData, type})} className={cn("py-3 rounded-xl border text-sm font-bold transition-all", adjustmentData.type === type ? "bg-blue-600 border-blue-600 text-white" : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100")}>{type}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Quantity</label>
                <input required type="number" min="1" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all" value={adjustmentData.amount} onChange={(e) => setAdjustmentData({...adjustmentData, amount: Number(e.target.value)})} />
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98]">Confirm Adjustment</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
