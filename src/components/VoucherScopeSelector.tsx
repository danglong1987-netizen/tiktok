import React from 'react';
import { MapPin, Globe, Ticket, Info, Check } from 'lucide-react';
import { VoucherCheckScope } from '../types';
import { VIETNAMESE_PROVINCES } from '../utils/addressGenerator';

interface VoucherScopeSelectorProps {
  voucherScope: VoucherCheckScope;
  onChangeScope: (scope: VoucherCheckScope) => void;
  selectedProvince: string;
  onChangeProvince: (prov: string) => void;
  onRecheckWithScope: () => void;
  isChecking: boolean;
  totalAccounts: number;
}

export const VoucherScopeSelector: React.FC<VoucherScopeSelectorProps> = ({
  voucherScope,
  onChangeScope,
  selectedProvince,
  onChangeProvince,
  onRecheckWithScope,
  isChecking,
  totalAccounts,
}) => {
  return (
    <div className="mb-4 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
      
      {/* Title & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        
        {/* Label */}
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Chế độ kiểm tra mã vận chuyển TikTok Shop:</span>
              <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.2 rounded">
                2 Lựa chọn
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Chọn kiểm tra mã trợ giá theo từng tỉnh thành hoặc kiểm tra toàn bộ kho voucher tổng thể
            </p>
          </div>
        </div>

        {/* 2 Scope Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          
          {/* Lựa chọn 1: Theo Tỉnh/Thành phố */}
          <button
            type="button"
            onClick={() => onChangeScope('province_specific')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              voucherScope === 'province_specific'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>1. Check theo Tỉnh / TP</span>
            {voucherScope === 'province_specific' && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
          </button>

          {/* Lựa chọn 2: Tổng thể */}
          <button
            type="button"
            onClick={() => onChangeScope('global_all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              voucherScope === 'global_all'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>2. Check tổng thể (Toàn sàn)</span>
            {voucherScope === 'global_all' && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
          </button>

        </div>

      </div>

      {/* Detail bar depending on selected choice */}
      {voucherScope === 'province_specific' ? (
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-rose-50/40 dark:bg-rose-950/20 -mx-3.5 -mb-3.5 p-3 rounded-b-xl border-t border-rose-100 dark:border-rose-900/40">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              Tỉnh / Thành phố nhận hàng cần kiểm tra:
            </span>
            <select
              value={selectedProvince}
              onChange={(e) => onChangeProvince(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {VIETNAMESE_PROVINCES.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:inline">
              (Kiểm tra các mã freeship áp dụng tối ưu khi ship về <strong>{selectedProvince}</strong>)
            </span>
          </div>

          <button
            type="button"
            onClick={onRecheckWithScope}
            disabled={isChecking || totalAccounts === 0}
            className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition-all whitespace-nowrap self-end sm:self-auto disabled:opacity-50"
          >
            Quét mã về {selectedProvince}
          </button>

        </div>
      ) : (
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50/60 dark:bg-slate-950/40 -mx-3.5 -mb-3.5 p-3 rounded-b-xl">
          <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>
              <strong>Chế độ tổng thể:</strong> Quét toàn bộ kho voucher vận chuyển (Freeship 100%, Giảm 70k, Giảm 50k Xtra, Giảm 25k toàn sàn) không phân biệt tỉnh nhận hàng.
            </span>
          </div>

          <button
            type="button"
            onClick={onRecheckWithScope}
            disabled={isChecking || totalAccounts === 0}
            className="px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg shadow-sm transition-all whitespace-nowrap self-end sm:self-auto disabled:opacity-50"
          >
            Quét kho voucher tổng thể
          </button>
        </div>
      )}

    </div>
  );
};
