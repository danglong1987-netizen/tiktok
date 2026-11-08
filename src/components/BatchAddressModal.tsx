import React, { useState, useMemo } from 'react';
import { 
  X, 
  MapPin, 
  Sparkles, 
  Check, 
  User, 
  Phone, 
  Compass,
  Shuffle,
  Tag
} from 'lucide-react';
import { TikTokAccount, ShippingAddress } from '../types';
import { 
  VIETNAMESE_PROVINCES, 
  DEFAULT_STREET_OPTIONS,
  generateRandomVietnameseName, 
  generateRandomPhoneNumber, 
  generateRandomHouseAndStreet,
  buildFullAddress 
} from '../utils/addressGenerator';

interface BatchAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: TikTokAccount[];
  selectedIds: string[];
  onApplyAddresses: (updatedAccounts: TikTokAccount[]) => void;
}

export const BatchAddressModal: React.FC<BatchAddressModalProps> = ({
  isOpen,
  onClose,
  accounts,
  selectedIds,
  onApplyAddresses,
}) => {
  // Target accounts
  const [targetMode, setTargetMode] = useState<'selected' | 'active_only' | 'all'>(
    selectedIds.length > 0 ? 'selected' : 'all'
  );

  // Field 1: Tên người nhận (3 chế độ: Random thuần, Random + đuôi, Cố định)
  const [nameMode, setNameMode] = useState<'random_suffix' | 'random_plain' | 'fixed'>('random_suffix');
  const [nameSuffix, setNameSuffix] = useState('999');
  const [fixedName, setFixedName] = useState('Nguyễn Văn An');

  // Field 2: Số điện thoại
  const [phoneMode, setPhoneMode] = useState<'random' | 'fixed'>('random');
  const [fixedPhone, setFixedPhone] = useState('0988665544');

  // Field 3: Địa chỉ
  // 3.1: Tỉnh
  const [selectedProvince, setSelectedProvince] = useState<string>('Quảng Ninh');
  
  // 3.2: Phường (Xã)
  const currentProvinceData = useMemo(() => {
    return VIETNAMESE_PROVINCES.find(p => p.name === selectedProvince) || VIETNAMESE_PROVINCES[0];
  }, [selectedProvince]);

  const [selectedWard, setSelectedWard] = useState<string>('Xã Kỳ Thượng');
  const [customWard, setCustomWard] = useState('');
  const [useCustomWard, setUseCustomWard] = useState(false);

  // 3.3: Chi tiết địa chỉ: Số nhà & tên đường là random, khu vực/thôn/xóm là CỐ ĐỊNH
  const [detailMode, setDetailMode] = useState<'random_house_and_street' | 'random_house_fixed_street' | 'fixed'>('random_house_and_street');
  const [fixedLocality, setFixedLocality] = useState('đồng lá hòa bình');
  const [fixedStreetName, setFixedStreetName] = useState('đường 6');
  const [fixedDetailAddress, setFixedDetailAddress] = useState('số nhà 22 đường 6, đồng lá hòa bình');

  // Refresh preview trigger
  const [previewSeed, setPreviewSeed] = useState(0);

  if (!isOpen) return null;

  // Selected accounts to apply
  const targetAccounts = accounts.filter(acc => {
    if (targetMode === 'selected') return selectedIds.includes(acc.id);
    if (targetMode === 'active_only') return acc.status === 'active';
    return true;
  });

  const activeWard = useCustomWard && customWard.trim() ? customWard.trim() : selectedWard;

  // Generate a sample address based on current settings for preview
  const generateOneAddress = (index: number): ShippingAddress => {
    // 1. Name generator with suffix option
    let name = '';
    if (nameMode === 'random_suffix') {
      name = generateRandomVietnameseName(nameSuffix || '999');
    } else if (nameMode === 'random_plain') {
      name = generateRandomVietnameseName();
    } else {
      name = fixedName;
    }

    // 2. Phone generator
    const phone = phoneMode === 'random' ? generateRandomPhoneNumber() : fixedPhone;

    // 3. Detailed address: số nhà & đường là RANDOM, khu vực/thôn/xóm CỐ ĐỊNH
    let detailed = '';
    if (detailMode === 'random_house_and_street') {
      detailed = generateRandomHouseAndStreet(fixedLocality);
    } else if (detailMode === 'random_house_fixed_street') {
      const houseNumber = Math.floor(1 + ((index * 23 + previewSeed * 7 + Math.random() * 200) % 240));
      detailed = `số nhà ${houseNumber} ${fixedStreetName.trim() || 'đường 6'}, ${fixedLocality.trim() || 'đồng lá hòa bình'}`;
    } else {
      detailed = fixedDetailAddress;
    }

    return buildFullAddress(name, phone, selectedProvince, activeWard, detailed);
  };

  // Preview samples (3 examples)
  const previewSamples = [0, 1, 2].map(idx => generateOneAddress(idx));

  // Apply batch addresses to target accounts
  const handleApply = () => {
    if (targetAccounts.length === 0) return;

    const targetIdSet = new Set(targetAccounts.map(a => a.id));
    let counter = 0;

    const updated = accounts.map(acc => {
      if (targetIdSet.has(acc.id)) {
        counter++;
        const newAddress = generateOneAddress(counter);
        return {
          ...acc,
          shippingAddress: newAddress,
        };
      }
      return acc;
    });

    onApplyAddresses(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Cài đặt địa chỉ giao hàng hàng loạt
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Setup Tên (+ đuôi), SĐT, 1 Tỉnh, 2 Phường/Xã, 3 Số nhà & Đường ngẫu nhiên, Khu vực cố định
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

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Target Accounts Selection */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Áp dụng địa chỉ cho danh sách nào:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetMode('selected')}
                disabled={selectedIds.length === 0}
                className={`py-2 px-3 rounded-lg border text-center font-semibold transition-all ${
                  targetMode === 'selected'
                    ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 ring-1 ring-rose-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Đã chọn ({selectedIds.length})
              </button>

              <button
                type="button"
                onClick={() => setTargetMode('active_only')}
                className={`py-2 px-3 rounded-lg border text-center font-semibold transition-all ${
                  targetMode === 'active_only'
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                Chỉ acc sống ({accounts.filter(a => a.status === 'active').length})
              </button>

              <button
                type="button"
                onClick={() => setTargetMode('all')}
                className={`py-2 px-3 rounded-lg border text-center font-semibold transition-all ${
                  targetMode === 'all'
                    ? 'border-slate-700 dark:border-slate-400 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white ring-1 ring-slate-700 dark:ring-slate-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                Tất cả ({accounts.length})
              </button>
            </div>
          </div>

          {/* Form Step by Step according to user exact order */}
          <div className="space-y-4">
            
            {/* 1. TÊN NGƯỜI NHẬN (CÓ THÊM LỰA CHỌN: RANDOM TÊN + ĐUÔI CỐ ĐỊNH) */}
            <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rose-500" />
                  <span>1. Tên người nhận:</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setNameMode('random_suffix')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                      nameMode === 'random_suffix'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    Random tên + Đuôi (vd: an 999)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNameMode('random_plain')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                      nameMode === 'random_plain'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Random tên thuần
                  </button>
                  <button
                    type="button"
                    onClick={() => setNameMode('fixed')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                      nameMode === 'fixed'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Tên cố định
                  </button>
                </div>
              </div>

              {/* Lựa chọn mới: Random Tên + Đuôi cố định */}
              {nameMode === 'random_suffix' && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                      Đuôi cố định phía sau tên:
                    </span>
                    <input
                      type="text"
                      value={nameSuffix}
                      onChange={(e) => setNameSuffix(e.target.value)}
                      placeholder="999, VIP, Shop01..."
                      className="w-32 px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-950 text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                    />
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      (Tên là ngẫu nhiên, đuôi <strong className="font-mono text-rose-600 dark:text-rose-400">{nameSuffix || '999'}</strong> cố định)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between font-mono">
                    <span>Mẫu sinh ra: <strong>{generateRandomVietnameseName(nameSuffix || '999')}</strong></span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-sans font-medium text-[10px]">Đuôi gắn cố định cho tất cả acc</span>
                  </div>
                </div>
              )}

              {nameMode === 'random_plain' && (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>Mỗi tài khoản sẽ nhận 1 họ tên tiếng Việt ngẫu nhiên (không có đuôi)</span>
                  <span className="font-bold font-mono">Ví dụ: {generateRandomVietnameseName()}</span>
                </div>
              )}

              {nameMode === 'fixed' && (
                <input
                  type="text"
                  value={fixedName}
                  onChange={(e) => setFixedName(e.target.value)}
                  placeholder="Nhập tên người nhận (ví dụ: Nguyễn Văn An)..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
              )}
            </div>

            {/* 2. SỐ ĐIỆN THOẠI */}
            <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-rose-500" />
                  <span>2. Số điện thoại nhận hàng:</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPhoneMode('random')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      phoneMode === 'random'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Random số điện thoại
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhoneMode('fixed')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      phoneMode === 'fixed'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Số cố định
                  </button>
                </div>
              </div>

              {phoneMode === 'fixed' ? (
                <input
                  type="text"
                  value={fixedPhone}
                  onChange={(e) => setFixedPhone(e.target.value)}
                  placeholder="Nhập số điện thoại (ví dụ: 0988123456)..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
              ) : (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>Tự sinh 10 chữ số chuẩn đầu số nhà mạng Viettel, Vina, Mobi (09xx, 08xx, 03xx...)</span>
                  <span className="font-bold font-mono">Ví dụ: {generateRandomPhoneNumber()}</span>
                </div>
              )}
            </div>

            {/* 3. ĐỊA CHỈ: 1 Tỉnh, 2 Phường (Xã), 3 Chi tiết */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 space-y-3.5">
              
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-rose-500" />
                <span>3. Địa chỉ giao hàng (theo 3 cấp chuẩn):</span>
              </div>

              {/* 3.1: 1 Tỉnh */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    3.1 - Tỉnh / Thành phố:
                  </label>
                  <select
                    value={selectedProvince}
                    onChange={(e) => {
                      const newProv = e.target.value;
                      setSelectedProvince(newProv);
                      const provObj = VIETNAMESE_PROVINCES.find(p => p.name === newProv);
                      if (provObj && provObj.wards.length > 0) {
                        setSelectedWard(provObj.wards[0]);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                  >
                    {VIETNAMESE_PROVINCES.map(p => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* 3.2: 2 Phường (Xã) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      3.2 - Phường (Xã):
                    </label>
                    <button
                      type="button"
                      onClick={() => setUseCustomWard(!useCustomWard)}
                      className="text-[10px] text-rose-600 dark:text-rose-400 hover:underline"
                    >
                      {useCustomWard ? 'Chọn từ danh sách' : 'Tự nhập xã khác'}
                    </button>
                  </div>

                  {useCustomWard ? (
                    <input
                      type="text"
                      value={customWard}
                      onChange={(e) => setCustomWard(e.target.value)}
                      placeholder="Nhập tên xã/phường (ví dụ: Xã Kỳ Thượng)..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                    />
                  ) : (
                    <select
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                    >
                      {currentProvinceData.wards.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* 3.3: 3 Chi tiết địa chỉ: Số nhà & đường là RANDOM, khu vực/thôn/xóm CỐ ĐỊNH */}
              <div className="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="font-bold text-slate-800 dark:text-slate-200">
                    3.3 - Chi tiết địa chỉ:
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDetailMode('random_house_and_street')}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                        detailMode === 'random_house_and_street'
                          ? 'bg-rose-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Random số nhà + đường (Khu vực cố định)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetailMode('random_house_fixed_street')}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                        detailMode === 'random_house_fixed_street'
                          ? 'bg-rose-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Random số nhà + Đường cố định
                    </button>
                    <button
                      type="button"
                      onClick={() => setDetailMode('fixed')}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                        detailMode === 'fixed'
                          ? 'bg-rose-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Cố định tất cả
                    </button>
                  </div>
                </div>

                {/* Chế độ 1: Số nhà và đường là Random, Khu vực / Thôn / Xóm Cố định */}
                {detailMode === 'random_house_and_street' && (
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="text-[11px] text-slate-600 dark:text-slate-300">
                      <strong className="text-rose-600 dark:text-rose-400">Quy tắc sinh địa chỉ:</strong> Số nhà ngẫu nhiên (1-250) + Tên đường ngẫu nhiên (đường 6, đường 2, đường 1, đường số 4, đường Lê Lợi...) + <strong>Khu vực/Thôn/Xóm CỐ ĐỊNH</strong>.
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Khu vực / Thôn / Xóm (CỐ ĐỊNH cho toàn bộ tài khoản):
                      </label>
                      <input
                        type="text"
                        value={fixedLocality}
                        onChange={(e) => setFixedLocality(e.target.value)}
                        placeholder="đồng lá hòa bình, thôn 1, xóm bến..."
                        className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-rose-300 dark:border-rose-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                      />
                    </div>

                    <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-[11px] space-y-1">
                      <div className="text-rose-800 dark:text-rose-300 font-semibold">
                        Ví dụ các địa chỉ sẽ được tạo tự động:
                      </div>
                      <div className="font-mono text-slate-700 dark:text-slate-300 pl-2 space-y-0.5">
                        <div>• số nhà <strong>22</strong> <strong>đường 6</strong>, <span className="text-rose-600 dark:text-rose-400 font-bold">{fixedLocality || 'đồng lá hòa bình'}</span></div>
                        <div>• số nhà <strong>85</strong> <strong>đường 2</strong>, <span className="text-rose-600 dark:text-rose-400 font-bold">{fixedLocality || 'đồng lá hòa bình'}</span></div>
                        <div>• số nhà <strong>146</strong> <strong>đường số 4</strong>, <span className="text-rose-600 dark:text-rose-400 font-bold">{fixedLocality || 'đồng lá hòa bình'}</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chế độ 2: Số nhà random, 1 tên đường cố định, Khu vực cố định */}
                {detailMode === 'random_house_fixed_street' && (
                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Tên đường (Cố định):</span>
                        <input
                          type="text"
                          value={fixedStreetName}
                          onChange={(e) => setFixedStreetName(e.target.value)}
                          placeholder="đường 6"
                          className="w-full mt-1 px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Khu vực / Thôn / Xóm (Cố định):</span>
                        <input
                          type="text"
                          value={fixedLocality}
                          onChange={(e) => setFixedLocality(e.target.value)}
                          placeholder="đồng lá hòa bình"
                          className="w-full mt-1 px-2.5 py-1.5 text-xs rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-rose-600 dark:text-rose-400 font-mono bg-rose-50 dark:bg-rose-950/30 p-2 rounded border border-rose-200 dark:border-rose-900/60">
                      Định dạng sinh ra: số nhà <strong>[ngẫu nhiên]</strong> {fixedStreetName || 'đường 6'}, {fixedLocality || 'đồng lá hòa bình'}
                    </div>
                  </div>
                )}

                {/* Chế độ 3: Cố định toàn bộ */}
                {detailMode === 'fixed' && (
                  <input
                    type="text"
                    value={fixedDetailAddress}
                    onChange={(e) => setFixedDetailAddress(e.target.value)}
                    placeholder="số nhà 22 đường 6 , đồng lá hòa bình"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                  />
                )}

              </div>

            </div>

          </div>

          {/* Real-time Preview Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Xem trước kết quả sinh ra theo cấu hình của bạn:
              </span>
              <button
                type="button"
                onClick={() => setPreviewSeed(s => s + 1)}
                className="text-[11px] text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Shuffle className="w-3 h-3" />
                Thử sinh lại mẫu khác
              </button>
            </div>

            <div className="space-y-1.5">
              {previewSamples.map((sample, i) => (
                <div 
                  key={i}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono text-[11px] space-y-1 shadow-sm"
                >
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[10px]">Tài khoản #{i + 1}:</span>
                      <strong className="text-slate-900 dark:text-white font-bold">{sample.recipientName}</strong>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{sample.phoneNumber}</span>
                  </div>
                  <div className="text-rose-600 dark:text-rose-400 font-sans text-xs font-medium">
                    {sample.fullAddress}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Sẽ gán cho: <strong className="text-slate-900 dark:text-white font-mono">{targetAccounts.length}</strong> tài khoản
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleApply}
              disabled={targetAccounts.length === 0}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm shadow-rose-600/30 transition-all flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Áp dụng địa chỉ ({targetAccounts.length})
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
