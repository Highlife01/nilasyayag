# Firebase Hosting Dağıtım Betiği (nilasyayag)
# Windows üzerinde Next.js Cloud Functions symlink izinleri için yönetici olarak çalıştırır.

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $scriptDir) { $scriptDir = $PSScriptRoot }
if (-not $scriptDir) { $scriptDir = "d:\WEB SİTELERİ\asiayag" }
Set-Location -LiteralPath $scriptDir

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "Windows sembolik baglanti (symlink) yetkisi icin Yonetici olarak baslatiliyor..." -ForegroundColor Yellow
    Start-Process powershell.exe -WorkingDirectory $scriptDir -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " ASIA OIL - FIREBASE HOSTING DEPLOY" -ForegroundColor Cyan
Write-Host " Hedef: https://nilasyayag.web.app" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Eski gecici .firebase artıklarını temizle
if (Test-Path -LiteralPath ".firebase") {
    Write-Host "Eski derleme artıkları temizleniyor..." -ForegroundColor Gray
    cmd /c "rmdir /s /q .firebase" 2>$null
}

try {
    firebase deploy --only hosting:nilasyayag
} catch {
    Write-Host "Dağıtım sırasında bir hata oluştu: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Islem tamamlandi. Pencereyi kapatmak icin Enter'a basin..." -ForegroundColor Green
Read-Host
