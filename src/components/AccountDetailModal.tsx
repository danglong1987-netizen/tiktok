import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Ban, 
  AlertTriangle, 
  Copy, 
  Check, 
  Ticket, 
  Calendar, 
  ShieldCheck, 
  ShoppingBag,
  Clock,
  RotateCw,
  ExternalLink,
  MapPin,
  Truck,
  PackageCheck
} from 'lucide-react';
import { TikTokAccount } from '../types';
import { copyToClipboard } from '../utils/export';

interface AccountDetailModalProps {
  account: TikTokAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onRecheck: (id: string) => void;
  isChecking: boolean;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  account,
  isOpen,
  onClose,
  onRecheck,
  isChecking,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen || !account) return null;

  const handleCopy = async (text: string, key: string) => {
    await copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const isActive = account.status === 'active';
  const isSuspended = account.status === 'suspended';
  const isCheckpoint = account.status === 'checkpoint';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-100 font-mono font-bold text-sm">
              {account.tiktokId.slice(1, 3).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  {account.tiktokId}
                </h2>
                {account.region && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    {account.region}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {account.nickname || account.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onRecheck(account.id)}
              disabled={isChecking}
              title="Quét lại tài khoản này"
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RotateCw className={`w-4 h-4 ${isChecking ? 'animate-spin text-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Prominent Status Banner - Red for Suspended, Green for Active */}
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            isActive
              ? 'bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500/40 text-emerald-800 dark:text-emerald-200'
              : isSuspended
              ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500/40 text-rose-800 dark:text-rose-200'
              : isCheckpoint
              ? 'bg-amber-500/10 dark:bg-amber-950/40 border-amber-500/40 text-amber-800 dark:text-amber-200'
              : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            <div className="p-1 rounded-lg shrink-0 mt-0.5">
              {isActive ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : isSuspended ? (
                <Ban className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              ) : isCheckpoint ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <Clock className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-extrabold uppercase tracking-wider ${
                  isActive ? 'text-emerald-700 dark:text-emerald-400' :
                  isSuspended ? 'text-rose-700 dark:text-rose-400' :
                  isCheckpoint ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500'
                }`}>
                  {isActive ? 'Tài khoản Còn sống (Hoạt động tốt)' :
                   isSuspended ? 'Tài khoản Đã bị đình chỉ (Khóa Banned)' :
                   isCheckpoint ? 'Tài khoản Cần xác minh OTP/Captcha' : 'Chưa kiểm tra'}
                </span>
                {account.lastChecked && (
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    Quét lúc: {new Date(account.lastChecked).toLocaleString('vi-VN')}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium">
                {account.statusReason || (isActive ? 'Tài khoản sẵn sàng đăng nhập và đặt đơn TikTok Shop' : 'Không có thông tin')}
              </p>
            </div>
          </div>

          {/* Credentials Card */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Thông tin đăng nhập tài khoản</span>
              <button
                onClick={() => handleCopy(`${account.email}|${account.password}`, 'combo')}
                className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
              >
                {copiedKey === 'combo' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                Sao chép dạng email|pass
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Email */}
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Email</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xs text-slate-900 dark:text-slate-100 font-medium truncate">
                    {account.email}
                  </span>
                  <button
                    onClick={() => handleCopy(account.email, 'email')}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {copiedKey === 'email' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* TikTok ID */}
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">TikTok ID / User</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xs text-rose-600 dark:text-rose-400 font-semibold truncate">
                    {account.tiktokId}
                  </span>
                  <button
                    onClick={() => handleCopy(account.tiktokId, 'tiktokId')}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {copiedKey === 'tiktokId' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Mật khẩu</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-mono text-xs text-slate-900 dark:text-slate-100 font-medium truncate">
                    {account.password || '(Không có pass)'}
                  </span>
                  {account.password ? (
                    <button
                      onClick={() => handleCopy(account.password!, 'password')}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {copiedKey === 'password' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">Quét công khai</span>
                  )}
                </div>
              </div>
            </div>

            {account.notes && (
              <div className="text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Ghi chú: </span>
                {account.notes}
              </div>
            )}
          </div>

          {/* Shipping Address Section */}
          <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>Địa chỉ giao hàng nhận hàng TikTok Shop</span>
              </div>
              {account.shippingAddress && (
                <button
                  onClick={() => handleCopy(account.shippingAddress!.fullAddress, 'full_addr')}
                  className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  {copiedKey === 'full_addr' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  Sao chép địa chỉ
                </button>
              )}
            </div>

            {account.shippingAddress ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Người nhận:</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">{account.shippingAddress.recipientName}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Số điện thoại:</span>
                    <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 block">{account.shippingAddress.phoneNumber}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    <div>
                      <span className="text-slate-400">1. Tỉnh/Thành phố:</span>{' '}
                      <strong className="text-slate-800 dark:text-slate-200">{account.shippingAddress.province}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">2. Phường/Xã:</span>{' '}
                      <strong className="text-slate-800 dark:text-slate-200">{account.shippingAddress.ward}</strong>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">3. Chi tiết (Số nhà, đường):</span>{' '}
                    <strong className="text-slate-900 dark:text-white font-mono text-xs">{account.shippingAddress.detailedAddress}</strong>
                  </div>
                  <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                    Địa chỉ hoàn chỉnh: {account.shippingAddress.fullAddress}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Chưa gán địa chỉ giao hàng cho tài khoản này. Bạn có thể dùng tính năng "Setup địa chỉ" ở thanh công cụ để gán hàng loạt.
              </p>
            )}
          </div>

          {/* Placed Orders & Carriers Section (Requirement 10) */}
          {account.placedOrders && account.placedOrders.length > 0 && (
            <div className="space-y-3 p-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Đơn hàng đã đặt & Đơn vị vận chuyển ({account.placedOrders.length} đơn)
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                  Tương ứng với các mã freeship đã dùng
                </span>
              </div>

              <div className="space-y-2">
                {account.placedOrders.map((po, idx) => (
                  <div 
                    key={`${po.orderCode}-${idx}`}
                    className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {po.orderCode}
                        </span>
                        <button
                          onClick={() => handleCopy(po.orderCode, `detail_order_${po.orderCode}`)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Sao chép mã đơn"
                        >
                          {copiedKey === `detail_order_${po.orderCode}` ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                          <Truck className="w-2.5 h-2.5 text-sky-600" />
                          <span>{po.carrier}</span>
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-md">
                        {po.productTitle} {po.variantName ? `(${po.variantName})` : ''}
                      </div>
                    </div>

                    <div className="text-right sm:shrink-0">
                      <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {po.finalTotal.toLocaleString('vi-VN')}₫
                      </div>
                      {po.trackingNumber && (
                        <div className="text-[10px] font-mono text-slate-400">
                          Mã VĐ: {po.trackingNumber}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Vouchers Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Danh sách mã vận chuyển TikTok Shop khả dụng ({account.vouchers.length})
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Áp dụng khi thanh toán giỏ hàng
              </span>
            </div>

            {account.vouchers.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                <Ticket className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {isSuspended 
                    ? 'Tài khoản đã bị đình chỉ nên không thể sử dụng mã vận chuyển.' 
                    : 'Tài khoản hiện không có mã vận chuyển freeship nào trong ví voucher.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {account.vouchers.map(v => (
                  <div 
                    key={v.id} 
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between"
                  >
                    {/* Top tag */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          v.type === 'freeship_100' || v.type === 'new_buyer'
                            ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300'
                            : v.type === 'freeship_xtra'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {v.discountDisplay}
                        </span>
                        {v.isExpiringSoon && (
                          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
                            Sắp hết hạn
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleCopy(v.code, `vouch_${v.id}`)}
                        title="Sao chép mã voucher"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
                      >
                        {copiedKey === `vouch_${v.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Voucher title & condition */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {v.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Áp dụng: <span className="font-semibold text-slate-700 dark:text-slate-300">{v.minOrderDisplay}</span>
                      </p>
                    </div>

                    {/* Expiry & code bottom */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>HSD: {v.expiryDate}</span>
                      </div>
                      <span className="font-mono text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {v.code}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 shrink-0">
          <span className="text-xs text-slate-400">
            ID hệ thống: {account.id}
          </span>
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
