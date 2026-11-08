import React, { useState } from 'react';
import { 
  Monitor, 
  Download, 
  CheckCircle2, 
  X, 
  FileCode, 
  Terminal, 
  Package, 
  ExternalLink,
  Sparkles,
  Laptop,
  Check,
  ShieldCheck
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { 
  downloadFullDesktopZip, 
  downloadWindowsBatFile, 
  downloadOfflineHtmlFile 
} from '../utils/installerPackage';

interface DesktopInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopInstallModal: React.FC<DesktopInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'easy' | 'single_file' | 'zip'>('easy');

  if (!isOpen) return null;

  const appUrl = 'https://ais-pre-r6ngwwm7uwkrlqpubpo5uu-267527988664.asia-east1.run.app';

  const handlePWAInstall = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) {
        setDownloadSuccess('Đã cài đặt thành công ứng dụng vào máy tính của bạn! Hãy kiểm tra màn hình Desktop.');
      }
    } else {
      alert('Cách cài cực nhanh: Nhìn lên góc trên bên phải thanh địa chỉ trình duyệt Chrome / Edge (nơi bạn gõ link web), bấm vào biểu tượng hình máy tính tải xuống [⬇] hoặc chọn Menu 3 chấm > "Cài đặt ứng dụng..." là xong ngay!');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setDownloadSuccess('Đã copy đường dẫn ứng dụng! Bạn có thể dán vào Chrome/Edge hoặc gửi qua Zalo.');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true);
      await downloadFullDesktopZip();
      setDownloadSuccess('Đã tải thành công file Bo-Cai-Dat-TikTok-Checker-PC.zip về máy!');
      setTimeout(() => setDownloadSuccess(null), 5000);
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi tạo file zip. Vui lòng thử lại!');
    } finally {
      setIsDownloadingZip(false);
    }
  };

  const handleDownloadBat = () => {
    downloadWindowsBatFile();
    setDownloadSuccess('Đã tải file chay-tiktok-checker.bat!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadHtml = () => {
    downloadOfflineHtmlFile();
    setDownloadSuccess('Đã tải file TikTok-Account-Checker-Offline.html! Bạn chỉ cần click đúp vào file vừa tải là dùng được ngay.');
    setTimeout(() => setDownloadSuccess(null), 6000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Hướng dẫn đưa ứng dụng lên máy tính cá nhân
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  Dễ nhất · Không cần biết kỹ thuật
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bạn không cần cài đặt phần mềm phức tạp, chỉ cần làm theo 1 trong các cách siêu dễ dưới đây
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert */}
        {downloadSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="px-6 pt-4 flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('easy')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'easy'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Cách 1: Đưa icon ra Desktop (Dễ nhất - 3 giây)
          </button>

          <button
            onClick={() => setActiveTab('single_file')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'single_file'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-sky-500" />
            Cách 2: Tải 1 file mở dùng ngay
          </button>

          <button
            onClick={() => setActiveTab('zip')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'zip'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Cách 3: Tải trọn bộ .ZIP & File .BAT
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* TAB 1: Easy - 3 Second Desktop Icon */}
          {activeTab === 'easy' && (
            <div className="space-y-4">
              
              {/* Box 1: 1-Click Install Button */}
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Cách A: Bấm nút này để trình duyệt tự động cài vào máy tính
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Trình duyệt sẽ tự động thêm icon ra màn hình Desktop và Start Menu:
                    </p>
                  </div>
                </div>

                <div className="pt-1 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handlePWAInstall}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 transition active:scale-95"
                  >
                    <Monitor className="w-4 h-4" />
                    <span>BẤM VÀO ĐÂY ĐỂ CÀI ĐẶT TỰ ĐỘNG</span>
                  </button>
                </div>
              </div>

              {/* Box 2: Drag & Drop Lock Icon - Easiest & Most Reliable */}
              <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">★</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Cách B: Kéo ổ khóa 🔒 ra màn hình Desktop (Mẹo 3 giây - ai cũng làm được)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="font-bold text-amber-600 dark:text-amber-400">Bước 1:</div>
                    <div className="text-slate-600 dark:text-slate-300 text-[11px]">
                      Thu nhỏ cửa sổ trình duyệt lại một chút để nhìn thấy một góc màn hình máy tính (Desktop).
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="font-bold text-amber-600 dark:text-amber-400">Bước 2:</div>
                    <div className="text-slate-600 dark:text-slate-300 text-[11px]">
                      Dùng chuột trái bấm giữ vào <strong>biểu tượng ổ khóa 🔒</strong> (hoặc icon tròn) ở đầu thanh địa chỉ.
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">Bước 3: Xong ngay!</div>
                    <div className="text-slate-600 dark:text-slate-300 text-[11px]">
                      Kéo và thả chuột ra ngoài màn hình Desktop ➔ Sẽ có icon mở ứng dụng ngay lập tức!
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 3: Permanent Link Access */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Đường dẫn online cá nhân của bạn (Lưu lại để mở bất cứ lúc nào):
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-semibold flex items-center gap-1 transition"
                  >
                    Sao chép link
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-rose-600 dark:text-rose-400 select-all break-all">
                  {appUrl}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  💡 Bạn có thể mở link này trên điện thoại hoặc máy tính khác, bấm <code>Ctrl + D</code> để lưu vào Dấu trang (Bookmarks).
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: Single HTML File (Zero installation) */}
          {activeTab === 'single_file' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-sky-300 dark:border-sky-800 bg-sky-50/60 dark:bg-sky-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-sky-500" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Tải 1 file duy nhất: TikTok-Account-Checker-Offline.html
                    </h4>
                    <p className="text-xs text-slate-500">
                      Không cần cài đặt, không cần giải nén, không cần internet — Tải về và click đúp là mở dùng luôn!
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleDownloadHtml}
                    className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Bấm để Tải file này về máy tính (Dung lượng siêu nhẹ ~30KB)</span>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">
                  Sau khi tải về, bạn làm như sau:
                </div>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-600 dark:text-slate-300">
                  <li>Mở thư mục <strong>Downloads (Tải về)</strong> trên máy tính.</li>
                  <li>Click đúp (bấm chuột 2 lần) vào file <code>TikTok-Account-Checker-Offline.html</code>.</li>
                  <li>Phần mềm sẽ tự mở lên với đầy đủ tính năng: check sống/chết (Xanh/Đỏ), quét mã freeship và gán địa chỉ hàng loạt.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: Full ZIP & BAT Package */}
          {activeTab === 'zip' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-rose-500" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Gói nén: Bo-Cai-Dat-TikTok-Checker-PC.zip</h4>
                      <p className="text-xs text-slate-500">Chứa file .BAT cho Windows và .SH cho Mac/Linux</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadZip}
                    disabled={isDownloadingZip}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
                  >
                    <Download className="w-4 h-4" />
                    {isDownloadingZip ? 'Đang tạo...' : 'Tải file .ZIP'}
                  </button>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="font-semibold text-slate-900 dark:text-white">File chạy tự động cho Windows:</div>
                  <button
                    onClick={handleDownloadBat}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    Tải riêng file chay-tiktok-checker.bat
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Hỗ trợ Windows 10/11, macOS, Linux
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
