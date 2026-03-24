import React from 'react';
import { useBilling } from '../context/BillingContext';

export const PrintableInvoice = ({ sale, customer, items }) => {
  const { settings } = useBilling();
  
  const companyName = settings.find(s => s.key === 'companyName')?.value || 'SmartBill';
  const companyLogo = settings.find(s => s.key === 'companyLogo')?.value;
  const companyAddress = settings.find(s => s.key === 'companyAddress')?.value || '123 Business St, City, State';
  const companyPhone = settings.find(s => s.key === 'companyPhone')?.value || '+91 1234567890';
  const companyEmail = settings.find(s => s.key === 'companyEmail')?.value || 'contact@company.com';
  const companyGST = settings.find(s => s.key === 'companyGST')?.value || '27AAAAA0000A1Z5';
  const cgstRateVal = parseFloat(settings.find(s => s.key === 'cgstRate')?.value || '0');
  const sgstRateVal = parseFloat(settings.find(s => s.key === 'sgstRate')?.value || '0');
  const autoGstEnabled = settings.find(s => s.key === 'autoGst')?.value !== 'false';

  if (!sale) return null;

  // Recalculate totals if they are missing or zero to ensure accuracy
  const subtotal = sale.subtotal || sale.subtotalAmount || items.reduce((acc, item) => {
    const itemPrice = item.price || item.customPrice || 0;
    const itemDiscount = item.itemDiscount || 0;
    const baseTotal = itemPrice * item.quantity;
    const discountAmt = item.itemDiscountType === 'percent' ? (baseTotal * (itemDiscount / 100)) : itemDiscount;
    return acc + (baseTotal - discountAmt);
  }, 0);

  const gstData = sale.gst || items.reduce((acc, item) => {
    const itemPrice = item.price || item.customPrice || 0;
    const itemDiscount = item.itemDiscount || 0;
    const baseTotal = itemPrice * item.quantity;
    const discountAmt = item.itemDiscountType === 'percent' ? (baseTotal * (itemDiscount / 100)) : itemDiscount;
    const itemTotal = baseTotal - discountAmt;
    
    const effectiveCgst = autoGstEnabled ? cgstRateVal : (item.gst / 2 || 0);
    const effectiveSgst = autoGstEnabled ? sgstRateVal : (item.gst / 2 || 0);
    
    acc.cgst += itemTotal * (effectiveCgst / 100);
    acc.sgst += itemTotal * (effectiveSgst / 100);
    acc.total += (itemTotal * (effectiveCgst / 100)) + (itemTotal * (effectiveSgst / 100));
    return acc;
  }, { total: 0, cgst: 0, sgst: 0 });

  const totalAmount = sale.total || sale.totalAmount || (subtotal + gstData.total - (sale.discount || sale.billDiscount || 0));

  return (
    <div className="hidden print:block fixed inset-0 bg-white p-8 z-[9999]">
      <div className="max-w-4xl mx-auto border border-slate-200 p-8 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
          <div className="flex gap-6 items-center">
            {companyLogo ? (
              <img src={companyLogo} alt={companyName} className="h-20 object-contain" />
            ) : (
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{companyName}</h1>
            )}
            <div>
              {companyLogo && <h1 className="sr-only">{companyName}</h1>}
              <p className="text-sm text-slate-600 font-medium">{companyAddress}</p>
              <p className="text-sm text-slate-600 font-medium">Phone: {companyPhone} | Email: {companyEmail}</p>
              <p className="text-xs font-bold text-slate-800 mt-1">GSTIN: {companyGST}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-blue-600 uppercase mb-2">Tax Invoice</h2>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-900">Invoice #: <span className="font-normal">{sale.id}</span></p>
              <p className="text-sm font-bold text-slate-900">Date: <span className="font-normal">{new Date(sale.transactionDate || new Date()).toLocaleDateString()}</span></p>
              <p className="text-sm font-bold text-slate-900">Time: <span className="font-normal">{new Date(sale.transactionDate || new Date()).toLocaleTimeString()}</span></p>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-50 p-4 rounded-xl">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Billed To:</h3>
            <p className="text-lg font-bold text-slate-900">{customer?.name || 'Walk-in Customer'}</p>
            {customer?.phone && <p className="text-sm text-slate-600">Phone: {customer.phone}</p>}
            {customer?.address && <p className="text-sm text-slate-600">Address: {customer.address}</p>}
            {customer?.email && <p className="text-sm text-slate-600">Email: {customer.email}</p>}
          </div>
          <div className="bg-slate-50 p-4 rounded-xl text-right">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Payment Details:</h3>
            <p className="text-lg font-bold text-slate-900 capitalize">{sale.paymentMethod || 'Cash'}</p>
            <p className="text-sm text-slate-600">Status: Paid</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-y-2 border-slate-900">
              <th className="text-left py-3 px-2 text-xs font-black text-slate-900 uppercase">Item Description</th>
              <th className="text-center py-3 px-2 text-xs font-black text-slate-900 uppercase">Price</th>
              <th className="text-center py-3 px-2 text-xs font-black text-slate-900 uppercase">Qty</th>
              <th className="text-center py-3 px-2 text-xs font-black text-slate-900 uppercase">GST</th>
              <th className="text-center py-3 px-2 text-xs font-black text-slate-900 uppercase">Discount</th>
              <th className="text-right py-3 px-2 text-xs font-black text-slate-900 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item, index) => {
              const itemPrice = item.price || item.customPrice;
              const itemDiscount = item.itemDiscount || 0;
              const baseTotal = itemPrice * item.quantity;
              const discountAmt = item.itemDiscountType === 'percent' ? (baseTotal * (itemDiscount / 100)) : itemDiscount;
              const itemTotalWithoutGst = baseTotal - discountAmt;
              
              const itemGstRate = autoGstEnabled ? (cgstRateVal + sgstRateVal) : (item.gst || 0);
              const itemTotal = itemTotalWithoutGst + (itemTotalWithoutGst * (itemGstRate / 100));
              
              return (
                <tr key={index}>
                  <td className="py-4 px-2">
                    <p className="text-sm font-bold text-slate-900">{item.name || item.productName}</p>
                    <p className="text-[10px] text-slate-400">HSN: 123456</p>
                  </td>
                  <td className="py-4 px-2 text-center text-sm">₹{itemPrice.toFixed(2)}</td>
                  <td className="py-4 px-2 text-center text-sm">{item.quantity}</td>
                  <td className="py-4 px-2 text-center text-sm">{itemGstRate}%</td>
                  <td className="py-4 px-2 text-center text-sm">
                    {itemDiscount > 0 ? (item.itemDiscountType === 'percent' ? `${itemDiscount}%` : `₹${itemDiscount}`) : '-'}
                  </td>
                  <td className="py-4 px-2 text-right text-sm font-bold text-slate-900">₹{itemTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end mb-12">
          <div className="w-80 space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal:</span>
              <span className="font-bold">₹{Number(subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>GST Total:</span>
              <span className="font-bold">₹{Number(gstData.total).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>CGST ({cgstRateVal}%):</span>
              <span className="font-bold">₹{Number(gstData.cgst).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600 border-b border-slate-100 pb-2">
              <span>SGST ({sgstRateVal}%):</span>
              <span className="font-bold">₹{Number(gstData.sgst).toFixed(2)}</span>
            </div>
            {(sale.discount > 0 || sale.billDiscount > 0) && (
              <div className="flex justify-between text-sm text-rose-500">
                <span>Bill Discount:</span>
                <span className="font-bold">-₹{(sale.discount || sale.billDiscount || 0).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-black text-slate-900 pt-2 border-t-2 border-slate-900">
              <span>Grand Total:</span>
              <span>₹{Number(totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-slate-100 pt-6 text-center">
          <p className="text-sm font-bold text-slate-900 mb-1 italic">Thank you for your business!</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">This is a computer generated invoice and does not require a signature.</p>
        </div>
      </div>
    </div>
  );
};
