import { TikTokAccount, ProductItem, ProductVariant, AutoOrderConfig, OrderResult, AutoOrderLog } from '../types';

// Default initial TikTok Shop products with realistic links & multiple price variations (Phân loại)
export const DEFAULT_TIKTOK_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-user-example',
    url: 'https://vt.tiktok.com/ZSjSampleA/',
    title: 'Phụ Kiện Kẹp Tóc & Dây Buộc Tóc Hot Trend (4 Phân Loại: 3k - 7k - 9k - 100k)',
    price: 3000,
    priceDisplay: '3.000₫ - 100.000₫',
    originalPrice: 120000,
    shopName: 'Tổng Kho Phụ Kiện TikTok Mall',
    shippingFeeEstimate: 20000,
    category: 'Phụ kiện & Thời trang',
    enabled: true,
    variants: [
      { id: 'va-1', name: 'Phân loại 1: Gói 5 Kẹp Càng Cua Mini', price: 7000, priceDisplay: '7.000₫', originalPrice: 15000 },
      { id: 'va-2', name: 'Phân loại 2: Hộp Quà Cao Cấp Set 50 Món', price: 100000, priceDisplay: '100.000₫', originalPrice: 160000 },
      { id: 'va-3', name: 'Phân loại 3: Dây Buộc Tóc Đơn (Vị trí #3 - Chuẩn 3.000₫)', price: 3000, priceDisplay: '3.000₫', originalPrice: 8000 },
      { id: 'va-4', name: 'Phân loại 4: Set 3 Dây Cột Tóc Xinh Hàn Quốc', price: 9000, priceDisplay: '9.000₫', originalPrice: 20000 },
    ],
  },
  {
    id: 'prod-1',
    url: 'https://vt.tiktok.com/ZSjSample1/',
    title: 'Áo Thun Cotton Unisex Oversize Phong Cách Hàn Quốc Form Rộng',
    price: 39000,
    priceDisplay: '39.000₫ - 129.000₫',
    originalPrice: 120000,
    shopName: 'Thời Trang GenZ Official',
    shippingFeeEstimate: 32000,
    category: 'Thời trang nam & nữ',
    enabled: true,
    variants: [
      { id: 'v1-1', name: 'Size S - Màu Trắng Basic (Rẻ nhất)', price: 39000, priceDisplay: '39.000₫', originalPrice: 80000 },
      { id: 'v1-2', name: 'Size M - Màu Đen Form Rộng', price: 69000, priceDisplay: '69.000₫', originalPrice: 120000 },
      { id: 'v1-3', name: 'Size L/XL - Họa Tiết Trend', price: 89000, priceDisplay: '89.000₫', originalPrice: 150000 },
      { id: 'v1-4', name: 'Combo 2 Áo Thun Đôi', price: 129000, priceDisplay: '129.000₫', originalPrice: 200000 },
    ],
  },
  {
    id: 'prod-2',
    url: 'https://vt.tiktok.com/ZSjSample2/',
    title: 'Tai Nghe Bluetooth True Wireless Không Dây Chống Ồn Âm Bass Cực Hay',
    price: 49000,
    priceDisplay: '49.000₫ - 169.000₫',
    originalPrice: 250000,
    shopName: 'Phụ Kiện Công Nghệ Mall',
    shippingFeeEstimate: 28000,
    category: 'Đồ điện tử & Công nghệ',
    enabled: true,
    variants: [
      { id: 'v2-1', name: 'Bản Tiêu Chuẩn - Đơn Âm Mono (Rẻ nhất)', price: 49000, priceDisplay: '49.000₫', originalPrice: 100000 },
      { id: 'v2-2', name: 'Bản Nâng Cấp - Stereo Bass Căng', price: 119000, priceDisplay: '119.000₫', originalPrice: 220000 },
      { id: 'v2-3', name: 'Bản Pro - Chống Ồn Chủ Động ANC', price: 169000, priceDisplay: '169.000₫', originalPrice: 290000 },
    ],
  },
  {
    id: 'prod-3',
    url: 'https://vt.tiktok.com/ZSjSample3/',
    title: 'Bình Giữ Nhiệt Inox 304 Cao Cấp Giữ Nóng Lạnh 24H Có Lưới Lọc Trà',
    price: 39000,
    priceDisplay: '39.000₫ - 99.000₫',
    originalPrice: 150000,
    shopName: 'Gia Dụng Tiện Ích Store',
    shippingFeeEstimate: 35000,
    category: 'Nhà cửa & Đời sống',
    enabled: true,
    variants: [
      { id: 'v3-1', name: 'Dung tích 350ml Mini Cầm Tay (Rẻ nhất)', price: 39000, priceDisplay: '39.000₫', originalPrice: 90000 },
      { id: 'v3-2', name: 'Dung tích 600ml Văn Phòng Tiêu Chuẩn', price: 69000, priceDisplay: '69.000₫', originalPrice: 130000 },
      { id: 'v3-3', name: 'Dung tích 1000ml Cực Đại Du Lịch', price: 99000, priceDisplay: '99.000₫', originalPrice: 180000 },
    ],
  },
  {
    id: 'prod-4',
    url: 'https://vt.tiktok.com/ZSjSample4/',
    title: 'Dép Quai Ngang Unisex Đế Bánh Mì Siêu Êm Chân Chống Trơn Trượt',
    price: 29000,
    priceDisplay: '29.000₫ - 59.000₫',
    originalPrice: 99000,
    shopName: 'Giày Dép Thời Trang Xtra',
    shippingFeeEstimate: 30000,
    category: 'Giày dép',
    enabled: true,
    variants: [
      { id: 'v4-1', name: 'Size 36-37 - Màu Cam/Hồng (Rẻ nhất)', price: 29000, priceDisplay: '29.000₫', originalPrice: 60000 },
      { id: 'v4-2', name: 'Size 38-39 - Màu Đen/Trắng Basic', price: 49000, priceDisplay: '49.000₫', originalPrice: 85000 },
      { id: 'v4-3', name: 'Size 40-44 - Đế Đúc Dày 4.5cm', price: 59000, priceDisplay: '59.000₫', originalPrice: 100000 },
    ],
  },
  {
    id: 'prod-5',
    url: 'https://vt.tiktok.com/ZSjSample5/',
    title: 'Combo Tất Cổ Ngắn Khử Mùi Thoáng Khí Phong Cách Basic',
    price: 15000,
    priceDisplay: '15.000₫ - 65.000₫',
    originalPrice: 70000,
    shopName: 'Phụ Kiện Giá Xưởng',
    shippingFeeEstimate: 25000,
    category: 'Thời trang',
    enabled: true,
    variants: [
      { id: 'v5-1', name: 'Gói Dùng Thử 2 Đôi (Rẻ nhất)', price: 15000, priceDisplay: '15.000₫', originalPrice: 35000 },
      { id: 'v5-2', name: 'Hộp 5 Đôi Basic Trắng/Đen', price: 35000, priceDisplay: '35.000₫', originalPrice: 70000 },
      { id: 'v5-3', name: 'Hộp 10 Đôi Cao Cấp Khử Mùi Nano', price: 65000, priceDisplay: '65.000₫', originalPrice: 120000 },
    ],
  },
];

