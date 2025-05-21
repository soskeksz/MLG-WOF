Write-Host "Cleaning up..." -ForegroundColor Green
if (Test-Path ".next") {
  Remove-Item -Recurse -Force ".next"
}

Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

Write-Host "Building for production..." -ForegroundColor Green
npm run build

Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host "You can now start the production server with: npm start" -ForegroundColor Cyan