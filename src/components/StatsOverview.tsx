import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  Ban, 
  Ticket, 
  TrendingUp,
  Percent
} from 'lucide-react';
import { TikTokAccount } from '../types';

interface StatsOverviewProps {
  accounts: TikTokAccount[];
  activeFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  accounts,
  activeFilter,
  onSelectFilter,
}) => {
  const total = accounts.length;
  const activeCount = accounts.filter(a => a.status === 'active').length;
  const suspendedCount = accounts.filter(a => a.status === 'suspended').length;
  const checkpointCount = accounts.filter(a => a.status === 'checkpoint').length;
  const pendingCount = accounts.filter(a => a.status === 'pending').length;

  const totalVouchers = accounts.reduce((acc, curr) => acc + curr.vouchers.length, 0);
  const freeship100Count = accounts.reduce(
    (acc, curr) => acc + curr.vouchers.filter(v => v.type === 'freeship_100' || v.type === 'new_buyer').length, 
    0
  );

  const activePercent = total > 0 ? Math.round((activeCount / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      
      {/* 1. Tổng số tài khoản */}
      <button
        onClick={() => onSelectFilter('all')}
        className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
          activeFilter === 'all'
            ? 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-sm ring-1 ring-slate-400 dark:ring-slate-600'
            : 'border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Tổng tài khoản
          </span>
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {total}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            tài khoản
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <span>Chưa kiểm tra: </span>
          <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{pendingCount}</span>
        </div>
      </button>

      {/* 2. Tài khoản SỐNG / ĐĂNG NHẬP ĐƯỢC - MÀU XANH LÁ (User request requirement) */}
      <button
        onClick={() => onSelectFilter('active')}
        className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
          activeFilter === 'active'
            ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30 ring-1 ring-emerald-500 shadow-sm'
            : 'border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/15 hover:border-emerald-400 dark:hover:border-emerald-800'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            Còn sống (Active)
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {activeCount}
          </span>
          <span className="text-xs text-emerald-700 dark:text-emerald-400/80 font-medium">
            (Tỷ lệ {activePercent}%)
          </span>
        </div>
        <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400/90 flex items-center gap-1">
          <span>Đăng nhập & mua sắm tốt</span>
        </div>
      </button>

      {/* 3. Tài khoản BỊ ĐÌNH CHỈ / KHÓA - MÀU ĐỎ (User request requirement) */}
      <button
        onClick={() => onSelectFilter('suspended')}
        className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
          activeFilter === 'suspended'
            ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/30 ring-1 ring-rose-500 shadow-sm'
            : 'border-rose-200/80 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/15 hover:border-rose-400 dark:hover:border-rose-800'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
            Bị đình chỉ (Khóa)
          </span>
          <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
            <Ban className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 font-mono tabular-nums">
            {suspendedCount}
          </span>
          <span className="text-xs text-rose-700 dark:text-rose-400/80 font-medium">
            tài khoản đỏ
          </span>
        </div>
        <div className="mt-2 text-xs text-rose-600 dark:text-rose-400/90 flex items-center gap-1">
          <span>Banned / Khóa TikTok Shop</span>
        </div>
      </button>

      {/* 4. Tổng mã vận chuyển khả dụng */}
      <button
        onClick={() => onSelectFilter('has_vouchers')}
        className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${
          activeFilter === 'has_vouchers'
            ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/30 ring-1 ring-amber-500 shadow-sm'
            : 'border-amber-200/70 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/15 hover:border-amber-400 dark:hover:border-amber-800'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            Mã vận chuyển có sẵn
          </span>
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
            <Ticket className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
            {totalVouchers}
          </span>
          <span className="text-xs text-amber-600/80 dark:text-amber-400/80 font-medium">
            voucher
          </span>
        </div>
        <div className="mt-2 text-xs text-amber-600 dark:text-amber-400/90">
          Trong các tài khoản sống
        </div>
      </button>

      {/* 5. Mã Freeship 100% (Đơn 0₫) */}
      <button
        onClick={() => onSelectFilter('freeship_100')}
        className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group col-span-2 lg:col-span-1 ${
          activeFilter === 'freeship_100'
            ? 'border-cyan-500 bg-cyan-50/80 dark:bg-cyan-950/30 ring-1 ring-cyan-500 shadow-sm'
            : 'border-cyan-200/70 dark:border-cyan-900/40 bg-cyan-50/30 dark:bg-cyan-950/15 hover:border-cyan-400 dark:hover:border-cyan-800'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-400">
            Freeship 100% (0₫)
          </span>
          <div className="p-1.5 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono tabular-nums">
            {freeship100Count}
          </span>
          <span className="text-xs text-cyan-600/80 dark:text-cyan-400/80 font-medium">
            mã VIP
          </span>
        </div>
        <div className="mt-2 text-xs text-cyan-600 dark:text-cyan-400/90">
          Miễn ship toàn phần
        </div>
      </button>

    </div>
  );
};
