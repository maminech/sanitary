# Deploy script for Sanitary Platform
# Deploys both backend (Render) and frontend (Vercel)

Write-Host "🚀 Starting deployment..." -ForegroundColor Cyan

# Get current directory
$rootDir = Get-Location

# Deploy Backend (Render auto-deploys from GitHub)
Write-Host "`n📦 Committing and pushing changes to GitHub..." -ForegroundColor Yellow
git add .
$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Update: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}
git commit -m "$commitMessage"
git push

Write-Host "`n✅ Backend will auto-deploy on Render from GitHub" -ForegroundColor Green

# Deploy Frontend (Vercel)
Write-Host "`n📦 Deploying frontend to Vercel..." -ForegroundColor Yellow
Set-Location "$rootDir\frontend"
vercel --prod --yes

Set-Location $rootDir

Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "`nFrontend URL will be shown above" -ForegroundColor Cyan
Write-Host "Backend URL: https://sanitary-platform-backend.onrender.com" -ForegroundColor Cyan
Write-Host "`n⚠️  Remember to update CORS_ORIGIN in Render if frontend URL changed!" -ForegroundColor Yellow
