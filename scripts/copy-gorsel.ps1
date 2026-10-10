$ErrorActionPreference = "Stop"
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)
node scripts/hero-webp.mjs
Write-Host "Hero sirasi: 1.webp, 2.webp, 3.webp, 4.webp"
