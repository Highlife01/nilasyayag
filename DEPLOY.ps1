# Firebase Hosting Dağıtım Betiği (nilasyayag)
# Windows üzerinde Next.js Cloud Functions symlink izinleri için yönetici olarak çalıştırır.

Set-Location -LiteralPath $PSScriptRoot

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "Windows sembolik baglanti (symlink) yetkisi icin Yonetici olarak baslatiliyor..." -ForegroundColor Yellow
    Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " ASIA OIL - FIREBASE HOSTING DEPLOY" -ForegroundColor Cyan
Write-Host " Hedef: https://nilasyayag.web.app" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

firebase deploy --only hosting:nilasyayag

Write-Host ""
Write-Host "Islem tamamlandi. Pencereyi kapatmak icin Enter'a basin..." -ForegroundColor Green
Read-Host
