import React, { useState } from 'react';
import { 
  Search, Calendar, Filter, Eye, Printer, 
  ChevronRight, ArrowLeft, MoreVertical,
  Download, Share2, Wallet, Smartphone, CreditCard, DollarSign, X
} from 'lucide-react';
import { useBilling } from '../../context/BillingContext';
import { cn } from '../../utils/cn';
import { PrintableInvoice } from '../../components/PrintableInvoice';

export default function BillingHistory() {
  const { pos, customers, products } = useBilling();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const [dateFilter, setDateFilter] = useState('All');

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'Cash': return <DollarSign size={16} />;
      case 'UPI': return <Smartphone size={16} />;
      case 'Card': return <CreditCard size={16} />;
      case 'Credit': return <Wallet size={16} />;
      default: return <DollarSign size={16} />;
    }
  };

  const filteredSales = pos.filter(sale => {
    const customer = customers.find(c => c.id === sale.customerId);
    const customerName = customer?.name || 'Walk-in Customer';
    const matchesSearch = customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         sale.id.toString().includes(searchQuery);
    
    if (dateFilter === 'Today') {
      const today = new Date().toLocaleDateString();
      return matchesSearch && new Date(sale.transactionDate).toLocaleDateString() === today;
    }
    
    return matchesSearch;
  }).reverse();

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleViewDetails = (sale) => {
    const customer = customers.find(c => c.id === sale.customerId);
    const saleItems = sale.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        name: product?.name || 'Unknown Product',
        gst: product?.gst || 0
      };
    });

    setSelectedSale({
      ...sale,
      customer,
      cart: saleItems
    });
    setShowDetailsModal(true);
  };

  const handlePrint = (sale) => {
    const customer = customers.find(c => c.id === sale.customerId);
    const saleItems = sale.items.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        name: product?.name || 'Unknown Product',
        gst: product?.gst || 0
      };
    });

    setSelectedSale({
      ...sale,
      customer,
      cart: saleItems
    });

    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Printable Invoice Component */}
      <PrintableInvoice 
        sale={selectedSale} 
        customer={selectedSale?.customer} 
        items={selectedSale?.cart || []} 
      />

      <div className="flex justify-between items-end print:hidden">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Billing History</h1>
          <p className="text-slate-500 font-medium">View and manage all your past invoices</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            {['All', 'Today'].map(filter => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                  dateFilter === filter ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden print:hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by Invoice ID or Customer Name..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-bold">
            <Filter size={18} />
            <span>Showing {filteredSales.length} Transactions</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="text-left py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Invoice</th>
                <th className="text-left py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="text-left py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                <th className="text-left py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="text-left py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Payment</th>
                <th className="text-right py-4 px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSales.map((sale) => {
                const customer = customers.find(c => c.id === sale.customerId);
                return (
                  <tr key={sale.id} className="group hover:bg-slate-50/80 transition-all">
                    <td className="py-4 px-6">
                      <span className="font-black text-slate-900 text-sm">#{sale.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xs">
                          {(customer?.name || 'W')[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{customer?.name || 'Walk-in Customer'}</p>
                          {customer?.phone && <p className="text-[10px] text-slate-400 font-medium">{customer.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-slate-700">{new Date(sale.transactionDate).toLocaleDateString()}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{new Date(sale.transactionDate).toLocaleTimeString()}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-black text-blue-600">₹{sale.totalAmount.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight",
                        sale.paymentMethod === 'Cash' ? "bg-emerald-50 text-emerald-600" :
                        sale.paymentMethod === 'UPI' ? "bg-blue-50 text-blue-600" :
                        sale.paymentMethod === 'Card' ? "bg-indigo-50 text-indigo-600" :
                        "bg-amber-50 text-amber-600"
                      )}>
                        {getPaymentIcon(sale.paymentMethod)}
                        {sale.paymentMethod}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => handlePrint(sale)}
                          className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 rounded-xl transition-all shadow-sm"
                          title="Print Invoice"
                        >
                          <Printer size={16} />
                        </button>
                        <button 
                          onClick={() => handleViewDetails(sale)}
                          className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 rounded-xl transition-all shadow-sm"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedSale && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:hidden">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900">Invoice Details</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">ID: #{selectedSale.id}</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-all"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</p>
                  <p className="font-bold text-slate-900 text-lg">{selectedSale.customer?.name || 'Walk-in Customer'}</p>
                  <p className="text-sm text-slate-500">{selectedSale.customer?.phone || 'No phone'}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</p>
                  <p className="font-bold text-slate-900">{new Date(selectedSale.transactionDate).toLocaleString()}</p>
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight mt-1",
                    selectedSale.paymentMethod === 'Cash' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                  )}>
                    {getPaymentIcon(selectedSale.paymentMethod)}
                    {selectedSale.paymentMethod}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
                      <th className="text-center py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                      <th className="text-center py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                      <th className="text-right py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selectedSale.cart.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-4">
                          <p className="text-sm font-bold text-slate-900">{item.name}</p>
                          <p className="text-[10px] text-slate-400">GST {item.gst}%</p>
                        </td>
                        <td className="py-3 px-4 text-center text-sm font-medium">₹{item.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center text-sm font-bold text-slate-600">{item.quantity}</td>
                        <td className="py-3 px-4 text-right text-sm font-black text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm text-slate-500 font-bold">
                    <span>Subtotal</span>
                    <span>₹{selectedSale.subtotal?.toFixed(2) || (selectedSale.totalAmount - (selectedSale.gst?.total || 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500 font-bold">
                    <span>GST Total</span>
                    <span>₹{selectedSale.gst?.total?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-center">
                    <span className="text-base font-black text-slate-900 uppercase tracking-widest">Grand Total</span>
                    <span className="text-2xl font-black text-blue-600">₹{selectedSale.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => handlePrint(selectedSale)}
                className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <Printer size={18} /> Print Invoice
              </button>
              <button 
                className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
              >
                <Share2 size={18} /> WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
