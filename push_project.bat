@echo off
echo ==========================================
echo   Pushing Project to GitHub Repository
echo ==========================================
echo.

echo [1/5] Initializing Git repository...
git init
echo.

echo [2/5] Adding all files to staging...
git add .
echo.

echo [3/5] Creating initial commit...
git commit -m "Initial commit: Lumiere Gallery project with README and gitignore"
echo.

echo [4/5] Configuring remote repository...
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/bharathbalikant-hue/CodeAlpha_-image-gallery.git
echo.

echo [5/5] Pushing to GitHub (origin/main)...
git push -u origin main
echo.

echo ==========================================
echo   Process completed!
echo ==========================================
pause
