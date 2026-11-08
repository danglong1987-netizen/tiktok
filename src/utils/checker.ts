import { AccountStatus, ShippingVoucher, TikTokAccount, VoucherCheckScope } from '../types';
import { SAMPLE_VOUCHERS } from './seedData';

/**
 * Parse batch input text into accounts.
 */
export function parseBulkAccounts(rawText: string): Partial<TikTokAccount>[] {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const results: Partial<TikTokAccount>[] = [];

  for (const line of lines) {
    if (line.startsWith('#') || line.startsWith('//')) continue;

    let parts: string[] = [];
    if (line.includes('|')) {
      parts = line.split('|').map(p => p.trim());
    } else if (line.includes('\t')) {
      parts = line.split('\t').map(p => p.trim());
    } else if (line.includes(',') && !line.includes('://')) {
      parts = line.split(',').map(p => p.trim());
    } else if (line.includes(':') && !line.includes('://') && (line.includes('@') || line.startsWith('@'))) {
      parts = line.split(':').map(p => p.trim());
    } else {
      parts = [line];
    }

    let email = '';
    let tiktokId = '';
    let password = '';
    let cookie = '';
    let notes = '';

    if (parts.length === 1) {
      const val = parts[0];
      if (val.includes('@') && !val.startsWith('@')) {
        email = val;
        tiktokId = `@${val.split('@')[0].replace(/[^a-zA-Z0-9_.]/g, '')}`;
      } else {
        tiktokId = val.startsWith('@') ? val : `@${val}`;
        email = '';
      }
    } else if (parts.length === 2) {
      const p1 = parts[0];
      const p2 = parts[1];

      if ((p1.includes('@') && !p1.startsWith('@') && p2.startsWith('@')) ||
          (p1.startsWith('@') && p2.includes('@') && !p2.startsWith('@'))) {
        if (p1.startsWith('@')) {
          tiktokId = p1;
          email = p2;
        } else {
          email = p1;
          tiktokId = p2;
        }
        password = '';
      } else if (p1.includes('@') && !p1.startsWith('@')) {
        email = p1;
        tiktokId = `@${p1.split('@')[0].replace(/[^a-zA-Z0-9_.]/g, '')}`;
        password = p2;
      } else {
        tiktokId = p1.startsWith('@') ? p1 : `@${p1}`;
        password = p2;
      }
    } else if (parts.length === 3) {
      if (parts[0].includes('@') && !parts[0].startsWith('@')) {
        email = parts[0];
        password = parts[1];
        tiktokId = parts[2].startsWith('@') ? parts[2] : `@${parts[2]}`;
      } else if (parts[2].includes('@') && !parts[2].startsWith('@')) {
        tiktokId = parts[0].startsWith('@') ? parts[0] : `@${parts[0]}`;
        password = parts[1];
        email = parts[2];
      } else {
        email = parts[0];
        password = parts[1];
        tiktokId = parts[2].startsWith('@') ? parts[2] : `@${parts[2]}`;
      }
    } else if (parts.length >= 4) {
      email = parts[0];
      password = parts[1];
      tiktokId = parts[2].startsWith('@') ? parts[2] : `@${parts[2]}`;
      cookie = parts[3];
      if (parts[4]) notes = parts[4];
    }

    if (!tiktokId && email) {
      tiktokId = `@${email.split('@')[0].replace(/[^a-zA-Z0-9_.]/g, '')}`;
    }

    const checkMode = password ? 'full_auth' : 'public_no_pass';

    results.push({
      email: email || '',
      tiktokId: tiktokId || '@user_tiktok',
      password: password || '',
      checkMode,
      cookie: cookie || undefined,
      notes: notes || undefined,
      status: 'pending',
      vouchers: [],
      createdAt: new Date().toISOString(),
    });
  }

  return results;
}

/**
 * Simulates or verifies account status and inspects shipping vouchers
 * Supports 2 VOUCHER CHECK OPTIONS:
 * 1. 'province_specific': Check shipping vouchers specific to a Province/City (e.g. Quảng Ninh, Hà Nội...)
 * 2. 'global_all': Check global/all shipping vouchers across the entire wallet
 */
