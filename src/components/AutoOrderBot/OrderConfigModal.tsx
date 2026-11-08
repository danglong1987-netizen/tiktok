import React, { useState } from 'react';
import { AutoOrderConfig } from '../../types';
import { 
  Sliders, 
  X, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  RotateCcw
} from 'lucide-react';

interface OrderConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AutoOrderConfig;
  onSaveConfig: (config: AutoOrderConfig) => void;
}

export const OrderConfigModal: React.FC<OrderConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [minProductPrice, setMinProductPrice] = useState(config.minProductPrice?.toString() || '1000');
  const [maxProductPrice, setMaxProductPrice] = useState(config.maxProductPrice?.toString() || '50000');
  const [minTotal, setMinTotal] = useState(config.minTotalAmount.toString());
  const [maxTotal, setMaxTotal] = useState(config.maxTotalAmount.toString());
  const [delaySec, setDelaySec] = useState(config.delayBetweenAccountsSec.toString());
  const [requireFreeship, setRequireFreeship] = useState(config.requireFreeship);
  const [selectLowestPriceVariant, setSelectLowestPriceVariant] = useState(config.selectLowestPriceVariant ?? true);
  const [filterVariantByPriceRange, setFilterVariantByPriceRange] = useState(config.filterVariantByPriceRange ?? true);
  const [skipSuspended, setSkipSuspended] = useState(config.skipSuspendedAccounts);
  const [targetProvince, setTargetProvince] = useState(config.targetProvince);

  if (!isOpen) return null;

  const handleApplyVariantPreset = (min: number, max: number) => {
    setMinProductPrice(min.toString());
    setMaxProductPrice(max.toString());
  };

  const handleApplyTotalPreset = (min: number, max: number) => {
    setMinTotal(min.toString());
    setMaxTotal(max.toString());
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const minProdVal = Number(minProductPrice.replace(/[^0-9]/g, '')) || 1000;
    const maxProdVal = Number(maxProductPrice.replace(/[^0-9]/g, '')) || 50000;
    const minVal = Number(minTotal.replace(/[^0-9]/g, '')) || 1000;
    const maxVal = Number(maxTotal.replace(/[^0-9]/g, '')) || 100000;
    const delayVal = Math.max(1, Number(delaySec) || 3);

    onSaveConfig({
      ...config,
      minProductPrice: minProdVal,
      maxProductPrice: maxProdVal,
      minTotalAmount: minVal,
      maxTotalAmount: maxVal,
      delayBetweenAccountsSec: delayVal,
      requireFreeship,
      selectLowestPriceVariant,
      filterVariantByPriceRange,
      skipSuspendedAccounts: skipSuspended,
      targetProvince,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Cài đặt quy tắc đặt hàng & Khoảng tiền
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Căn cứ vào tổng tiền thực tế sau khi trừ mã freeship để chốt đơn hoặc tự động thoát tài khoản
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          
          {/* Section 1: Variation Price Bounds (User Core Requirement) */}
          <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>1. Khoảng Giá Phân Loại Sản Phẩm (Lựa chọn phân loại / SKU trong link):</span>
            </div>
            
            {/* User explanation box */}
            <div className="p-3 rounded-lg bg-amber-100/70 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>🎯 Quy tắc chọn phân loại:</strong> Link sản phẩm có nhiều phân loại với các mức giá khác nhau (ví dụ: 3.000₫, 7.000₫, 9.000₫, 100.000₫). Nếu khoảng giá cài đặt là <strong>1.000₫ - 5.000₫</strong> thì bot sẽ tự động quét toàn bộ link và chọn đúng phân loại <strong>3.000₫</strong> (không phân biệt phân loại đó nằm ở vị trí số 1, 2, 3 hay 4 trong link). Các phân loại ngoài khoảng sẽ bị loại bỏ. Nếu link không có phân loại nào thỏa mãn, bot sẽ tự động thoát tài khoản!
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] text-slate-500 font-medium">Mẫu nhanh:</span>
              <button
                type="button"
                onClick={() => handleApplyVariantPreset(1000, 5000)}
                className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:border-amber-500 text-[11px] font-bold transition shadow-xs"
              >
                1k - 5k (Chuẩn ví dụ Deal 3k)
              </button>
              <button
                type="button"
                onClick={() => handleApplyVariantPreset(2000, 15000)}
                className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500 text-[11px] font-semibold transition"
              >
                2k - 15k (Phụ kiện mini)
              </button>
              <button
                type="button"
                onClick={() => handleApplyVariantPreset(10000, 50000)}
                className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500 text-[11px] font-semibold transition"
              >
                10k - 50k (Tiêu chuẩn)
              </button>
              <button
                type="button"
                onClick={() => handleApplyVariantPreset(30000, 120000)}
                className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-500 text-[11px] font-semibold transition"
              >
                30k - 120k (Thời trang)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">
                  Giá phân loại THẤP NHẤT (VNĐ):
                </label>
                <input
                  type="number"
                  required
                  step="1000"
                  min="0"
                  value={minProductPrice}
                  onChange={(e) => setMinProductPrice(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-950 font-mono text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/30"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">
                  Giá phân loại CAO NHẤT (VNĐ):
                </label>
                <input
                  type="number"
                  required
                  step="1000"
                  min="0"
                  value={maxProductPrice}
                  onChange={(e) => setMaxProductPrice(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-950 font-mono text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Final Total Amount Bounds */}
          <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold">
              <DollarSign className="w-4 h-4" />
              <span>2. Khoảng Tổng Tiền Thanh Toán Cho Phép (Căn cứ chốt đơn sau khi trừ ship):</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Tổng tiền = Giá phân loại đã chọn + Phí ship - Mã giảm freeship. Nếu tổng tiền nằm trong khoảng này, bot sẽ chốt đơn. Nếu vượt trần hoặc thấp hơn sàn, bot sẽ <strong>tự động đăng xuất tài khoản</strong> để chuyển sang tài khoản kế tiếp.
            </p>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] text-slate-500 font-medium">Mẫu nhanh:</span>
              <button
                type="button"
                onClick={() => handleApplyTotalPreset(1000, 45000)}
                className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-500 text-[11px] font-semibold transition"
              >
                Đơn siêu rẻ (1k - 45k)
              </button>
              <button
                type="button"
                onClick={() => handleApplyTotalPreset(10000, 95000)}
                className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-500 text-[11px] font-semibold transition"
              >
                Chuẩn (10k - 95k)
              </button>
              <button
                type="button"
                onClick={() => handleApplyTotalPreset(50000, 160000)}
                className="px-2.5 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-500 text-[11px] font-semibold transition"
              >
                Đơn Mall (50k - 160k)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">
                  Tổng tiền THẤP NHẤT (VNĐ):
                </label>
                <input
                  type="number"
                  required
                  step="1000"
                  min="0"
                  value={minTotal}
                  onChange={(e) => setMinTotal(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/30"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-1">
                  Tổng tiền CAO NHẤT (VNĐ):
                </label>
                <input
                  type="number"
                  required
                  step="1000"
                  min="0"
                  value={maxTotal}
                  onChange={(e) => setMaxTotal(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-mono text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500/30"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Safety Controls & Rules */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Clock className="w-4 h-4 text-sky-500" />
              <span>3. Quy tắc an toàn & Tự động thoát tài khoản:</span>
            </div>

            <div className="space-y-2.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterVariantByPriceRange}
                  onChange={(e) => setFilterVariantByPriceRange(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-amber-600 rounded cursor-pointer"
                />
                <div>
                  <span className="font-bold text-amber-700 dark:text-amber-400">
                    🎯 Quét toàn bộ phân loại và chọn phân loại tương ứng với khoảng giá đã chọn (bất kể vị trí số mấy)
                  </span>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Không phụ thuộc vị trí thứ 1, 2, 3... trong link, bot sẽ tìm đúng phân loại có giá nằm trong khoảng và tự động chọn phân loại đó.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={skipSuspended}
                  onChange={(e) => setSkipSuspended(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-rose-600 rounded cursor-pointer"
                />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Tự động thoát ngay khi tài khoản bị khóa đỏ hoặc lỗi checkpoint
                  </span>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Hệ thống sẽ không tốn thời gian đặt hàng trên các tài khoản bị cấm, tự động logout để chuyển tiếp tài khoản sống.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireFreeship}
                  onChange={(e) => setRequireFreeship(e.target.checked)}
                  className="w-4 h-4 mt-0.5 accent-rose-600 rounded cursor-pointer"
                />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Ưu tiên áp dụng mã Freeship 100% hoặc Freeship Xtra
                  </span>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Tự động tìm và gắn mã freeship tốt nhất trong ví của tài khoản để hạ cước vận chuyển xuống mức thấp nhất.
                  </p>
                </div>
              </label>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Thời gian nghỉ giữa các tài khoản:
                  </span>
                  <p className="text-slate-500 text-[11px]">Giúp hạn chế bị TikTok nghi ngờ hành vi tự động.</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={delaySec}
                    onChange={(e) => setDelaySec(e.target.value)}
                    className="w-16 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center font-bold text-xs"
                  />
                  <span className="text-slate-500">giây</span>
                </div>
              </div>
            </div>
          </div>

          {/* Target Province */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                Tỉnh / Thành phố tính cước vận chuyển:
              </span>
              <select
                value={targetProvince}
                onChange={(e) => setTargetProvince(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 font-semibold text-xs"
              >
                <option value="Quảng Ninh">Quảng Ninh</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Hải Phòng">Hải Phòng</option>
                <option value="Bắc Ninh">Bắc Ninh</option>
                <option value="Bình Dương">Bình Dương</option>
                <option value="Cần Thơ">Cần Thơ</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500">
              Bot sẽ tính mức trợ giá cước vận chuyển giao về địa chỉ này để so khớp với tổng tiền cho phép.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition"
            >
              Lưu cấu hình
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
