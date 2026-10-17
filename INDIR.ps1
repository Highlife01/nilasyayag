$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "Git kurulu degil. https://git-scm.com/download/win adresinden Git for Windows kurun."
  Write-Host "Kurulum bitince yeni bir PowerShell acip bu dosyayi yeniden calistirin."
  exit 1
}

Write-Host "GitHub'dan guncel kodlar indiriliyor (git pull)..." -ForegroundColor Cyan
git pull origin main

Write-Host "`nBasariyla guncellendi!" -ForegroundColor Green
