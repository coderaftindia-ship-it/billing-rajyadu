import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Minus, Trash2, CreditCard, Wallet, 
  Smartphone, DollarSign, Printer, Share2, ChevronRight, 
  ShoppingCart, X, CheckCircle2, LayoutGrid, List
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useBilling } from '../../context/BillingContext';
import { ProductCard } from './ProductCard';
import { PrintableInvoice } from '../../components/PrintableInvoice';

export default function POS() {
  const { products, customers, completeSale, addCustomer, settings, addToast } = useBilling();
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('fixed');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

  useEffect(() => {
    const product = products.find(p => p.barcode === searchQuery);
    if (product) {
      addToCart(product);
      setSearchQuery('');
      addToast(`Added ${product.name} to cart`);
    }
  }, [searchQuery, products]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, {
        ...product,
        quantity: 1,
        itemDiscount: 0,
        itemDiscountType: 'fixed',
        customPrice: product.price
      }] );
    }
  };

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const calculateItemTotal = (item) => {
    const baseTotal = item.customPrice * item.quantity;
    const itemDiscount = item.itemDiscountType === 'percent'
      ? baseTotal * (item.itemDiscount / 100)
      : item.itemDiscount;
    return baseTotal - itemDiscount;
  };

  const subtotal = cart.reduce((acc, item) => acc + calculateItemTotal(item), 0);

  const getSettingValue = (key, fallback) => {
    const entry = settings.find(s => s.key === key);
    return entry && entry.value !== undefined && entry.value !== null && entry.value !== ''
      ? entry.value
      : fallback;
  };

  const cgstRate = parseFloat(getSettingValue('cgstRate', '0')) || 0;
  const sgstRate = parseFloat(getSettingValue('sgstRate', '0')) || 0;
  const autoGstEnabled = getSettingValue('autoGst', 'true') !== 'false';

  const gstBreakdown = cart.reduce((acc, item) => {
    const itemTotal = calculateItemTotal(item);
    const productGst = Number(item.gst) || 0;
    const shouldAutoApply = autoGstEnabled || (productGst === 0 && (cgstRate > 0 || sgstRate > 0));
    const itemCgstRate = shouldAutoApply ? cgstRate : (productGst / 2);
    const itemSgstRate = shouldAutoApply ? sgstRate : (productGst / 2);
    const cgstAmount = Number((itemTotal * (itemCgstRate / 100)).toFixed(2));
    const sgstAmount = Number((itemTotal * (itemSgstRate / 100)).toFixed(2));
    acc.cgst += cgstAmount;
    acc.sgst += sgstAmount;
    acc.total += cgstAmount + sgstAmount;
    return acc;
  }, { total: 0, cgst: 0, sgst: 0 });

  const billDiscountAmount = discountType === 'percent'
    ? Number((subtotal * (discount / 100)).toFixed(2))
    : Number(discount || 0);

  const total = Number((subtotal + gstBreakdown.total - billDiscountAmount).toFixed(2));

  const filteredProducts = products.filter(p =>
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.barcode && p.barcode.includes(searchQuery)))
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      addToast('Cart is empty!', 'error');
      return;
    }

    if (!selectedCustomer) {
      addToast('Please select a customer before proceeding with the payment!', 'error');
      return;
    }

    const saleInfo = {
      cart: [...cart],
      customer: selectedCustomer,
      subtotal: Number(subtotal.toFixed(2)),
      subtotalAmount: Number(subtotal.toFixed(2)),
      gst: { ...gstBreakdown },
      billDiscount: Number(billDiscountAmount.toFixed(2)),
      discount: Number(billDiscountAmount.toFixed(2)),
      total: Number(total.toFixed(2)),
      totalAmount: Number(total.toFixed(2)),
      paymentMethod
    };

    try {
      const result = await completeSale(saleInfo);
      const newSale = {
        ...saleInfo,
        id: result.id,
        total,
        customer: selectedCustomer,
        cart: [...cart]
      };
      setLastSale(newSale);
      setCart([]);
      setDiscount(0);
      setShowSuccessModal(true);
      addToast('Sale completed successfully');
    } catch (error) {
      console.error('Checkout failed:', error);
      addToast('Checkout failed. Please try again.', 'error');
    }
  };

  const handlePrint = () => {
    if (lastSale) {
      window.print();
    }
  };

  const shareOnWhatsApp = () => {
    if (!lastSale) return;
    const message = `Invoice ${lastSale.id} total ₹${lastSale.total.toFixed(2)}. Thank you for your purchase.`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="lg:h-[calc(100vh-140px)] flex flex-col pb-24 sm:pb-0 bg-slate-50">
      <PrintableInvoice
        sale={lastSale}
        customer={lastSale?.customer}
        items={lastSale?.cart || []}
      />

      <div className="flex-1 overflow-hidden px-4 md:px-6 py-4 md:py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1.75fr_1.15fr] gap-6 h-full">
          <section className="space-y-6">
            <div className="bg-white rounded-4xl border border-slate-200 shadow-sm p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900">Billing POS</h1>
                  <p className="text-sm text-slate-500 mt-2">Search, add items, and complete billing with tax details in one place.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-slate-500">View:</span>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'flex items-center justify-center w-11 h-11 rounded-2xl transition-all',
                      viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    )}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={cn(
                      'flex items-center justify-center w-11 h-11 rounded-2xl transition-all',
                      viewMode === 'table' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    )}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] items-center">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search products by name or barcode"
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        'rounded-full px-4 py-2 text-sm font-semibold transition',
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-4xl border border-slate-200 shadow-sm p-5 md:p-6 min-h-130 overflow-hidden">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Products</h2>
                  <p className="text-sm text-slate-500">Browse products and tap to add to cart.</p>
                </div>
                <span className="text-sm text-slate-500">{filteredProducts.length} items found</span>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-170 text-left">
                    <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.2em] text-slate-400">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((product) => (
                        <tr
                          key={product.id}
                          className={cn(
                            'transition hover:bg-slate-50',
                            product.stock <= 0 && 'opacity-60 grayscale'
                          )}
                        >
                          <td className="px-4 py-4">
                            <div className="font-semibold text-slate-900">{product.name}</div>
                            <div className="text-[11px] text-slate-400">#{product.barcode || 'N/A'}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={cn('rounded-full px-2 py-1 text-[11px] font-semibold', product.stock <= 0 ? 'bg-rose-100 text-rose-600' : product.stock < 10 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600')}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-semibold text-slate-900">₹{product.price}</td>
                          <td className="px-4 py-4 text-right">
                            <button
                              onClick={() => product.stock > 0 && addToCart(product)}
                              disabled={product.stock <= 0}
                              className={cn(
                                'rounded-2xl px-4 py-2 text-sm font-semibold transition',
                                product.stock > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              )}
                            >
                              Add
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="bg-white rounded-4xl border border-slate-200 shadow-sm p-5 md:p-6 sticky top-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Order Summary</h2>
                  <p className="text-sm text-slate-500">Review cart, customer and payment before checkout.</p>
                </div>
                <button onClick={() => setCart([])} className="text-rose-500 hover:text-rose-600 text-sm font-semibold">
                  Clear Order
                </button>
              </div>

              <div className="mt-5 grid gap-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Customer</label>
                  <div className="mt-3 flex items-center gap-3">
                    <select
                      className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      onChange={(e) => setSelectedCustomer(customers.find((c) => c.id === parseInt(e.target.value)))}
                      value={selectedCustomer?.id || ''}
                    >
                      <option value="" disabled>Select customer</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} {c.phone && `(${c.phone})`}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowCustomerModal(true)}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md hover:bg-blue-700"
                      aria-label="Add customer"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart size={28} className="mx-auto text-slate-300" />
                      <p className="mt-4 text-sm font-semibold text-slate-500">Add products to see order details.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="rounded-3xl bg-white border border-slate-200 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                              <p className="text-xs text-slate-400">Qty {item.quantity} · ₹{item.customPrice.toFixed(2)}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="rounded-2xl p-2 text-slate-400 hover:text-rose-500 transition"
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 space-y-4">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>CGST ({cgstRate}%)</span>
                  <span className="font-semibold text-slate-900">₹{gstBreakdown.cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>SGST ({sgstRate}%)</span>
                  <span className="font-semibold text-slate-900">₹{gstBreakdown.sgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500 items-center gap-3">
                  <span className="flex items-center gap-1">
                    Discount
                    <button
                      onClick={() => setDiscountType(discountType === 'fixed' ? 'percent' : 'fixed')}
                      className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-600"
                    >
                      {discountType === 'fixed' ? '₹' : '%'}
                    </button>
                  </span>
                  <input
                    type="number"
                    className="w-24 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-right text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                  />
                </div>
                <div className="border-t border-slate-200 pt-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-slate-900">Grand Total</span>
                    <span className="text-2xl font-black text-blue-600">₹{total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-500">Includes CGST + SGST</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-4xl border border-slate-200 shadow-sm p-5 md:p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'Cash', icon: DollarSign },
                  { id: 'UPI', icon: Smartphone },
                  { id: 'Card', icon: CreditCard },
                  { id: 'Credit', icon: Wallet },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-3xl border px-4 py-3 text-sm font-semibold transition',
                      paymentMethod === method.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    )}
                  >
                    <method.icon size={18} />
                    {method.id}
                  </button>
                ))}
              </div>
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full rounded-3xl bg-blue-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <div className="flex items-center justify-center gap-2">
                  <Printer size={18} />
                  Generate Invoice & Print
                </div>
              </button>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 sm:hidden bg-white border-t border-slate-200 shadow-t-lg p-4 print:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-slate-500">Total (GST included)</p>
            <p className="text-lg font-bold text-slate-900">₹{total.toFixed(2)}</p>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="min-w-35 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Printer size={18} /> Checkout
          </button>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/25 flex items-center justify-center z-50 p-4 print:hidden">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={48} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Sale Successful!</h3>
              <p className="text-slate-500 mt-2">Bill ID: {lastSale?.id}</p>
              <p className="text-3xl font-black text-blue-600 mt-4">₹{lastSale?.total.toFixed(2)}</p>
            </div>
            <div className="pt-4 space-y-3">
              <button onClick={() => setShowSuccessModal(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">Done</button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handlePrint}
                  className="py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <Printer size={18} /> Print
                </button>
                <button
                  onClick={shareOnWhatsApp}
                  className="py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  <Share2 size={18} /> WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCustomerModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Add New Customer</h3>
              <button onClick={() => setShowCustomerModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                address: formData.get('address'),
                credit: 0
              };
              await addCustomer(data);
              setShowCustomerModal(false);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input name="name" required className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                <input name="phone" required className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email (Optional)</label>
                <input name="email" type="email" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea name="address" className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" rows="3"></textarea>
              </div>
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">Save Customer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
