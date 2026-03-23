import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  AlertTriangle, 
  Package, 
  ArrowRight,
  Download,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useBilling } from '../../context/BillingContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';

const StatCard = ({ title, value, subValue, icon: Icon, trend, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Icon size={24} />
      </div>
      {trend !== undefined && (
        <span className={`flex items-center gap-1 text-xs font-medium ${trend > 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'} px-2 py-1 rounded-full`}>
          {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    <p className="text-xs text-slate-400 mt-2">{subValue}</p>
  </div>
);

export default function Dashboard() {
  const { products, pos, customers, reports, addToast } = useBilling();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const timeRanges = ['Today', 'Last 7 Days', 'Last 30 Days', 'Last 6 Months', 'Last 12 Months', 'All Time'];

  const handleExport = () => {
    try {
      const exportData = {
        summary: {
          todaySales,
          monthlySales,
          customerCount: customers.length,
          lowStockCount: lowStockItems.length
        },
        recentTransactions,
        inventory: products.slice(0, 10),
        timestamp: new Date().toISOString()
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dashboard_summary_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addToast('Report exported successfully');
    } catch (error) {
      addToast('Error exporting report', 'error');
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todaySales = pos
    .filter(sale => sale.transactionDate.startsWith(today))
    .reduce((acc, sale) => acc + sale.totalAmount, 0);

  const monthlySales = pos.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const lowStockItems = products.filter(p => p.stock < 10);

  // Mock data for chart based on actual sales if available
  const salesData = [
    { name: 'Mon', sales: 4000, profit: 2400 },
    { name: 'Tue', sales: 3000, profit: 1398 },
    { name: 'Wed', sales: 2000, profit: 9800 },
    { name: 'Thu', sales: 2780, profit: 3908 },
    { name: 'Fri', sales: 1890, profit: 4800 },
    { name: 'Sat', sales: 2390, profit: 3800 },
    { name: 'Sun', sales: 3490, profit: 4300 },
  ];

  const recentTransactions = pos.slice(-4).reverse().map(sale => ({
    id: `#TRX-${sale.id}`,
    customer: customers.find(c => c.id === sale.customerId)?.name || 'Walk-in Customer',
    amount: `₹${sale.totalAmount.toFixed(2)}`,
    status: 'Completed',
    time: new Date(sale.transactionDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }));

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Business Overview</h1>
          <p className="text-slate-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Calendar size={18} />
              <span>{timeRange}</span>
              <ChevronDown className={cn("transition-transform duration-300", showTimeDropdown && "rotate-180")} size={16} />
            </button>

            {showTimeDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowTimeDropdown(false)}></div>
                <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-20 min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-200">
                  {timeRanges.map(range => (
                    <button
                      key={range}
                      onClick={() => {
                        setTimeRange(range);
                        setShowTimeDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2 text-left text-sm font-medium transition-colors hover:bg-slate-50",
                        timeRange === range ? "text-blue-600 bg-blue-50/50" : "text-slate-600"
                      )}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
          >
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Sales" 
          value={`₹${todaySales.toFixed(2)}`} 
          subValue="Real-time data"
          icon={DollarSign} 
          trend={0}
          color="blue"
        />
        <StatCard 
          title="Total Sales" 
          value={`₹${monthlySales.toFixed(2)}`} 
          subValue={`${pos.length} total orders`}
          icon={ShoppingCart} 
          trend={0}
          color="indigo"
        />
        <StatCard 
          title="Customers" 
          value={customers.length.toString()} 
          subValue="Active profiles"
          icon={TrendingUp} 
          color="emerald"
        />
        <StatCard 
          title="Low Stock Alert" 
          value={`${lowStockItems.length} Items`} 
          subValue="Requires immediate action"
          icon={AlertTriangle} 
          color="rose"
        />
      </div>

      {/* Charts & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-900">Revenue Analysis</h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Sales
              </span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Overview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">Inventory Overview</h3>
          <div className="space-y-6">
            {products.slice(0, 5).map((product, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.stock} {product.unit} in stock</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">₹{product.price}</p>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Transactions</h3>
            <button 
              onClick={() => navigate('/billing-history')}
              className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
            >
              View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentTransactions.map((trx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{trx.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{trx.customer}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{trx.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700`}>
                        {trx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{trx.time}</td>
                  </tr>
                ))}
                {recentTransactions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-400">No transactions yet today.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-200 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Need Help?</h3>
            <p className="text-blue-100 text-sm mb-6">Check our tutorial videos or contact support for any issues with the billing software.</p>
            <div className="space-y-3">
              <button onClick={() => alert('Tutorials coming soon!')} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-all text-left px-4 flex items-center justify-between group">
                Watch Tutorials
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => alert('Support contact: support@smartbill.com')} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-all text-left px-4 flex items-center justify-between group">
                Contact Support
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/50 flex items-center justify-center">
                <ShoppingCart size={24} />
              </div>
              <div>
                <p className="text-xs text-blue-200">System Version</p>
                <p className="text-sm font-bold text-white">v2.4.0 (Stable)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
