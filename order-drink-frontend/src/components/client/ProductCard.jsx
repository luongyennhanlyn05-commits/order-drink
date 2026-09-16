import React from 'react';
import { Plus, Ban } from 'lucide-react';

export const ProductCard = ({ product, onSelect }) => {
  const isAvailable = product.isAvailable !== false;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0) + ' đ';
  };

  return (
    <div
      onClick={() => isAvailable && onSelect(product)}
      className={`group relative bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col ${
        isAvailable ? 'cursor-pointer active:scale-[0.99]' : 'opacity-60 cursor-not-allowed grayscale-30'
      }`}
    >
      {/* Ảnh món */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isAvailable ? 'group-hover:scale-105' : ''
          }`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Badge danh mục */}
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/50 text-white backdrop-blur-xs">
          {product.category}
        </span>

        {/* Trạng thái hết hàng nếu có */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2">
            <Ban className="w-6 h-6 text-red-400 mb-1" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-200">
              Tạm hết món
            </span>
          </div>
        )}
      </div>

      {/* Thông tin món */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>

          {/* Sizes tóm tắt */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              {product.sizes.map((s) => (
                <span
                  key={s.name}
                  className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-semibold"
                >
                  {s.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Giá & Nút (+) */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-50">
          <div>
            <span className="text-xs text-slate-400 block -mb-0.5">Giá từ</span>
            <span className="text-sm font-extrabold text-amber-600">
              {formatPrice(product.basePrice)}
            </span>
          </div>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              if (isAvailable) onSelect(product);
            }}
            aria-label={`Thêm món ${product.name}`}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isAvailable
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/30 active:scale-90 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
