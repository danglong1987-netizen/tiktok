import { ShippingAddress } from '../types';

// Top common Vietnamese family names and given names
const VIETNAMESE_LAST_NAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
const VIETNAMESE_MIDDLE_NAMES = ['Văn', 'Thị', 'Đức', 'Hoàng', 'Ngọc', 'Minh', 'Quang', 'Hải', 'Phương', 'Thu', 'Thành', 'Thanh', 'Khánh', 'Anh'];
const VIETNAMESE_FIRST_NAMES = ['An', 'Bình', 'Cường', 'Dũng', 'Giang', 'Hà', 'Hải', 'Huy', 'Khoa', 'Linh', 'Long', 'Mai', 'Nam', 'Nhi', 'Phong', 'Quân', 'Sơn', 'Tâm', 'Thắng', 'Trang', 'Tuấn', 'Tùng', 'Việt', 'Vy', 'Yến'];

// Vietnamese mobile carrier prefixes
const PHONE_PREFIXES = ['098', '097', '096', '086', '038', '039', '037', '036', '035', '034', '033', '032', '090', '093', '089', '070', '079', '077', '076', '078', '091', '094', '088', '083', '084', '085', '081', '082', '092', '056', '058'];

// Top provinces and typical wards in Vietnam (including user example Quảng Ninh - Xã Kỳ Thượng)
export interface ProvinceData {
  name: string;
  wards: string[];
}

export const VIETNAMESE_PROVINCES: ProvinceData[] = [
  {
    name: 'Quảng Ninh',
    wards: [
      'Xã Kỳ Thượng',
      'Phường Bãi Cháy',
      'Phường Hồng Gai',
      'Phường Cao Xanh',
      'Phường Tuần Châu',
      'Phường Cẩm Phả',
      'Xã Đồng Lâm',
      'Xã Sơn Dương',
      'Phường Mạo Khê',
      'Xã Quảng La',
    ],
  },
  {
    name: 'Hà Nội',
    wards: [
      'Phường Dịch Vọng Hậu',
      'Phường Kim Mã',
      'Phường Hàng Bạc',
      'Phường Láng Hạ',
      'Phường Khương Trung',
      'Phường Mễ Trì',
      'Xã Tiên Dương',
      'Xã Đông Hội',
      'Phường Mai Dịch',
      'Phường Cầu Giấy',
    ],
  },
  {
    name: 'TP. Hồ Chí Minh',
    wards: [
      'Phường Bến Nghé',
      'Phường Thảo Điền',
      'Phường 25',
      'Phường Tân Phong',
      'Phường Hiệp Bình Chánh',
      'Phường Đa Kao',
      'Phường Bến Thành',
      'Xã Bình Hưng',
      'Phường Phú Nhuận',
      'Phường Linh Trung',
    ],
  },
  {
    name: 'Đà Nẵng',
    wards: [
      'Phường Thạch Thang',
      'Phường Hải Châu 1',
      'Phường An Hải Bắc',
      'Phường Khuê Trung',
      'Phường Hòa Khánh Bắc',
      'Phường Phước Mỹ',
    ],
  },
  {
    name: 'Hải Phòng',
    wards: [
      'Phường Hoàng Văn Thụ',
      'Phường Lạc Viên',
      'Phường Đằng Hải',
      'Xã Thủy Đường',
      'Phường Quán Toan',
    ],
  },
  {
    name: 'Bắc Ninh',
    wards: [
      'Phường Suối Hoa',
      'Phường Ninh Xá',
      'Phường Võ Cường',
      'Xã Yên Trung',
      'Phường Trang Hạ',
    ],
  },
  {
    name: 'Bình Dương',
    wards: [
      'Phường Phú Cường',
      'Phường Dĩ An',
      'Phường Thuận Giao',
      'Phường Hiệp Thành',
      'Phường Lái Thiêu',
    ],
  },
  {
    name: 'Đồng Nai',
    wards: [
      'Phường Quyết Thắng',
      'Phường Trảng Dài',
      'Phường Long Bình',
      'Phường Tân Tiến',
      'Xã Hóa An',
    ],
  },
  {
    name: 'Thái Nguyên',
    wards: [
      'Phường Phan Đình Phùng',
      'Phường Hoàng Văn Thụ',
      'Phường Tân Lập',
      'Xã Quyết Thắng',
    ],
  },
  {
    name: 'Cần Thơ',
    wards: [
      'Phường Ninh Kiều',
      'Phường An Khánh',
      'Phường Cái Khế',
      'Phường Hưng Lợi',
    ],
  },
  {
    name: 'Hải Dương',
    wards: [
      'Phường Trần Phú',
      'Phường Lê Thanh Nghị',
      'Phường Cẩm Thượng',
      'Xã Lai Vu',
    ],
  },
  {
    name: 'Thanh Hóa',
    wards: [
      'Phường Điện Biên',
      'Phường Ba Đình',
      'Phường Đông Hương',
      'Xã Quảng Hùng',
    ],
  },
  {
    name: 'Nghệ An',
    wards: [
      'Phường Hưng Dũng',
      'Phường Quang Trung',
      'Phường Lê Lợi',
      'Xã Nghi Kim',
    ],
  },
];

