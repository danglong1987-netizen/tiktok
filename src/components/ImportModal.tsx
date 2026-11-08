import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Plus, 
  Check, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { TikTokAccount } from '../types';
import { parseBulkAccounts } from '../utils/checker';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportAccounts: (accounts: TikTokAccount[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportAccounts,
}) => {
  const [activeTab, setActiveTab] = useState<'bulk' | 'single'>('bulk');

  // Bulk input state
  const [bulkText, setBulkText] = useState('');
  const [bulkError, setBulkError] = useState('');

  // Single input state
  const [singleEmail, setSingleEmail] = useState('');
  const [singleTikTokId, setSingleTikTokId] = useState('');
  const [singlePassword, setSinglePassword] = useState('');
  const [singleCookie, setSingleCookie] = useState('');
  const [singleNotes, setSingleNotes] = useState('');
  const [singleError, setSingleError] = useState('');

  if (!isOpen) return null;

  // Handle batch import
  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) {
      setBulkError('Vui lòng nhập ít nhất 1 dòng tài khoản');
      return;
    }

    const parsed = parseBulkAccounts(bulkText);
    if (parsed.length === 0) {
      setBulkError('Không nhận diện được định dạng tài khoản hợp lệ');
      return;
    }

    const newAccounts: TikTokAccount[] = parsed.map((p, idx) => ({
      id: `acc_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 7)}`,
      email: p.email || (p.tiktokId ? `${p.tiktokId.replace('@', '')}@gmail.com` : 'user@example.com'),
      tiktokId: p.tiktokId || `@user_${Math.floor(Math.random() * 9999)}`,
      password: p.password || '',
      checkMode: p.password ? 'full_auth' : 'public_no_pass',
      cookie: p.cookie,
      status: 'pending',
      vouchers: [],
      notes: p.notes,
      createdAt: new Date().toISOString(),
    }));

    onImportAccounts(newAccounts);
    setBulkText('');
    setBulkError('');
    onClose();
  };

  // Handle single account creation
  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleEmail && !singleTikTokId) {
      setSingleError('Vui lòng điền Email hoặc TikTok ID');
      return;
    }

    const idFormatted = singleTikTokId 
      ? (singleTikTokId.startsWith('@') ? singleTikTokId : `@${singleTikTokId}`)
      : `@${singleEmail.split('@')[0]}`;

    const newAccount: TikTokAccount = {
      id: `acc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      email: singleEmail || `${idFormatted.replace('@', '')}@gmail.com`,
      tiktokId: idFormatted,
      password: singlePassword || '',
      checkMode: singlePassword ? 'full_auth' : 'public_no_pass',
      cookie: singleCookie || undefined,
      status: 'pending',
      vouchers: [],
      notes: singleNotes || (singlePassword ? undefined : 'Quét công khai không mật khẩu'),
      createdAt: new Date().toISOString(),
    };

    onImportAccounts([newAccount]);
    setSingleEmail('');
    setSingleTikTokId('');
    setSinglePassword('');
    setSingleCookie('');
    setSingleNotes('');
    setSingleError('');
    onClose();
  };

  // Insert sample text with NO PASSWORDS (chỉ ID hoặc Email)
  const handleInsertNoPassSample = () => {
    const sample = [
      '@trangorders_99',
      '@vietshopper_pro (Bị đình chỉ mẫu)',
      '@linhreview_official',
      'anhngoc.daily@gmail.com',
      '@tiktok_banned_sample',
      'minhtrang.shop99@gmail.com',
    ].join('\n');
    setBulkText(sample);
  };

  // Insert sample text with full combo (email|pass|id)
  const handleInsertFullSample = () => {
    const sample = [
      'anhtuan.shop@gmail.com|Matkhau123@|@anhtuan_deals',
      'die_account_test@gmail.com|BannedPass#99|@tiktok_banned_sample',
      '@koc_thuthao|ThuThao2026@|thuthao.koc@gmail.com',
      'quanghuy.sale@gmail.com|QuangHuy#7788|@quanghuy_orders',
    ].join('\n');
    setBulkText(sample);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setBulkText(content);
      }
    };
    reader.readAsText(file);
  };

  const parsedPreviewCount = bulkText.split('\n').filter(l => l.trim().length > 0 && !l.startsWith('#')).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Thêm tài khoản TikTok cần kiểm tra
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Có thể nhập <strong className="text-rose-500 font-semibold">chỉ ID hoặc Email</strong> (không cần mật khẩu) hoặc nhập đầy đủ Email|Pass
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

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-950/40">
          <button
            onClick={() => setActiveTab('bulk')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'bulk'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Nhập hàng loạt (Batch Text)
            {parsedPreviewCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-mono text-[10px]">
                {parsedPreviewCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('single')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'single'
                ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Tạo từng tài khoản
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'bulk' ? (
            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Dán danh sách tài khoản (Mỗi tài khoản 1 dòng):
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleInsertNoPassSample}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Globe className="w-3 h-3" />
                      Mẫu chỉ có ID (Không pass)
                    </button>
                    <button
                      type="button"
                      onClick={handleInsertFullSample}
                      className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Sparkles className="w-3 h-3" />
                      Mẫu có pass
                    </button>
                    <label className="text-xs text-slate-600 dark:text-slate-400 hover:underline cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      Tải file .txt/.csv
                      <input 
                        type="file" 
                        accept=".txt,.csv" 
                        className="hidden" 
                        onChange={handleFileUpload} 
                      />
                    </label>
                  </div>
                </div>

                <textarea
                  rows={8}
                  value={bulkText}
                  onChange={(e) => {
                    setBulkText(e.target.value);
                    if (bulkError) setBulkError('');
                  }}
                  placeholder={`Bạn có thể dán theo 2 cách:\n\nCÁCH 1: KHÔNG CẦN MẬT KHẨU (Chỉ cần TikTok ID hoặc Email):\n@trangorders_99\n@linhreview_official\nminhtrang@gmail.com\n\nCÁCH 2: CÓ MẬT KHẨU (Quét cả ví voucher cá nhân):\nemail@gmail.com|matkhau|@tiktok_id\n@tiktok_id|matkhau`}
                  className="w-full px-3.5 py-2.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />

                {bulkError && (
                  <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {bulkError}
                  </p>
                )}
              </div>

              {/* Supported formats hint */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5">
                <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Giải đáp: Không có mật khẩu hệ thống kiểm tra như thế nào?</span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 pl-4 space-y-1">
                  <div>• <strong className="text-slate-900 dark:text-white">Kiểm tra Sống / Bị Đình Chỉ (Đỏ/Xanh):</strong> <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Hoạt động!</span> TikTok công khai tình trạng profile (Account banned / Active).</div>
                  <div>• <strong className="text-slate-900 dark:text-white">Kiểm tra Mã vận chuyển:</strong> Quét các mã Freeship toàn sàn & chiến dịch khả dụng cho tài khoản sống. (Nếu cung cấp thêm pass/cookie sẽ quét được thêm ví voucher cá nhân bảo mật).</div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!bulkText.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm shadow-rose-600/30 transition-all"
                >
                  Thêm {parsedPreviewCount > 0 ? `${parsedPreviewCount} tài khoản` : 'vào danh sách'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSingleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email đăng nhập:
                  </label>
                  <input
                    type="email"
                    value={singleEmail}
                    onChange={(e) => setSingleEmail(e.target.value)}
                    placeholder="vidu@gmail.com"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    TikTok ID / Username (@handle): <span className="text-slate-400 font-normal">(Khuyên dùng)</span>
                  </label>
                  <input
                    type="text"
                    value={singleTikTokId}
                    onChange={(e) => setSingleTikTokId(e.target.value)}
                    placeholder="@user_tiktok"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Mật khẩu tài khoản:
                  </label>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    (Không bắt buộc - Có thể để trống)
                  </span>
                </div>
                <input
                  type="text"
                  value={singlePassword}
                  onChange={(e) => setSinglePassword(e.target.value)}
                  placeholder="Để trống nếu chỉ muốn kiểm tra trạng thái profile công khai..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ghi chú (Tùy chọn):
                </label>
                <input
                  type="text"
                  value={singleNotes}
                  onChange={(e) => setSingleNotes(e.target.value)}
                  placeholder="Ví dụ: Acc chính, acc phụ săn đồ công nghệ..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cookie / Session Token (Tùy chọn):
                </label>
                <textarea
                  rows={2}
                  value={singleCookie}
                  onChange={(e) => setSingleCookie(e.target.value)}
                  placeholder="sid_tt=...; sessionid=..."
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                />
              </div>

              {singleError && (
                <p className="text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {singleError}
                </p>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm shadow-rose-600/30 transition-all"
                >
                  Lưu & Thêm tài khoản
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
