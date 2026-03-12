# PowerShell script untuk Windows
Write-Host "🐳 Starting TailAdmin Dashboard with Docker..." -ForegroundColor Cyan
Write-Host "📦 Building and running container on port 4000..." -ForegroundColor Yellow
Write-Host ""

docker-compose up --build

Write-Host ""
Write-Host "✅ Application should be running at http://localhost:4000" -ForegroundColor Green
