$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "Git kurulu degil. https://git-scm.com/download/win adresinden Git for Windows kurun."
  Write-Host "Kurulum bitince yeni bir PowerShell acip bu dosyayi yeniden calistirin."
  exit 1
}
if (-not (Test-Path -LiteralPath ".git")) {
  git init -b main
}
$ErrorActionPreference = "Continue"
git rev-parse --verify HEAD 2>&1 | Out-Null
$hasCommit = $LASTEXITCODE -eq 0
$ErrorActionPreference = "Stop"
if (-not $hasCommit) {
  git checkout -B main
  git add .
  git -c user.email="cebrailkara@gmail.com" -c user.name="Cebrail Kara" commit -m "Nilasya sitesi"
}
$names = @(git remote)
if ($names -notcontains "github") {
  git remote add github "https://github.com/Highlife01/nilasyayag.git"
}
git push -u github HEAD:main
Write-Host "Gonderildi: https://github.com/Highlife01/nilasyayag"
