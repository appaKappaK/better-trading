# Better Trading - Firefox Setup Script
# Run this once on a new machine to get everything ready.
# Usage: Right-click -> "Run with PowerShell" OR run from a PowerShell terminal

Set-StrictMode -Off
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=== Better Trading Firefox Setup ===" -ForegroundColor Cyan
Write-Host ""

# ── 1. Execution policy ──────────────────────────────────────────────────────
$policy = Get-ExecutionPolicy -Scope CurrentUser
if ($policy -eq "Restricted" -or $policy -eq "Undefined") {
    Write-Host "[1/5] Setting PowerShell execution policy..." -ForegroundColor Yellow
    Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
} else {
    Write-Host "[1/5] Execution policy OK ($policy)" -ForegroundColor Green
}

# ── 2. fnm ───────────────────────────────────────────────────────────────────
Write-Host "[2/5] Checking fnm..." -ForegroundColor Yellow
$fnmPath = Get-Command fnm -ErrorAction SilentlyContinue
if (-not $fnmPath) {
    Write-Host "      fnm not found. Installing via winget..." -ForegroundColor Yellow
    winget install Schniz.fnm --accept-source-agreements --accept-package-agreements
    # Reload PATH
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
}

# Activate fnm
Invoke-Expression (fnm env --use-on-cd | Out-String)

# Install and use Node 18
$nodeVersion = fnm list | Select-String "18\."
if (-not $nodeVersion) {
    Write-Host "      Installing Node 18..." -ForegroundColor Yellow
    fnm install 18
}
fnm use 18
Write-Host "      Node $(node --version) active" -ForegroundColor Green

# ── 3. fnm in PowerShell profile ─────────────────────────────────────────────
Write-Host "[3/5] Checking PowerShell profile..." -ForegroundColor Yellow
$profileDir = Split-Path $PROFILE
if (-not (Test-Path $profileDir)) {
    New-Item -ItemType Directory -Force -Path $profileDir | Out-Null
}
if (-not (Test-Path $PROFILE)) {
    New-Item -ItemType File -Force -Path $PROFILE | Out-Null
}
$profileContent = Get-Content $PROFILE -Raw -ErrorAction SilentlyContinue
if (-not $profileContent -or $profileContent -notlike "*fnm env*") {
    Add-Content -Path $PROFILE -Value "`nfnm env --use-on-cd | Out-String | Invoke-Expression"
    Add-Content -Path $PROFILE -Value "fnm use 18 2>`$null"
    Write-Host "      Added fnm to PowerShell profile" -ForegroundColor Green
} else {
    Write-Host "      fnm already in profile" -ForegroundColor Green
}

# ── 4. npm install ───────────────────────────────────────────────────────────
Write-Host "[4/5] Installing npm dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps
Write-Host "      Dependencies installed" -ForegroundColor Green

# ── 5. Build the .xpi ────────────────────────────────────────────────────────
Write-Host "[5/5] Building Firefox extension..." -ForegroundColor Yellow
npm run package-firefox

Write-Host ""
Write-Host "=== Done! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "To install in Firefox Developer Edition:" -ForegroundColor White
Write-Host "  1. about:config  ->  xpinstall.signatures.required = false" -ForegroundColor Gray
Write-Host "  2. about:addons  ->  gear icon  ->  Install Add-on From File" -ForegroundColor Gray
Write-Host "  3. Select: $PSScriptRoot\dist-packages\better-trading-firefox.xpi" -ForegroundColor Gray
Write-Host ""
