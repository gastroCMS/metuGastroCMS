#Requires -RunAsAdministrator
[CmdletBinding()]
param(
  [string]$RepoUrl = "",               # Optional: e.g. https://github.com/yourorg/metu-gastro-cms.git
  [string]$ProjectDir = "$env:USERPROFILE\metu-gastro-cms"  # Where to clone or use existing project
)

$ErrorActionPreference = "Stop"

function Write-Section($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }

# Ensure TLS for downloads
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Test-Command { param([string]$Name) return [bool](Get-Command $Name -ErrorAction SilentlyContinue) }

function Install-WithWinget {
  param(
    [string]$Id,
    [string]$CmdAfter = "",
    [int]$Retries = 1
  )
  if (-not (Test-Command winget)) { throw "winget is not available on this system. Please update Windows App Installer from Microsoft Store and rerun." }
  $args = "install --id $Id -e --source winget --accept-source-agreements --accept-package-agreements --silent"
  Write-Section "Installing $Id via winget"
  $attempt = 0
  do {
    try {
      Start-Process -FilePath "winget" -ArgumentList $args -Wait -WindowStyle Hidden
      if ($CmdAfter) { Invoke-Expression $CmdAfter }
      return
    } catch {
      $attempt++
      if ($attempt -gt $Retries) { throw }
      Start-Sleep -Seconds 5
    }
  } while ($true)
}

function Ensure-Git {
  if (Test-Command git) { return }
  Install-WithWinget -Id "Git.Git"
}

function Ensure-Node {
  if (Test-Command node -and (node -v) -match '^v(1[8-9]|2[0-9])') { return }
  Install-WithWinget -Id "OpenJS.NodeJS.LTS"
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

function Ensure-DockerDesktop {
  if (Test-Command docker) { return }
  Install-WithWinget -Id "Docker.DockerDesktop"
  # Start Docker Desktop once; it may require first-run setup
  $dockerDesktop = "$Env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
  if (Test-Path $dockerDesktop) {
    Start-Process -FilePath $dockerDesktop
  }
}

function Wait-For-Docker {
  Write-Section "Waiting for Docker engine to be ready (this can take several minutes on first run)"
  $timeoutSec = 900
  $elapsed = 0
  while ($true) {
    try {
      docker info --format '{{json .ServerVersion}}' | Out-Null
      break
    } catch {
      if ($elapsed -ge $timeoutSec) {
        throw "Docker did not become ready within $($timeoutSec/60) minutes. If this is the first install, reboot once and rerun setup.ps1."
      }
      Start-Sleep -Seconds 5
      $elapsed += 5
    }
  }
}

function Ensure-SupabaseCli {
  if (Test-Command supabase) { return }
  Write-Section "Installing Supabase CLI"
  try {
    # Try winget (if package exists)
    Install-WithWinget -Id "Supabase.Supabase"
    if (Test-Command supabase) { return }
  } catch {
    # ignore and fallback
  }

  # Fallback: download latest release binary
  $supabaseDir = "$env:ProgramFiles\Supabase"
  New-Item -ItemType Directory -Force -Path $supabaseDir | Out-Null
  $exePath = Join-Path $supabaseDir "supabase.exe"

  Write-Host "Downloading latest Supabase CLI from GitHub releases..."
  $release = Invoke-RestMethod -Uri "https://api.github.com/repos/supabase/cli/releases/latest"
  $asset = $release.assets | Where-Object { $_.name -match 'windows_amd64\.exe$' } | Select-Object -First 1
  if (-not $asset) { throw "Could not find Supabase CLI windows asset in latest release." }
  Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $exePath

  # Add to PATH (machine)
  $machinePath = [Environment]::GetEnvironmentVariable("Path","Machine")
  if ($machinePath -notlike "*$supabaseDir*") {
    $newPath = $machinePath.TrimEnd(";") + ";" + $supabaseDir
    setx /M PATH "$newPath" | Out-Null
  }
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

function Ensure-Project {
  param([string]$RepoUrl, [string]$ProjectDir)
  if (Test-Path (Join-Path $ProjectDir "package.json")) { return }
  if (-not $RepoUrl) {
    throw "Project not found at '$ProjectDir'. Provide -RepoUrl to clone or copy the project folder here before running."
  }
  Write-Section "Cloning repository"
  New-Item -ItemType Directory -Force -Path $ProjectDir | Out-Null
  git clone "$RepoUrl" "$ProjectDir"
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
  Write-Section "Preparing local Supabase (containers, migrations, seed)"
  # Stop if running; ignore failures
  try { supabase stop | Out-Null } catch {}
  # Reset DB to apply migrations and seed
  supabase db reset | Write-Host
  # Start full stack
  supabase start | Write-Host
}

function Setup-NodeDeps {
  param([string]$ProjectDir)
  Write-Section "Installing Node dependencies"
  Push-Location $ProjectDir
  try {
    if (Test-Path (Join-Path $ProjectDir "package-lock.json")) {
      npm ci
    } else {
      npm install
    }
  } finally {
    Pop-Location
  }
}

function Start-Dev {
  param([string]$ProjectDir)
  Write-Section "Starting Next.js dev server"
  $script = "cd `"$ProjectDir`"; npm run dev"
  Start-Process -WindowStyle Normal powershell -ArgumentList "-NoExit","-Command",$script

  # Optionally wait for 3000 and open browser
  Write-Host "Waiting for http://localhost:3000 ..."
  $timeoutSec = 300
  $elapsed = 0
  while ($true) {
    try {
      $resp = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
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
Write-Section "Checking prerequisites (Git, Node.js LTS, Docker Desktop, Supabase CLI)"
Ensure-Git
Ensure-Node
Ensure-DockerDesktop
Wait-For-Docker
Ensure-SupabaseCli

Ensure-Project -RepoUrl $RepoUrl -ProjectDir $ProjectDir
Ensure-EnvFile -ProjectDir $ProjectDir

Setup-SupabaseLocal
Setup-NodeDeps -ProjectDir $ProjectDir
Start-Dev -ProjectDir $ProjectDir

Write-Host "`nAll set. If Docker required a first-time setup/restart, reboot and rerun this script." -ForegroundColor Green
