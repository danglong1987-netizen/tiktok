import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Ban, 
  AlertTriangle, 
  Clock, 
  RotateCw, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Trash2, 
  Ticket, 
  CheckSquare, 
  Square,
  MapPin,
  Truck,
  PackageCheck,
  ShoppingBag
} from 'lucide-react';
import { TikTokAccount } from '../types';
import { copyToClipboard } from '../utils/export';

interface AccountTableProps {
  accounts: TikTokAccount[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onCheckSingle: (id: string) => void;
  onDeleteSingle: (id: string) => void;
  onBatchCheck: () => void;
  onBatchDelete: () => void;
  onOpenDetail: (account: TikTokAccount) => void;
  onOpenAddressModal: () => void;
  onPurgeSuspended?: () => void;
  isChecking: boolean;
  checkingId?: string | null;
}

export const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onCheckSingle,
  onDeleteSingle,
  onBatchCheck,
  onBatchDelete,
  onOpenDetail,
  onOpenAddressModal,
  onPurgeSuspended,
  isChecking,
  checkingId,
}) => {
  const [showPasswordIds, setShowPasswordIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = async (text: string, id: string) => {
    await copyToClipboard(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const suspendedCount = accounts.filter(a => a.status === 'suspended').length;
  const isAllSelected = accounts.length > 0 && selectedIds.length === accounts.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < accounts.length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      
      {/* Quick Action: Purge Suspended Accounts */}
      {suspendedCount > 0 && onPurgeSuspended && (
        <div className="bg-rose-500/10 border-b border-rose-200 dark:border-rose-900/60 px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
            <Ban className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>
              Có <strong>{suspendedCount} tài khoản bị khóa đỏ</strong> (Đình chỉ).
            </span>
          </div>
          <button
            onClick={onPurgeSuspended}
            className="px-2.5 py-1 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1 transition"
          >
            <Ban className="w-3 h-3" />
            <span>Loại bỏ {suspendedCount} nick khóa đỏ khỏi danh sách</span>
          </button>
        </div>
      )}
      
      {/* Batch Action Toolbar when items are selected */}
      {selectedIds.length > 0 && (
        <div className="bg-rose-50/80 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-900/60 px-4 py-2.5 flex items-center justify-between text-xs transition-colors">
          <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 font-medium">
            <span className="font-bold font-mono">{selectedIds.length}</span>
            <span>tài khoản được chọn</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddressModal}
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              Gán địa chỉ ({selectedIds.length})
            </button>
            <button
              onClick={onBatchCheck}
              disabled={isChecking}
              className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Kiểm tra {selectedIds.length} tài khoản
            </button>
            <button
              onClick={onBatchDelete}
              disabled={isChecking}
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950 font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Xóa đã chọn
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              
              <th className="w-10 px-4 py-3.5 text-center">
                <button
                  onClick={onToggleSelectAll}
                  aria-label="Chọn tất cả"
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  ) : isPartiallySelected ? (
                    <div className="w-4 h-4 rounded bg-rose-600/30 border border-rose-600 flex items-center justify-center">
                      <div className="w-2 h-0.5 bg-rose-600" />
                    </div>
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>

              <th className="px-4 py-3.5">Tài khoản (Email / TikTok ID)</th>
              <th className="px-4 py-3.5">Mật khẩu</th>
              <th className="px-4 py-3.5">Tình trạng tài khoản</th>
              <th className="px-4 py-3.5 min-w-[190px]">Mã vận chuyển TikTok Shop</th>
              <th className="px-4 py-3.5 min-w-[210px]">Địa chỉ nhận hàng</th>
              <th className="px-4 py-3.5 min-w-[220px]">Mã đơn hàng & ĐVVC</th>
              <th className="px-4 py-3.5 text-right">Lần quét cuối</th>
              <th className="px-4 py-3.5 text-center w-28">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Ticket className="w-8 h-8 stroke-1 text-slate-400" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Chưa có tài khoản nào trong danh sách
                    </p>
                    <p className="text-xs text-slate-400">
                      Bấm nút "Nhập tài khoản" ở góc trên để thêm tài khoản kiểm tra
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              accounts.map((acc) => {
                const isSelected = selectedIds.includes(acc.id);
                const isItemChecking = checkingId === acc.id;
                const isPasswordVisible = !!showPasswordIds[acc.id];

                const isSuspended = acc.status === 'suspended';
                const isActive = acc.status === 'active';
                const isCheckpoint = acc.status === 'checkpoint';

                let rowBgClass = 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors';
                if (isSuspended) {
                  rowBgClass = 'bg-rose-500/[0.04] dark:bg-rose-950/20 hover:bg-rose-500/[0.08] dark:hover:bg-rose-950/30 transition-colors';
                } else if (isActive) {
                  rowBgClass = 'bg-emerald-500/[0.03] dark:bg-emerald-950/15 hover:bg-emerald-500/[0.07] dark:hover:bg-emerald-950/25 transition-colors';
                }

                return (
                  <tr key={acc.id} className={rowBgClass}>
                    
                    {/* Checkbox */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onToggleSelect(acc.id)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Email & TikTok ID */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                            {acc.email || '(Chưa có email)'}
                          </span>
                          {acc.email && (
                            <button
                              onClick={() => handleCopy(acc.email, `email_${acc.id}`)}
                              title="Sao chép Email"
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                            >
                              {copiedId === `email_${acc.id}` ? (
                                <Check className="w-3 h-3 text-emerald-500" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <span className="font-mono text-rose-600 dark:text-rose-400 font-medium">
                            {acc.tiktokId}
                          </span>
                          {acc.nickname && (
                            <span className="text-slate-400 truncate max-w-[120px]">
                              · {acc.nickname}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Password */}
                    <td className="px-4 py-3 font-mono">
                      {acc.password ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-700 dark:text-slate-300">
                            {isPasswordVisible ? acc.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(acc.id)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                            title={isPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                          >
                            {isPasswordVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={() => handleCopy(acc.password!, `pass_${acc.id}`)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                            title="Sao chép mật khẩu"
                          >
                            {copiedId === `pass_${acc.id}` ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 italic text-[11px] font-sans">
                          (Không có pass)
                        </span>
                      )}
                    </td>

                    {/* Status Column - Explicitly RED for Suspended, GREEN for Active */}
                    <td className="px-4 py-3">
                      {isItemChecking ? (
                        <div className="inline-flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-medium animate-pulse">
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang kiểm tra...</span>
                        </div>
                      ) : isActive ? (
                        <div className="flex flex-col gap-1 items-start">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>CÒN SỐNG (LIVE)</span>
                          </div>
                          <span className="text-[11px] text-emerald-700 dark:text-emerald-400/90 line-clamp-1 max-w-[200px]" title={acc.statusReason}>
                            {acc.statusReason || 'Đăng nhập & mua sắm tốt'}
                          </span>
                        </div>
                      ) : isSuspended ? (
                        <div className="flex flex-col gap-1 items-start">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/40">
                            <Ban className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                            <span>BỊ ĐÌNH CHỈ (KHÓA)</span>
                          </div>
                          <span className="text-[11px] text-rose-700 dark:text-rose-400/90 line-clamp-1 max-w-[200px]" title={acc.statusReason}>
                            {acc.statusReason || 'Vi phạm chính sách TikTok'}
                          </span>
                        </div>
                      ) : isCheckpoint ? (
                        <div className="flex flex-col gap-1 items-start">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            <span>CẦN XÁC MINH OTP</span>
                          </div>
                          <span className="text-[11px] text-amber-700 dark:text-amber-400/90 line-clamp-1 max-w-[200px]">
                            {acc.statusReason || 'Cần nhập mã 2FA / OTP'}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Chưa kiểm tra</span>
                        </div>
                      )}
                    </td>

                    {/* Shipping Vouchers Column */}
                    <td className="px-4 py-3">
                      {isSuspended ? (
                        <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">
                          Ví voucher bị vô hiệu hóa do tài khoản khóa
                        </span>
                      ) : acc.vouchers && acc.vouchers.length > 0 ? (
                        <div className="flex flex-col gap-1 max-w-[280px]">
                          {acc.checkedVoucherScope?.scope === 'province_specific' && acc.checkedVoucherScope.province && (
                            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5" />
                              <span>Áp dụng về {acc.checkedVoucherScope.province}:</span>
                            </span>
                          )}
                          <div className="flex flex-wrap gap-1.5">
                            {acc.vouchers.map(v => (
                              <button
                                key={v.id}
                                onClick={() => onOpenDetail(acc)}
                                title={`${v.title} - ${v.minOrderDisplay} (${v.expiryDate})`}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                                  v.type === 'freeship_100' || v.type === 'new_buyer'
                                    ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800'
                                    : v.type === 'freeship_xtra'
                                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                }`}
                              >
                                <Ticket className="w-2.5 h-2.5" />
                                <span>{v.discountDisplay}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                          {acc.status === 'pending' ? 'Chờ quét voucher...' : 'Không có mã'}
                        </span>
                      )}
                    </td>

                    {/* Shipping Address Column (New Feature!) */}
                    <td className="px-4 py-3">
                      {acc.shippingAddress ? (
                        <div className="flex flex-col gap-0.5 max-w-[260px]">
                          <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span className="truncate">{acc.shippingAddress.recipientName}</span>
                            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                              · {acc.shippingAddress.phoneNumber}
                            </span>
                          </div>
                          <div 
                            className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight" 
                            title={acc.shippingAddress.fullAddress}
                          >
                            {acc.shippingAddress.fullAddress}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (!selectedIds.includes(acc.id)) {
                              onToggleSelect(acc.id);
                            }
                            onOpenAddressModal();
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-dashed border-slate-200 dark:border-slate-800 transition-colors"
                        >
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>+ Gán địa chỉ</span>
                        </button>
                      )}
                    </td>

                    {/* Placed Orders & Shipping Carrier Column (Requirement 10) */}
                    <td className="px-4 py-3">
                      {acc.placedOrders && acc.placedOrders.length > 0 ? (
                        <div className="flex flex-col gap-1.5 max-w-[280px]">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              <PackageCheck className="w-3 h-3 text-emerald-600" />
                              <span>ĐÃ ĐẶT {acc.placedOrders.length} ĐƠN</span>
                            </span>
                          </div>

                          <div className="space-y-1">
                            {acc.placedOrders.map((po, poIdx) => (
                              <div 
                                key={`${po.orderCode}-${poIdx}`}
                                className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col gap-0.5"
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-mono font-bold text-[11px] text-slate-900 dark:text-white">
                                    {po.orderCode}
                                  </span>
                                  <button
                                    onClick={() => handleCopy(po.orderCode, `order_${po.orderCode}_${poIdx}`)}
                                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-0.5"
                                    title="Sao chép mã đơn"
                                  >
                                    {copiedId === `order_${po.orderCode}_${poIdx}` ? (
                                      <Check className="w-3 h-3 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>

                                <div className="flex items-center gap-1 text-[10px] flex-wrap">
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                                    <Truck className="w-2.5 h-2.5 text-sky-600" />
                                    <span>{po.carrier}</span>
                                  </span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                                    {po.finalTotal.toLocaleString('vi-VN')}₫
                                  </span>
                                </div>

                                {po.trackingNumber && (
                                  <div className="text-[9px] font-mono text-slate-400 truncate" title={`Mã vận đơn: ${po.trackingNumber}`}>
                                    Mã VĐ: {po.trackingNumber}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : isSuspended ? (
                        <span className="text-slate-400 dark:text-slate-500 italic text-[11px]">
                          (Đã loại bỏ - Nick khóa)
                        </span>
                      ) : acc.vouchers && acc.vouchers.length > 0 ? (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-col gap-0.5">
                          <span className="text-amber-600 dark:text-amber-400 font-medium">
                            Chưa đặt đơn
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Sẵn sàng {acc.vouchers.length} mã freeship
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                          Chưa có đơn
                        </span>
                      )}
                    </td>

                    {/* Last Checked */}
                    <td className="px-4 py-3 text-right text-slate-500 dark:text-slate-400 font-mono text-[11px] tabular-nums whitespace-nowrap">
                      {acc.lastChecked ? (
                        <div>
                          <div>{new Date(acc.lastChecked).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500">
                            {new Date(acc.lastChecked).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onCheckSingle(acc.id)}
                          disabled={isChecking}
                          title="Kiểm tra lại tài khoản này"
                          className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <RotateCw className={`w-3.5 h-3.5 ${isItemChecking ? 'animate-spin text-rose-500' : ''}`} />
                        </button>
                        <button
                          onClick={() => onOpenDetail(acc)}
                          title="Xem chi tiết địa chỉ, ví voucher & thông tin"
                          className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteSingle(acc.id)}
                          disabled={isChecking}
                          title="Xóa tài khoản"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
