# EduShare+ Local Dev Setup Script
# Chạy với quyền Administrator nếu Docker Desktop cần

$ErrorActionPreference = "Stop"
$BackendDir = $PSScriptRoot + "\backend"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   EduShare+ Local Dev Environment Setup   " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# ─── Step 1: Copy .env.local → .env ─────────────────────────────────────────
Write-Host "[1/4] Copying .env.local → .env ..." -ForegroundColor Yellow
$EnvLocal = Join-Path $BackendDir ".env.local"
$EnvTarget = Join-Path $BackendDir ".env"

if (-not (Test-Path $EnvLocal)) {
    Write-Host "  ERROR: .env.local not found at: $EnvLocal" -ForegroundColor Red
    exit 1
}
Copy-Item -Path $EnvLocal -Destination $EnvTarget -Force
Write-Host "  OK: .env created at $EnvTarget" -ForegroundColor Green

# ─── Step 2: Kiểm tra Docker ─────────────────────────────────────────────────
Write-Host ""
Write-Host "[2/4] Checking Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "  OK: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Docker not found. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

$dockerRunning = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Docker daemon is not running. Start Docker Desktop first." -ForegroundColor Red
    exit 1
}
Write-Host "  OK: Docker daemon is running." -ForegroundColor Green

# ─── Step 3: Pull & Start infrastructure ─────────────────────────────────────
Write-Host ""
Write-Host "[3/4] Starting EduShare+ infrastructure containers..." -ForegroundColor Yellow
$ComposeFile = Join-Path $BackendDir "docker-compose.local.yml"

Set-Location $BackendDir
docker compose -f $ComposeFile --env-file $EnvTarget pull --quiet
docker compose -f $ComposeFile --env-file $EnvTarget up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: docker compose failed." -ForegroundColor Red
    exit 1
}
Write-Host "  OK: Containers started." -ForegroundColor Green

# ─── Step 4: Wait for healthchecks ───────────────────────────────────────────
Write-Host ""
Write-Host "[4/4] Waiting for services to be healthy..." -ForegroundColor Yellow
$MaxWait = 120  # seconds
$Interval = 5
$Elapsed = 0
$RequiredHealthy = @(
    "edushare-auth-db",
    "edushare-rabbitmq",
    "edushare-redis",
    "edushare-minio",
    "edushare-zipkin"
)

while ($Elapsed -lt $MaxWait) {
    $allHealthy = $true
    foreach ($container in $RequiredHealthy) {
        $status = docker inspect --format "{{.State.Health.Status}}" $container 2>&1
        if ($status -ne "healthy") {
            $allHealthy = $false
            break
        }
    }
    if ($allHealthy) { break }
    Start-Sleep -Seconds $Interval
    $Elapsed += $Interval
    Write-Host "  ... waiting ($Elapsed/$MaxWait s)" -ForegroundColor Gray
}

if ($Elapsed -ge $MaxWait) {
    Write-Host "  WARNING: Some containers may not be fully healthy yet. Check with: docker ps" -ForegroundColor Yellow
} else {
    Write-Host "  OK: Core services are healthy!" -ForegroundColor Green
}

# ─── Summary ─────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Infrastructure is ready!                " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "DATABASE CONNECTIONS (connect from host):" -ForegroundColor White
Write-Host "  auth-db        -> localhost:3307  (DB: skill_auth)" -ForegroundColor Gray
Write-Host "  user-db        -> localhost:3308  (DB: skill_user)" -ForegroundColor Gray
Write-Host "  skill-db       -> localhost:3309  (DB: skill_skill)" -ForegroundColor Gray
Write-Host "  session-db     -> localhost:3310  (DB: skill_session)" -ForegroundColor Gray
Write-Host "  mentor-db      -> localhost:3311  (DB: skill_mentor)" -ForegroundColor Gray
Write-Host "  group-db       -> localhost:3312  (DB: skill_group)" -ForegroundColor Gray
Write-Host "  review-db      -> localhost:3313  (DB: skill_review)" -ForegroundColor Gray
Write-Host "  notification-db-> localhost:3314  (DB: skill_notification)" -ForegroundColor Gray
Write-Host "  payment-db     -> localhost:3315  (DB: skill_payment)" -ForegroundColor Gray
Write-Host "  messaging-db   -> localhost:3316  (DB: skill_messaging)" -ForegroundColor Gray
Write-Host "  resource-db    -> localhost:3317  (DB: edushare_resource)" -ForegroundColor Gray
Write-Host "  academic-db    -> localhost:3318  (DB: edushare_academic)" -ForegroundColor Gray
Write-Host ""
Write-Host "SERVICES:" -ForegroundColor White
Write-Host "  RabbitMQ UI    -> http://localhost:15672  (edushare / edushare123)" -ForegroundColor Gray
Write-Host "  Redis          -> localhost:6379" -ForegroundColor Gray
Write-Host "  MinIO Console  -> http://localhost:9001  (edushare_admin / edushare_minio_2024)" -ForegroundColor Gray
Write-Host "  MinIO S3 API   -> http://localhost:9000" -ForegroundColor Gray
Write-Host "  Zipkin UI      -> http://localhost:9411" -ForegroundColor Gray
Write-Host "  Mailhog UI     -> http://localhost:8025" -ForegroundColor Gray
Write-Host "  Mailhog SMTP   -> localhost:1025" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop infrastructure:" -ForegroundColor White
Write-Host "  docker compose -f backend\docker-compose.local.yml down" -ForegroundColor Gray
Write-Host ""
Write-Host "To view logs:" -ForegroundColor White
Write-Host "  docker compose -f backend\docker-compose.local.yml logs -f [service-name]" -ForegroundColor Gray
Write-Host ""
