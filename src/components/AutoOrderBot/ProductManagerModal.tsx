import React, { useState } from 'react';
import { ProductItem } from '../../types';
import { parseBulkProductInput, DEFAULT_TIKTOK_PRODUCTS } from '../../utils/autoOrderEngine';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  X, 
  CheckCircle2, 
  Shuffle, 
  ExternalLink, 
  RotateCcw,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';

interface ProductManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  onUpdateProducts: (products: ProductItem[]) => void;
}

export const ProductManagerModal: React.FC<ProductManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'bulk_add' | 'add_single'>('list');
  const [bulkText, setBulkText] = useState('');
  
  // Single product input
  const [singleUrl, setSingleUrl] = useState('');
  const [singleTitle, setSingleTitle] = useState('');
  const [singlePrice, setSinglePrice] = useState('79000');
  const [singleShop, setSingleShop] = useState('TikTok Shop Official');

  if (!isOpen) return null;

  const handleToggleProduct = (id: string) => {
    const updated = products.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p);
    onUpdateProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    onUpdateProducts(updated);
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) return;
    const parsed = parseBulkProductInput(bulkText);
    const combined = [...products, ...parsed];
    onUpdateProducts(combined);
    setBulkText('');
    setActiveTab('list');
  };

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleUrl.trim()) return;

    const priceNum = Number(singlePrice.replace(/[^0-9]/g, '')) || 50000;
    const newProduct: ProductItem = {
      id: `prod-${Date.now()}`,
      url: singleUrl.startsWith('http') ? singleUrl : `https://${singleUrl}`,
      title: singleTitle.trim() || `Sản phẩm TikTok Shop (${priceNum.toLocaleString('vi-VN')}₫)`,
      price: priceNum,
      priceDisplay: `${priceNum.toLocaleString('vi-VN')}₫`,
      originalPrice: Math.round(priceNum * 1.4 / 1000) * 1000,
      shopName: singleShop.trim() || 'TikTok Shop Mall',
      shippingFeeEstimate: 30000,
      enabled: true,
    };

    onUpdateProducts([newProduct, ...products]);
    setSingleUrl('');
    setSingleTitle('');
    setSinglePrice('79000');
    setActiveTab('list');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Khôi phục danh sách link sản phẩm mẫu?')) {
      onUpdateProducts(DEFAULT_TIKTOK_PRODUCTS);
    }
  };

  const enabledCount = products.filter(p => p.enabled).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Quản lý kho Link Sản Phẩm TikTok Shop
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                  {enabledCount}/{products.length} link đang bật
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bot sẽ chọn ngẫu nhiên (random) 1 trong các link đang bật này cho mỗi tài khoản để đặt hàng
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

        {/* Tab switchers */}
        <div className="px-6 pt-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'list'
                  ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              Danh sách link sản phẩm ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('bulk_add')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'bulk_add'
                  ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Nhập hàng loạt link
            </button>
            <button
              onClick={() => setActiveTab('add_single')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'add_single'
                  ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              Thêm 1 link lẻ
            </button>
          </div>

          <button
            onClick={handleResetDefaults}
            className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 pb-2"
          >
            <RotateCcw className="w-3 h-3" />
            Nạp mẫu ban đầu
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: List View */}
          {activeTab === 'list' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    Hệ thống sẽ <strong>chọn ngẫu nhiên (random)</strong> một trong các link có dấu tích xanh dưới đây khi một tài khoản đăng nhập để đặt hàng.
                  </span>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  Chưa có link sản phẩm nào. Bấm vào tab "Nhập hàng loạt link" để dán danh sách URL!
                </div>
              ) : (
                <div className="space-y-2">
                  {products.map((p, idx) => (
                    <div 
                      key={p.id}
                      className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                        p.enabled 
                          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                          : 'bg-slate-100/60 dark:bg-slate-950/60 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="checkbox"
                          checked={p.enabled}
                          onChange={() => handleToggleProduct(p.id)}
                          className="w-4 h-4 accent-rose-600 rounded cursor-pointer shrink-0"
                          title="Bật/Tắt chọn sản phẩm này khi random"
                        />
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-500 shrink-0">
                          #{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-slate-900 dark:text-white truncate" title={p.title}>
                            {p.title}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">{p.priceDisplay}</span>
                            <span>·</span>
                            <span className="truncate">{p.shopName}</span>
                            <span>·</span>
                            <a 
                              href={p.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-sky-500 hover:underline inline-flex items-center gap-0.5 truncate max-w-xs"
                            >
                              <span className="truncate">{p.url}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          </div>

                          {/* Variations List & Lowest Price Badge */}
                          {p.variants && p.variants.length > 0 && (
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Phân loại:</span>
                              {p.variants.map((v, vIdx) => {
                                const minPrice = Math.min(...p.variants!.map(item => item.price));
                                const isLowest = v.price === minPrice;
                                return (
                                  <span 
                                    key={v.id || vIdx}
                                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition ${
                                      isLowest
                                        ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-200 shadow-xs flex items-center gap-1'
                                        : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 flex items-center gap-1'
                                    }`}
                                  >
                                    <span className="font-mono text-slate-400 dark:text-slate-500 font-bold">#{vIdx + 1}</span>
                                    <span>{v.name}: <strong>{v.price.toLocaleString('vi-VN')}₫</strong></span>
                                    {isLowest && (
                                      <span className="px-1 py-0.2 rounded bg-amber-500 text-white text-[8px] font-extrabold uppercase">
                                        Giá thấp
                                      </span>
                                    )}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.enabled 
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {p.enabled ? 'Sẵn sàng random' : 'Tạm tắt'}
                        </span>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Xóa link này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Bulk Add */}
          {activeTab === 'bulk_add' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Dán danh sách các link sản phẩm TikTok Shop (mỗi dòng 1 link). Hệ thống hỗ trợ cả định dạng kèm giá và tên:
                <div className="mt-1.5 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-950 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  https://vt.tiktok.com/ZSjSample1/ | 69000 | Áo thun oversize<br />
                  https://vt.tiktok.com/ZSjSample2/ | 120000 | Tai nghe bluetooth<br />
                  https://vt.tiktok.com/ZSjSample3/
                </div>
              </div>

              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Dán các link TikTok Shop vào đây (mỗi dòng 1 link)..."
                rows={8}
                className="w-full p-3 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  onClick={handleBulkImport}
                  disabled={!bulkText.trim()}
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 rounded-lg shadow-sm transition"
                >
                  Nạp vào danh sách
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Add Single */}
          {activeTab === 'add_single' && (
            <form onSubmit={handleAddSingle} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Đường dẫn sản phẩm TikTok Shop (URL): *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://vt.tiktok.com/ZSjxxxxxx/"
                  value={singleUrl}
                  onChange={(e) => setSingleUrl(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                  Tên sản phẩm (Tùy chọn):
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Áo thun cotton form rộng unisex..."
                  value={singleTitle}
                  onChange={(e) => setSingleTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                    Giá sản phẩm (VNĐ): *
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="1000"
                    value={singlePrice}
                    onChange={(e) => setSinglePrice(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                    Tên Shop / Mall:
                  </label>
                  <input
                    type="text"
                    value={singleShop}
                    onChange={(e) => setSingleShop(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition"
                >
                  Thêm link sản phẩm
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Tổng {products.length} link sản phẩm trong kho random
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition"
          >
            Đã xong
          </button>
        </div>

      </div>
    </div>
  );
};