// Rich list of random streets for dynamic generation
export const DEFAULT_STREET_OPTIONS = [
  'đường 6',
  'đường 2',
  'đường 1',
  'đường 3',
  'đường 4',
  'đường 5',
  'đường 7',
  'đường 8',
  'đường 9',
  'đường 10',
  'đường 12',
  'đường số 1',
  'đường số 2',
  'đường số 3',
  'đường số 4',
  'đường số 6',
  'đường số 8',
  'đường Lê Lợi',
  'đường Trần Hưng Đạo',
  'đường Quang Trung',
  'đường Nguyễn Trãi',
  'đường Hai Bà Trưng',
  'đường Giải Phóng',
  'đường Lý Thường Kiệt',
  'đường Hoàng Hoa Thám',
];

const LOCALITY_NAMES = [
  'đồng lá hòa bình',
  'khu phố 1',
  'khu phố 2',
  'khu phố 3',
  'thôn 1',
  'thôn 2',
  'thôn 3',
  'xóm giữa',
  'xóm bến',
  'tổ 2 khu 4',
  'tổ 5 khu 1',
  'ấp bình hòa',
  'ấp tân lập',
  'khu đô thị mới',
  'ngõ 15',
  'ngõ 88',
  'ngách 24/6',
];

/**
 * Generate a random Vietnamese full name.
 * If suffix is passed (e.g. "999"), returns "Nguyễn Văn An 999"
 */
export function generateRandomVietnameseName(suffix?: string): string {
  const last = VIETNAMESE_LAST_NAMES[Math.floor(Math.random() * VIETNAMESE_LAST_NAMES.length)];
  const mid = VIETNAMESE_MIDDLE_NAMES[Math.floor(Math.random() * VIETNAMESE_MIDDLE_NAMES.length)];
  const first = VIETNAMESE_FIRST_NAMES[Math.floor(Math.random() * VIETNAMESE_FIRST_NAMES.length)];
  const baseName = `${last} ${mid} ${first}`;

  if (suffix && suffix.trim().length > 0) {
    return `${baseName} ${suffix.trim()}`;
  }
  return baseName;
}

/**
 * Generate a random Vietnamese 10-digit mobile phone number
 */
export function generateRandomPhoneNumber(): string {
  const prefix = PHONE_PREFIXES[Math.floor(Math.random() * PHONE_PREFIXES.length)];
  const suffix = Math.floor(1000000 + Math.random() * 9000000).toString();
  return `${prefix}${suffix}`;
}

/**
 * Generates random house number + random street name, with FIXED locality/landmark
 * Example: "số nhà 22 đường 6, đồng lá hòa bình"
 * (số nhà và đường là ngẫu nhiên, khu vực đồng lá hòa bình là cố định)
 */
export function generateRandomHouseAndStreet(
  fixedLocality: string = 'đồng lá hòa bình', 
  customStreetPool?: string[]
): string {
  const houseNumber = Math.floor(1 + Math.random() * 250);
  const pool = (customStreetPool && customStreetPool.length > 0) ? customStreetPool : DEFAULT_STREET_OPTIONS;
  const randomStreet = pool[Math.floor(Math.random() * pool.length)];
  const locality = fixedLocality.trim() || 'đồng lá hòa bình';

  return `số nhà ${houseNumber} ${randomStreet}, ${locality}`;
}

/**
 * Generate a completely random detailed address (số nhà, đường & khu vực đều ngẫu nhiên)
 */
export function generateRandomDetailedAddress(landmarkSuffix?: string): string {
  const houseNumber = Math.floor(1 + Math.random() * 250);
  const street = DEFAULT_STREET_OPTIONS[Math.floor(Math.random() * DEFAULT_STREET_OPTIONS.length)];
  const locality = landmarkSuffix && landmarkSuffix.trim().length > 0 
    ? landmarkSuffix.trim() 
    : LOCALITY_NAMES[Math.floor(Math.random() * LOCALITY_NAMES.length)];

  return `số nhà ${houseNumber} ${street}, ${locality}`;
}

/**
 * Creates a complete shipping address following the user's exact 3-step sequence:
 * 1. Tỉnh
 * 2. Phường (Xã)
 * 3. Chi tiết địa chỉ (có lựa chọn random như số nhà ... đường)
 * Ví dụ: "số nhà 22 đường 6, đồng lá hòa bình, xã kỳ thượng, quảng ninh"
 */
export function buildFullAddress(
  name: string,
  phone: string,
  province: string,
  ward: string,
  detailedAddress: string
): ShippingAddress {
  const parts = [
    detailedAddress.trim(),
    ward.trim(),
    province.trim(),
  ].filter(p => p.length > 0);

  const fullAddress = parts.join(', ');

  return {
    recipientName: name.trim(),
    phoneNumber: phone.trim(),
    province: province.trim(),
    ward: ward.trim(),
    detailedAddress: detailedAddress.trim(),
    fullAddress,
    updatedAt: new Date().toISOString(),
  };
}
