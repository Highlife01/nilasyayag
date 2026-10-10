# Yerel klasör izni — yalnızca bu Windows kullanıcısı, yalnızca bu klasör.
# Ağ paylaşımı açmaz. Uzak sunucuya dosya göndermez.
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$Path = "D:\web_siteleri\nilasyayag"
$me = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name

if (-not (Test-Path -LiteralPath $Path)) {
  Write-Error "Klasör bulunamadı: $Path"
  exit 1
}

icacls $Path /inheritance:e | Out-Null
icacls $Path /grant:r "${me}:(OI)(CI)F" /T | Out-Null

Write-Host "Tam yetki verildi: $me"
Write-Host "Klasör: $Path"
Write-Host ""

$visualDir = Get-ChildItem -LiteralPath $Path -Directory -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match "görsel|gorsel|gorseller|images|visuals|resim" } |
  Select-Object -First 1

if (-not $visualDir) {
  Write-Host "Görsel klasörü bulunamadı. Beklenen yol: $Path\görsel"
  exit 0
}

Write-Host "Görsel klasörü: $($visualDir.FullName)"
Write-Host ""

Get-ChildItem -LiteralPath $visualDir.FullName -Recurse -File |
  Where-Object { $_.Extension -match "\.(jpe?g|png|webp|avif|gif|svg)$" } |
  Select-Object Name, Length, FullName |
  Format-Table -AutoSize
