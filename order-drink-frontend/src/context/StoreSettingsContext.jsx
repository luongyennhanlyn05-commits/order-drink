import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreSettingsContext = createContext(null);

const DEFAULT_SETTINGS = {
  storeName: 'Tiệm Trà & Cà Phê',
  storeSubtitle: 'Gọi món tại bàn',
  wifiName: 'TiemTra_Free',
  wifiPass: '88888888',
  address: '',
};

export const StoreSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('app_store_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const updateSettings = (newSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('app_store_settings', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    // Cập nhật title trình duyệt theo tên quán
    if (settings.storeName) {
      document.title = `${settings.storeName} - ${settings.storeSubtitle || 'Gọi món tại bàn'}`;
    }
  }, [settings.storeName, settings.storeSubtitle]);

  return (
    <StoreSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error('useStoreSettings must be used within StoreSettingsProvider');
  }
  return context;
};
