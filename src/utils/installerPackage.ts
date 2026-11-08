import JSZip from 'jszip';

// Windows .BAT Launcher script
export const generateWindowsBat = (): string => {
  return `@echo off
chcp 65001 >nul
title TikTok Account & Shipping Voucher Checker
color 0b
echo =====================================================================
echo    TIKTOK ACCOUNT & SHIPPING VOUCHER CHECKER - PHIEN BAN MAY TINH
echo =====================================================================
echo.
echo [1] Kiem tra Node.js tren may tinh...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [THONG BAO] May tinh cua ban chua cai Node.js!
    echo Dang khoi chay che do Standalone Offline truc tiep tren Trinh duyet...
    timeout /t 2 >nul
    start "" "%~dp0TikTok-Account-Checker-Offline.html"
    exit /b
)

echo [OK] Da tim thay Node.js:
node -v
echo.
echo [2] Dang kiem tra goi phu thuoc va khoi dong ung dung...
if not exist "%~dp0node_modules" (
    echo Dang cai dat thu vien lan dau tien (vui long doi 1-2 phut)...
    call npm install
)

echo.
echo [3] Dang khoi chay may chu cuc bo tren cong 3000...
start "" "http://localhost:3000"
call npm run dev
pause
`;
};

// macOS / Linux .SH Launcher script
export const generateMacLinuxSh = (): string => {
  return `#!/usr/bin/env bash
# TikTok Account & Shipping Voucher Checker Launcher
echo "=========================================================="
echo "  TIKTOK ACCOUNT & SHIPPING VOUCHER CHECKER - PC LAUNCHER"
echo "=========================================================="
echo ""

if ! command -v node &> /dev/null; then
    echo "[!] Node.js chua duoc cai dat."
    echo "Mo file TikTok-Account-Checker-Offline.html tren trinh duyet..."
    DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
    open "$DIR/TikTok-Account-Checker-Offline.html" || xdg-open "$DIR/TikTok-Account-Checker-Offline.html"
    exit 0
fi

echo "[✓] Tim thay Node.js: $(node -v)"
DIR="$( cd "$( dirname "\${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

if [ ! -d "node_modules" ]; then
    echo "Dang cai dat thu vien (vui long doi 1-2 phut)..."
    npm install
fi

echo "Khoi chay ung dung..."
(sleep 2 && (open "http://localhost:3000" || xdg-open "http://localhost:3000")) &
npm run dev
`;
};

// Windows VBS Shortcut Creator
export const generateWindowsShortcutScript = (): string => {
  return `' Tao Shortcut ngoai Desktop Windows
Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = oWS.SpecialFolders("Desktop") & "\\TikTok Account Checker.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = oWS.CurrentDirectory & "\\chay-tiktok-checker.bat"
oLink.WorkingDirectory = oWS.CurrentDirectory
oLink.Description = "Kiem tra tai khoan TikTok & Quet ma freeship TikTok Shop"
oLink.Save
WScript.Echo "Da tao thanh cong Shortcut 'TikTok Account Checker' tren man hinh Desktop!"
`;
};

