import React, { useState, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { QrCode, Download, ExternalLink, Printer, Plus, Trash2, Globe, Sparkles, Coffee } from 'lucide-react';
import { useStoreSettings } from '../../context/StoreSettingsContext';

export const QrTableManager = () => {
  const { settings } = useStoreSettings();
  // Danh sách các bàn (Mặc định từ bàn 01 đến bàn 10, chủ quán có thể thêm bớt tùy ý)
  const [tables, setTables] = useState([
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10'
  ]);

  const [newTableInput, setNewTableInput] = useState('');
  
  // URL gốc: mặc định lấy origin hiện tại (ví dụ http://localhost:3000 hoặc IP LAN http://192.168.x.x:3000)
  const [baseUrl, setBaseUrl] = useState(() => {
    return window.location.origin;
  });

  const [selectedTableForPrint, setSelectedTableForPrint] = useState(null);

  // Thêm bàn mới
  const handleAddTable = (e) => {
    e.preventDefault();
    const formatted = newTableInput.trim().toUpperCase();
    if (!formatted) return;
    if (tables.includes(formatted)) {
      alert('Bàn này đã tồn tại trong danh sách!');
      return;
    }
    setTables([...tables, formatted]);
    setNewTableInput('');
  };

  // Xóa bàn
  const handleDeleteTable = (table) => {
    if (window.confirm(`Bạn có chắc muốn xóa mã QR của Bàn ${table}?`)) {
      setTables(tables.filter((t) => t !== table));
    }
  };

  // Tải ảnh QR Code (PNG)
  const handleDownloadQr = (tableNumber) => {
    const canvas = document.getElementById(`qr-canvas-${tableNumber}`);
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `QR_Ban_${tableNumber}_KopiBoba.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // In mẫu thẻ để bàn (Print Standee)
  const handlePrintTableCard = (tableNumber) => {
    setSelectedTableForPrint(tableNumber);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const getTableUrl = (tableNumber) => {
    return `${baseUrl}/?table=${encodeURIComponent(tableNumber)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Giới Thiệu */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold text-slate-900">
              Quản Lý & Tạo Mã QR Cho Từng Bàn
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Hệ thống tự động lập trình mã QR tương ứng với từng số bàn. Khách hàng chỉ cần dùng 
            <strong className="text-slate-700"> Camera điện thoại hoặc Zalo</strong> quét mã dán trên bàn là vào thẳng menu gọi món của bàn đó!
          </p>
        </div>

        {/* Cấu hình Base URL (để khi chạy IP mạng LAN hoặc Domain thật chỉ cần sửa 1 chỗ) */}
        <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2 text-xs">
          <Globe className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Đường dẫn máy chủ (URL)</span>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="bg-white border border-slate-200 px-2 py-1 rounded-lg text-xs font-semibold text-slate-800 w-48 sm:w-56 focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="http://localhost:3000"
            />
          </div>
        </div>
      </div>

      {/* Form thêm bàn mới */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleAddTable} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={newTableInput}
            onChange={(e) => setNewTableInput(e.target.value)}
            placeholder="Nhập tên bàn (VD: 11, VIP 01)..."
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/30 w-52"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Thêm bàn</span>
          </button>
        </form>

        <span className="text-xs font-medium text-slate-500">
          Tổng cộng: <strong className="text-slate-900 font-extrabold">{tables.length}</strong> bàn đang hoạt động
        </span>
      </div>

      {/* Grid Danh Sách Mã QR Từng Bàn */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => {
          const tableUrl = getTableUrl(table);
          return (
            <div
              key={table}
              className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Header card bàn */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-amber-500 text-white font-black text-xs rounded-xl shadow-xs">
                    BÀN {table}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTable(table)}
                  className="text-slate-300 hover:text-red-500 p-1 transition-colors cursor-pointer"
                  title="Xóa bàn này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Vùng hiển thị Mã QR Code */}
              <div className="py-4 flex flex-col items-center justify-center">
                <div className="p-3 bg-white rounded-2xl border-2 border-slate-100 shadow-xs group-hover:border-amber-400/50 transition-colors">
                  {/* Canvas QR dùng để tải ảnh PNG */}
                  <QRCodeCanvas
                    id={`qr-canvas-${table}`}
                    value={tableUrl}
                    size={150}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-mono truncate max-w-[200px]">
                  {tableUrl}
                </p>
              </div>

              {/* Các nút thao tác cho từng bàn */}
              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  {/* Tải ảnh PNG */}
                  <button
                    onClick={() => handleDownloadQr(table)}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold transition-all cursor-pointer"
                    title="Tải ảnh QR về máy để in"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Tải ảnh</span>
                  </button>

                  {/* In Thẻ Để Bàn */}
                  <button
                    onClick={() => handlePrintTableCard(table)}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-[11px] font-bold transition-all cursor-pointer border border-amber-200"
                    title="In thẻ mica để bàn"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-600" />
                    <span>In thẻ bàn</span>
                  </button>
                </div>

                {/* Mở thử nghiệm */}
                <a
                  href={tableUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>Vào thử Bàn {table}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* MẪU IN THẺ ĐỂ BÀN (Dành cho Print Stylesheet khi bấm In) */}
      {selectedTableForPrint && (
        <div id="print-template" className="hidden print:block fixed inset-0 bg-white p-12 text-center text-slate-900">
          <div className="max-w-md mx-auto border-4 border-slate-900 rounded-3xl p-8 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <Coffee className="w-8 h-8 text-amber-600" />
              <h1 className="text-2xl font-black tracking-tight uppercase">
                {settings?.storeName || 'TIỆM CÀ PHÊ'}
              </h1>
            </div>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-6">
              {settings?.storeSubtitle || 'Dine-in QR Ordering System'}
            </p>

            <div className="px-6 py-2 bg-slate-900 text-white text-2xl font-black rounded-2xl mb-6">
              BÀN {selectedTableForPrint}
            </div>

            <div className="p-4 bg-white border-2 border-slate-900 rounded-2xl mb-6 shadow-sm">
              <QRCodeSVG
                value={getTableUrl(selectedTableForPrint)}
                size={220}
                level="H"
                includeMargin={true}
              />
            </div>

            <h3 className="text-lg font-extrabold text-slate-900 mb-1">
              QUÉT MÃ ĐỂ GỌI MÓN
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mb-4">
              Mở camera điện thoại hoặc Zalo để quét mã và xem thực đơn ngay tại bàn
            </p>

            <div className="pt-4 border-t border-slate-200 w-full text-xs text-slate-600 font-semibold flex justify-between">
              <span>Wifi: {settings?.wifiName || 'Free_Wifi'}</span>
              <span>Mật khẩu: {settings?.wifiPass || '88888888'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
