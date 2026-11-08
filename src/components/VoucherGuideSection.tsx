import React from 'react';
import { Ticket, ShieldAlert, Sparkles, CheckCircle2, Truck, Check, MapPin, Compass } from 'lucide-react';

export const VoucherGuideSection: React.FC = () => {
  return (
    <div id="voucher-types-info" className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
      
      {/* Question Answer Box: Chỉ cung cấp Email hoặc ID (Không có mật khẩu) */}
      <div className="p-4 sm:p-5 rounded-2xl border border-sky-300 dark:border-sky-800 bg-sky-50/70 dark:bg-sky-950/30 text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-sky-500 text-white shrink-0 shadow-sm shadow-sky-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-3 flex-1">
            <div>
              <h3 className="text-sm font-bold text-sky-950 dark:text-sky-200">
                Giải đáp: Nếu không cung cấp mật khẩu, chỉ có Email hoặc TikTok ID thì kiểm tra được không?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Hệ thống hỗ trợ <strong>cả 2 chế độ</strong>: Quét công khai bằng TikTok ID / Email (không cần mật khẩu) và Quét đăng nhập xác thực sâu (có mật khẩu).
              </p>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-xl border border-sky-200 dark:border-sky-900 bg-white/90 dark:bg-slate-900/90 shadow-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-sky-100/60 dark:bg-sky-950/70 border-b border-sky-200 dark:border-sky-900 text-slate-700 dark:text-slate-300 font-bold">
                    <th className="px-3.5 py-2.5">Tính năng kiểm tra</th>
                    <th className="px-3.5 py-2.5 text-center text-emerald-700 dark:text-emerald-400">
                      Chỉ có TikTok ID / Email (Không cần mật khẩu)
                    </th>
                    <th className="px-3.5 py-2.5 text-center text-rose-700 dark:text-rose-400">
                      Có Mật khẩu hoặc Cookie
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="px-3.5 py-2.5 font-medium text-slate-900 dark:text-white">
                      1. Kiểm tra tài khoản Sống hay Bị Đình Chỉ (Đỏ / Xanh)
                    </td>
                    <td className="px-3.5 py-2.5 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      <div className="inline-flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>HOÀN TOÀN ĐƯỢC (100%)</span>
                      </div>
                      <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                        TikTok công khai trạng thái trang cá nhân (Live vs Banned)
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      <div className="inline-flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>HOÀN TOÀN ĐƯỢC</span>
                      </div>
                      <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                        Kiểm tra cả trạng thái phiên đăng nhập
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-3.5 py-2.5 font-medium text-slate-900 dark:text-white">
                      2. Kiểm tra mã vận chuyển TikTok Shop khả dụng
                    </td>
                    <td className="px-3.5 py-2.5 text-center text-amber-600 dark:text-amber-400">
                      <div className="font-semibold">Quét mã Freeship sàn & chiến dịch</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        (Mã freeship toàn sàn, voucher sự kiện mà tài khoản sống đủ điều kiện nhận)
                      </div>
                    </td>
                    <td className="px-3.5 py-2.5 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      <div className="inline-flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>Quét toàn bộ ví cá nhân</span>
                      </div>
                      <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                        Xem chi tiết từng voucher lưu riêng trong mục "Phiếu giảm giá của tôi"
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              💡 <strong>Mẹo:</strong> Để kiểm tra hàng loạt tài khoản còn sống hay đã bị khóa nhanh nhất, bạn chỉ cần dán danh sách <code>@username</code> hoặc <code>email</code> mà không cần nhập mật khẩu.
            </p>
          </div>
        </div>
      </div>

      {/* 2 Voucher Check Modes Card */}
      <div className="p-4 sm:p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0 shadow-sm shadow-rose-500/20">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Chi tiết 2 lựa chọn kiểm tra mã vận chuyển TikTok Shop
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs">
              Hệ thống đã tách riêng 2 chế độ kiểm tra độc lập để tối ưu việc săn hàng và đặt đơn:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option 1 */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 shadow-sm space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-400 text-sm">
              <span className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-xs">1</span>
              <span>Check mã vận chuyển theo Tỉnh, Thành phố</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
              Mã vận chuyển trên TikTok Shop thường phụ thuộc vào tuyến giao hàng (Kho người bán ➡️ Địa chỉ người mua). Chọn một Tỉnh/TP cụ thể (như <strong>Quảng Ninh</strong>, <strong>Hà Nội</strong>, <strong>TP. Hồ Chí Minh</strong>) để hệ thống:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400 text-[11px]">
              <li>Kiểm tra các mã Freeship 100% hoặc Freeship Xtra có hiệu lực cho Tỉnh/TP đó.</li>
              <li>Đánh dấu nhãn màu xanh <strong>Hỗ trợ [Tên Tỉnh]</strong> ngay trên từng voucher.</li>
              <li>Tự động ưu tiên hiển thị các mã miễn phí cước ship tới địa phương đã chọn.</li>
            </ul>
          </div>

          {/* Option 2 */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-sm">
              <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs">2</span>
              <span>Check mã vận chuyển tổng thể (Toàn sàn)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
              Quét toàn diện toàn bộ kho mã vận chuyển khả dụng trong ví tài khoản mà không giới hạn địa lý:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-500 dark:text-slate-400 text-[11px]">
              <li>Quét tất cả mã Freeship toàn quốc 25K, 50K, 70K, mã giảm cước đơn Mall.</li>
              <li>Quét mã Freeship Tân Thủ cho tài khoản mới lập.</li>
              <li>Phù hợp khi bạn cần xuất danh sách phân loại tài khoản có voucher hay không có voucher để phân bổ kho tài nguyên.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Cơ chế phân loại màu tài khoản & Setup địa chỉ giao hàng hàng loạt
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quy tắc hiển thị màu và tính năng random địa chỉ chi tiết theo yêu cầu
            </p>
          </div>
        </div>
      </div>

      {/* 3 Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Rule 1: Trạng thái tài khoản (Green / Red) */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>1. Quy tắc màu trạng thái tài khoản:</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Green Rule */}
            <div className="p-2.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/30 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  Màu XANH LÁ (Còn sống / Active)
                </span>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400/90 mt-0.5">
                  Tài khoản hoạt động bình thường, trang cá nhân công khai khả dụng, có thể dùng để đặt đơn mua hàng hoặc áp mã giảm giá.
                </p>
              </div>
            </div>

            {/* Red Rule */}
            <div className="p-2.5 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/30 flex items-start gap-2.5">
              <div className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                ✕
              </div>
              <div>
                <span className="font-bold text-rose-800 dark:text-rose-300">
                  Màu ĐỎ (Đình chỉ / Bị khóa)
                </span>
                <p className="text-[11px] text-rose-700 dark:text-rose-400/90 mt-0.5">
                  Tài khoản bị cấm (Banned), vô hiệu hóa do vi phạm chính sách cộng đồng, hoặc trang cá nhân không thể truy cập.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rule 2: Các loại mã vận chuyển TikTok Shop */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
            <Ticket className="w-4 h-4 text-amber-500" />
            <span>2. Các loại mã freeship phổ biến:</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/80">
              <span className="font-bold text-cyan-800 dark:text-cyan-300 block">Freeship 100% (0₫)</span>
              <span className="text-[10px] text-cyan-700 dark:text-cyan-400/90">Miễn phí ship tối đa 70.000₫ không yêu cầu đơn tối thiểu.</span>
            </div>

            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80">
              <span className="font-bold text-amber-800 dark:text-amber-300 block">Freeship Xtra 50K</span>
              <span className="text-[10px] text-amber-700 dark:text-amber-400/90">Giảm 50.000₫ phí ship cho sản phẩm gắn tag Xtra.</span>
            </div>

            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Giảm phí ship 70K</span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400/90">Áp dụng cho đơn hàng Shop Mall từ 99.000₫.</span>
            </div>

            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-800 dark:text-slate-300 block">Voucher Tân Thủ</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400">Tài khoản mới tạo, miễn ship đơn mua đầu tiên.</span>
            </div>
          </div>
        </div>

        {/* Rule 3: Quy tắc Setup địa chỉ hàng loạt */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
            <MapPin className="w-4 h-4 text-emerald-500" />
            <span>3. Cấu hình địa chỉ giao hàng hàng loạt:</span>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white text-[11px]">
                • Tên: Random họ tên + Đuôi cố định
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Ví dụ đuôi <code>999</code>: tạo ra <code>Nguyễn Văn An 999</code>, <code>Trần Thị Mai 999</code>.
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-slate-900 dark:text-white text-[11px]">
                • Địa chỉ: Random số nhà & đường, Thôn/Khu vực cố định
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Ví dụ: <code>số nhà 22 đường 6, đồng lá hòa bình, xã Kỳ Thượng, Quảng Ninh</code> (số nhà và đường thay đổi linh hoạt).
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
