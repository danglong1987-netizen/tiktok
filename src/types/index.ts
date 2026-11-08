export type AccountStatus = 'active' | 'suspended' | 'checkpoint' | 'pending' | 'checking';

export type VoucherType = 
  | 'freeship_100' 
  | 'discount_70k' 
  | 'discount_50k' 
  | 'discount_25k' 
  | 'freeship_xtra' 
  | 'new_buyer';

export type VoucherCheckScope = 'global_all' | 'province_specific';

export interface ShippingVoucher {
  id: string;
  code: string;
  title: string;
  type: VoucherType;
  discountValue: number;
  discountDisplay: string;
  minOrderValue: number;
  minOrderDisplay: string;
  expiryDate: string;
  isExpiringSoon?: boolean;
  quantity: number;
  applicableProvince?: string; // "Toàn quốc", hoặc tên tỉnh cụ thể như "Quảng Ninh", "Hà Nội"...
  isFreeForProvince?: boolean; // Miễn phí 100% phí ship khi giao về tỉnh này
}

export type AccountCheckMode = 'public_no_pass' | 'full_auth';

export interface ShippingAddress {
  recipientName: string;
  phoneNumber: string;
  province: string; // 1 Tỉnh
  ward: string; // 2 Phường (Xã)
  detailedAddress: string; // 3 Chi tiết địa chỉ (Số nhà, đường...)
  fullAddress: string; // Tổng hợp: số nhà 22 đường 6, đồng lá hòa bình, xã kỳ thượng, quảng ninh
  updatedAt?: string;
}

export interface TikTokAccount {
  id: string;
  email: string;
  tiktokId: string; // @username or ID
  password?: string;
  cookie?: string;
  checkMode?: AccountCheckMode;
  status: AccountStatus;
  statusReason?: string;
  lastChecked?: string;
  nickname?: string;
  avatar?: string;
  region?: string;
  vouchers: ShippingVoucher[];
  checkedVoucherScope?: {
    scope: VoucherCheckScope; // 'province_specific' hoặc 'global_all'
    province?: string; // Tên tỉnh nếu check theo tỉnh (ví dụ: 'Quảng Ninh')
  };
  shippingAddress?: ShippingAddress; // Địa chỉ nhận hàng TikTok Shop
  placedOrders?: {
    orderCode: string;
    carrier: string; // Đơn vị vận chuyển: J&T Express, SPX Express, Ninja Van...
    trackingNumber?: string; // Mã vận đơn
    productTitle: string;
    variantName?: string;
    finalTotal: number;
    placedAt: string;
    voucherUsed?: string;
  }[];
  notes?: string;
  createdAt: string;
}

export interface BatchAddressConfig {
  targetMode: 'selected' | 'all' | 'active_only';
  nameMode: 'fixed' | 'random';
  fixedName: string;
  phoneMode: 'fixed' | 'random';
  fixedPhone: string;
  province: string;
  ward: string;
  detailedAddressMode: 'fixed' | 'random_house_street' | 'custom_template';
  fixedDetailedAddress: string;
  customTemplate: string;
  landmarkPrefix: string; // e.g. "đồng lá hòa bình"
}

export interface CheckOptions {
  delayMs: number;
  autoSave: boolean;
  verifyShippingVouchers: boolean;
  mode: 'smart' | 'direct_profile';
  voucherCheckScope: VoucherCheckScope; // 1: province_specific, 2: global_all
  targetProvince?: string;
}

// Auto Order TikTok Shop Types
export interface ProductVariant {
  id: string;
  name: string; // Tên phân loại, ví dụ: "Size S - Trắng", "Bản Tiêu Chuẩn", "Dung tích 350ml"
  price: number;
  priceDisplay: string;
  originalPrice?: number;
  stock?: number;
}

export interface ProductItem {
  id: string;
  url: string;
  title: string;
  price: number;
  priceDisplay: string;
  originalPrice?: number;
  shopName: string;
  imageUrl?: string;
  category?: string;
  shippingFeeEstimate: number;
  variants?: ProductVariant[]; // Danh sách các phân loại có nhiều mức giá khác nhau
  lowestPriceVariant?: ProductVariant; // Phân loại có giá thấp nhất
  enabled: boolean;
}

export interface AutoOrderConfig {
  minTotalAmount: number; // Tổng tiền tối thiểu để chốt đơn (VNĐ)
  maxTotalAmount: number; // Tổng tiền tối đa để chốt đơn (VNĐ)
  minProductPrice: number; // Giá sản phẩm/phân loại tối thiểu (VNĐ)
  maxProductPrice: number; // Giá sản phẩm/phân loại tối đa (VNĐ)
  delayBetweenAccountsSec: number; // Giây nghỉ giữa các acc
  requireFreeship: boolean; // Bắt buộc phải có mã freeship
  autoSelectRandomProduct: boolean; // Random link trong danh sách
  selectLowestPriceVariant: boolean; // Tự động chọn phân loại thấp nhất
  filterVariantByPriceRange?: boolean; // Tự động chọn phân loại có giá tương ứng với khoảng giá đã chọn (không phân biệt vị trí số mấy)
  targetProvince: string; // Tỉnh giao hàng
  paymentMethod: 'COD' | 'ZaloPay' | 'ShopeePay'; // Mặc định COD
  maxOrdersPerRun: number; // Số đơn tối đa mỗi lần chạy
  skipSuspendedAccounts: boolean; // Tự động bỏ qua acc khóa đỏ
}

export interface OrderResult {
  id: string;
  orderCode: string;
  accountId: string;
  accountEmail: string;
  accountTiktokId: string;
  productUrl: string;
  productTitle: string;
  selectedVariantName?: string; // Tên phân loại được chọn
  selectedVariantPosition?: number; // Vị trí số mấy của phân loại trong link sản phẩm (1, 2, 3...)
  productPrice: number;
  shippingFee: number;
  shippingDiscount: number;
  voucherUsed: string;
  carrier?: string; // Đơn vị vận chuyển (e.g. J&T Express, SPX Express, Ninja Van...)
  trackingNumber?: string; // Mã vận đơn
  finalTotal: number;
  status: 'success' | 'skipped_price' | 'skipped_status' | 'failed_login';
  reason: string;
  shippingAddress: string;
  timestamp: string;
}

export interface AutoOrderLog {
  id: string;
  timestamp: string;
  accountTiktokId: string;
  step: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

