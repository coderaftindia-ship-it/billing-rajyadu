
import React from 'react';
import { Plus, ShoppingCart } from 'lucide-react';
import { cn } from '../../utils/cn';

export function ProductCard({ product, onAddToCart }) {
  return (
    <div
      onClick={() => product.stock > 0 && onAddToCart(product)}
      className={cn(
        "bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 group flex flex-col cursor-pointer overflow-hidden relative",
        product.stock <= 0 && "opacity-60 grayscale cursor-not-allowed"
      )}
    >
      {/* Stock Badge */}
      <div className="absolute top-2 right-2 z-10">
        {product.stock <= 0 ? (
          <span className="px-2 py-1 bg-rose-500 text-white text-[8px] font-black rounded-lg shadow-sm">OUT OF STOCK</span>
        ) : product.stock < 10 ? (
          <span className="px-2 py-1 bg-amber-500 text-white text-[8px] font-black rounded-lg shadow-sm animate-pulse">ONLY {product.stock} LEFT</span>
        ) : (
          <span className="px-2 py-1 bg-slate-900/10 backdrop-blur-md text-slate-600 text-[8px] font-black rounded-lg border border-white/20">QTY: {product.stock}</span>
        )}
      </div>

      {/* Product Image Area */}
      <div className="relative h-32 bg-slate-50 flex items-center justify-center group-hover:bg-blue-50/50 transition-colors border-b border-slate-50">
        <div className="text-slate-300 group-hover:text-blue-200 transition-all duration-500 group-hover:scale-110">
          <ShoppingCart size={40} strokeWidth={1.5} />
        </div>
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <Plus size={24} strokeWidth={3} />
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black rounded uppercase tracking-tighter">
              {product.category}
            </span>
          </div>
          <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight text-sm line-clamp-2">
            {product.name}
          </h4>
          <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-tighter opacity-60">#{product.barcode}</p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-50 gap-2">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Price</span>
            <p className="text-lg font-black text-slate-900 tracking-tight leading-none">₹{product.price}</p>
          </div>
          <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-2 rounded-lg whitespace-nowrap">
            Add to cart
          </div>
        </div>
      </div>
    </div>
  );
}