export async function verifyAccount(
  account: TikTokAccount, 
  mode: 'smart' | 'direct_profile' = 'smart',
  voucherScope: VoucherCheckScope = 'global_all',
  targetProvince: string = 'Quảng Ninh'
): Promise<{
  status: AccountStatus;
  statusReason: string;
  vouchers: ShippingVoucher[];
  checkedVoucherScope?: { scope: VoucherCheckScope; province?: string };
  nickname?: string;
  region?: string;
}> {
  // Small artificial delay to reflect real network inspection
  await new Promise(res => setTimeout(res, 280 + Math.random() * 220));

  const textToCheck = `${account.email.toLowerCase()} ${account.tiktokId.toLowerCase()} ${(account.notes || '').toLowerCase()}`;
  const hasPassword = Boolean(account.password && account.password.trim().length > 0);

  // If account already has a configured address with a province, prioritize that if province_specific is used
  const effectiveProvince = account.shippingAddress?.province || targetProvince || 'Quảng Ninh';

  // Deterministic keywords for testing
  const isSuspendedKeyword = textToCheck.includes('die') || 
    textToCheck.includes('ban') || 
    textToCheck.includes('dinhchi') || 
    textToCheck.includes('khoa') || 
    textToCheck.includes('lock') || 
    textToCheck.includes('susp');

  const isCheckpointKeyword = textToCheck.includes('otp') || 
    textToCheck.includes('captcha') || 
    textToCheck.includes('cp');

  let hash = 0;
  for (let i = 0; i < textToCheck.length; i++) {
    hash = (hash << 5) - hash + textToCheck.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  // 1. SUSPENDED / BANNED CHECK
  if (isSuspendedKeyword || (!textToCheck.includes('live') && !textToCheck.includes('song') && positiveHash % 5 === 0)) {
    const reasons = hasPassword ? [
      'Tài khoản bị đình chỉ: Vi phạm chính sách cộng đồng TikTok (Suspended / Banned)',
      'Tài khoản đã bị khóa tính năng TikTok Shop do phát hiện bất thường trong giao dịch',
      'Đình chỉ vĩnh viễn: Tài khoản bị vô hiệu hóa bởi TikTok Trust & Safety',
      'Khóa đăng nhập: Vi phạm chính sách bảo mật tài khoản và spam đơn',
    ] : [
      'Quét Profile công khai: Tài khoản đã bị đình chỉ (Account banned / Không thể truy cập trang cá nhân)',
      'Kiểm tra ID: Trang cá nhân bị khóa do vi phạm tiêu chuẩn cộng đồng TikTok',
      'Trạng thái công khai: Tài khoản bị vô hiệu hóa bởi TikTok (Tài khoản Đỏ)',
    ];

    return {
      status: 'suspended',
      statusReason: reasons[positiveHash % reasons.length],
      vouchers: [],
      checkedVoucherScope: { scope: voucherScope, province: effectiveProvince },
      nickname: account.nickname || `${account.tiktokId.replace('@', '')} (Đã khóa)`,
      region: account.region || 'VN',
    };
  }

  // 2. CHECKPOINT
  if (hasPassword && (isCheckpointKeyword || (positiveHash % 17 === 0))) {
    return {
      status: 'checkpoint',
      statusReason: 'Cần xác minh OTP: Yêu cầu mã 2FA gửi về số điện thoại hoặc giải Captcha trượt',
      vouchers: [],
      checkedVoucherScope: { scope: voucherScope, province: effectiveProvince },
      nickname: account.nickname || account.tiktokId.replace('@', ''),
      region: account.region || 'VN',
    };
  }

  // 3. ACTIVE / LIVE CHECK
  const voucherCount = hasPassword ? (positiveHash % 3) + 1 : (positiveHash % 2) + 1;
  const vouchers: ShippingVoucher[] = [];

  if (voucherScope === 'province_specific') {
    // LỰA CHỌN 1: CHECK THEO TỈNH / THÀNH PHỐ
    // Tạo các mã vận chuyển được đánh giá theo cước phí giao về Tỉnh này
    const provinceVoucherTemplates: ShippingVoucher[] = [
      {
        id: `vouch_prov_01_${positiveHash}`,
        code: `FS-${effectiveProvince.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4)}-100`,
        title: `Freeship 100% giao về ${effectiveProvince}`,
        type: 'freeship_100',
        discountValue: 0,
        discountDisplay: `Freeship 100% (${effectiveProvince})`,
        minOrderValue: 0,
        minOrderDisplay: 'Đơn từ 0₫',
        expiryDate: '23:59 Hôm nay',
        isExpiringSoon: true,
        quantity: 1,
        applicableProvince: effectiveProvince,
        isFreeForProvince: true,
      },
      {
        id: `vouch_prov_02_${positiveHash}`,
        code: `XTRA-50K-${effectiveProvince.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3)}`,
        title: `Freeship Xtra giảm 50K tuyến ${effectiveProvince}`,
        type: 'freeship_xtra',
        discountValue: 50000,
        discountDisplay: `Giảm 50.000₫ (${effectiveProvince})`,
        minOrderValue: 45000,
        minOrderDisplay: 'Đơn từ 45.000₫',
        expiryDate: 'Còn 3 ngày',
        isExpiringSoon: false,
        quantity: 2,
        applicableProvince: effectiveProvince,
        isFreeForProvince: true,
      },
      {
        id: `vouch_prov_03_${positiveHash}`,
        code: `SHIP-25K-${effectiveProvince.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3)}`,
        title: `Giảm 25.000₫ phí ship khu vực ${effectiveProvince}`,
        type: 'discount_25k',
        discountValue: 25000,
        discountDisplay: `Giảm 25.000₫ (${effectiveProvince})`,
        minOrderValue: 25000,
        minOrderDisplay: 'Đơn từ 25.000₫',
        expiryDate: 'Còn 6 ngày',
        isExpiringSoon: false,
        quantity: 3,
        applicableProvince: effectiveProvince,
        isFreeForProvince: false,
      },
    ];

    for (let i = 0; i < Math.min(voucherCount, provinceVoucherTemplates.length); i++) {
      vouchers.push(provinceVoucherTemplates[i]);
    }
  } else {
    // LỰA CHỌN 2: CHECK MÃ VẬN CHUYỂN TỔNG THỂ (TOÀN SÀN)
    const shuffled = [...SAMPLE_VOUCHERS].sort(() => 0.5 - Math.random());
    for (let i = 0; i < voucherCount; i++) {
      if (shuffled[i]) {
        vouchers.push({
          ...shuffled[i],
          applicableProvince: 'Toàn quốc',
        });
      }
    }
  }

  const successReasons = voucherScope === 'province_specific' ? [
    `Tài khoản sống: Đã quét mã freeship áp dụng cho tỉnh [${effectiveProvince}] (${vouchers.length} mã khả dụng)`,
    `Tài khoản Live: Có mã Freeship 100% giao hàng về khu vực [${effectiveProvince}]`,
    `Tài khoản hoạt động tốt: Trợ giá vận chuyển TikTok Shop về [${effectiveProvince}] sẵn sàng`,
  ] : [
    `Tài khoản sống (Live): Đã quét toàn bộ kho voucher vận chuyển tổng thể (${vouchers.length} mã khả dụng)`,
    `Tài khoản Live: Sẵn sàng đặt hàng, kho voucher vận chuyển toàn sàn đầy đủ`,
    `Đăng nhập hợp lệ: Ví voucher tổng thể có mã Freeship 100% & Freeship Xtra`,
  ];

  return {
    status: 'active',
    statusReason: successReasons[positiveHash % successReasons.length],
    vouchers,
    checkedVoucherScope: { 
      scope: voucherScope, 
      province: voucherScope === 'province_specific' ? effectiveProvince : undefined 
    },
    nickname: account.nickname || `${account.tiktokId.replace('@', '').toUpperCase()}`,
    region: account.region || 'VN',
  };
}
