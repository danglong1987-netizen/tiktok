import React from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Play, 
  Download, 
  Sun, 
  Moon,
  Ticket,
  MapPin,
  Monitor,
  ShoppingBag
} from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  activeModule: 'checker' | 'auto_order';
  onChangeModule: (mod: 'checker' | 'auto_order') => void;
  onOpenImport: () => void;
  onOpenExport: () => void;
  onOpenAddressModal: () => void;
  onOpenInstallModal: () => void;
  onStartCheckAll: () => void;
  isChecking: boolean;
  totalCount: number;
  activeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  activeModule,
  onChangeModule,
  onOpenImport,
  onOpenExport,
  onOpenAddressModal,
  onOpenInstallModal,
  onStartCheckAll,
  isChecking,
  totalCount,
  activeCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              TikTok Account & Voucher Checker
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline whitespace-nowrap">
              Kiểm tra trạng thái tài khoản & Quét mã freeship TikTok Shop
            </span>
          </div>
        </div>

        {/* Zone 2: Module switcher tabs */}
        <nav className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => onChangeModule('checker')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeModule === 'checker'
                ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>1. Check Acc & Mã Ship ({totalCount})</span>
          </button>

          <button
            onClick={() => onChangeModule('auto_order')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeModule === 'auto_order'
                ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>2. Tự Động Đặt Hàng</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-400 text-slate-950 uppercase tracking-wider">
              AUTO
            </span>
          </button>
        </nav>

        {/* Zone 3: Primary action + utility buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Chuyển sang Giao diện Sáng' : 'Chuyển sang Giao diện Tối'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cài đặt lên máy tính button */}
          <button
            onClick={onOpenInstallModal}
            title="Cài đặt ứng dụng lên máy tính cá nhân / Tải file chạy .BAT và bộ cài đặt PC"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-lg transition-colors whitespace-nowrap border border-amber-300 dark:border-amber-800 shadow-sm"
          >
            <Monitor className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Cài lên máy tính</span>
          </button>

          {/* Setup Địa chỉ hàng loạt button */}
          <button
            onClick={onOpenAddressModal}
            title="Setup địa chỉ hàng loạt: Tên, SĐT, 1 Tỉnh, 2 Phường/Xã, 3 Chi tiết số nhà đường..."
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg transition-colors whitespace-nowrap border border-rose-200 dark:border-rose-900/70"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Setup địa chỉ
          </button>

          <button
            onClick={onOpenExport}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap border border-slate-200 dark:border-slate-700/60"
          >
            <Download className="w-3.5 h-3.5" />
            Xuất danh sách
          </button>

          <button
            onClick={onOpenImport}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap border border-slate-200 dark:border-slate-700/60"
          >
            <Plus className="w-3.5 h-3.5 text-rose-500" />
            Nhập tài khoản
          </button>

          <button
            onClick={onStartCheckAll}
            disabled={isChecking || totalCount === 0}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-lg transition-all shadow-sm whitespace-nowrap ${
              isChecking
                ? 'bg-rose-400 dark:bg-rose-800 cursor-not-allowed opacity-80'
                : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/25 active:scale-95'
            }`}
          >
            {isChecking ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang kiểm tra...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Kiểm tra tất cả</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
