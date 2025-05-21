# Update clean-build.ps1
Write-Host "Cleaning up..." -ForegroundColor Green
if (Test-Path ".next") {
  Remove-Item -Recurse -Force ".next"
}

Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

Write-Host "Building for production with linting disabled..." -ForegroundColor Green
$env:NEXT_TELEMETRY_DISABLED=1
npx next build --no-lint

# Verify build exists
if (Test-Path ".next/BUILD_ID") {
  Write-Host "Build completed successfully!" -ForegroundColor Green
  Write-Host "You can now start the production server with: npm start" -ForegroundColor Cyan
} else {
  Write-Host "Build failed. Check errors above." -ForegroundColor Red
}