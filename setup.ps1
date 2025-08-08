#Requires -RunAsAdministrator
[CmdletBinding()]
param(
  [string]$ProjectDir = $PSScriptRoot
)

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Write-Section($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function Test-Command { param([string]$Name) return [bool](Get-Command $Name -ErrorAction SilentlyContinue) }

function Install-WithWinget {
  param([string]$Id,[string]$Args="--silent",[int]$Retries=1)
  if (-not (Test-Command winget)) { throw "winget is not available. Install 'App Installer' from Microsoft Store, then rerun." }
  $common = "--accept-source-agreements --accept-package-agreements -e --source winget"
  $all = "install --id $Id $common $Args"
  Write-Section "Installing $Id via winget"
  $attempt = 0
  do {
    try {
      Start-Process -FilePath "winget" -ArgumentList $all -Wait -WindowStyle Hidden
      return
    } catch {
      $attempt++
      if ($attempt -gt $Retries) { throw }
      Start-Sleep -Seconds 5
    }
  } while ($true)
}

function Ensure-Node {
  if (Test-Command node -and (node -v) -match '^v(1[8-9]|2[0-9])') { return }
  try {
    Install-WithWinget -Id "OpenJS.NodeJS.LTS"
  } catch {
    Write-Section "winget Node install failed, attempting direct MSI fallback"
    try {
      $arch = (Get-CimInstance Win32_Processor).Architecture
      $nodeArch = if ($arch -eq 12) { "arm64" } else { "x64" }  # 12=ARM64
      $releases = Invoke-RestMethod -UseBasicParsing -Uri "https://nodejs.org/dist/index.json"
      $latestLts = $releases | Where-Object { $_.lts } | Select-Object -First 1
      if (-not $latestLts) { throw "Could not determine latest LTS Node.js version" }
      $ver = $latestLts.version.TrimStart('v')
      $msiUrl = "https://nodejs.org/dist/v$ver/node-v$ver-$nodeArch.msi"
      $msiPath = Join-Path $env:TEMP "node-$ver-$nodeArch.msi"
      Invoke-WebRequest -UseBasicParsing -Uri $msiUrl -OutFile $msiPath
      Start-Process "msiexec.exe" -ArgumentList "/i","`"$msiPath`"","/quiet","/norestart" -Wait
    } catch {
      throw "Node.js installation failed: $($_.Exception.Message)"
    }
  }
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

function Ensure-SupabaseCli {
  if (Test-Command supabase) { return }
  Write-Section "Installing Supabase CLI"
  $installed = $false
  try {
    Install-WithWinget -Id "Supabase.Supabase"
    $installed = $true
  } catch {
    Write-Host "winget package not available; using GitHub release binary fallback"
  }
  if (-not $installed) {
    $supabaseDir = "$env:ProgramFiles\Supabase"
    New-Item -ItemType Directory -Force -Path $supabaseDir | Out-Null
    $exePath = Join-Path $supabaseDir "supabase.exe"
    $arch = (Get-CimInstance Win32_Processor).Architecture
    $assetSuffix = if ($arch -eq 12) { "windows_arm64.exe" } else { "windows_amd64.exe" }
    $release = Invoke-RestMethod -UseBasicParsing -Uri "https://api.github.com/repos/supabase/cli/releases/latest"
    $asset = $release.assets | Where-Object { $_.name -like "*$assetSuffix" } | Select-Object -First 1
    if (-not $asset) { throw "Could not find Supabase CLI $assetSuffix asset in latest release." }
    Invoke-WebRequest -UseBasicParsing -Uri $asset.browser_download_url -OutFile $exePath
    $machinePath = [Environment]::GetEnvironmentVariable("Path","Machine")
    if ($machinePath -notlike "*$supabaseDir*") {
      $newPath = $machinePath.TrimEnd(";") + ";" + $supabaseDir
      setx /M PATH "$newPath" | Out-Null
    }
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
  }
}

function Ensure-EnvFile {
  param([string]$ProjectDir)
  $envPath = Join-Path $ProjectDir ".env.local"
  if (-not (Test-Path $envPath)) {
    Set-Content -Path $envPath -Encoding UTF8 -Value @"
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
"@
  }
}

function Setup-SupabaseLocal {
  param([string]$ProjectDir)
  Write-Section "Preparing local Supabase (migrations, seed)"
  Push-Location $ProjectDir
  try { supabase stop | Out-Null } catch {}
  supabase db reset | Write-Host
  supabase start | Write-Host
  Pop-Location
}

function Setup-NodeDeps {
  param([string]$ProjectDir)
  Write-Section "Installing Node dependencies"
  Push-Location $ProjectDir
  try {
    $env:HUSKY = "0"  # avoid git requirement when running from a zip
    if (Test-Path (Join-Path $ProjectDir "package-lock.json")) {
      npm ci --no-audit --no-fund
    } else {
      npm install --no-audit --no-fund
    }
  } finally {
    Pop-Location
  }
}

function Start-Dev {
  param([string]$ProjectDir)
  Write-Section "Starting Next.js dev server"
  $cmd = "cd `"$ProjectDir`"; npm run dev"
  Start-Process -WindowStyle Normal powershell -ArgumentList "-NoExit","-Command",$cmd

  Write-Host "Waiting for http://localhost:3000 ..."
  $timeoutSec = 300
  $elapsed = 0
  while ($true) {
    try {
      $resp = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:3000" -TimeoutSec 5
      Start-Process "http://localhost:3000"
      break
    } catch {
      if ($elapsed -ge $timeoutSec) { break }
      Start-Sleep -Seconds 3
      $elapsed += 3
    }
  }
}

# --- Execution ---
Write-Section "Validating project directory"
if (-not (Test-Path (Join-Path $ProjectDir "package.json"))) {
  throw "Project folder not detected at '$ProjectDir'. Place setup.ps1 in the unzipped repo root and run again."
}

Write-Section "Installing prerequisites (Node.js LTS, Supabase CLI)"
Ensure-Node
Ensure-SupabaseCli

Ensure-EnvFile -ProjectDir $ProjectDir
Setup-SupabaseLocal -ProjectDir $ProjectDir
Setup-NodeDeps -ProjectDir $ProjectDir
Start-Dev -ProjectDir $ProjectDir

Write-Host "`nAll set. Ensure Docker Desktop is running before executing this script." -ForegroundColor Green
