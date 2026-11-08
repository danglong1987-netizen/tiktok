import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Check, 
  Copy, 
  Filter,
  CheckCircle2,
  Ban
} from 'lucide-react';
import { TikTokAccount } from '../types';
import { exportAccountsToCSV, exportAccountsToTXT, copyToClipboard } from '../utils/export';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: TikTokAccount[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  accounts,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'active_only' | 'suspended_only' | 'freeship_only'>('all');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Filter accounts according to user selection
  const filteredAccounts = accounts.filter(acc => {
    if (filterType === 'active_only') return acc.status === 'active';
    if (filterType === 'suspended_only') return acc.status === 'suspended';
    if (filterType === 'freeship_only') return acc.status === 'active' && acc.vouchers.length > 0;
    return true;
  });

  const activeCount = filteredAccounts.filter(a => a.status === 'active').length;
  const suspendedCount = filteredAccounts.filter(a => a.status === 'suspended').length;

  const handleExportCSV = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    exportAccountsToCSV(filteredAccounts, `tiktok_report_${filterType}_${timestamp}.csv`);
  };

  const handleExportTXT = (format: 'email|pass' | 'id|pass' | 'email|pass|id' | 'email|pass|address' | 'full') => {
    exportAccountsToTXT(filteredAccounts, format, false);
  };

  const handleQuickCopy = async (format: 'email|pass' | 'id|pass') => {
    const text = filteredAccounts
      .map(acc => format === 'email|pass' ? `${acc.email}|${acc.password}` : `${acc.tiktokId}|${acc.password}`)
      .join('\n');
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Xuất danh sách tài khoản TikTok & Voucher
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Xuất file Excel CSV hoặc file TXT nạp vào tool mua hàng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Step 1: Chọn bộ lọc đối tượng xuất */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              1. Chọn danh sách muốn xuất:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                  filterType === 'all'
                    ? 'border-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white ring-1 ring-slate-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                Tất cả ({accounts.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterType('active_only')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                  filterType === 'active_only'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500'
                    : 'border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50/50'
                }`}
              >
                Chỉ còn sống ({accounts.filter(a => a.status === 'active').length})
              </button>

              <button
                type="button"
                onClick={() => setFilterType('freeship_only')}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                  filterType === 'freeship_only'
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 ring-1 ring-cyan-500'
                    : 'border-cyan-200 dark:border-cyan-900/50 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50/50'
                }`}
              >
                Có mã freeship ({accounts.filter(a => a.status === 'active' && a.vouchers.length > 0).length})
              </button>

              <button
                type="button"
                onClick={() => setFilterType('suspended_only')}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                  filterType === 'suspended_only'
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500'
                    : 'border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50/50'
                }`}
              >
                Bị đình chỉ ({accounts.filter(a => a.status === 'suspended').length})
              </button>
            </div>

            <div className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
              <span>Sẽ xuất: <strong className="font-mono text-slate-900 dark:text-white">{filteredAccounts.length}</strong> tài khoản</span>
              <span className="text-emerald-600 dark:text-emerald-400">· {activeCount} sống</span>
              <span className="text-rose-600 dark:text-rose-400">· {suspendedCount} khóa</span>
            </div>
          </div>

          {/* Step 2: Các định dạng xuất */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              2. Chọn định dạng tải về:
            </label>

            <div className="space-y-2.5">
              
              {/* Option 1: Full Excel CSV */}
              <button
                onClick={handleExportCSV}
                disabled={filteredAccounts.length === 0}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-600 bg-slate-50/60 dark:bg-slate-950/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 text-left flex items-center justify-between transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      Tải file Excel / CSV đầy đủ chi tiết (.csv)
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Bao gồm Email, Pass, TikTok ID, Tình trạng (Đỏ/Xanh), Chi tiết các mã vận chuyển, Thời gian quét
                    </p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
              </button>

              {/* Option 2: TXT email|password for bot/tool */}
              <button
                onClick={() => handleExportTXT('email|pass')}
                disabled={filteredAccounts.length === 0}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-500 dark:hover:border-rose-600 bg-slate-50/60 dark:bg-slate-950/50 hover:bg-rose-50/30 dark:hover:bg-rose-950/20 text-left flex items-center justify-between transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400">
                      Tải file TXT định dạng email|password (.txt)
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      Chuẩn định dạng nhập vào tool nuôi acc / auto checkout TikTok Shop
                    </p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-rose-500" />
              </button>

              {/* Option 2.5: TXT email|pass|address for TikTok Shop auto-order bots */}
              <button
                onClick={() => handleExportTXT('email|pass|address')}
                disabled={filteredAccounts.length === 0}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-600 bg-slate-50/60 dark:bg-slate-950/50 hover:bg-amber-50/30 dark:hover:bg-amber-950/20 text-left flex items-center justify-between transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                      Tải file TXT kèm địa chỉ giao hàng (.txt)
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      email|pass|Tên_người_nhận|SĐT|Địa_chỉ_chi_tiết (Cho bot auto đặt hàng)
                    </p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400 group-hover:text-amber-500" />
              </button>

              {/* Option 3: TXT id|password */}
              <button
                onClick={() => handleExportTXT('id|pass')}
                disabled={filteredAccounts.length === 0}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/60 dark:bg-slate-950/50 text-left flex items-center justify-between transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Tải file TXT định dạng id|password (.txt)
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      @username|matkhau
                    </p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-400" />
              </button>

            </div>
          </div>

          {/* Quick Copy to Clipboard */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Sao chép nhanh vào bộ nhớ tạm:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickCopy('email|pass')}
                  disabled={filteredAccounts.length === 0}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy email|pass
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
