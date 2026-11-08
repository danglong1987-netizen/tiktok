import React, { useState, useEffect, useRef } from 'react';
import { 
  TikTokAccount, 
  ProductItem, 
  AutoOrderConfig, 
  OrderResult, 
  AutoOrderLog 
} from '../../types';
import { 
  DEFAULT_TIKTOK_PRODUCTS, 
  DEFAULT_AUTO_ORDER_CONFIG,
  loadProductsFromStorage,
  saveProductsToStorage,
  loadOrderConfigFromStorage,
  saveOrderConfigToStorage,
  loadOrderResultsFromStorage,
  saveOrderResultsToStorage,
  pickRandomProduct,
  processAccountOrder,
  exportOrdersToCSV,
  exportOrdersToTXT,
  exportOrderCodesOnlyToFile,
  formatOrderCodesForClipboard
} from '../../utils/autoOrderEngine';
import { copyToClipboard } from '../../utils/export';
import { ProductManagerModal } from './ProductManagerModal';
import { OrderConfigModal } from './OrderConfigModal';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  ShoppingBag, 
  Sliders, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  DollarSign, 
  Clock, 
  Terminal, 
  ExternalLink,
  Shuffle,
  LogOut,
  Layers,
  Sparkles,
  ArrowRight,
  Trash2,
  ShieldCheck,
  Copy,
  Check,
  CheckCheck,
  Truck,
  FileText
} from 'lucide-react';

interface AutoOrderDashboardProps {
  accounts: TikTokAccount[];
  onOpenAccountImport: () => void;
  onOpenAddressSetup: () => void;
  onPurgeSuspendedAccounts?: () => void;
  onUpdateAccounts?: (accounts: TikTokAccount[]) => void;
}

