import React, { useState } from 'react';
import { AdminNavbar } from '../components/admin/AdminNavbar';
import { KdsKanbanBoard } from '../components/admin/KdsKanbanBoard';
import { MenuManagement } from '../components/admin/MenuManagement';
import { RevenueSummary } from '../components/admin/RevenueSummary';
import { QrTableManager } from '../components/admin/QrTableManager';
import { StoreSettings } from '../components/admin/StoreSettings';

export const AdminDashboard = ({ onSwitchToClient }) => {
  const [activeTab, setActiveTab] = useState('kds');
  const [pendingCount, setPendingCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col">
      {/* Top Navbar */}
      <AdminNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        pendingCount={pendingCount}
        onSwitchToClient={onSwitchToClient}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'kds' && (
          <KdsKanbanBoard onPendingCountChange={setPendingCount} />
        )}

        {activeTab === 'menu' && (
          <MenuManagement />
        )}

        {activeTab === 'revenue' && (
          <RevenueSummary />
        )}

        {activeTab === 'qr' && (
          <QrTableManager />
        )}

        {activeTab === 'settings' && (
          <StoreSettings />
        )}
      </main>
    </div>
  );
};
