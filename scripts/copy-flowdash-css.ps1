Param(
  [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
  [string]$DistRoot = $null,
  [switch]$Clean
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

if (-not $DistRoot) {
  $DistRoot = Join-Path $RepoRoot 'dashboard/dist'
}

$flowdashCssSrc = Join-Path $RepoRoot 'dashboard/flowdash.css'
$themesSrcRoot  = Join-Path $RepoRoot 'dashboard/themes'
$themesDestRoot = Join-Path $DistRoot 'themes'

if (-not (Test-Path $flowdashCssSrc)) {
  throw "Could not find flowdash css at: $flowdashCssSrc"
}

New-Item -ItemType Directory -Force -Path $DistRoot | Out-Null
New-Item -ItemType Directory -Force -Path $themesDestRoot | Out-Null

if ($Clean) {
  if (Test-Path $themesDestRoot) {
    Get-ChildItem -Path $themesDestRoot -Recurse -Include *.css | Remove-Item -Force -ErrorAction SilentlyContinue
  }
}

# Copy base css to dist\flowdash.css
$destFlowdash = Join-Path $DistRoot 'flowdash.css'
Copy-Item -Path $flowdashCssSrc -Destination $destFlowdash -Force

# Copy only .css files from themes, preserving folder structure
if (Test-Path $themesSrcRoot) {
  Get-ChildItem -Path $themesSrcRoot -Recurse -File -Filter *.css | ForEach-Object {
    $relativePath = ($_.FullName.Substring($themesSrcRoot.Length) -replace '^[\\/]+','')
    $destPath = Join-Path $themesDestRoot $relativePath
    $destDir = Split-Path $destPath -Parent
    if (-not (Test-Path $destDir)) {
      New-Item -ItemType Directory -Force -Path $destDir | Out-Null
    }
    Copy-Item -Path $_.FullName -Destination $destPath -Force
  }
}

Write-Host "Copied:" -ForegroundColor Green
Write-Host "  $(Resolve-Path $flowdashCssSrc) -> $destFlowdash"
Write-Host "Theme CSS copied to: $themesDestRoot"


