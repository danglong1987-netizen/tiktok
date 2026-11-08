#!/usr/bin/env bash
# TikTok Account & Shipping Voucher Checker Launcher
echo "=========================================================="
echo "  TIKTOK ACCOUNT & SHIPPING VOUCHER CHECKER - PC LAUNCHER"
echo "=========================================================="
echo ""

if ! command -v node &> /dev/null; then
    echo "[!] Node.js chua duoc cai dat."
    echo "Mo ung dung tren trinh duyet..."
    DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    open "$DIR/dist/index.html" || xdg-open "$DIR/dist/index.html"
    exit 0
fi

echo "[✓] Tim thay Node.js: $(node -v)"
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

if [ ! -d "node_modules" ]; then
    echo "Dang cai dat thu vien (vui long doi 1-2 phut)..."
    npm install
fi

echo "Khoi chay ung dung tren cong 3000..."
(sleep 2 && (open "http://localhost:3000" || xdg-open "http://localhost:3000")) &
npm run dev
