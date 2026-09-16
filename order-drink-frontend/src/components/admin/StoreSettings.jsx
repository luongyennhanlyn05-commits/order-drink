import React, { useState } from 'react';
import { Store, Wifi, Check, Save } from 'lucide-react';
import { useStoreSettings } from '../../context/StoreSettingsContext';

export const StoreSettings = () => {
  const { settings, updateSettings } = useStoreSettings();
  const [formData, setFormData] = useState({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Tiêu đề */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Cài Đặt Thông Tin Quán
            </h2>
            <p className="text-xs text-slate-500">
              Thay đổi tên quán, thông tin hiển thị trên menu và thẻ để bàn
            </p>
          </div>
        </div>
      </div>

      {/* Form Cài Đặt */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
        
        {/* Tên Quán */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Tên quán (Thương hiệu) *
          </label>
          <input
            type="text"
            required
            value={formData.storeName}
            onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
            placeholder="VD: The Coffee Lab, Tiệm Trà Chanh 1975..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Tên này sẽ xuất hiện trên đầu trang menu của khách và trên thẻ in mã QR để bàn.
          </p>
        </div>

        {/* Khẩu hiệu / Phụ đề */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Mô tả ngắn (Slogan)
          </label>
          <input
            type="text"
            value={formData.storeSubtitle}
            onChange={(e) => setFormData({ ...formData, storeSubtitle: e.target.value })}
            placeholder="VD: Cà phê nguyên chất & Trà sữa đài loan..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
        </div>

        {/* Thông tin Wifi */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5" />
            <span>Thông tin Wifi quán (Tự động in lên thẻ bàn)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Tên mạng Wifi (SSID)
              </label>
              <input
                type="text"
                value={formData.wifiName}
                onChange={(e) => setFormData({ ...formData, wifiName: e.target.value })}
                placeholder="VD: Cafe_Free"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Mật khẩu Wifi
              </label>
              <input
                type="text"
                value={formData.wifiPass}
                onChange={(e) => setFormData({ ...formData, wifiPass: e.target.value })}
                placeholder="VD: 88888888"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>
        </div>

        {/* Nút lưu */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            {isSaved && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Đã lưu thông tin quán thành công!
              </span>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Lưu thay đổi</span>
          </button>
        </div>

      </form>
    </div>
  );
};
