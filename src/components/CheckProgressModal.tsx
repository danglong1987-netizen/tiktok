import React from 'react';
import { 
  RotateCw, 
  CheckCircle2, 
  Ban, 
  Ticket, 
  X,
  Check
} from 'lucide-react';

interface CheckProgressModalProps {
  isOpen: boolean;
  total: number;
  current: number;
  currentAccountName?: string;
  activeCount: number;
  suspendedCount: number;
  vouchersFound: number;
  isComplete: boolean;
  onCancel: () => void;
  onFinish: () => void;
  onPurgeSuspended?: () => void;
  onGoToAutoOrder?: () => void;
}

export const CheckProgressModal: React.FC<CheckProgressModalProps> = ({
  isOpen,
  total,
  current,
  currentAccountName,
  activeCount,
  suspendedCount,
  vouchersFound,
  isComplete,
  onCancel,
  onFinish,
  onPurgeSuspended,
  onGoToAutoOrder,
}) => {
  if (!isOpen) return null;

  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isComplete 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }`}>
              {isComplete ? (
                <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <RotateCw className="w-4 h-4 animate-spin text-rose-600 dark:text-rose-400" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isComplete ? 'Quét tài khoản hoàn tất!' : 'Đang kiểm tra tài khoản TikTok...'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isComplete 
                  ? `Đã kiểm tra xong ${total} tài khoản` 
                  : `Đang quét tài khoản: ${currentAccountName || '...'}`}
              </p>
            </div>
          </div>

          {isComplete && (
            <button
              onClick={onFinish}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-6">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-600 dark:text-slate-400">
              Tiến độ: <strong className="text-slate-900 dark:text-white">{current}/{total}</strong>
            </span>
            <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">
              {percent}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                isComplete 
                  ? 'bg-emerald-500' 
                  : 'bg-gradient-to-r from-rose-500 to-amber-500'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Realtime KPI counters during check */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* Active accounts - Green */}
          <div className="p-3 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CÒN SỐNG</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
              {activeCount}
            </div>
            <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">Xanh lá (Live)</span>
          </div>

          {/* Suspended accounts - Red */}
          <div className="p-3 rounded-xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 mb-1">
              <Ban className="w-3.5 h-3.5" />
              <span>ĐÌNH CHỈ</span>
            </div>
            <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 font-mono tabular-nums">
              {suspendedCount}
            </div>
            <span className="text-[10px] text-rose-600/80 dark:text-rose-400/80">Màu đỏ (Khóa)</span>
          </div>

          {/* Shipping vouchers */}
          <div className="p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 mb-1">
              <Ticket className="w-3.5 h-3.5" />
              <span>MÃ SHIP</span>
            </div>
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
              {vouchersFound}
            </div>
            <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80">Voucher Shop</span>
          </div>
        </div>

        {/* Suspended Accounts Prompt when Complete */}
        {isComplete && suspendedCount > 0 && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 font-bold">
              <Ban className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Phát hiện {suspendedCount} tài khoản bị ĐÌNH CHỈ (KHÓA ĐỎ)</span>
            </div>
            <p className="text-[11px] text-rose-700 dark:text-rose-400">
              Để bot tự động đặt hàng hoạt động ổn định và không bị lỗi, bạn nên loại bỏ các tài khoản khóa đỏ này khỏi danh sách.
            </p>
            {onPurgeSuspended && (
              <button
                onClick={() => {
                  onPurgeSuspended();
                  onFinish();
                }}
                className="w-full py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Loại bỏ {suspendedCount} tài khoản khóa đỏ khỏi danh sách đặt hàng</span>
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2">
          {isComplete ? (
            <>
              {onGoToAutoOrder && activeCount > 0 && (
                <button
                  onClick={() => {
                    onFinish();
                    onGoToAutoOrder();
                  }}
                  className="w-full sm:w-auto py-2 px-4 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:opacity-95 shadow-md shadow-rose-600/20 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>Chuyển sang Đặt Hàng Tự Động ({activeCount} acc)</span>
                </button>
              )}
              <button
                onClick={onFinish}
                className="w-full sm:w-auto py-2 px-4 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-center"
              >
                Đóng & Xem danh sách
              </button>
            </>
          ) : (
            <button
              onClick={onCancel}
              className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Dừng kiểm tra
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
