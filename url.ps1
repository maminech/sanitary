# Quick URL Getter - Just shows the latest URL
Set-Location "$PSScriptRoot\frontend"
$url = (vercel ls 2>&1 | Select-String -Pattern 'https://frontend-[a-z0-9]+-[a-z0-9-]+\.vercel\.app' | Select-Object -First 1).Matches.Value
Write-Host "`n✅ Latest Frontend URL: $url`n" -ForegroundColor Green
Write-Host "Login Page: $url/login`n" -ForegroundColor Yellow
$url | Set-Clipboard
Write-Host "✅ Copied to clipboard!`n" -ForegroundColor Cyan
