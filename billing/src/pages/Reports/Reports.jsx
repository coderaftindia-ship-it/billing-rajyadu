
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Download, 
  Filter, 
  PieChart, 
  ArrowRight,
  ChevronDown,
  FileText,
  Activity,
  Package,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '../../utils/cn';
import { useBilling } from '../../context/BillingContext';

const reportTypes = [
  { id: 'sales', name: 'Sales Report', description: 'Daily, Monthly & Yearly sales performance' },
  { id: 'profit', name: 'Profit & Loss', description: 'Analyze your business profitability' },
  { id: 'gst', name: 'GST Report', description: 'Tax collected and tax paid records' },
  { id: 'stock', name: 'Stock Report', description: 'Inventory valuation and turnover' },
  { id: 'product', name: 'Product Wise', description: 'Top performing and slow items' },
];

// --- Sub-components for different reports ---

const SalesReport = ({ data }) => {
  const { totalSales, totalOrders, averageTicketSize, salesOverTime } = data;
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-blue-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 relative z-10">Total Revenue</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">₹{totalSales.toLocaleString()}</h3>
          <div className="mt-6 flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest relative z-10">
            <div className="p-1 bg-emerald-50 rounded-lg"><ArrowUpRight size={14} strokeWidth={3} /></div>
            <span>+12.5% Growth</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 relative z-10">Total Orders</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">{totalOrders}</h3>
          <div className="mt-6 flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest relative z-10">
            <div className="p-1 bg-emerald-50 rounded-lg"><ArrowUpRight size={14} strokeWidth={3} /></div>
            <span>+5.2% Volume</span>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 relative z-10">Avg. Order Value</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">₹{averageTicketSize.toFixed(0)}</h3>
          <div className="mt-6 flex items-center gap-2 text-rose-600 text-[10px] font-black uppercase tracking-widest relative z-10">
            <div className="p-1 bg-rose-50 rounded-lg"><ArrowDownRight size={14} strokeWidth={3} /></div>
            <span>-2.1% Value</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Revenue Trends</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Monthly performance analysis</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600 shadow-lg shadow-blue-200"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Revenue</span>
            </div>
          </div>
        </div>
        <div className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesOverTime}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
              <Tooltip 
                cursor={{stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5'}}
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }}
              />
              <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={5} fillOpacity={1} fill="url(#colorSales)" dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 10, strokeWidth: 0, fill: '#3b82f6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const ProfitLossReport = ({ data }) => {
  const { totalSales, totalExpenses, netProfit, salesOverTime } = data;
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-xl font-black text-slate-900 mb-10 text-center uppercase tracking-tight">Income Distribution</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={[
                    { name: 'Revenue', value: totalSales },
                    { name: 'Expenses', value: totalExpenses },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={130}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#3b82f6" className="drop-shadow-xl" />
                  <Cell fill="#f43f5e" className="drop-shadow-xl" />
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ paddingTop: '40px', fontWeight: 'bold', fontSize: '12px' }}/>
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-blue-100 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-125 transition-transform duration-700"><DollarSign size={200} /></div>
            <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Gross Revenue</p>
            <h3 className="text-5xl font-black tracking-tighter">₹{totalSales.toLocaleString()}</h3>
          </div>
          <div className="bg-gradient-to-br from-rose-500 to-rose-700 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-rose-100 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-125 transition-transform duration-700"><TrendingDown size={200} /></div>
            <p className="text-rose-100 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Total Expenses</p>
            <h3 className="text-5xl font-black tracking-tighter">₹{totalExpenses.toLocaleString()}</h3>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-emerald-100 relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-125 transition-transform duration-700"><TrendingUp size={200} /></div>
            <p className="text-emerald-100 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Net Profit</p>
            <h3 className="text-5xl font-black tracking-tighter">₹{netProfit.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <h3 className="text-2xl font-black text-slate-900 mb-10 uppercase tracking-tight">Profitability Trend</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesOverTime}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }}
              />
              <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorProfit)" dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 10, strokeWidth: 0, fill: '#10b981' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const GSTReport = ({ data }) => {
  const { gstCollected, gstPaid, netGstPayable } = data;
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border-2 border-blue-50 shadow-sm text-center relative overflow-hidden group">
          <div className="absolute -right-2 -top-2 w-16 h-16 bg-blue-50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner relative z-10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
            <ArrowUpRight size={32} strokeWidth={2.5} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 relative z-10">GST Collected</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">₹{gstCollected.toLocaleString()}</h3>
          <p className="text-[10px] text-blue-500 mt-4 font-black uppercase tracking-widest relative z-10">Output Tax</p>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border-2 border-rose-50 shadow-sm text-center relative overflow-hidden group">
          <div className="absolute -right-2 -top-2 w-16 h-16 bg-rose-50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner relative z-10 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500">
            <ArrowDownRight size={32} strokeWidth={2.5} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 relative z-10">GST Paid</p>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter relative z-10">₹{gstPaid.toLocaleString()}</h3>
          <p className="text-[10px] text-rose-500 mt-4 font-black uppercase tracking-widest relative z-10">Input Credit</p>
        </div>
        <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200 text-center text-white relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-150 transition-transform duration-1000"><FileText size={150} /></div>
          <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg backdrop-blur-md relative z-10">
            <Activity size={32} strokeWidth={2.5} />
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">Net Payable</p>
          <h3 className="text-4xl font-black tracking-tighter relative z-10">₹{netGstPayable.toLocaleString()}</h3>
          <p className="text-[10px] text-blue-400 mt-4 font-black uppercase tracking-widest relative z-10">Current Liability</p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 bg-slate-50/30">
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Filing Summary</h3>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Detailed tax breakdown for the period</p>
        </div>
        <div className="p-10">
          <table className="w-full text-left border-separate border-spacing-y-4">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-6 pb-2">Category Description</th>
                <th className="px-6 pb-2 text-center">Tax Rate</th>
                <th className="px-6 pb-2">Taxable Base</th>
                <th className="px-6 pb-2 text-right">Tax Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-slate-600">
              <tr className="bg-slate-50/50 rounded-2xl group hover:bg-blue-50 transition-colors">
                <td className="px-6 py-6 rounded-l-2xl border-y border-l border-transparent group-hover:border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><ArrowUpRight size={16} /></div>
                    <span>Output GST (Sales)</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-center border-y border-transparent group-hover:border-blue-100">18%</td>
                <td className="px-6 py-6 border-y border-transparent group-hover:border-blue-100">₹{(gstCollected / 0.18).toLocaleString()}</td>
                <td className="px-6 py-6 text-right rounded-r-2xl border-y border-r border-transparent group-hover:border-blue-100 text-blue-600 font-black">₹{gstCollected.toLocaleString()}</td>
              </tr>
              <tr className="bg-slate-50/50 rounded-2xl group hover:bg-rose-50 transition-colors">
                <td className="px-6 py-6 rounded-l-2xl border-y border-l border-transparent group-hover:border-rose-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center"><ArrowDownRight size={16} /></div>
                    <span>Input GST (Purchases)</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-center border-y border-transparent group-hover:border-rose-100">18%</td>
                <td className="px-6 py-6 border-y border-transparent group-hover:border-rose-100">₹{(gstPaid / 0.18).toLocaleString()}</td>
                <td className="px-6 py-6 text-right rounded-r-2xl border-y border-r border-transparent group-hover:border-rose-100 text-rose-600 font-black">₹{gstPaid.toLocaleString()}</td>
              </tr>
              <tr className="bg-slate-900 rounded-3xl text-white">
                <td className="px-8 py-8 rounded-l-[2rem] font-black text-lg">Total Net Tax Payable</td>
                <td className="px-8 py-8 text-center"></td>
                <td className="px-8 py-8"></td>
                <td className="px-8 py-8 text-right rounded-r-[2rem] font-black text-3xl tracking-tighter">₹{netGstPayable.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StockReport = ({ data }) => {
  const { totalStockValue, lowStockItems, categorySales } = data;
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-125 transition-transform duration-1000"><Package size={250} /></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Inventory Valuation</p>
          <h3 className="text-6xl font-black tracking-tighter mb-4">₹{totalStockValue.toLocaleString()}</h3>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
            <Activity size={16} className="text-blue-400" />
            <span className="text-xs font-bold text-slate-300 tracking-wide">Market Price Evaluation</span>
          </div>
        </div>
        <div className="bg-white p-12 rounded-[3rem] border-4 border-rose-50 shadow-sm relative overflow-hidden flex flex-col justify-center group">
          <div className="absolute top-8 right-10 text-rose-100 group-hover:rotate-12 transition-transform duration-500"><Activity size={80} strokeWidth={1} /></div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Critical Stock Alerts</p>
          <h3 className="text-6xl font-black text-rose-600 tracking-tighter">{lowStockItems}</h3>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-rose-600 rounded-full animate-ping"></span>
            Action Required
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-black text-slate-900 mb-10 uppercase tracking-tight">Category Distribution</h3>
          <div className="space-y-10">
            {categorySales.map((cat, idx) => (
              <div key={idx} className="space-y-4 group">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</p>
                    <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{cat.name}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</p>
                    <p className="text-lg font-black text-slate-900 tracking-tight">₹{cat.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className="w-full h-4 bg-slate-50 rounded-2xl overflow-hidden shadow-inner">
                  <div 
                    className="h-full rounded-2xl transition-all duration-1000 shadow-lg" 
                    style={{ 
                      width: `${(cat.value / totalStockValue) * 100}%`, 
                      backgroundColor: ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'][idx % 4] 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex flex-col justify-between min-h-[400px]">
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-10 uppercase tracking-widest">Insights</h3>
              <div className="space-y-8">
                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500"><ShoppingCart size={28} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Turnover</p>
                    <p className="text-lg font-black text-slate-900 tracking-tight">4.2x / Month</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500"><TrendingUp size={28} /></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Catalog</p>
                    <p className="text-lg font-black text-slate-900 tracking-tight">128 Products</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-10">
              <div className="p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-45 transition-transform"><Activity size={40} /></div>
                <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-2">Efficiency Rate</p>
                <h4 className="text-2xl font-black tracking-tight">94.2%</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductWiseReport = ({ data }) => {
  const { topSellingProducts } = data;
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Top Performance</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">High volume inventory analysis</p>
          </div>
          <button className="flex items-center gap-3 px-6 py-3 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100">
            <Filter size={16} strokeWidth={2.5} /> Advanced Filter
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {topSellingProducts.map((product, idx) => (
            <div key={idx} className="flex items-center gap-8 p-6 rounded-[2rem] hover:bg-slate-50 transition-all group relative overflow-hidden border border-transparent hover:border-slate-100">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-black text-slate-900 text-lg tracking-tight truncate">{product.name}</h4>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Best Seller</span>
                </div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">SKU ID: PRD-{idx + 100}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-black text-slate-900 tracking-tighter">{product.quantity}</p>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Units Moved</p>
              </div>
              <div className="w-48 shrink-0 hidden md:block">
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-100 transition-all duration-1000" 
                    style={{ width: `${(product.quantity / topSellingProducts[0].quantity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-rose-50 p-10 rounded-[3rem] border border-rose-100 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-rose-100 opacity-50 group-hover:scale-125 transition-transform duration-700"><TrendingDown size={100} /></div>
          <h3 className="text-xl font-black text-rose-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
            <div className="p-2 bg-rose-200/50 rounded-xl"><Activity size={20} /></div>
            Slow Movement
          </h3>
          <div className="space-y-4">
            {['Sugar Free Biscuits', 'Organic Tea', 'Premium Nuts'].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-5 bg-white rounded-2xl border border-rose-100/50 shadow-sm group/item hover:scale-[1.02] transition-transform">
                <span className="text-sm font-black text-slate-700">{item}</span>
                <span className="px-3 py-1 bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-widest rounded-full">Inactive</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-emerald-50 p-10 rounded-[3rem] border border-emerald-100 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-emerald-100 opacity-50 group-hover:scale-125 transition-transform duration-700"><TrendingUp size={100} /></div>
          <h3 className="text-xl font-black text-emerald-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
            <div className="p-2 bg-emerald-200/50 rounded-xl"><Activity size={20} /></div>
            High Velocity
          </h3>
          <div className="space-y-4">
            {['Dairy Milk', 'Wheat Flour', 'Cooking Oil'].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-5 bg-white rounded-2xl border border-emerald-100/50 shadow-sm group/item hover:scale-[1.02] transition-transform">
                <span className="text-sm font-black text-slate-700">{item}</span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">+45% Demand</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Reports() {
  const { reports } = useBilling();
  const [selectedReport, setSelectedReport] = useState('sales');
  const [timeRange, setTimeRange] = useState('Last 12 Months');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  if (!reports) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-sm animate-pulse">Analyzing business data...</p>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    const jsonString = JSON.stringify(reports, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report_${selectedReport}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const timeRanges = ['Today', 'Last 7 Days', 'Last 30 Days', 'Last 6 Months', 'Last 12 Months', 'All Time'];

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'sales': return <SalesReport data={reports} />;
      case 'profit': return <ProfitLossReport data={reports} />;
      case 'gst': return <GSTReport data={reports} />;
      case 'stock': return <StockReport data={reports} />;
      case 'product': return <ProductWiseReport data={reports} />;
      default: return <SalesReport data={reports} />;
    }
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm relative group">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-50 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-2xl mb-4">
            <Activity size={16} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">System Intelligence</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
            Business <span className="text-blue-600">Analytics</span>
          </h1>
          <p className="text-slate-500 font-bold mt-4 max-w-md leading-relaxed">
            Harness the power of data-driven insights to scale your operations and maximize profitability.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 w-full lg:w-auto relative z-20">
          <div className="relative flex-1 lg:flex-none">
            <button 
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-white hover:border-slate-200 transition-all shadow-inner relative z-30"
            >
              <Calendar size={18} strokeWidth={2.5} />
              <span>{timeRange}</span>
              <ChevronDown className={cn("transition-transform duration-300", showTimeDropdown && "rotate-180")} size={16} strokeWidth={3} />
            </button>
            
            {showTimeDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-20 cursor-default" 
                  onClick={() => setShowTimeDropdown(false)}
                ></div>
                <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-[0_20px_70px_-10px_rgba(0,0,0,0.15)] border border-slate-100 py-4 z-30 animate-in fade-in slide-in-from-top-4 duration-300 ring-1 ring-slate-900/5">
                  <div className="px-6 py-2 mb-2">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Horizon</p>
                  </div>
                  {timeRanges.map(range => (
                    <button
                      key={range}
                      onClick={() => {
                        setTimeRange(range);
                        setShowTimeDropdown(false);
                      }}
                      className={cn(
                        "w-full px-8 py-4 text-left text-[11px] font-black uppercase tracking-widest transition-all hover:bg-slate-50 flex items-center justify-between group",
                        timeRange === range ? "text-blue-600 bg-blue-50/30" : "text-slate-500"
                      )}
                    >
                      {range}
                      {timeRange === range && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full shadow-lg shadow-blue-200"></div>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <button 
            onClick={handleExport}
            className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-black shadow-2xl shadow-slate-200 transition-all active:scale-95 relative z-10"
          >
            <Download size={18} strokeWidth={2.5} />
            <span>Export Intel</span>
          </button>
        </div>
      </div>

      {/* Ultra Modern Report Selector */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={cn(
              "flex flex-col items-center p-8 rounded-[3rem] border-2 transition-all duration-500 text-center group relative overflow-hidden",
              selectedReport === report.id 
                ? "border-blue-600 bg-white shadow-2xl shadow-blue-100 ring-8 ring-blue-50/50 -translate-y-2" 
                : "border-slate-50 bg-slate-50/30 hover:border-slate-200 hover:bg-white hover:shadow-xl hover:-translate-y-1"
            )}
          >
            <div className={cn(
              "w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-6 transition-all duration-700 shadow-lg",
              selectedReport === report.id 
                ? "bg-blue-600 text-white rotate-[360deg] scale-110 shadow-blue-200" 
                : "bg-white text-slate-400 group-hover:text-blue-500 shadow-slate-100"
            )}>
              {report.id === 'sales' && <BarChart3 size={28} strokeWidth={2.5} />}
              {report.id === 'profit' && <TrendingUp size={28} strokeWidth={2.5} />}
              {report.id === 'gst' && <FileText size={28} strokeWidth={2.5} />}
              {report.id === 'stock' && <Activity size={28} strokeWidth={2.5} />}
              {report.id === 'product' && <PieChart size={28} strokeWidth={2.5} />}
            </div>
            <p className={cn("font-black text-sm mb-2 tracking-tight uppercase", selectedReport === report.id ? "text-blue-600" : "text-slate-900")}>
              {report.name}
            </p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">View Metrics</p>
            
            {selectedReport === report.id && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-blue-600"></div>
            )}
          </button>
        ))}
      </div>

      {/* Dynamic Report Content Container */}
      <div className="relative min-h-[600px] bg-slate-50/30 p-2 rounded-[4rem]">
        {renderReportContent()}
      </div>
    </div>
  );
}