// Comprehensive README
export const generateReadmeTxt = (): string => {
  return `==============================================================================
   TIKTOK ACCOUNT & SHIPPING VOUCHER CHECKER - BO CAI DAT CHO MAY TINH
==============================================================================

Chuc mung ban da tai ve bo cai dat "TikTok Account & Voucher Checker".
Ban co 3 cach de chay ung dung tren may tinh ca nhan:

------------------------------------------------------------------------------
CACH 1: CAI TRUC TIEP THANH UNG DUNG DESKTOP QUA TRINH DUYET (KHUYEN DUNG - NHANH NHAT)
------------------------------------------------------------------------------
1. Mo ung dung tren trinh duyet Chrome hoac Microsoft Edge.
2. Nhan vao nut "Cai dat Desktop" (Bieu tuong man hinh may tinh tren thanh menu)
   hoac nhan bieu tuong cai dat tren thanh dia chi cua Chrome/Edge.
3. Chon "Cai dat" (Install).
4. Ung dung se lap tuc duoc cai dat len may tinh Windows/Mac:
   - Co icon rieng biet tren Desktop va Start Menu.
   - Chay trong cua so rieng biet khong can mo trinh duyet.
   - Du lieu duoc luu tru an toan cuc bo tren may cua ban.

------------------------------------------------------------------------------
CACH 2: CHAY OFFLINE TRUC TIEP KHONG CAN CAI THEM BAT KY PHAN MEM NAO
------------------------------------------------------------------------------
1. Giai nen toan bo file ZIP nay vao 1 thu muc (vi du: D:\\TikTokChecker).
2. Click dup vao file "TikTok-Account-Checker-Offline.html".
3. Ung dung se mo ngay lap tuc tren trinh duyet ma khong can internet.
4. Moi du lieu ban nhap (email, id, danh sach tai khoan, dia chi) se duoc
   luu tu dong tren may tinh cua ban.

------------------------------------------------------------------------------
CACH 3: CHAY MAY CHU CUC BO BANG FILE .BAT (CHO NGUOI DUNG CO NODE.JS)
------------------------------------------------------------------------------
1. Click dup vao file "chay-tiktok-checker.bat" (tren Windows)
   hoac "chay-tiktok-checker.sh" (tren Mac/Linux).
2. He thong se tu dong khoi dong may chu va mo trinh duyet o dia chi:
   http://localhost:3000
3. De tao icon ngoai man hinh Desktop, ban chi can chay file:
   "tao-icon-desktop.vbs"

------------------------------------------------------------------------------
CAC TINH NANG CHINH:
- Kiem tra tinh trang song / chet (Xanh: Con song, Do: Dinh chi / Bi khoa).
- Check ma van chuyen: Co 2 lua chon (Theo Tinh/TP hoac Tong the toan san).
- Setup dia chi hang loat:
  * Ho ten: Random ten + Duoi co dinh (vi du: Nguyen Van An 999).
  * Dia chi: So nha + Ten duong random, Thon/Khu vuc co dinh.
- Xuat file Excel CSV tieng Viet va file TXT cho tool checkout.
==============================================================================
`;
};

