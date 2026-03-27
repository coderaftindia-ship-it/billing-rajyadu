
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Plus, Minus, Trash2, User, CreditCard, Wallet, 
  Smartphone, DollarSign, Printer, Share2, QrCode, Tag, 
  ChevronRight, ShoppingCart, X, CheckCircle2, LayoutGrid, List
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
  const [discountType, setDiscountType] = useState('fixed'); // 'fixed' or 'percent'
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Barcode Scanner Logic
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
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { 
        ...product, 
        quantity: 1, 
        itemDiscount: 0, 
        itemDiscountType: 'fixed',
        customPrice: product.price 
      }]);
    }
    // No toast here to avoid spamming on every click, 
    // but barcode logic has it because it's automatic.
  };

  const updateCartItem = (productId, updates) => {
    setCart(cart.map(item => 
      item.id === productId ? { ...item, ...updates } : item
    ));
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
  
  const cgstRate = parseFloat(settings.find(s => s.key === 'cgstRate')?.value || '0');
  const sgstRate = parseFloat(settings.find(s => s.key === 'sgstRate')?.value || '0');
  const autoGstEnabled = settings.find(s => s.key === 'autoGst')?.value !== 'false'; // Default to true if not explicitly false

  const gstBreakdown = cart.reduce((acc, item) => {
    const itemTotal = calculateItemTotal(item);
    
    // Logic: Use settings rates if autoGst is enabled OR if product GST is 0
    // This ensures taxes are applied if they are defined in settings
    const shouldAutoApply = autoGstEnabled || (item.gst === 0 && (cgstRate > 0 || sgstRate > 0));
    
    const itemCgstRate = shouldAutoApply ? cgstRate : (item.gst / 2);
    const itemSgstRate = shouldAutoApply ? sgstRate : (item.gst / 2);
    
    const cgstAmount = Number((itemTotal * (itemCgstRate / 100)).toFixed(2));
    const sgstAmount = Number((itemTotal * (itemSgstRate / 100)).toFixed(2));
    
    acc.cgst += cgstAmount;
    acc.sgst += sgstAmount;
    acc.total += (cgstAmount + sgstAmount);
    return acc;
  }, { total: 0, cgst: 0, sgst: 0 });

  const billDiscountAmount = discountType === 'percent' 
    ? Number((subtotal * (discount / 100)).toFixed(2))
    : Number(discount);

  const total = Number((subtotal + gstBreakdown.total - billDiscountAmount).toFixed(2));

  const filteredProducts = products.filter(p => 
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.barcode && p.barcode.includes(searchQuery)))
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('Cart is empty!');
    
    // Validate if customer is selected for any payment
    if (!selectedCustomer) {
      return alert('Please select a customer before proceeding with the payment!');
    }

    const saleInfo = {
      cart: [...cart], // Clone cart to ensure it's not modified later
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
    
    const sale = await completeSale(saleInfo);
    addToast('Sale completed successfully');
    
    setLastSale({
      ...sale,
      ...saleInfo,
      id: sale.id || 'N/A'
    });
    setShowSuccessModal(true);
    setCart([]);
    setDiscount(0);
    setDiscountType('fixed');
    setSelectedCustomer(null);
  };

  const shareOnWhatsApp = () => {
    if (!lastSale) return;
    
    const customer = lastSale.customer || { name: 'Customer' };
    const itemsText = lastSale.cart?.map(item => `- ${item.name}: ${item.quantity} x ₹${item.price} = ₹${(item.quantity * item.price).toFixed(2)}`).join('%0A') || '';
    
    const message = `*Invoice from SmartBill*%0A%0A` +
      `*Bill ID:* ${lastSale.id}%0A` +
      `*Customer:* ${customer.name}%0A` +
      `*Date:* ${new Date().toLocaleDateString()}%0A%0A` +
      `*Items:*%0A${itemsText}%0A%0A` +
      `*Total Amount:* ₹${lastSale.total.toFixed(2)}%0A` +
      `*Payment Status:* ${paymentMethod}%0A%0A` +
      `Thank you for shopping with us!`;

    const whatsappUrl = `https://wa.me/${customer.phone || ''}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePrint = () => {
    if (lastSale) {
      window.print();
    }
  };

  return (
    <div className="lg:h-[calc(100vh-140px)] flex flex-col">
      {/* Printable Invoice - Hidden normally, visible during print */}
      <PrintableInvoice 
        sale={lastSale} 
        customer={lastSale?.customer} 
        items={lastSale?.cart || []} 
      />

      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-8 min-h-0 overflow-hidden px-4 md:px-0">
        {/* Left Section - Product Selection */}
        <div className="lg:col-span-7 flex flex-col gap-4 md:gap-6 min-h-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full sm:w-auto relative group flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search products by name or barcode..." 
                className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border border-slate-200 rounded-xl md:rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-sm md:text-base shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex bg-white p-1.5 rounded-xl md:rounded-2xl border border-slate-200 shadow-sm w-full sm:w-auto overflow-x-auto">
              <div className="flex gap-1 w-full sm:w-auto">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "flex-1 sm:flex-none p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all",
                    viewMode === 'grid' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:bg-slate-50"
                  )}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('table')}
                  className={cn(
                    "flex-1 sm:flex-none p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all",
                    viewMode === 'table' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:bg-slate-50"
                  )}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium whitespace-nowrap transition-all",
                  selectedCategory === cat ? "bg-blue-600 text-white shadow-lg" : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 auto-rows-max">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredProducts.map(product => (
                      <tr 
                        key={product.id} 
                        onClick={() => product.stock > 0 && addToCart(product)}
                        className={cn(
                          "group hover:bg-blue-50/50 transition-colors cursor-pointer",
                          product.stock <= 0 && "opacity-60 grayscale cursor-not-allowed"
                        )}
                      >
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{product.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">#{product.barcode}</span>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              product.stock <= 0 ? "bg-rose-500" : product.stock < 10 ? "bg-amber-500" : "bg-emerald-500"
                            )} />
                            <span className={cn(
                              "text-sm font-bold",
                              product.stock <= 0 ? "text-rose-600" : product.stock < 10 ? "text-amber-600" : "text-slate-700"
                            )}>
                              {product.stock}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <span className="text-sm font-black text-slate-900">₹{product.price}</span>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                          <button 
                            disabled={product.stock <= 0}
                            className={cn(
                              "p-2 rounded-xl transition-all",
                              product.stock > 0 ? "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white" : "bg-slate-50 text-slate-300"
                            )}
                          >
                            <Plus size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Cart & Checkout */}
        <div className="lg:col-span-5 flex flex-col gap-6 h-full min-h-[600px] lg:min-h-0">
          <div className="flex-1 bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            <div className="p-4 md:p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  Current Order
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">{cart.length} items</span>
                </h3>
                <button onClick={() => setCart([])} className="text-rose-500 hover:text-rose-600 text-sm font-medium">Clear</button>
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1 group">
                  <select 
                    className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                    onChange={(e) => setSelectedCustomer(customers.find(c => c.id === parseInt(e.target.value)))}
                    value={selectedCustomer?.id || ''}
                  >
                    <option value="" disabled>Select Customer</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
                <button 
                  onClick={() => setShowCustomerModal(true)}
                  className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 py-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-full flex items-center justify-center">
                    <ShoppingCart size={32} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Your cart is empty</p>
                    <p className="text-xs text-slate-500">Add products to start a new sale</p>
                  </div>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="space-y-3 pb-4 border-b border-slate-50 last:border-0 group">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            ₹
                            <input 
                              type="number" 
                              className="w-12 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none font-medium"
                              value={item.customPrice}
                              onChange={(e) => updateCartItem(item.id, { customPrice: Number(e.target.value) })}
                            />
                          </div>
                          <span className="text-slate-300 hidden sm:inline">|</span>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            Disc
                            <input 
                              type="number" 
                              className="w-8 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none font-medium"
                              value={item.itemDiscount}
                              onChange={(e) => updateCartItem(item.id, { itemDiscount: Number(e.target.value) })}
                            />
                            <button 
                              onClick={() => updateCartItem(item.id, { itemDiscountType: item.itemDiscountType === 'fixed' ? 'percent' : 'fixed' })}
                              className="text-blue-500 font-bold"
                            >
                              {item.itemDiscountType === 'fixed' ? '₹' : '%'}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded text-slate-600"><Minus size={12} /></button>
                        <span className="w-6 md:w-8 text-center text-xs md:text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded text-slate-600"><Plus size={12} /></button>
                      </div>
                      <div className="text-right w-20 md:w-24">
                        <p className="text-xs md:text-sm font-black text-slate-900">₹{calculateItemTotal(item).toFixed(2)}</p>
                        <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                          GST {autoGstEnabled ? (cgstRate + sgstRate) : item.gst}%
                        </p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors sm:opacity-0 sm:group-hover:opacity-100"><Trash2 size="16" /></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-100 space-y-3">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-[11px] text-slate-400 px-2">
                <span>CGST ({cgstRate}%)</span>
                <span>₹{gstBreakdown.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 px-2">
                <span>SGST ({sgstRate}%)</span>
                <span>₹{gstBreakdown.sgst.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  Discount 
                  <button 
                    onClick={() => setDiscountType(discountType === 'fixed' ? 'percent' : 'fixed')}
                    className="text-[10px] px-1 bg-blue-100 text-blue-600 rounded font-bold"
                  >
                    {discountType === 'fixed' ? '₹' : '%'}
                  </button>
                </span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    className="w-20 text-right bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none font-semibold text-slate-900" 
                    value={discount} 
                    onChange={(e) => setDiscount(Number(e.target.value))} 
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-base md:text-lg font-bold text-slate-900">Grand Total</span>
                <span className="text-xl md:text-2xl font-black text-blue-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 shadow-xl space-y-4 md:space-y-6">
            <div className="grid grid-cols-2 gap-2">
              {[{ id: 'Cash', icon: DollarSign }, { id: 'UPI', icon: Smartphone }, { id: 'Card', icon: CreditCard }, { id: 'Credit', icon: Wallet }].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    "flex items-center gap-2 p-2 md:p-3 rounded-xl border-2 transition-all",
                    paymentMethod === method.id ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                  )}
                >
                  <method.icon size={16} />
                  <span className="text-xs md:text-sm font-bold">{method.id}</span>
                </button>
              ))}
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white py-3 md:py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
            >
              <Printer size={20} /> Generate Invoice & Print
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
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

      {/* Add Customer Modal */}
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
