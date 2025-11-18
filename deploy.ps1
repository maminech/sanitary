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

# Get the latest deployment URL and set the alias
Write-Host "`n📋 Setting up production alias..." -ForegroundColor Cyan
Set-Location "$rootDir\frontend"
$latestUrl = (vercel ls 2>&1 | Select-String -Pattern 'https://frontend-[a-z0-9]+-[a-z0-9-]+\.vercel\.app' | Select-Object -First 1).Matches.Value

if ($latestUrl) {
    Write-Host "Assigning permanent domain to latest deployment..." -ForegroundColor Yellow
    vercel alias set $latestUrl sanitary-platform.vercel.app 2>&1 | Out-Null
}

Write-Host "`n🌐 Production URLs (Permanent):" -ForegroundColor Green
Write-Host "   Frontend: https://sanitary-platform.vercel.app" -ForegroundColor Yellow
Write-Host "   Backend:  https://sanitary-platform-backend.onrender.com" -ForegroundColor Yellow
Write-Host "`n🔗 Login Page: https://sanitary-platform.vercel.app/login" -ForegroundColor Cyan
"https://sanitary-platform.vercel.app" | Set-Clipboard
Write-Host "`n✅ URL copied to clipboard!" -ForegroundColor Green

Set-Location $rootDir
Write-Host "`n⚠️  Remember to update CORS_ORIGIN in Render if frontend URL changed!" -ForegroundColor Yellow