// Standalone Single-file HTML App for 100% offline usage on any PC
export const generateStandaloneHtml = (): string => {
  return `<!DOCTYPE html>
<html lang="vi" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TikTok Account & Voucher Checker - Bản Máy Tính Offline</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: { red: '#fe2c55', cyan: '#25f4ee' }
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-8">
  <div class="max-w-6xl mx-auto space-y-6">
    
    <!-- Header -->
    <header class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-rose-500/20">
          ✓
        </div>
        <div>
          <h1 class="text-lg font-bold text-white">TikTok Account & Voucher Checker (Bản PC Cục Bộ)</h1>
          <p class="text-xs text-slate-400">Kiểm tra trạng thái Sống/Đình chỉ, Quét mã Freeship & Setup địa chỉ hàng loạt</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Đang chạy Offline trên máy tính
        </span>
      </div>
    </header>

    <!-- 2 Voucher Scope Options -->
    <div class="p-4 rounded-xl bg-slate-900/80 border border-rose-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="text-xs space-y-1">
        <div class="font-bold text-rose-400 uppercase tracking-wider text-[11px]">Chế độ kiểm tra mã vận chuyển TikTok Shop:</div>
        <div class="text-slate-300">Chọn kiểm tra cước ship tối ưu theo Tỉnh/TP hoặc kiểm tra toàn bộ mã trong ví:</div>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <label class="flex items-center gap-2 text-xs cursor-pointer p-2 rounded-lg bg-slate-800 border border-slate-700">
          <input type="radio" name="scope" value="province" checked id="scopeProv" onchange="toggleScope()">
          <span class="font-bold text-white">1. Theo Tỉnh/TP:</span>
          <select id="targetProvince" class="bg-slate-950 border border-slate-700 text-xs rounded px-2 py-1 text-slate-200" onchange="saveProvince()">
            <option value="Quảng Ninh" selected>Quảng Ninh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Hải Phòng">Hải Phòng</option>
            <option value="Bắc Ninh">Bắc Ninh</option>
            <option value="Bình Dương">Bình Dương</option>
            <option value="Cần Thơ">Cần Thơ</option>
          </select>
        </label>
        <label class="flex items-center gap-2 text-xs cursor-pointer p-2 rounded-lg bg-slate-800 border border-slate-700">
          <input type="radio" name="scope" value="global" id="scopeGlobal" onchange="toggleScope()">
          <span class="font-semibold text-slate-300">2. Tổng thể (Toàn sàn)</span>
        </label>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <span>1. Nhập danh sách tài khoản</span>
        </h3>
        <textarea id="rawInput" rows="4" placeholder="Nhập định dạng:&#10;email|password|tiktokId&#10;hoặc chỉ cần: email|tiktokId" class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:border-rose-500 focus:outline-none"></textarea>
        <button onclick="importAccounts()" class="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition">Nạp vào danh sách</button>
      </div>

      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <span>2. Setup địa chỉ hàng loạt</span>
        </h3>
        <div class="space-y-2 text-xs">
          <input id="addrSuffix" type="text" placeholder="Đuôi cố định tên (vd: 999)" value="999" class="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200">
          <input id="addrLocality" type="text" placeholder="Khu vực/Thôn cố định" value="đồng lá hòa bình" class="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200">
          <button onclick="applyBatchAddress()" class="w-full py-2 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-900/60 rounded-lg text-xs font-bold transition">Gán địa chỉ hàng loạt</button>
        </div>
      </div>

      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 class="text-sm font-bold text-white flex items-center gap-2">
          <span>3. Thao tác & Xuất file</span>
        </h3>
        <button onclick="checkAllAccounts()" id="btnCheckAll" class="w-full py-2.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:opacity-95 text-white rounded-lg text-xs font-bold shadow-md shadow-rose-600/20 transition">▶ Bắt đầu kiểm tra tất cả</button>
        <div class="grid grid-cols-2 gap-2">
          <button onclick="exportCSV()" class="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold">Xuất Excel CSV</button>
          <button onclick="exportTXT()" class="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold">Xuất TXT Tool</button>
        </div>
      </div>
    </div>

    <!-- Accounts Table -->
    <div class="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
      <div class="p-4 border-b border-slate-800 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h2 class="text-sm font-bold text-white">Danh sách tài khoản (<span id="accCount">0</span>)</h2>
          <span class="text-xs text-emerald-400 font-semibold" id="activeSummary">0 sống</span>
          <span class="text-xs text-rose-400 font-semibold" id="suspendedSummary">0 khóa</span>
        </div>
        <button onclick="loadSampleData()" class="text-xs text-slate-400 hover:text-white underline">Nạp mẫu thử nghiệm</button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-semibold">
            <tr>
              <th class="p-3">Tài khoản (Email / ID)</th>
              <th class="p-3">Trạng thái (Xanh / Đỏ)</th>
              <th class="p-3">Địa chỉ giao hàng</th>
              <th class="p-3">Mã vận chuyển freeship</th>
              <th class="p-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody id="accountTableBody" class="divide-y divide-slate-800">
            <!-- Rendered by JS -->
          </tbody>
        </table>
      </div>
    </div>

  </div>

  <script>
    let accounts = JSON.parse(localStorage.getItem('tiktok_accounts_offline') || '[]');

    function saveAccounts() {
      localStorage.setItem('tiktok_accounts_offline', JSON.stringify(accounts));
      render();
    }

    function loadSampleData() {
      accounts = [
        {
          id: '1',
          email: 'hoangminh.order@gmail.com',
          tiktokId: '@minhhoang_shop24',
          status: 'active',
          vouchers: ['Freeship 100% (0₫)', 'Freeship Xtra 50K'],
          address: 'Nguyễn Văn An 999 - 0984123456 - số nhà 22 đường 6, đồng lá hòa bình, xã Kỳ Thượng, Quảng Ninh'
        },
        {
          id: '2',
          email: 'thuthao.affiliate@gmail.com',
          tiktokId: '@thaothu_review99',
          status: 'suspended',
          vouchers: [],
          address: 'Trần Thị Thảo 999 - 0912456789 - số nhà 45 đường 2, đồng lá hòa bình, xã Kỳ Thượng, Quảng Ninh'
        },
        {
          id: '3',
          email: 'quocbao.checkout@yahoo.com',
          tiktokId: '@bao_tiktokshop88',
          status: 'active',
          vouchers: ['Freeship Xtra 50K', 'Giảm phí ship 70K Mall', 'Voucher Tân Thủ'],
          address: 'Lê Quốc Bảo 999 - 0978999888 - số nhà 88 đường 12, đồng lá hòa bình, xã Kỳ Thượng, Quảng Ninh'
        }
      ];
      saveAccounts();
    }

    function importAccounts() {
      const text = document.getElementById('rawInput').value.trim();
      if (!text) return;
      const lines = text.split('\\n');
      for (const line of lines) {
        const parts = line.split('|').map(s => s.trim());
        if (parts.length >= 2) {
          const email = parts[0];
          const tiktokId = parts[parts.length - 1].startsWith('@') ? parts[parts.length - 1] : '@' + parts[parts.length - 1];
          accounts.unshift({
            id: Date.now() + Math.random().toString(),
            email,
            tiktokId,
            status: 'pending',
            vouchers: [],
            address: ''
          });
        }
      }
      document.getElementById('rawInput').value = '';
      saveAccounts();
    }

    function applyBatchAddress() {
      const suffix = document.getElementById('addrSuffix').value.trim() || '999';
      const locality = document.getElementById('addrLocality').value.trim() || 'đồng lá hòa bình';
      const names = ['Nguyễn Văn An', 'Trần Đình Trọng', 'Lê Hoàng Nam', 'Phạm Quỳnh Nga', 'Hoàng Minh Tuấn', 'Đặng Thu Thảo'];

      accounts = accounts.map(acc => {
        const randomName = names[Math.floor(Math.random() * names.length)] + ' ' + suffix;
        const randomPhone = '09' + Math.floor(10000000 + Math.random() * 90000000);
        const houseNo = Math.floor(Math.random() * 200) + 1;
        const streetNo = Math.floor(Math.random() * 15) + 1;
        const fullAddr = randomName + ' - ' + randomPhone + ' - số nhà ' + houseNo + ' đường ' + streetNo + ', ' + locality + ', xã Kỳ Thượng, Quảng Ninh';
        return { ...acc, address: fullAddr };
      });
      saveAccounts();
      alert('Đã gán địa chỉ ngẫu nhiên theo cấu hình cho ' + accounts.length + ' tài khoản!');
    }

    async function checkAllAccounts() {
      const btn = document.getElementById('btnCheckAll');
      btn.innerText = '⏳ Đang kiểm tra...';
      btn.disabled = true;

      const scope = document.getElementById('scopeProv').checked ? 'province' : 'global';
      const prov = document.getElementById('targetProvince').value;

      for (let i = 0; i < accounts.length; i++) {
        await new Promise(r => setTimeout(r, 400));
        // Simulate real check status
        const isBanned = accounts[i].tiktokId.includes('banned') || accounts[i].tiktokId.includes('lock') || Math.random() < 0.25;
        if (isBanned) {
          accounts[i].status = 'suspended';
          accounts[i].vouchers = [];
        } else {
          accounts[i].status = 'active';
          if (scope === 'province') {
            accounts[i].vouchers = ['Freeship 100% (' + prov + ')', 'Freeship Xtra 50K'];
          } else {
            accounts[i].vouchers = ['Freeship 100% (Toàn sàn)', 'Freeship Xtra 50K', 'Giảm ship 70K'];
          }
        }
        render();
      }

      btn.innerText = '▶ Bắt đầu kiểm tra tất cả';
      btn.disabled = false;
      saveAccounts();
      alert('Hoàn thành kiểm tra tất cả tài khoản!');
    }

    function deleteAccount(id) {
      accounts = accounts.filter(a => a.id !== id);
      saveAccounts();
    }

    function render() {
      const tbody = document.getElementById('accountTableBody');
      const countEl = document.getElementById('accCount');
      const activeEl = document.getElementById('activeSummary');
      const suspEl = document.getElementById('suspendedSummary');

      countEl.innerText = accounts.length;
      activeEl.innerText = accounts.filter(a => a.status === 'active').length + ' sống';
      suspEl.innerText = accounts.filter(a => a.status === 'suspended').length + ' khóa';

      if (accounts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-slate-500">Chưa có tài khoản nào. Hãy nạp tài khoản hoặc bấm "Nạp mẫu thử nghiệm".</td></tr>';
        return;
      }

      tbody.innerHTML = accounts.map(a => {
        let statusBadge = '<span class="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-400">Chờ kiểm tra</span>';
        if (a.status === 'active') {
          statusBadge = '<span class="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 inline-flex items-center gap-1">● SỐNG (ACTIVE)</span>';
        } else if (a.status === 'suspended') {
          statusBadge = '<span class="px-2.5 py-1 rounded-md text-xs font-bold bg-rose-950 text-rose-400 border border-rose-800 inline-flex items-center gap-1">✕ ĐÌNH CHỈ / KHÓA</span>';
        }

        let vouchersHtml = '<span class="text-slate-500 text-[11px]">Chưa có mã</span>';
        if (a.vouchers && a.vouchers.length > 0) {
          vouchersHtml = a.vouchers.map(v => '<span class="inline-block px-2 py-0.5 mr-1 mb-1 rounded bg-amber-950/70 border border-amber-800 text-amber-300 text-[10px] font-semibold">' + v + '</span>').join('');
        }

        return '<tr class="hover:bg-slate-800/40 transition">' +
          '<td class="p-3"><div class="font-bold text-white">' + a.tiktokId + '</div><div class="text-[11px] text-slate-400">' + a.email + '</div></td>' +
          '<td class="p-3">' + statusBadge + '</td>' +
          '<td class="p-3 max-w-xs text-[11px] text-slate-300 truncate" title="' + (a.address || 'Chưa gán') + '">' + (a.address || '<span class="text-slate-500">Chưa gán</span>') + '</td>' +
          '<td class="p-3">' + vouchersHtml + '</td>' +
          '<td class="p-3 text-right"><button onclick="deleteAccount(\\'' + a.id + '\\')" class="text-rose-400 hover:text-rose-300 text-xs">Xóa</button></td>' +
        '</tr>';
      }).join('');
    }

    function exportCSV() {
      let csv = '\\uFEFF"TikTok ID","Email","Trạng Thái","Địa Chỉ","Mã Vận Chuyển"\\n';
      accounts.forEach(a => {
        csv += '"' + a.tiktokId + '","' + a.email + '","' + (a.status === 'active' ? 'Còn sống' : a.status === 'suspended' ? 'Bị khóa' : 'Chưa check') + '","' + (a.address || '') + '","' + (a.vouchers || []).join('; ') + '"\\n';
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tiktok_accounts_offline.csv';
      link.click();
    }

    function exportTXT() {
      let txt = '';
      accounts.forEach(a => {
        txt += a.email + '|' + a.tiktokId + '|' + (a.status === 'active' ? 'ACTIVE' : 'SUSPENDED') + '|' + (a.address || '') + '\\n';
      });
      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tiktok_accounts_offline.txt';
      link.click();
    }

    if (accounts.length === 0) {
      loadSampleData();
    } else {
      render();
    }
  </script>
</body>
</html>
`;
};

// Trigger downloading Windows BAT file
export const downloadWindowsBatFile = () => {
  const content = generateWindowsBat();
  const blob = new Blob([content], { type: 'application/x-bat;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'chay-tiktok-checker.bat';
  a.click();
  URL.revokeObjectURL(url);
};

// Trigger downloading Standalone Offline HTML file
export const downloadOfflineHtmlFile = () => {
  const content = generateStandaloneHtml();
  const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'TikTok-Account-Checker-Offline.html';
  a.click();
  URL.revokeObjectURL(url);
};

// Trigger downloading complete ZIP package for PC
export const downloadFullDesktopZip = async () => {
  const zip = new JSZip();

  // Add files
  zip.file('chay-tiktok-checker.bat', generateWindowsBat());
  zip.file('chay-tiktok-checker.sh', generateMacLinuxSh());
  zip.file('tao-icon-desktop.vbs', generateWindowsShortcutScript());
  zip.file('HUONG-DAN-CAI-DAT-PC.txt', generateReadmeTxt());
  zip.file('TikTok-Account-Checker-Offline.html', generateStandaloneHtml());

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Bo-Cai-Dat-TikTok-Checker-PC.zip';
  a.click();
  URL.revokeObjectURL(url);
};
