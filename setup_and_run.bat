@echo off
title MCQ Solver - Setup & Run
color 0A

echo.
echo  =============================================
echo    MCQ Solver Overlay - First Time Setup
echo  =============================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Node.js is NOT installed on this system.
    echo.
    echo  You need Node.js to run this app.
    echo  Download it from: https://nodejs.org/
    echo.
    echo  After installing Node.js, close this window
    echo  and double-click this file again.
    echo.
    echo  [TIP] You can also install it via winget:
    echo        winget install OpenJS.NodeJS.LTS
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
echo.

:: Navigate to the app directory
cd /d "%~dp0llama-overlay"

:: Check if node_modules exists
if not exist "node_modules" (
    echo [*] Installing dependencies (first time only)...
    echo     This may take a minute or two...
    echo.
    call npm install
    echo.
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm install failed! Check your internet connection.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully!
    echo.
) else (
    echo [OK] Dependencies already installed.
    echo.
)

echo [*] Starting MCQ Solver Overlay...
echo.
echo  =============================================
echo   SHORTCUTS:
echo   Ctrl+Shift+G   = Get Answer (from clipboard)
echo   Ctrl+Shift+F   = Re-query (new answer)
echo   Ctrl+Shift+Down = Next Line
echo   Ctrl+Shift+Up   = Prev Line
echo   Ctrl+Shift+R   = Reset
echo   Ctrl+Shift+H   = Hide overlay
echo  =============================================
echo.
echo  Close this window to stop the app.
echo.

npm start
