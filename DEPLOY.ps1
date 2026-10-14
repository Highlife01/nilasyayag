# Firebase Hosting Dağıtım Betiği (nilasyayag)
# Windows üzerinde Next.js Cloud Functions symlink izinleri için yönetici olarak çalıştırır.

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $scriptDir) { $scriptDir = $PSScriptRoot }
if (-not $scriptDir) { $scriptDir = "d:\WEB SİTELERİ\asiayag" }
Set-Location -LiteralPath $scriptDir

$shimPath = (Join-Path $scriptDir "scripts\win-symlink-shim.cjs") -replace '\\', '/'
$env:NODE_OPTIONS = "--require `"$shimPath`""

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

$deploySucceeded = $false
try {
    firebase deploy --only hosting:nilasyayag
    if ($LASTEXITCODE -eq 0) {
        $deploySucceeded = $true
    } else {
        Write-Host "Dağıtım başarısız oldu (Çıkış kodu: $LASTEXITCODE). Sürüm temizliği çalıştırılmayacak." -ForegroundColor Red
    }
} catch {
    Write-Host "Dağıtım sırasında bir hata oluştu: $_" -ForegroundColor Red
    Write-Host "Başarısız deploy nedeniyle Hosting sürüm temizliği atlandı." -ForegroundColor Yellow
}

if ($deploySucceeded) {
    Write-Host ""
    Write-Host "Dağıtım başarılı. Son 5 release koruma ve eski sürüm temizliği başlatılıyor..." -ForegroundColor Cyan
    node scripts/cleanup-hosting-versions.mjs --apply --site=nilasyayag
    if ($LASTEXITCODE -ne 0) {
        Write-Host "UYARI: Hosting sürüm temizliği sırasında bazı silme hataları oluştu. Lütfen yukarıdaki hata kayıtlarını kontrol edin." -ForegroundColor Red
    } else {
        Write-Host "Hosting sürüm temizliği ve canlı site doğrulaması başarıyla tamamlandı." -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Islem tamamlandi. Pencereyi kapatmak icin Enter'a basin..." -ForegroundColor Green
Read-Host