export const AutoOrderDashboard: React.FC<AutoOrderDashboardProps> = ({
  accounts,
  onOpenAccountImport,
  onOpenAddressSetup,
  onPurgeSuspendedAccounts,
  onUpdateAccounts,
}) => {
  // Products and Config State
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [config, setConfig] = useState<AutoOrderConfig>(DEFAULT_AUTO_ORDER_CONFIG);
  const [orderResults, setOrderResults] = useState<OrderResult[]>([]);
  const [logs, setLogs] = useState<AutoOrderLog[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSingleId, setCopiedSingleId] = useState<string | null>(null);

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  // Execution Bot State
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAccount, setCurrentAccount] = useState<TikTokAccount | null>(null);
  const [currentProduct, setCurrentProduct] = useState<ProductItem | null>(null);
  const [currentStepName, setCurrentStepName] = useState<string>('Sẵn sàng');
  const [currentStepProgress, setCurrentStepProgress] = useState<number>(0);

  const abortRef = useRef(false);
  const pauseRef = useRef(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Requirement 10: Tự động loại bỏ tài khoản bị đình chỉ (khóa đỏ) khỏi danh sách đặt hàng
  const suspendedAccounts = accounts.filter(a => a.status === 'suspended');
  const activeAccounts = accounts.filter(a => a.status === 'active');
  
  // Danh sách tài khoản thực tế được đưa vào hàng đợi đặt hàng:
  // Loại bỏ 100% tài khoản bị đình chỉ (khóa đỏ). Ưu tiên các tài khoản đã quét "SỐNG" (Active).
  const orderQueueAccounts = accounts.filter(a => {
    // Luôn luôn loại bỏ tài khoản khóa đỏ
    if (a.status === 'suspended') return false;
    // Nếu đã có các tài khoản được kiểm tra sống (active), chỉ đặt hàng trên tài khoản sống
    if (activeAccounts.length > 0) {
      return a.status === 'active';
    }
    // Nếu chưa kiểm tra (pending), cho phép đặt nhưng loại bỏ suspended
    return true;
  });

  // Initialize
  useEffect(() => {
    setProducts(loadProductsFromStorage());
    setConfig(loadOrderConfigFromStorage());
    setOrderResults(loadOrderResultsFromStorage());
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleUpdateProducts = (newProducts: ProductItem[]) => {
    setProducts(newProducts);
    saveProductsToStorage(newProducts);
  };

  const handleSaveConfig = (newConfig: AutoOrderConfig) => {
    setConfig(newConfig);
    saveOrderConfigToStorage(newConfig);
  };

  const addLog = (accountTiktokId: string, step: string, type: 'info' | 'success' | 'warning' | 'error', message: string) => {
    const newLog: AutoOrderLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
      accountTiktokId,
      step,
      type,
      message,
    };
    setLogs(prev => [newLog, ...prev.slice(0, 150)]);
  };

  // Requirement 10: Copy all order codes
  const handleCopyAllOrderCodes = async () => {
    const text = formatOrderCodesForClipboard(orderResults, 'codes_only');
    if (!text) {
      alert('Chưa có mã đơn hàng thành công nào để sao chép!');
      return;
    }
    await copyToClipboard(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2200);
  };

  const handleCopySingleCode = async (code: string, id: string) => {
    await copyToClipboard(code);
    setCopiedSingleId(id);
    setTimeout(() => setCopiedSingleId(null), 1500);
  };

  // Run Auto Order Bot
  const handleStartBot = async () => {
    const enabledProducts = products.filter(p => p.enabled);
    if (enabledProducts.length === 0) {
      alert('Chưa có link sản phẩm nào được bật! Vui lòng bấm vào "Quản lý Link Sản Phẩm" và bật ít nhất 1 link.');
      setIsProductModalOpen(true);
      return;
    }

    if (orderQueueAccounts.length === 0) {
      if (suspendedAccounts.length > 0) {
        alert(`Không thể đặt hàng: Toàn bộ ${suspendedAccounts.length} tài khoản trong danh sách đều đã bị ĐÌNH CHỈ (KHÓA ĐỎ)!\n\nHệ thống đã tự động LOẠI BỎ toàn bộ các tài khoản này khỏi danh sách đặt hàng để bảo vệ quy trình. Vui lòng nạp thêm tài khoản mới hoặc kiểm tra lại.`);
      } else {
        alert('Danh sách tài khoản đang trống! Hãy nạp tài khoản trước khi chạy đặt hàng tự động.');
        onOpenAccountImport();
      }
      return;
    }

    setIsRunning(true);
    setIsPaused(false);
    abortRef.current = false;
    pauseRef.current = false;

    if (suspendedAccounts.length > 0) {
      addLog('BẢO VỆ', 'Lọc nick khóa', 'warning', `Đã tự động LOẠI BỎ ${suspendedAccounts.length} tài khoản bị đình chỉ (khóa đỏ) khỏi danh sách đặt hàng.`);
    }
    addLog('HỆ THỐNG', 'Khởi động', 'info', `Bắt đầu tiến trình tự động đặt hàng TikTok Shop với ${orderQueueAccounts.length} tài khoản còn sống...`);
    addLog('CẤU HÌNH', 'Quy tắc', 'info', `Khoảng giá phân loại: ${config.minProductPrice.toLocaleString('vi-VN')}₫ - ${config.maxProductPrice.toLocaleString('vi-VN')}₫ | Tổng tiền chốt: ${config.minTotalAmount.toLocaleString('vi-VN')}₫ - ${config.maxTotalAmount.toLocaleString('vi-VN')}₫ | Kho: ${enabledProducts.length} link random`);
    addLog('ĐA ĐƠN THEO VOUCHER', 'Chính sách', 'info', 'Trong 1 tài khoản có bao nhiêu mã freeship phù hợp thì bot sẽ tự động đặt đủ số lượng đơn tương ứng trước khi thoát tài khoản!');

    let updatedResults = [...orderResults];
    const accountsUpdatedClone = [...accounts];

    for (let i = currentIndex; i < orderQueueAccounts.length; i++) {
      if (abortRef.current) {
        addLog('HỆ THỐNG', 'Dừng', 'warning', 'Người dùng đã dừng tiến trình đặt hàng tự động.');
        break;
      }

      // Handle pause
      while (pauseRef.current && !abortRef.current) {
        await new Promise(r => setTimeout(r, 500));
      }

      const acc = orderQueueAccounts[i];
      setCurrentIndex(i);
      setCurrentAccount(acc);

      // Check vouchers on this account
      const suitableVouchers = (acc.vouchers && acc.vouchers.length > 0) ? acc.vouchers : [];

      // If requireFreeship is true and account has NO vouchers
      if (config.requireFreeship && suitableVouchers.length === 0) {
        addLog(
          acc.tiktokId,
          'Kiểm tra mã ship',
          'warning',
          `❌ Tài khoản ${acc.tiktokId} KHÔNG CÓ mã vận chuyển freeship nào phù hợp (yêu cầu bắt buộc) ➔ Tự động thoát tài khoản!`
        );
        const skippedNoVoucher: OrderResult = {
          id: `order-no-voucher-${Date.now()}-${Math.random()}`,
          orderCode: 'SKIPPED_NO_VOUCHER',
          accountId: acc.id,
          accountEmail: acc.email,
          accountTiktokId: acc.tiktokId,
          productUrl: 'N/A',
          productTitle: 'Tài khoản không có mã freeship',
          productPrice: 0,
          shippingFee: 0,
          shippingDiscount: 0,
          voucherUsed: 'Không có mã',
          finalTotal: 0,
          status: 'skipped_price',
          reason: 'Tài khoản không có mã vận chuyển phù hợp trong khi cấu hình yêu cầu bắt buộc mã freeship. Đã tự động thoát nick.',
          shippingAddress: acc.shippingAddress?.fullAddress || 'Chưa thiết lập',
          timestamp: new Date().toISOString(),
        };
        updatedResults = [skippedNoVoucher, ...updatedResults];
        setOrderResults(updatedResults);
        saveOrderResultsToStorage(updatedResults);
        continue;
      }

      // Requirement 10: Trong 1 tài khoản có bao nhiêu mã vận chuyển phù hợp thì đặt đủ số lượng đơn tương ứng!
      const totalOrdersForThisAccount = suitableVouchers.length > 0 ? suitableVouchers.length : 1;

      addLog(
        acc.tiktokId,
        'Xác định số đơn',
        'info',
        `🎯 Tài khoản ${acc.tiktokId} có ${suitableVouchers.length} mã vận chuyển phù hợp. Hệ thống sẽ tiến hành đặt ĐỦ ${totalOrdersForThisAccount} ĐƠN HÀNG tương ứng trước khi thoát tài khoản!`
      );

      const placedOrdersForThisAcc = [...(acc.placedOrders || [])];

      // Loop through each voucher to place an order
      for (let orderIdx = 0; orderIdx < totalOrdersForThisAccount; orderIdx++) {
        if (abortRef.current) break;
        while (pauseRef.current && !abortRef.current) {
          await new Promise(r => setTimeout(r, 500));
        }

        const assignedVoucher = suitableVouchers[orderIdx];
        const orderNumDisplay = orderIdx + 1;

        setCurrentStepName(`Acc #${i + 1}/${orderQueueAccounts.length} (${acc.tiktokId}): Đặt đơn #${orderNumDisplay}/${totalOrdersForThisAccount} [Mã ship: ${assignedVoucher ? assignedVoucher.discountDisplay : 'Mặc định'}]`);
        setCurrentStepProgress(Math.round(((orderIdx) / totalOrdersForThisAccount) * 70 + 20));

        // Requirement 1: Pick a random product from the list for each order
        const chosenProduct = pickRandomProduct(products);
        if (!chosenProduct) break;
        setCurrentProduct(chosenProduct);

        // Process order with the assigned voucher
        const result = await processAccountOrder(
          acc, 
          chosenProduct, 
          config, 
          (step, type, msg) => {
            addLog(acc.tiktokId, step, type, msg);
          },
          assignedVoucher,
          orderIdx,
          totalOrdersForThisAccount
        );

        updatedResults = [result, ...updatedResults];
        setOrderResults(updatedResults);
        saveOrderResultsToStorage(updatedResults);

        // If order succeeded, save placed order with carrier and tracking
        if (result.status === 'success') {
          placedOrdersForThisAcc.push({
            orderCode: result.orderCode,
            carrier: result.carrier || 'J&T Express',
            trackingNumber: result.trackingNumber,
            productTitle: result.productTitle,
            variantName: result.selectedVariantName,
            finalTotal: result.finalTotal,
            placedAt: result.timestamp,
            voucherUsed: result.voucherUsed,
          });
        }

        // Delay between orders on same account
        if (orderIdx < totalOrdersForThisAccount - 1 && !abortRef.current) {
          addLog(acc.tiktokId, 'Nghỉ giữa đơn', 'info', `Nghỉ 1.2s chuẩn bị đặt đơn #${orderNumDisplay + 1}/${totalOrdersForThisAccount} với mã ship tiếp theo...`);
          await new Promise(r => setTimeout(r, 1200));
        }
      }

      // Sync account placedOrders to parent App state
      const targetAccIndex = accountsUpdatedClone.findIndex(a => a.id === acc.id);
      if (targetAccIndex !== -1) {
        accountsUpdatedClone[targetAccIndex] = {
          ...accountsUpdatedClone[targetAccIndex],
          placedOrders: placedOrdersForThisAcc,
        };
        if (onUpdateAccounts) {
          onUpdateAccounts([...accountsUpdatedClone]);
        }
      }

      addLog(
        acc.tiktokId,
        'Đăng xuất tài khoản',
        'success',
        `Hoàn tất đặt đủ ${totalOrdersForThisAccount} đơn cho tài khoản ${acc.tiktokId}. Đã lưu mã đơn & ĐVVC. Tự động thoát tài khoản an toàn!`
      );

      setCurrentStepProgress(100);

      // Delay between accounts to avoid checkpoints
      if (i < orderQueueAccounts.length - 1 && !abortRef.current) {
        setCurrentStepName(`Nghỉ ${config.delayBetweenAccountsSec}s trước khi chuyển tài khoản tiếp theo...`);
        for (let s = config.delayBetweenAccountsSec; s > 0; s--) {
          if (abortRef.current) break;
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    }

    setIsRunning(false);
    setIsPaused(false);
    setCurrentAccount(null);
    setCurrentProduct(null);
    setCurrentStepName('Hoàn tất toàn bộ danh sách tài khoản');
    addLog('HỆ THỐNG', 'Hoàn tất', 'success', `Đã kết thúc phiên chạy tự động cho toàn bộ ${orderQueueAccounts.length} tài khoản hợp lệ!`);
  };

  const handlePauseBot = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(pauseRef.current);
    addLog('HỆ THỐNG', 'Tạm dừng', 'warning', pauseRef.current ? 'Đã tạm dừng đặt hàng.' : 'Tiếp tục chạy đặt hàng...');
  };

  const handleStopBot = () => {
    abortRef.current = true;
    pauseRef.current = false;
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStepName('Đã dừng');
  };

  const handleResetBot = () => {
    if (window.confirm('Bạn có muốn xóa kết quả các đơn hàng đã đặt để chạy lại từ đầu?')) {
      setOrderResults([]);
      setLogs([]);
      saveOrderResultsToStorage([]);
      setCurrentIndex(0);
      setCurrentStepName('Sẵn sàng');
    }
  };

  // Metrics
  const successOrders = orderResults.filter(o => o.status === 'success');
  const skippedPriceOrders = orderResults.filter(o => o.status === 'skipped_price');
  const skippedStatusOrders = orderResults.filter(o => o.status === 'skipped_status');
  const totalSpent = successOrders.reduce((sum, o) => sum + o.finalTotal, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Bot Controls */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Title & Engine Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Phần Mềm Tự Động Đặt Hàng TikTok Shop (Auto Order)
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                  isRunning && !isPaused
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 animate-pulse'
                    : isPaused
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isRunning && !isPaused ? 'bg-emerald-500' : isPaused ? 'bg-amber-500' : 'bg-slate-400'}`} />
                  {isRunning && !isPaused ? 'Đang chạy tự động' : isPaused ? 'Đang tạm dừng' : 'Sẵn sàng'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tự động chọn random link sản phẩm ➔ So khớp khoảng tổng tiền [Min - Max] ➔ Chốt đơn hoặc Tự động thoát tài khoản
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {!isRunning ? (
              <button
                onClick={handleStartBot}
                disabled={orderQueueAccounts.length === 0}
                className="px-5 py-2.5 bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:opacity-95 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/25 flex items-center gap-2 transition active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>BẮT ĐẦU ĐẶT HÀNG TỰ ĐỘNG ({orderQueueAccounts.length} ACC SỐNG)</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handlePauseBot}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition"
                >
                  <Pause className="w-4 h-4" />
                  <span>{isPaused ? 'Tiếp tục' : 'Tạm dừng'}</span>
                </button>
                <button
                  onClick={handleStopBot}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition"
                >
                  <Square className="w-4 h-4" />
                  <span>Dừng hẳn</span>
                </button>
              </>
            )}

            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition shadow-sm"
              title="Cài đặt khoảng tiền min-max và quy tắc chốt đơn"
            >
              <Sliders className="w-3.5 h-3.5 text-rose-500" />
              <span>Cài đặt khoảng tiền</span>
            </button>

            <button
              onClick={() => setIsProductModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition shadow-sm"
              title="Quản lý danh sách các link sản phẩm để random"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-500" />
              <span>Kho link ({products.filter(p => p.enabled).length})</span>
            </button>
          </div>
        </div>

        {/* Requirement 10: Automatic Suspension Filter Banner */}
        {suspendedAccounts.length > 0 && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-rose-600 text-white shrink-0">
                <Ban className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2 flex-wrap">
                  <span>ĐÃ TỰ ĐỘNG LOẠI BỎ {suspendedAccounts.length} TÀI KHOẢN KHÓA ĐỎ KHỎI DANH SÁCH ĐẶT HÀNG</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
                    Bảo vệ ngân sách & chống checkpoint
                  </span>
                </div>
                <div className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5">
                  Bot chỉ tiến hành đặt hàng trên <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{orderQueueAccounts.length}</strong> tài khoản còn sống (Active). Toàn bộ nick bị đình chỉ đã được lọc ra ngoài hàng đợi.
                </div>
              </div>
            </div>
            {onPurgeSuspendedAccounts && (
              <button
                onClick={onPurgeSuspendedAccounts}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa hẳn {suspendedAccounts.length} nick khóa</span>
              </button>
            )}
          </div>
        )}

        {/* 4 Core Rules Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          
          {/* Rule 1: Random Product */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              <Shuffle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>1. Random Link Sản Phẩm:</span>
                <span className="text-[10px] text-amber-600 font-normal">({products.filter(p => p.enabled).length} link bật)</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Mỗi tài khoản được gán ngẫu nhiên 1 link sản phẩm trong kho link đã nạp để đặt mua.
              </p>
            </div>
          </div>

          {/* Rule 2: Price Bounds & Variant Selection */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                <span>2. Giá Phân Loại:</span>
                <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                  {config.minProductPrice.toLocaleString('vi-VN')}₫ - {config.maxProductPrice.toLocaleString('vi-VN')}₫
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Tự động chọn phân loại có giá nằm trong khoảng (bất kể vị trí số mấy). Tổng tiền chốt: {config.minTotalAmount.toLocaleString('vi-VN')}₫ - {config.maxTotalAmount.toLocaleString('vi-VN')}₫.
              </p>
            </div>
          </div>

          {/* Rule 3: Auto Logout on Mismatch / Ban */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
              <LogOut className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>3. Tự Động Thoát Acc:</span>
                <span className="text-[10px] text-emerald-600 font-normal">(Nghỉ {config.delayBetweenAccountsSec}s)</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Tự đăng nhập theo danh sách, nếu không thỏa điều kiện tiền ➔ Thoát ngay để chuyển tài khoản kế tiếp.
              </p>
            </div>
          </div>

          {/* Rule 4: Exclude Suspended Accounts & Lowest Variant */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>4. Lọc Khóa & Chọn Giá Rẻ:</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                Tự loại bỏ toàn bộ nick khóa đỏ ({suspendedAccounts.length} nick). Tự động chọn phân loại có giá thấp nhất.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Success Orders */}
        <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
            <span>Đơn Đặt Thành Công</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
            {successOrders.length}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400/80 mt-1">
            Đạt chuẩn khoảng giá [{config.minTotalAmount.toLocaleString('vi-VN')}₫ - {config.maxTotalAmount.toLocaleString('vi-VN')}₫]
          </div>
        </div>

        {/* Skipped by Price Bounds */}
        <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm">
          <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 font-semibold mb-1">
            <span>Thoát Do Vượt Khoảng Giá</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-800 dark:text-amber-300">
            {skippedPriceOrders.length}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400/80 mt-1">
            Không áp được mã freeship hoặc giá vượt trần
          </div>
        </div>

        {/* Skipped by Suspended Account */}
        <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 shadow-sm">
          <div className="flex items-center justify-between text-xs text-rose-700 dark:text-rose-400 font-semibold mb-1">
            <span>Thoát Do Acc Khóa Đỏ</span>
            <Ban className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-extrabold text-rose-800 dark:text-rose-300">
            {skippedStatusOrders.length}
          </div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400/80 mt-1">
            Tài khoản bị đình chỉ / lỗi đăng nhập
          </div>
        </div>

        {/* Total Money Spent */}
        <div className="p-4 rounded-xl border border-sky-300 dark:border-sky-900/60 bg-sky-50/50 dark:bg-sky-950/20 shadow-sm">
          <div className="flex items-center justify-between text-xs text-sky-700 dark:text-sky-400 font-semibold mb-1">
            <span>Tổng Tiền Đã Chốt Đơn</span>
            <DollarSign className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-sky-800 dark:text-sky-300 font-mono">
            {totalSpent.toLocaleString('vi-VN')}₫
          </div>
          <div className="text-[11px] text-sky-600 dark:text-sky-400/80 mt-1">
            Trung bình: {successOrders.length > 0 ? Math.round(totalSpent / successOrders.length).toLocaleString('vi-VN') : 0}₫ / đơn
          </div>
        </div>

      </div>

      {/* Live Bot Execution Monitor (Active when running or current step) */}
      {isRunning && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-rose-500/50 shadow-xl space-y-3 animate-pulse">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Đang xử lý đặt hàng tự động:
              </span>
              <span className="font-mono text-rose-400 font-bold">
                {currentAccount?.tiktokId} ({currentAccount?.email})
              </span>
            </div>
            <div className="text-slate-400 font-mono text-[11px]">
              Tài khoản #{currentIndex + 1} / {orderQueueAccounts.length} (Đã lọc nick khóa)
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-rose-500 to-amber-500 h-full transition-all duration-300"
              style={{ width: `${currentStepProgress}%` }}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs gap-2 pt-1">
            <div className="text-slate-300 flex items-center gap-1.5">
              <span className="text-amber-400 font-bold">▶ Trạng thái:</span>
              <span>{currentStepName}</span>
            </div>
            {currentProduct && (
              <div className="text-slate-400 text-[11px] truncate max-w-md">
                Sản phẩm ngẫu nhiên: <strong className="text-white">{currentProduct.title}</strong> ({currentProduct.priceDisplay})
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Split: Order Results Table & Real-time Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Orders Table */}
        <div className="lg:col-span-2 space-y-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Bảng Kết Quả Đơn Hàng ({orderResults.length})
              </h3>
              <span className="text-xs text-slate-500">
                ({successOrders.length} thành công, {skippedPriceOrders.length + skippedStatusOrders.length} đã thoát)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {orderResults.length > 0 && (
                <>
                  {/* Requirement 10: Copy All Order Codes Button */}
                  <button
                    onClick={handleCopyAllOrderCodes}
                    disabled={successOrders.length === 0}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition flex items-center gap-1.5 disabled:opacity-50 ${
                      copiedAll
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40'
                    }`}
                    title="Sao chép toàn bộ mã đơn hàng TikTok Shop thành công"
                  >
                    {copiedAll ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Đã sao chép ({successOrders.length} mã)!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sao chép {successOrders.length} mã đơn</span>
                      </>
                    )}
                  </button>

                  {/* Requirement 10: Export Order Codes Only (.txt) */}
                  <button
                    onClick={() => exportOrderCodesOnlyToFile(orderResults)}
                    disabled={successOrders.length === 0}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 flex items-center gap-1 transition disabled:opacity-50"
                    title="Xuất file .txt chỉ chứa danh sách mã đơn hàng & đơn vị vận chuyển"
                  >
                    <FileText className="w-3 h-3 text-amber-600" />
                    <span>Xuất file mã đơn (.txt)</span>
                  </button>

                  <button
                    onClick={() => exportOrdersToCSV(orderResults)}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 transition"
                    title="Xuất bảng chi tiết ra Excel CSV"
                  >
                    <Download className="w-3 h-3 text-emerald-500" />
                    <span>Xuất CSV (Excel)</span>
                  </button>

                  <button
                    onClick={() => exportOrdersToTXT(orderResults)}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 transition"
                    title="Xuất báo cáo chi tiết .txt"
                  >
                    <Download className="w-3 h-3 text-sky-500" />
                    <span>Báo cáo (.txt)</span>
                  </button>

                  <button
                    onClick={handleResetBot}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                    title="Xóa danh sách đơn"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            {orderResults.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs space-y-2">
                <ShoppingBag className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                <div className="font-semibold text-slate-600 dark:text-slate-400">Chưa có đơn hàng nào được xử lý.</div>
                <div className="text-[11px] text-slate-500">
                  Bấm nút <strong>"BẮT ĐẦU ĐẶT HÀNG TỰ ĐỘNG"</strong> ở trên để khởi chạy bot!
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                      <th className="px-3.5 py-2.5">Mã đơn / ĐVVC / Tài khoản</th>
                      <th className="px-3.5 py-2.5">Sản phẩm (Random)</th>
                      <th className="px-3.5 py-2.5">Tổng tiền</th>
                      <th className="px-3.5 py-2.5">Mã Freeship</th>
                      <th className="px-3.5 py-2.5">Kết quả & Lý do</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {orderResults.map((order) => (
                      <tr 
                        key={order.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition ${
                          order.status === 'success' ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : ''
                        }`}
                      >
                        {/* Account & Order Code & Carrier */}
                        <td className="px-3.5 py-3 align-top">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                              {order.orderCode}
                            </span>
                            {order.orderCode !== 'SKIPPED' && !order.orderCode.startsWith('SKIPPED') && order.orderCode !== 'N/A' && (
                              <button
                                onClick={() => handleCopySingleCode(order.orderCode, order.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                title="Sao chép mã đơn này"
                              >
                                {copiedSingleId === order.id ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>

                          {/* Carrier badge */}
                          {order.carrier && (
                            <div className="mt-1 flex items-center gap-1 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
                                <Truck className="w-2.5 h-2.5 text-sky-600 shrink-0" />
                                <span>{order.carrier}</span>
                              </span>
                              {order.trackingNumber && (
                                <span className="font-mono text-[9px] text-slate-400" title="Mã vận đơn">
                                  {order.trackingNumber}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1">
                            {order.accountTiktokId}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {order.accountEmail}
                          </div>
                        </td>

                        {/* Product */}
                        <td className="px-3.5 py-3 align-top max-w-xs">
                          <div className="font-semibold text-slate-900 dark:text-white truncate" title={order.productTitle}>
                            {order.productTitle}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>Giá: {order.productPrice.toLocaleString('vi-VN')}₫</span>
                            <span>·</span>
                            <a 
                              href={order.productUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-sky-500 hover:underline flex items-center gap-0.5"
                            >
                              <span>Link</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5" title={order.shippingAddress}>
                            📍 {order.shippingAddress}
                          </div>
                          {order.selectedVariantName && (
                            <div className="mt-1 flex items-center">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                <Sparkles className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400 shrink-0" />
                                <span className="truncate max-w-[220px]" title={order.selectedVariantName}>
                                  Phân loại: {order.selectedVariantName}
                                </span>
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Total Amount */}
                        <td className="px-3.5 py-3 align-top whitespace-nowrap">
                          <div className={`font-mono font-extrabold ${
                            order.status === 'success' 
                              ? 'text-emerald-600 dark:text-emerald-400 text-sm' 
                              : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            {order.finalTotal > 0 ? `${order.finalTotal.toLocaleString('vi-VN')}₫` : '0₫'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Cước ship: {order.shippingFee - order.shippingDiscount > 0 ? `${(order.shippingFee - order.shippingDiscount).toLocaleString('vi-VN')}₫` : '0₫ (Freeship)'}
                          </div>
                        </td>

                        {/* Voucher */}
                        <td className="px-3.5 py-3 align-top">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            {order.voucherUsed}
                          </span>
                        </td>

                        {/* Result & Reason */}
                        <td className="px-3.5 py-3 align-top max-w-xs">
                          {order.status === 'success' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 inline-flex items-center gap-1">
                              ✓ ĐÃ ĐẶT ĐƠN
                            </span>
                          )}
                          {order.status === 'skipped_price' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800 inline-flex items-center gap-1">
                              THOÁT: GIÁ KHÔNG KHỚP
                            </span>
                          )}
                          {order.status === 'skipped_status' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800 inline-flex items-center gap-1">
                              THOÁT: ACC KHÓA
                            </span>
                          )}

                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2" title={order.reason}>
                            {order.reason}
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1 Col): Live Execution Console Logs */}
        <div className="space-y-3">
          
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-rose-500" />
              <span>Nhật Ký Thực Thi (Live Logs)</span>
            </h3>
            {logs.length > 0 && (
              <button
                onClick={() => setLogs([])}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Xóa log
              </button>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 h-[520px] overflow-y-auto space-y-2 shadow-inner">
            {logs.length === 0 ? (
              <div className="p-8 text-center text-slate-600">
                Log chạy bot sẽ hiển thị trực tiếp tại đây...
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="leading-relaxed border-b border-slate-900 pb-1.5">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-slate-500">{log.timestamp}</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-bold">
                      {log.step}
                    </span>
                    <span className="text-rose-400 font-bold">
                      {log.accountTiktokId}
                    </span>
                  </div>
                  <div className={`mt-0.5 ${
                    log.type === 'success' 
                      ? 'text-emerald-400 font-semibold' 
                      : log.type === 'error' 
                      ? 'text-rose-400 font-semibold' 
                      : log.type === 'warning' 
                      ? 'text-amber-300' 
                      : 'text-slate-300'
                  }`}>
                    {log.message}
                  </div>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>

        </div>

      </div>

      {/* Product Manager Modal */}
      <ProductManagerModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        products={products}
        onUpdateProducts={handleUpdateProducts}
      />

      {/* Order Config Modal */}
      <OrderConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />

    </div>
  );
};