// Default Auto Order Configuration
export const DEFAULT_AUTO_ORDER_CONFIG: AutoOrderConfig = {
  minProductPrice: 1000, // Giá phân loại tối thiểu: ví dụ 1.000₫ (phù hợp với deal 3k của bạn)
  maxProductPrice: 50000, // Giá phân loại tối đa: ví dụ 50.000₫
  minTotalAmount: 1000, // Căn cứ tổng tiền tối thiểu: 1.000₫
  maxTotalAmount: 95000, // Căn cứ tổng tiền tối đa: 95.000₫ (dao động trong khoảng)
  delayBetweenAccountsSec: 3, // Giây nghỉ giữa các tài khoản
  requireFreeship: true, // Bắt buộc phải có mã freeship để giữ tổng tiền thấp
  autoSelectRandomProduct: true, // Luôn chọn random 1 link sản phẩm trong danh sách
  selectLowestPriceVariant: true, // Tự động chọn phân loại thấp nhất trong khoảng
  filterVariantByPriceRange: true, // TỰ ĐỘNG CHỌN PHÂN LOẠI CÓ MỨC GIÁ NẰM TRONG KHOẢNG GIÁ ĐÃ CHỌN
  targetProvince: 'Quảng Ninh',
  paymentMethod: 'COD',
  maxOrdersPerRun: 100,
  skipSuspendedAccounts: true, // Thoát ngay nếu tài khoản bị khóa
};

// Storage Keys
const PRODUCTS_STORAGE_KEY = 'tiktok_auto_order_products';
const CONFIG_STORAGE_KEY = 'tiktok_auto_order_config';
const ORDERS_STORAGE_KEY = 'tiktok_auto_order_results';

