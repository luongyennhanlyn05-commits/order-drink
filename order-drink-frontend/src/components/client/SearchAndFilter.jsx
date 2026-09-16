import React, { useState } from 'react';
import { Search, X, Sparkles } from 'lucide-react';

export const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onSelectCategory,
  totalResults,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="sticky top-14 z-20 bg-slate-50/95 backdrop-blur-md pt-2 pb-2.5 -mx-4 px-4 border-b border-slate-200/70 transition-all">
      <div className="space-y-2.5">
        {/* Thanh Tìm Kiếm Mobile Tối Ưu */}
        <div
          className={`relative flex items-center transition-all duration-200 rounded-2xl ${
            isFocused
              ? 'ring-2 ring-amber-500/30 shadow-md shadow-amber-500/10'
              : 'shadow-xs'
          }`}
        >
          {/* Icon Tìm kiếm */}
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors">
            <Search
              className={`w-4 h-4 ${
                isFocused ? 'text-amber-500' : 'text-slate-400'
              }`}
            />
          </div>

          {/* Ô nhập từ khóa */}
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm món trà sữa, cà phê, đá xay..."
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-all"
          />

          {/* Nút Xóa nhanh từ khóa */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Xóa từ khóa"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 active:scale-90 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center">
                <X className="w-3 h-3 text-slate-600" />
              </div>
            </button>
          )}
        </div>

        {/* Danh Mục Dạng Chip Trượt Ngang (Tối ưu vuốt chạm trên điện thoại) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4 scroll-smooth">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25 font-bold'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100/80'
                }`}
              >
                {cat === 'Tất cả' && <Sparkles className="w-3 h-3 inline mr-1 text-amber-200" />}
                {cat}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
