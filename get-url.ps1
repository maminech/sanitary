# Get Current Frontend URL
# Run this script to get the latest production URL

Write-Host "🔍 Getting latest Vercel deployment URL..." -ForegroundColor Cyan

Set-Location "$PSScriptRoot\frontend"

# Get the latest production deployment
$output = vercel ls --json 2>&1 | Out-String

if ($output -match '"url":\s*"([^"]+)"' -and $output -match '"state":\s*"READY"') {
    $deployments = $output | ConvertFrom-Json
    $latestReady = $deployments.deployments | Where-Object { $_.state -eq "READY" -and $_.target -eq "production" } | Select-Object -First 1
    
    if ($latestReady) {
        $url = "https://$($latestReady.url)"
        Write-Host ""
        Write-Host "✅ Latest Production URL:" -ForegroundColor Green
        Write-Host $url -ForegroundColor Yellow
        Write-Host ""
        Write-Host "📋 Login Page:" -ForegroundColor Cyan
        Write-Host "$url/login" -ForegroundColor Yellow
        Write-Host ""
        
        # Copy to clipboard
        $url | Set-Clipboard
        Write-Host "✅ URL copied to clipboard!" -ForegroundColor Green
        
        # Ask if user wants to open in browser
        $open = Read-Host "Open in browser? (Y/n)"
        if ($open -ne "n" -and $open -ne "N") {
            Start-Process $url
        }
    } else {
        Write-Host "❌ No ready production deployments found" -ForegroundColor Red
    }
} else {
    # Fallback: try text parsing
    Write-Host ""
    Write-Host "Running vercel ls..." -ForegroundColor Yellow
    vercel ls | Select-String -Pattern "https://frontend.*vercel\.app" | Select-Object -First 1
}

Write-Host ""
Write-Host "💡 Tip: Bookmark the URL or use this script after each deployment" -ForegroundColor Cyan