export const loadProductsFromStorage = (): ProductItem[] => {
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) return DEFAULT_TIKTOK_PRODUCTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TIKTOK_PRODUCTS;
  } catch {
    return DEFAULT_TIKTOK_PRODUCTS;
  }
};

export const saveProductsToStorage = (products: ProductItem[]): void => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products:', e);
  }
};

export const loadOrderConfigFromStorage = (): AutoOrderConfig => {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return DEFAULT_AUTO_ORDER_CONFIG;
    return { ...DEFAULT_AUTO_ORDER_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_AUTO_ORDER_CONFIG;
  }
};

export const saveOrderConfigToStorage = (cfg: AutoOrderConfig): void => {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(cfg));
  } catch (e) {
    console.error('Failed to save config:', e);
  }
};

export const loadOrderResultsFromStorage = (): OrderResult[] => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveOrderResultsToStorage = (orders: OrderResult[]): void => {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders:', e);
  }
};

// Parse bulk input product URLs
export const parseBulkProductInput = (text: string): ProductItem[] => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const products: ProductItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Support formats:
    // 1. Just URL: https://vt.tiktok.com/ZSjSample/
    // 2. URL | Price | Title: https://vt.tiktok.com/ZSjSample/ | 89000 | Tên sản phẩm
    // 3. Title - Price - URL: Áo thun - 69000 - https://vt.tiktok.com/...
    let url = '';
    let price = 50000 + Math.floor(Math.random() * 80) * 1000;
    let title = `Sản phẩm TikTok Shop #${i + 1}`;

    if (line.includes('|')) {
      const parts = line.split('|').map(p => p.trim());
      url = parts[0];
      if (parts[1] && !isNaN(Number(parts[1]))) price = Number(parts[1]);
      if (parts[2]) title = parts[2];
    } else if (line.includes(' - ')) {
      const parts = line.split(' - ').map(p => p.trim());
      const urlPart = parts.find(p => p.includes('http'));
      if (urlPart) url = urlPart;
      const pricePart = parts.find(p => !isNaN(Number(p.replace(/[^0-9]/g, ''))));
      if (pricePart) price = Number(pricePart.replace(/[^0-9]/g, ''));
      const titlePart = parts.find(p => !p.includes('http') && p !== pricePart);
      if (titlePart) title = titlePart;
    } else {
      url = line;
      // Derive readable title if URL has slugs
      if (line.includes('tiktok.com')) {
        title = `Sản phẩm TikTok Shop Link #${i + 1}`;
      }
    }

    if (!url.startsWith('http')) {
      url = `https://${url}`;
    }

    // Generate realistic multi-price variants for imported products
    const baseLowestPrice = price;
    const variants: ProductVariant[] = [
      {
        id: `var-${Date.now()}-1`,
        name: 'Phân loại 1: Bản Tiêu Chuẩn / Size Nhỏ (Thấp nhất)',
        price: baseLowestPrice,
        priceDisplay: `${baseLowestPrice.toLocaleString('vi-VN')}₫`,
        originalPrice: Math.round(baseLowestPrice * 1.5 / 1000) * 1000,
      },
      {
        id: `var-${Date.now()}-2`,
        name: 'Phân loại 2: Bản Nâng Cấp / Size Vừa',
        price: Math.round((baseLowestPrice * 1.4) / 1000) * 1000,
        priceDisplay: `${Math.round((baseLowestPrice * 1.4) / 1000) * 1000}₫`,
        originalPrice: Math.round(baseLowestPrice * 1.8 / 1000) * 1000,
      },
      {
        id: `var-${Date.now()}-3`,
        name: 'Phân loại 3: Bản Cao Cấp / Combo Đầy Đủ',
        price: Math.round((baseLowestPrice * 1.9) / 1000) * 1000,
        priceDisplay: `${Math.round((baseLowestPrice * 1.9) / 1000) * 1000}₫`,
        originalPrice: Math.round(baseLowestPrice * 2.3 / 1000) * 1000,
      },
    ];

    products.push({
      id: `prod-imported-${Date.now()}-${i}`,
      url,
      title,
      price: baseLowestPrice,
      priceDisplay: `${baseLowestPrice.toLocaleString('vi-VN')}₫ - ${variants[2].price.toLocaleString('vi-VN')}₫`,
      originalPrice: Math.round(baseLowestPrice * 1.5 / 1000) * 1000,
      shopName: 'TikTok Shop Mall',
      shippingFeeEstimate: 28000 + Math.floor(Math.random() * 15) * 1000,
      variants,
      enabled: true,
    });
  }

  return products;
};

