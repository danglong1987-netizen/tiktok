import { TikTokAccount } from '../types';

/**
 * Exports account list to CSV with UTF-8 BOM for Microsoft Excel Vietnamese support
 */
export function exportAccountsToCSV(accounts: TikTokAccount[], filename = 'tiktok_accounts_report.csv'): void {
  const headers = [
    'STT',
    'Email',
    'TikTok ID',
    'Mật khẩu',
    'Tình trạng tài khoản',
    'Mã màu trạng thái',
    'Chi tiết tình trạng',
    'Tổng số mã vận chuyển',
    'Chi tiết mã vận chuyển (Freeship)',
    'Tên người nhận hàng',
    'SĐT nhận hàng',
    '1. Tỉnh/Thành phố',
    '2. Phường/Xã',
    '3. Chi tiết (Số nhà, đường...)',
    'Địa chỉ nhận hàng hoàn chỉnh',
    'Thời gian kiểm tra',
    'Ghi chú',
  ];

  const rows = accounts.map((acc, index) => {
    const statusLabel = 
      acc.status === 'active' ? 'Còn sống (Hoạt động)' :
      acc.status === 'suspended' ? 'Bị đình chỉ (Khóa)' :
      acc.status === 'checkpoint' ? 'Cần xác minh OTP/Captcha' : 'Chưa kiểm tra';

    const colorLabel = 
      acc.status === 'active' ? 'Xanh lá (Hợp lệ)' :
      acc.status === 'suspended' ? 'Đỏ (Khóa/Đình chỉ)' : 'Trung tính';

    const voucherSummaries = acc.vouchers.map(v => `${v.title} [${v.minOrderDisplay}] (${v.expiryDate})`).join('; ');
    const lastChecked = acc.lastChecked ? new Date(acc.lastChecked).toLocaleString('vi-VN') : 'Chưa quét';

    const addr = acc.shippingAddress;
    const recipient = addr ? addr.recipientName : '';
    const phone = addr ? addr.phoneNumber : '';
    const province = addr ? addr.province : '';
    const ward = addr ? addr.ward : '';
    const detailed = addr ? addr.detailedAddress : '';
    const fullAddr = addr ? addr.fullAddress : '';

    return [
      index + 1,
      `"${acc.email.replace(/"/g, '""')}"`,
      `"${acc.tiktokId.replace(/"/g, '""')}"`,
      `"${(acc.password || '').replace(/"/g, '""')}"`,
      `"${statusLabel}"`,
      `"${colorLabel}"`,
      `"${(acc.statusReason || '').replace(/"/g, '""')}"`,
      acc.vouchers.length,
      `"${voucherSummaries.replace(/"/g, '""')}"`,
      `"${recipient.replace(/"/g, '""')}"`,
      `"${phone}"`,
      `"${province.replace(/"/g, '""')}"`,
      `"${ward.replace(/"/g, '""')}"`,
      `"${detailed.replace(/"/g, '""')}"`,
      `"${fullAddr.replace(/"/g, '""')}"`,
      `"${lastChecked}"`,
      `"${(acc.notes || '').replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports accounts formatted for auto-checkout tools (e.g. email|pass, with address)
 */
export function exportAccountsToTXT(
  accounts: TikTokAccount[], 
  format: 'email|pass' | 'id|pass' | 'email|pass|id' | 'email|pass|address' | 'full',
  onlyActive: boolean = false
): void {
  const filtered = onlyActive ? accounts.filter(a => a.status === 'active') : accounts;

  const lines = filtered.map(acc => {
    const pass = acc.password || '';
    const addr = acc.shippingAddress ? `${acc.shippingAddress.recipientName}|${acc.shippingAddress.phoneNumber}|${acc.shippingAddress.fullAddress}` : 'Chưa_có_địa_chỉ';
    
    switch (format) {
      case 'email|pass':
        return `${acc.email}|${pass}`;
      case 'id|pass':
        return `${acc.tiktokId}|${pass}`;
      case 'email|pass|id':
        return `${acc.email}|${pass}|${acc.tiktokId}`;
      case 'email|pass|address':
        return `${acc.email}|${pass}|${addr}`;
      case 'full':
      default:
        const vCodes = acc.vouchers.map(v => v.code).join(',');
        return `${acc.email}|${pass}|${acc.tiktokId}|${acc.status}|Vouchers:[${vCodes}]|Address:[${addr}]`;
    }
  });

  const textContent = lines.join('\r\n');
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filePrefix = onlyActive ? 'tiktok_acc_alive' : 'tiktok_acc_list';
  link.setAttribute('href', url);
  link.setAttribute('download', `${filePrefix}_${format.replace(/\|/g, '_')}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Clipboard error', err);
    return false;
  }
}
