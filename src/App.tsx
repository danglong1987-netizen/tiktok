/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TikTokAccount, VoucherCheckScope } from './types';
import { loadAccountsFromStorage, saveAccountsToStorage, resetToDefaultAccounts } from './utils/storage';
import { verifyAccount } from './utils/checker';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { AccountTable } from './components/AccountTable';
import { ImportModal } from './components/ImportModal';
import { ExportModal } from './components/ExportModal';
import { AccountDetailModal } from './components/AccountDetailModal';
import { CheckProgressModal } from './components/CheckProgressModal';
import { BatchAddressModal } from './components/BatchAddressModal';
import { DesktopInstallModal } from './components/DesktopInstallModal';
import { AutoOrderDashboard } from './components/AutoOrderBot/AutoOrderDashboard';
import { VoucherScopeSelector } from './components/VoucherScopeSelector';
import { VoucherGuideSection } from './components/VoucherGuideSection';
import { 
  Search, 
  RotateCcw, 
  Trash2, 
  CheckCircle2, 
  Ban, 
  Ticket,
  MapPin,
  Monitor,
  ShoppingBag
} from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [activeModule, setActiveModule] = useState<'checker' | 'auto_order'>('checker');
  const [accounts, setAccounts] = useState<TikTokAccount[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'vouchers_desc' | 'status'>('default');

  // 2 Voucher Check Options (New feature)
  // 1: 'province_specific' (Check theo Tỉnh/TP)
  // 2: 'global_all' (Check tổng thể toàn sàn)
  const [voucherScope, setVoucherScope] = useState<VoucherCheckScope>('global_all');
  const [targetProvince, setTargetProvince] = useState<string>('Quảng Ninh');

  // Modals state
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<TikTokAccount | null>(null);

  // Checker execution state
  const [isChecking, setIsChecking] = useState(false);
  const [checkingId, setCheckingId] = useState<string | null>(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [progressState, setProgressState] = useState({
    total: 0,
    current: 0,
    currentName: '',
    active: 0,
    suspended: 0,
    vouchers: 0,
    isComplete: false,
  });

  const abortCheckRef = useRef(false);

  // Initialize theme and load accounts
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const loaded = loadAccountsFromStorage();
    setAccounts(loaded);
  }, []);

  // Save to localStorage whenever accounts change
  const updateAccounts = (newAccounts: TikTokAccount[]) => {
    setAccounts(newAccounts);
    saveAccountsToStorage(newAccounts);
  };

  // Toggle Dark Mode
  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredAccounts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAccounts.map(a => a.id));
    }
  };

  // Import accounts
  const handleImportAccounts = (imported: TikTokAccount[]) => {
    const combined = [...imported, ...accounts];
    updateAccounts(combined);
  };

  // Batch address assignment
  const handleApplyAddresses = (updatedAccounts: TikTokAccount[]) => {
    updateAccounts(updatedAccounts);
  };

  // Delete single account
  const handleDeleteSingle = (id: string) => {
    const updated = accounts.filter(a => a.id !== id);
    setSelectedIds(prev => prev.filter(item => item !== id));
    updateAccounts(updated);
  };

  // Batch delete
  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} tài khoản đã chọn?`);
    if (!confirmDelete) return;

    const updated = accounts.filter(a => !selectedIds.includes(a.id));
    setSelectedIds([]);
    updateAccounts(updated);
  };

  // Reset to default sample accounts
  const handleResetSampleData = () => {
    const defaults = resetToDefaultAccounts();
    setAccounts(defaults);
    setSelectedIds([]);
  };

  // Clear all accounts
  const handleClearAll = () => {
    const confirmClear = window.confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách tài khoản?');
    if (!confirmClear) return;
    updateAccounts([]);
    setSelectedIds([]);
  };

  // Loại bỏ toàn bộ tài khoản bị đình chỉ (khóa đỏ) khỏi danh sách
  const handlePurgeSuspendedAccounts = () => {
    const suspended = accounts.filter(a => a.status === 'suspended');
    if (suspended.length === 0) {
      alert('Không có tài khoản nào bị khóa đỏ trong danh sách!');
      return;
    }
    const confirmPurge = window.confirm(`Bạn có chắc chắn muốn LOẠI BỎ ${suspended.length} tài khoản bị đình chỉ (khóa đỏ) khỏi danh sách đặt hàng?`);
    if (!confirmPurge) return;

    const cleaned = accounts.filter(a => a.status !== 'suspended');
    setSelectedIds(prev => prev.filter(id => !suspended.some(s => s.id === id)));
    updateAccounts(cleaned);
  };

  // Check single account with selected voucher scope
  const handleCheckSingle = async (id: string) => {
    const target = accounts.find(a => a.id === id);
    if (!target) return;

    setCheckingId(id);
    const result = await verifyAccount(target, 'smart', voucherScope, targetProvince);

    const updated = accounts.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: result.status,
          statusReason: result.statusReason,
          vouchers: result.vouchers,
          checkedVoucherScope: result.checkedVoucherScope,
          nickname: result.nickname || a.nickname,
          region: result.region || a.region,
          lastChecked: new Date().toISOString(),
        };
      }
      return a;
    });

    updateAccounts(updated);
    setCheckingId(null);
  };

  // Batch or All Check Runner with selected voucher scope
  const runBatchCheck = async (targets: TikTokAccount[]) => {
    if (targets.length === 0) return;

    setIsChecking(true);
    abortCheckRef.current = false;
    setIsProgressModalOpen(true);

    let activeCount = 0;
    let suspendedCount = 0;
    let vouchersCount = 0;

    setProgressState({
      total: targets.length,
      current: 0,
      currentName: targets[0].tiktokId,
      active: 0,
      suspended: 0,
      vouchers: 0,
      isComplete: false,
    });

    let currentAccounts = [...accounts];

    for (let i = 0; i < targets.length; i++) {
      if (abortCheckRef.current) break;

      const acc = targets[i];
      setCheckingId(acc.id);
      setProgressState(prev => ({
        ...prev,
        current: i,
        currentName: `${acc.tiktokId} (${acc.email})`,
      }));

      const result = await verifyAccount(acc, 'smart', voucherScope, targetProvince);

      if (result.status === 'active') activeCount++;
      if (result.status === 'suspended') suspendedCount++;
      vouchersCount += result.vouchers.length;

      currentAccounts = currentAccounts.map(a => {
        if (a.id === acc.id) {
          return {
            ...a,
            status: result.status,
            statusReason: result.statusReason,
            vouchers: result.vouchers,
            checkedVoucherScope: result.checkedVoucherScope,
            nickname: result.nickname || a.nickname,
            region: result.region || a.region,
            lastChecked: new Date().toISOString(),
          };
        }
        return a;
      });

      updateAccounts(currentAccounts);

      setProgressState(prev => ({
        ...prev,
        current: i + 1,
        active: activeCount,
        suspended: suspendedCount,
        vouchers: vouchersCount,
      }));
    }

    setCheckingId(null);
    setIsChecking(false);
    setProgressState(prev => ({
      ...prev,
      isComplete: true,
    }));
  };

  const handleStartCheckAll = () => {
    runBatchCheck(accounts);
  };

  const handleBatchCheckSelected = () => {
    const targets = accounts.filter(a => selectedIds.includes(a.id));
    runBatchCheck(targets);
  };

  const handleCancelCheck = () => {
    abortCheckRef.current = true;
    setIsChecking(false);
    setCheckingId(null);
    setIsProgressModalOpen(false);
  };

  // Open detail modal
  const handleOpenDetail = (account: TikTokAccount) => {
    setSelectedAccount(account);
    setIsDetailOpen(true);
  };

  // Filtered & Searched accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => {
      // Search query matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchEmail = acc.email.toLowerCase().includes(q);
        const matchId = acc.tiktokId.toLowerCase().includes(q);
        const matchNotes = (acc.notes || '').toLowerCase().includes(q);
        const matchVouchers = acc.vouchers.some(v => v.title.toLowerCase().includes(q) || v.code.toLowerCase().includes(q));
        const matchAddress = acc.shippingAddress?.fullAddress.toLowerCase().includes(q) || acc.shippingAddress?.recipientName.toLowerCase().includes(q);
        if (!matchEmail && !matchId && !matchNotes && !matchVouchers && !matchAddress) return false;
      }

      // Filter category
      if (filter === 'active') return acc.status === 'active';
      if (filter === 'suspended') return acc.status === 'suspended';
      if (filter === 'checkpoint') return acc.status === 'checkpoint';
      if (filter === 'pending') return acc.status === 'pending';
      if (filter === 'has_vouchers') return acc.status === 'active' && acc.vouchers.length > 0;
      if (filter === 'freeship_100') {
        return acc.status === 'active' && acc.vouchers.some(v => v.type === 'freeship_100' || v.type === 'new_buyer');
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'vouchers_desc') {
        return b.vouchers.length - a.vouchers.length;
      }
      if (sortBy === 'status') {
        const score = (st: string) => st === 'active' ? 3 : st === 'checkpoint' ? 2 : st === 'pending' ? 1 : 0;
        return score(b.status) - score(a.status);
      }
      return 0;
    });
  }, [accounts, filter, searchQuery, sortBy]);

  const activeCount = accounts.filter(a => a.status === 'active').length;
  const suspendedCount = accounts.filter(a => a.status === 'suspended').length;
  const addressConfiguredCount = accounts.filter(a => a.shippingAddress).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* 3-Zone Top Navigation Bar */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        activeModule={activeModule}
        onChangeModule={(mod) => setActiveModule(mod)}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAddressModal={() => setIsAddressModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onStartCheckAll={handleStartCheckAll}
        isChecking={isChecking}
        totalCount={accounts.length}
        activeCount={activeCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {activeModule === 'auto_order' ? (
          <AutoOrderDashboard
            accounts={accounts}
            onOpenAccountImport={() => setIsImportOpen(true)}
            onOpenAddressSetup={() => setIsAddressModalOpen(true)}
            onPurgeSuspendedAccounts={handlePurgeSuspendedAccounts}
            onUpdateAccounts={updateAccounts}
          />
        ) : (
          <>
            {/* Intro Kicker */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Bảng điều khiển kiểm tra tài khoản & Quét mã TikTok Shop
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Kiểm tra trạng thái Sống (Xanh) / Khóa (Đỏ), quét mã freeship theo Tỉnh/TP hoặc Tổng thể, và setup địa chỉ giao hàng hàng loạt.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {suspendedCount > 0 && (
              <button
                onClick={handlePurgeSuspendedAccounts}
                title="Loại bỏ tài khoản bị khóa đỏ khỏi danh sách đặt hàng"
                className="px-3 py-2 text-xs font-bold rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Ban className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                Loại bỏ {suspendedCount} nick khóa đỏ
              </button>
            )}
            <button
              onClick={() => setIsInstallModalOpen(true)}
              title="Xuất file cài đặt / Cài ứng dụng lên máy tính cá nhân"
              className="px-3 py-2 text-xs font-bold rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-300 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Monitor className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Cài lên máy tính
            </button>
            <button
              onClick={() => setIsAddressModalOpen(true)}
              title="Cài đặt địa chỉ giao hàng hàng loạt"
              className="px-3 py-2 text-xs font-bold rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              Setup địa chỉ ({addressConfiguredCount}/{accounts.length})
            </button>
            <button
              onClick={handleResetSampleData}
              title="Khôi phục danh sách mẫu thử nghiệm"
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              Nạp mẫu
            </button>
            <button
              onClick={handleClearAll}
              title="Xóa trắng danh sách tài khoản"
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-600 dark:text-slate-400 hover:text-rose-600 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa tất cả
            </button>
          </div>
        </div>

        {/* 5-Card Metric Overview (Green Live vs Red Suspended) */}
        <StatsOverview
          accounts={accounts}
          activeFilter={filter}
          onSelectFilter={(newFilter) => setFilter(newFilter)}
        />

        {/* 2-Option Voucher Scope Selector (Theo Tỉnh/TP hoặc Tổng thể) */}
        <VoucherScopeSelector
          voucherScope={voucherScope}
          onChangeScope={(scope) => setVoucherScope(scope)}
          selectedProvince={targetProvince}
          onChangeProvince={(prov) => setTargetProvince(prov)}
          onRecheckWithScope={handleStartCheckAll}
          isChecking={isChecking}
          totalAccounts={accounts.length}
        />

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo email, TikTok ID, địa chỉ, voucher..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Interactive filter buttons / segmented controls */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/60 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tất cả ({accounts.length})
            </button>

            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                filter === 'active'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Sống ({accounts.filter(a => a.status === 'active').length})
            </button>

            <button
              onClick={() => setFilter('suspended')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                filter === 'suspended'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
            >
              <Ban className="w-3 h-3" />
              Khóa đỏ ({accounts.filter(a => a.status === 'suspended').length})
            </button>

            <button
              onClick={() => setFilter('has_vouchers')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                filter === 'has_vouchers'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
            >
              <Ticket className="w-3 h-3" />
              Có mã ship ({accounts.filter(a => a.status === 'active' && a.vouchers.length > 0).length})
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500"
            >
              <option value="default">Thứ tự mặc định</option>
              <option value="vouchers_desc">Nhiều mã ship nhất</option>
              <option value="status">Trạng thái (Sống trước)</option>
            </select>
          </div>

        </div>

        {/* Account Table */}
        <AccountTable
          accounts={filteredAccounts}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onCheckSingle={handleCheckSingle}
          onDeleteSingle={handleDeleteSingle}
          onBatchCheck={handleBatchCheckSelected}
          onBatchDelete={handleBatchDelete}
          onOpenDetail={handleOpenDetail}
          onOpenAddressModal={() => setIsAddressModalOpen(true)}
          onPurgeSuspended={handlePurgeSuspendedAccounts}
          isChecking={isChecking}
          checkingId={checkingId}
        />

        {/* Voucher & Rules Guide Section */}
        <VoucherGuideSection />

          </>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            TikTok Account & Shipping Voucher Checker · Setup địa chỉ giao hàng & quét mã freeship
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Hỗ trợ 2 chế độ: Quét mã theo Tỉnh/TP và Quét mã tổng thể toàn sàn
          </span>
        </div>
      </footer>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportAccounts={handleImportAccounts}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        accounts={accounts}
      />

      {/* Batch Address Setup Modal */}
      <BatchAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        accounts={accounts}
        selectedIds={selectedIds}
        onApplyAddresses={handleApplyAddresses}
      />

      {/* Desktop App Installer & Launcher Modal */}
      <DesktopInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Account Detail Drawer/Modal */}
      <AccountDetailModal
        account={selectedAccount}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onRecheck={handleCheckSingle}
        isChecking={isChecking && checkingId === selectedAccount?.id}
      />

      {/* Check Progress Modal */}
      <CheckProgressModal
        isOpen={isProgressModalOpen}
        total={progressState.total}
        current={progressState.current}
        currentAccountName={progressState.currentName}
        activeCount={progressState.active}
        suspendedCount={progressState.suspended}
        vouchersFound={progressState.vouchers}
        isComplete={progressState.isComplete}
        onCancel={handleCancelCheck}
        onFinish={() => setIsProgressModalOpen(false)}
        onPurgeSuspended={handlePurgeSuspendedAccounts}
        onGoToAutoOrder={() => setActiveModule('auto_order')}
      />

    </div>
  );
}
