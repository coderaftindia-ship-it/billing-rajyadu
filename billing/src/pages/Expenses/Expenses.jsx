import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  ChevronRight, 
  MoreVertical,
  Edit2,
  Trash2,
  ArrowDownCircle,
  TrendingDown,
  PieChart,
  DollarSign,
  X,
  FileText
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useBilling } from '../../context/BillingContext';

export default function Expenses() {
  const { expenses, addExpense, pos, purchases } = useBilling();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: '', amount: 0, paymentMethod: 'Cash', status: 'Paid', date: new Date().toLocaleDateString()
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleSubmit = (e) => {
    e.preventDefault();
    addExpense({
      ...newExpense,
      amount: Number(newExpense.amount),
      expenseDate: new Date().toISOString()
    });
    setShowAddModal(false);
    setNewExpense({ category: '', amount: 0, paymentMethod: 'Cash', status: 'Paid', date: new Date().toLocaleDateString() });
  };

  const categories = ['All', 'Labour Salary', 'Electricity', 'Transport', 'Packaging', 'Rent', 'Software', 'Other'];

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.id && e.id.toString().includes(searchQuery));
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleExport = () => {
    const headers = ['ID,Category,Amount,Method,Status,Date\n'];
    const rows = filteredExpenses.map(e => 
      `${e.id},${e.category},${e.amount},${e.paymentMethod},${e.status},${e.expenseDate ? new Date(e.expenseDate).toLocaleDateString() : e.date}\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_report_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  const totalSales = pos.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const totalPurchases = purchases.reduce((acc, pur) => acc + (pur.totalAmount || 0), 0);
  
  const netProfit = totalSales - totalExpenses - totalPurchases;
  const operatingMargin = totalSales > 0 ? (netProfit / totalSales * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expense Management</h1>
          <p className="text-slate-500 text-sm">Track your business overheads and operational costs.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-medium hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all active:scale-[0.98]"
        >
          <Plus size={18} />
          <span>Record New Expense</span>
        </button>
      </div>

      {/* Financial Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <ArrowDownCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Expenses</p>
            <h3 className="text-2xl font-bold text-slate-900">₹{totalExpenses.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Gross Sales</p>
            <h3 className="text-2xl font-bold text-slate-900">₹{totalSales.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 ring-2 ring-emerald-500/10">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Net Profit</p>
            <h3 className="text-2xl font-bold text-emerald-600">₹{(totalSales - totalExpenses).toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Bills</p>
            <h3 className="text-2xl font-bold text-slate-900">₹{expenses.filter(e => e.status === 'Pending').reduce((acc, e) => acc + e.amount, 0).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-full md:w-80 group focus-within:bg-white focus-within:border-blue-500 transition-all">
              <Search className="text-slate-400 group-focus-within:text-blue-500" size={18} />
              <input 
                type="text" 
                placeholder="Search expenses..." 
                className="bg-transparent border-none outline-none w-full text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative group">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition-all outline-none border-none cursor-pointer pr-8"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-100 transition-all"
              >
                <Download size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Expense Details</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-all">
                          <Wallet size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{expense.category}</p>
                          <p className="text-[10px] text-slate-500 font-mono tracking-tighter">{expense.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">₹{expense.amount.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600 font-medium px-2 py-1 bg-slate-100 rounded-lg">
                        {expense.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                        expense.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      )}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm text-slate-500 font-medium">
                        {expense.expenseDate ? new Date(expense.expenseDate).toLocaleDateString() : expense.date}
                      </p>
                    </td>
                  </tr>
                ))}
                {filteredExpenses.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                      No expenses recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Analysis */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <PieChart size={20} className="text-rose-500" />
              Expense Breakdown
            </h3>
            <div className="space-y-6">
              {['Labour Salary', 'Electricity', 'Transport', 'Packaging'].map((catName, idx) => {
                const spent = expenses.filter(e => e.category === catName).reduce((acc, e) => acc + e.amount, 0);
                const colors = ['bg-blue-500', 'bg-amber-500', 'bg-rose-500', 'bg-emerald-500'];
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-slate-600">{catName}</span>
                      <span className="text-slate-900">₹{spent.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000", colors[idx])}
                        style={{ width: totalExpenses > 0 ? `${(spent / totalExpenses) * 100}%` : '0%' }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-xl shadow-emerald-200">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              Profit Analysis
            </h3>
            <p className="text-emerald-100 text-sm mb-8 leading-relaxed">Your net profit is calculated by deducting all expenses and purchase costs from your total sales revenue.</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-medium border-b border-white/10 pb-4">
                <span className="text-emerald-100">Operating Margin</span>
                <span className="font-black">{operatingMargin.toFixed(1)}%</span>
              </div>
              <button 
                onClick={() => setShowProfitModal(true)}
                className="w-full py-4 bg-white text-emerald-600 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group hover:bg-emerald-50 shadow-lg"
              >
                Full Profit Report
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Plus className="text-rose-600" size={24} />
                Record New Expense
              </h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Expense Category</label>
                <select 
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all appearance-none"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  <option value="Labour Salary">Labour Salary</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Transport">Transport</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Rent">Rent</option>
                  <option value="Software">Software Subscription</option>
                  <option value="Other">Other Miscellaneous</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Amount (₹)</label>
                <input 
                  required
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:bg-white focus:border-blue-500 transition-all"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest">Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Cash', 'UPI', 'Bank Transfer', 'Credit'].map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setNewExpense({...newExpense, paymentMethod: method})}
                      className={cn(
                        "py-3 rounded-xl border text-sm font-bold transition-all",
                        newExpense.paymentMethod === method ? "bg-rose-600 border-rose-600 text-white" : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 transition-all active:scale-[0.98]"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Profit Report Modal */}
      {showProfitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden border border-slate-100 flex flex-col">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <PieChart size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Financial Report</h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Business Performance Summary</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProfitModal(false)} 
                className="p-3 hover:bg-slate-100 rounded-2xl transition-all group active:scale-95"
              >
                <X size={20} className="text-slate-400 group-hover:text-slate-600" />
              </button>
            </div>
            
            <div className="p-10 space-y-10 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-5 bg-blue-50/50 rounded-3xl border border-blue-100/50 group hover:bg-blue-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                      <DollarSign size={20} />
                    </div>
                    <span className="text-slate-700 font-bold text-sm">Total Sales Revenue (+)</span>
                  </div>
                  <span className="text-blue-700 font-black text-xl">₹{totalSales.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center p-5 bg-rose-50/50 rounded-3xl border border-rose-100/50 group hover:bg-rose-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
                      <ArrowDownCircle size={20} />
                    </div>
                    <span className="text-slate-700 font-bold text-sm">Total Expenses (-)</span>
                  </div>
                  <span className="text-rose-700 font-black text-xl">₹{totalExpenses.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center p-5 bg-amber-50/50 rounded-3xl border border-amber-100/50 group hover:bg-amber-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                      <Wallet size={20} />
                    </div>
                    <span className="text-slate-700 font-bold text-sm">Purchase Costs (-)</span>
                  </div>
                  <span className="text-amber-700 font-black text-xl">₹{totalPurchases.toLocaleString()}</span>
                </div>
              </div>

              <div className="relative pt-2">
                <div className="absolute -top-1 left-0 right-0 border-t-2 border-dashed border-slate-100"></div>
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-8 text-white rounded-[2rem] shadow-2xl shadow-emerald-200 relative overflow-hidden group">
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="relative flex justify-between items-end">
                    <div>
                      <p className="text-emerald-100/80 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Estimated Net Profit</p>
                      <h3 className="text-4xl font-black tracking-tight">₹{netProfit.toLocaleString()}</h3>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm mb-3">
                        <TrendingDown size={14} className="rotate-180" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Growth</span>
                      </div>
                      <p className="text-emerald-100/80 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Net Margin</p>
                      <h3 className="text-4xl font-black tracking-tight">{operatingMargin.toFixed(1)}%</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/80 p-8 rounded-3xl border border-slate-100/50 space-y-4 relative">
                <div className="absolute top-4 right-6 text-slate-200"><FileText size={40} /></div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Analysis Summary</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium relative z-10">
                  Your business is currently operating at a net margin of <strong className="text-emerald-600 font-black">{operatingMargin.toFixed(1)}%</strong>. 
                  This metric reflects the overall profitability after accounting for all recorded <span className="text-slate-900 font-bold">operational expenses</span> and <span className="text-slate-900 font-bold">supplier costs</span>.
                </p>
              </div>

              <button 
                onClick={() => setShowProfitModal(false)}
                className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                Dismiss Report
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
