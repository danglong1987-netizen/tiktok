@echo off
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
    start "" "%~dp0dist\index.html"
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