// Requirement 1: Select a random product link from the list
export const pickRandomProduct = (products: ProductItem[]): ProductItem | null => {
  const enabledProducts = products.filter(p => p.enabled);
  if (enabledProducts.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * enabledProducts.length);
  return enabledProducts[randomIndex];
};

// TikTok Shop Shipping Carriers in Vietnam
export const TIKTOK_SHOP_CARRIERS = [
  'J&T Express',
  'SPX Express',
  'Ninja Van',
  'Viettel Post',
  'GHTK (Tiết Kiệm)',
];

// Requirement 2 & 3: Evaluate order based on product price, total amount range, lowest variant, and auto logout
export const processAccountOrder = async (
  account: TikTokAccount,
  product: ProductItem,
  config: AutoOrderConfig,
  onLogStep?: (step: string, type: 'info' | 'success' | 'warning' | 'error', message: string) => void,
  assignedVoucher?: any,
  orderIndex?: number,
  totalOrdersForAccount?: number
): Promise<OrderResult> => {
  const log = (step: string, type: 'info' | 'success' | 'warning' | 'error', message: string) => {
    if (onLogStep) onLogStep(step, type, message);
  };

  const orderPrefix = totalOrdersForAccount && totalOrdersForAccount > 1 
    ? `[Đơn #${(orderIndex || 0) + 1}/${totalOrdersForAccount}] ` 
    : '';

  // Step 1: Login Account
  if (!orderIndex || orderIndex === 0) {
    log('Đăng nhập', 'info', `Bắt đầu phiên đăng nhập: ${account.tiktokId} (${account.email})...`);
    await new Promise(r => setTimeout(r, 600));
  }

  // Requirement 3: Check account status; logout immediately if suspended/checkpoint
  if (account.status === 'suspended') {
    log('Đăng xuất', 'error', `Tài khoản ${account.tiktokId} đang bị ĐÌNH CHỈ / KHÓA ĐỎ. Tự động đăng xuất và chuyển tài khoản kế tiếp!`);
    return {
      id: `order-failed-${Date.now()}`,
      orderCode: 'N/A',
      accountId: account.id,
      accountEmail: account.email,
      accountTiktokId: account.tiktokId,
      productUrl: product.url,
      productTitle: product.title,
      selectedVariantName: 'Không xác định',
      productPrice: product.price,
      shippingFee: 0,
      shippingDiscount: 0,
      voucherUsed: 'Không thể áp dụng (Acc bị khóa)',
      finalTotal: 0,
      status: 'skipped_status',
      reason: 'Tài khoản bị đình chỉ / khóa đỏ. Hệ thống tự động thoát tài khoản để bảo toàn quy trình.',
      shippingAddress: account.shippingAddress?.fullAddress || 'Chưa thiết lập',
      timestamp: new Date().toISOString(),
    };
  }

  log('Đăng nhập', 'success', `Đăng nhập thành công tài khoản: ${account.tiktokId} (Trạng thái: Sống - Xanh)`);

  // Step 2: Random product chosen (Requirement 1)
  log('Chọn sản phẩm', 'info', `Đã chọn ngẫu nhiên link sản phẩm: "${product.title}" (${product.priceDisplay})`);
  await new Promise(r => setTimeout(r, 450));

  // Step 3: Select Product Variation (Phân loại / SKU) matching the selected price range
  let effectiveProductPrice = product.price;
  let selectedVariantName = 'Bản Tiêu Chuẩn';
  let selectedVariantPosition: number | undefined = undefined;

  if (product.variants && product.variants.length > 0) {
    // Map with 1-based index (không phân biệt phân loại nằm ở vị trí số mấy trong link sản phẩm)
    const variantsWithPos = product.variants.map((v, idx) => ({ ...v, position: idx + 1 }));
    const allVariantsSummary = variantsWithPos
      .map(v => `#${v.position} (${v.name}: ${v.price.toLocaleString('vi-VN')}₫)`)
      .join(' | ');

    log(
      'Quét phân loại',
      'info',
      `Sản phẩm có ${product.variants.length} phân loại: [${allVariantsSummary}]. Khoảng giá phân loại yêu cầu: ${config.minProductPrice.toLocaleString('vi-VN')}₫ - ${config.maxProductPrice.toLocaleString('vi-VN')}₫.`
    );

    // Filter all variants whose price falls within [config.minProductPrice, config.maxProductPrice]
    const matchingVariants = variantsWithPos.filter(
      v => v.price >= config.minProductPrice && v.price <= config.maxProductPrice
    );

    if (matchingVariants.length > 0) {
      // Pick the best matching variant within the configured range (lowest price among matching ones)
      const chosenVariant = [...matchingVariants].sort((a, b) => a.price - b.price)[0];
      effectiveProductPrice = chosenVariant.price;
      selectedVariantPosition = chosenVariant.position;
      selectedVariantName = `${chosenVariant.name} (${chosenVariant.price.toLocaleString('vi-VN')}₫ - Vị trí #${chosenVariant.position})`;

      const nonMatchingCount = product.variants.length - matchingVariants.length;
      log(
        'Chọn phân loại',
        'success',
        `🎯 ĐÃ CHỌN PHÂN LOẠI PHÙ HỢP KHOẢNG GIÁ [${config.minProductPrice.toLocaleString('vi-VN')}₫ - ${config.maxProductPrice.toLocaleString('vi-VN')}₫]: "${chosenVariant.name}" (${chosenVariant.price.toLocaleString('vi-VN')}₫) tại VỊ TRÍ #${chosenVariant.position} trong link sản phẩm! (Bỏ qua ${nonMatchingCount} phân loại ngoài khoảng giá yêu cầu).`
      );
    } else {
      // NO variation matches the required price interval!
      const pricesOnly = variantsWithPos.map(v => `${v.price.toLocaleString('vi-VN')}₫ (vị trí #${v.position})`).join(', ');
      log(
        'Bỏ qua phân loại',
        'warning',
        `❌ KHÔNG CÓ PHÂN LOẠI NÀO CỦA LINK NẰM TRONG KHOẢNG GIÁ [${config.minProductPrice.toLocaleString('vi-VN')}₫ - ${config.maxProductPrice.toLocaleString('vi-VN')}₫]! Các mức giá phân loại hiện có: [${pricesOnly}].`
      );
      log(
        'Đăng xuất',
        'warning',
        `Không đáp ứng được yêu cầu về khoảng giá phân loại ➔ Tự động thoát tài khoản ${account.tiktokId} để chuyển tiếp!`
      );

      return {
        id: `order-skipped-variant-${Date.now()}`,
        orderCode: 'SKIPPED',
        accountId: account.id,
        accountEmail: account.email,
        accountTiktokId: account.tiktokId,
        productUrl: product.url,
        productTitle: product.title,
        selectedVariantName: 'Không có phân loại hợp lệ',
        selectedVariantPosition: undefined,
        productPrice: product.price,
        shippingFee: 0,
        shippingDiscount: 0,
        voucherUsed: 'Không áp dụng',
        finalTotal: 0,
        status: 'skipped_price',
        reason: `Link có ${product.variants.length} phân loại [${pricesOnly}] nhưng không có phân loại nào nằm trong khoảng giá yêu cầu [${config.minProductPrice.toLocaleString('vi-VN')}₫ - ${config.maxProductPrice.toLocaleString('vi-VN')}₫]. Hệ thống tự động thoát tài khoản.`,
        shippingAddress: account.shippingAddress?.fullAddress || 'Chưa thiết lập',
        timestamp: new Date().toISOString(),
      };
    }
  } else {
    // Single-price product without variants
    if (product.price < config.minProductPrice || product.price > config.maxProductPrice) {
      log(
        'Bỏ qua sản phẩm',
        'warning',
        `Giá sản phẩm ${product.price.toLocaleString('vi-VN')}₫ không nằm trong khoảng giá yêu cầu [${config.minProductPrice.toLocaleString('vi-VN')}₫ - ${config.maxProductPrice.toLocaleString('vi-VN')}₫] ➔ Tự động thoát tài khoản!`
      );
      return {
        id: `order-skipped-single-price-${Date.now()}`,
        orderCode: 'SKIPPED',
        accountId: account.id,
        accountEmail: account.email,
        accountTiktokId: account.tiktokId,
        productUrl: product.url,
        productTitle: product.title,
        selectedVariantName: 'Sản phẩm đơn giá',
        selectedVariantPosition: 1,
        productPrice: product.price,
        shippingFee: 0,
        shippingDiscount: 0,
        voucherUsed: 'Không áp dụng',
        finalTotal: 0,
        status: 'skipped_price',
        reason: `Giá sản phẩm ${product.price.toLocaleString('vi-VN')}₫ không nằm trong khoảng giá [${config.minProductPrice.toLocaleString('vi-VN')}₫ - ${config.maxProductPrice.toLocaleString('vi-VN')}₫]. Đã tự động thoát tài khoản.`,
        shippingAddress: account.shippingAddress?.fullAddress || 'Chưa thiết lập',
        timestamp: new Date().toISOString(),
      };
    }
    log('Chọn phân loại', 'info', `Sản phẩm đơn giá phù hợp khoảng: ${product.priceDisplay}`);
  }

  await new Promise(r => setTimeout(r, 450));

  // Step 4: Check shipping address
  const fullAddress = account.shippingAddress?.fullAddress || 'Địa chỉ mặc định TikTok Shop';
  log('Địa chỉ giao hàng', 'info', `Điểm nhận hàng: ${fullAddress}`);

  // Step 5: Evaluate shipping vouchers
  const baseShippingFee = product.shippingFeeEstimate || 30000;
  let shippingDiscount = 0;
  let voucherUsed = 'Không có mã freeship';

  if (assignedVoucher) {
    // Specifically use the voucher for this multi-order slot
    if (assignedVoucher.type === 'freeship_100' || assignedVoucher.type === 'new_buyer') {
      shippingDiscount = baseShippingFee; // 100% Freeship
    } else if (assignedVoucher.type === 'discount_70k') {
      shippingDiscount = Math.min(baseShippingFee, 70000);
    } else if (assignedVoucher.type === 'freeship_xtra' || assignedVoucher.type === 'discount_50k') {
      shippingDiscount = Math.min(baseShippingFee, 50000);
    } else {
      shippingDiscount = Math.min(baseShippingFee, assignedVoucher.discountValue || 25000);
    }
    voucherUsed = `${assignedVoucher.title} (${assignedVoucher.discountDisplay})`;
  } else if (account.vouchers && account.vouchers.length > 0) {
    // Check for best shipping voucher
    const freeship100 = account.vouchers.find(v => v.type === 'freeship_100' || v.type === 'new_buyer');
    const freeshipXtra = account.vouchers.find(v => v.type === 'freeship_xtra' || v.type === 'discount_50k');
    const freeship70 = account.vouchers.find(v => v.type === 'discount_70k');

    if (freeship100) {
      shippingDiscount = baseShippingFee; // 100% Freeship
      voucherUsed = freeship100.title;
    } else if (freeship70) {
      shippingDiscount = Math.min(baseShippingFee, 70000);
      voucherUsed = freeship70.title;
    } else if (freeshipXtra) {
      shippingDiscount = Math.min(baseShippingFee, 50000);
      voucherUsed = freeshipXtra.title;
    } else {
      shippingDiscount = Math.min(baseShippingFee, account.vouchers[0].discountValue);
      voucherUsed = account.vouchers[0].title;
    }
  }

  // Assign realistic Shipping Carrier & Tracking Number for TikTok Shop
  const carrier = assignedVoucher?.applicableProvince && assignedVoucher.isFreeForProvince
    ? 'J&T Express (Tuyến Tỉnh)'
    : TIKTOK_SHOP_CARRIERS[(orderIndex || 0) % TIKTOK_SHOP_CARRIERS.length];
  const carrierPrefix = carrier.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, 'JT');
  const trackingNumber = `${carrierPrefix}${Math.floor(100000000 + Math.random() * 900000000)}VN`;

  const finalShippingFee = Math.max(0, baseShippingFee - shippingDiscount);
  log(
    'Áp mã giảm giá',
    'info',
    `${orderPrefix}Phí ship ban đầu: ${baseShippingFee.toLocaleString('vi-VN')}₫ -> Giảm: ${shippingDiscount.toLocaleString('vi-VN')}₫ (Mã: ${voucherUsed}) -> Cước ship còn: ${finalShippingFee.toLocaleString('vi-VN')}₫ | ĐVVC: ${carrier}`
  );

  // Step 6: Requirement 2 - Calculate Total Amount using Lowest Price Variant & Compare Bounds
  const finalTotal = effectiveProductPrice + finalShippingFee;

  log(
    'Tính tổng tiền',
    'info',
    `${orderPrefix}Tổng tiền thanh toán cuối cùng: ${finalTotal.toLocaleString('vi-VN')}₫ [Giá phân loại: ${effectiveProductPrice.toLocaleString('vi-VN')}₫ + Ship: ${finalShippingFee.toLocaleString('vi-VN')}₫] (Khoảng cài đặt: ${config.minTotalAmount.toLocaleString('vi-VN')}₫ - ${config.maxTotalAmount.toLocaleString('vi-VN')}₫)`
  );
  await new Promise(r => setTimeout(r, 600));

  // Case A: Total exceeds max bound (too expensive, often because no freeship voucher applied)
  if (finalTotal > config.maxTotalAmount) {
    log('Đăng xuất', 'warning', `${orderPrefix}Tổng tiền ${finalTotal.toLocaleString('vi-VN')}₫ VƯỢT QUÁ mức tối đa ${config.maxTotalAmount.toLocaleString('vi-VN')}₫. Không đáp ứng yêu cầu!`);
    return {
      id: `order-skipped-max-${Date.now()}-${Math.random()}`,
      orderCode: 'SKIPPED',
      accountId: account.id,
      accountEmail: account.email,
      accountTiktokId: account.tiktokId,
      productUrl: product.url,
      productTitle: product.title,
      selectedVariantName,
      selectedVariantPosition,
      productPrice: effectiveProductPrice,
      shippingFee: baseShippingFee,
      shippingDiscount,
      voucherUsed,
      carrier,
      trackingNumber,
      finalTotal,
      status: 'skipped_price',
      reason: `Tổng tiền ${finalTotal.toLocaleString('vi-VN')}₫ cao hơn mức trần cho phép (${config.maxTotalAmount.toLocaleString('vi-VN')}₫).`,
      shippingAddress: fullAddress,
      timestamp: new Date().toISOString(),
    };
  }

  // Case B: Total is below min bound (abnormally low or wrong product configuration)
  if (finalTotal < config.minTotalAmount) {
    log('Đăng xuất', 'warning', `${orderPrefix}Tổng tiền ${finalTotal.toLocaleString('vi-VN')}₫ THẤP HƠN mức tối thiểu ${config.minTotalAmount.toLocaleString('vi-VN')}₫. Không đáp ứng yêu cầu!`);
    return {
      id: `order-skipped-min-${Date.now()}-${Math.random()}`,
      orderCode: 'SKIPPED',
      accountId: account.id,
      accountEmail: account.email,
      accountTiktokId: account.tiktokId,
      productUrl: product.url,
      productTitle: product.title,
      selectedVariantName,
      selectedVariantPosition,
      productPrice: effectiveProductPrice,
      shippingFee: baseShippingFee,
      shippingDiscount,
      voucherUsed,
      carrier,
      trackingNumber,
      finalTotal,
      status: 'skipped_price',
      reason: `Tổng tiền ${finalTotal.toLocaleString('vi-VN')}₫ thấp hơn mức sàn yêu cầu (${config.minTotalAmount.toLocaleString('vi-VN')}₫).`,
      shippingAddress: fullAddress,
      timestamp: new Date().toISOString(),
    };
  }

  // Case C: Matches requirement: Place order successfully!
  const orderCode = `TTS-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  log(
    'Chốt đơn',
    'success',
    `${orderPrefix}THÀNH CÔNG! Mã đơn: ${orderCode} [ĐVVC: ${carrier} - Mã vận đơn: ${trackingNumber}]. Phân loại: "${selectedVariantName}". Tổng thanh toán: ${finalTotal.toLocaleString('vi-VN')}₫.`
  );
  await new Promise(r => setTimeout(r, 500));

  return {
    id: `order-success-${Date.now()}-${Math.random()}`,
    orderCode,
    accountId: account.id,
    accountEmail: account.email,
    accountTiktokId: account.tiktokId,
    productUrl: product.url,
    productTitle: product.title,
    selectedVariantName,
    selectedVariantPosition,
    productPrice: effectiveProductPrice,
    shippingFee: baseShippingFee,
    shippingDiscount,
    voucherUsed,
    carrier,
    trackingNumber,
    finalTotal,
    status: 'success',
    reason: `Phân loại phù hợp khoảng giá: "${selectedVariantName}". Áp mã: ${voucherUsed}. ĐVVC: ${carrier}. Tổng tiền ${finalTotal.toLocaleString('vi-VN')}₫ hợp lệ. Đặt thành công!`,
    shippingAddress: fullAddress,
    timestamp: new Date().toISOString(),
  };
};

// Export Orders to CSV (UTF-8 BOM for Excel)
export const exportOrdersToCSV = (orders: OrderResult[]): void => {
  let csv = '\uFEFF';
  csv += '"Mã Đơn Hàng","Đơn Vị Vận Chuyển","Mã Vận Đơn","TikTok ID","Email","Trạng Thái","Phân Loại Đã Chọn","Tổng Tiền (VNĐ)","Giá Phân Loại","Mã Vận Chuyển","Sản Phẩm","Link TikTok Shop","Địa Chỉ Nhận Hàng","Lý Do / Chi Tiết","Thời Gian"\n';

  orders.forEach(o => {
    const statusText = o.status === 'success' 
      ? 'ĐẶT THÀNH CÔNG' 
      : o.status === 'skipped_price' 
      ? 'BỎ QUA DO GIÁ TIỀN' 
      : 'BỎ QUA DO TÀI KHOẢN KHÓA';

    csv += `"${o.orderCode}","${o.carrier || 'J&T Express'}","${o.trackingNumber || 'N/A'}","${o.accountTiktokId}","${o.accountEmail}","${statusText}","${(o.selectedVariantName || 'Mặc định').replace(/"/g, '""')}","${o.finalTotal}","${o.productPrice}","${o.voucherUsed}","${o.productTitle.replace(/"/g, '""')}","${o.productUrl}","${o.shippingAddress.replace(/"/g, '""')}","${o.reason.replace(/"/g, '""')}","${o.timestamp}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Don_Hang_TikTok_Shop_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// Export Orders to full TXT report
export const exportOrdersToTXT = (orders: OrderResult[]): void => {
  let txt = `DANH SÁCH ĐƠN HÀNG TỰ ĐỘNG TIKTOK SHOP - XUẤT NGÀY ${new Date().toLocaleString('vi-VN')}\n`;
  txt += '========================================================================================\n\n';

  orders.forEach((o, i) => {
    txt += `[${i + 1}] Mã đơn: ${o.orderCode} | ĐVVC: ${o.carrier || 'J&T Express'} | Mã vận đơn: ${o.trackingNumber || 'N/A'} | Trạng thái: ${o.status.toUpperCase()}\n`;
    txt += `   Tài khoản: ${o.accountTiktokId} (${o.accountEmail})\n`;
    txt += `   Sản phẩm: ${o.productTitle}\n`;
    txt += `   Phân loại chọn: ${o.selectedVariantName || 'Bản Tiêu Chuẩn'}\n`;
    txt += `   Link SP: ${o.productUrl}\n`;
    txt += `   Tổng tiền thanh toán: ${o.finalTotal.toLocaleString('vi-VN')}₫ (Giá phân loại: ${o.productPrice.toLocaleString('vi-VN')}₫ | Mã ship: ${o.voucherUsed})\n`;
    txt += `   Địa chỉ giao hàng: ${o.shippingAddress}\n`;
    txt += `   Kết quả: ${o.reason}\n`;
    txt += '----------------------------------------------------------------------------------------\n';
  });

  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Don_Hang_TikTok_Shop_${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// Export pure list of Order Codes (Mã đơn hàng + ĐVVC) to file TXT
export const exportOrderCodesOnlyToFile = (orders: OrderResult[], onlySuccess = true): void => {
  const targetOrders = onlySuccess ? orders.filter(o => o.status === 'success') : orders;
  if (targetOrders.length === 0) return;

  let content = `# DANH SÁCH MÃ ĐƠN HÀNG TIKTOK SHOP (${targetOrders.length} ĐƠN)\n`;
  content += `# Thời gian xuất: ${new Date().toLocaleString('vi-VN')}\n`;
  content += `# Cấu trúc: [MÃ ĐƠN HÀNG] | [ĐƠN VỊ VẬN CHUYỂN] | [MÃ VẬN ĐƠN] | [TÀI KHOẢN] | [TỔNG TIỀN]\n`;
  content += '------------------------------------------------------------------------------------\n';

  targetOrders.forEach(o => {
    content += `${o.orderCode} | ${o.carrier || 'J&T Express'} | ${o.trackingNumber || 'N/A'} | ${o.accountTiktokId} | ${o.finalTotal.toLocaleString('vi-VN')}₫\n`;
  });

  content += '------------------------------------------------------------------------------------\n';
  content += '# DANH SÁCH CHỈ MÃ ĐƠN (DỄ DÀNG SAO CHÉP / TRA CỨU HÀNG LOẠT):\n';
  targetOrders.forEach(o => {
    content += `${o.orderCode}\n`;
  });

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Ma_Don_Hang_TikTokShop_${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// Helper to format order codes for clipboard
export const formatOrderCodesForClipboard = (orders: OrderResult[], format: 'codes_only' | 'detailed' = 'codes_only'): string => {
  const successOrders = orders.filter(o => o.status === 'success');
  if (successOrders.length === 0) return '';

  if (format === 'codes_only') {
    return successOrders.map(o => o.orderCode).join('\n');
  }

  return successOrders
    .map(o => `${o.orderCode} | ${o.carrier || 'J&T Express'} | ${o.accountTiktokId} | ${o.finalTotal.toLocaleString('vi-VN')}₫ | ${o.productTitle}`)
    .join('\n');
};

