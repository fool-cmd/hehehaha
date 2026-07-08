@echo off
setlocal EnableDelayedExpansion
title MCQ Solver - Setup ^& Run
color 0A

echo.
echo  =============================================
echo    MCQ Solver Overlay - First Time Setup
echo  =============================================
echo.

:: -----------------------------------------------
:: 1. Check if Node.js is installed
:: -----------------------------------------------
where node >nul 2>nul
if !ERRORLEVEL! NEQ 0 (
    echo [ERROR] Node.js is NOT installed on this system.
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

:: -----------------------------------------------
:: 2. Check if npm is available
:: -----------------------------------------------
where npm >nul 2>nul
if !ERRORLEVEL! NEQ 0 (
    echo [ERROR] npm is NOT found. Node.js may not be installed correctly.
    echo         Try reinstalling Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] npm found:
call npm --version
echo.

:: -----------------------------------------------
:: 3. Navigate to the app directory
:: -----------------------------------------------
cd /d "%~dp0llama-overlay"
if !ERRORLEVEL! NEQ 0 (
    echo [ERROR] Could not find the llama-overlay folder.
    echo         Make sure the folder structure is intact.
    echo.
    pause
    exit /b 1
)

:: -----------------------------------------------
:: 4. Install dependencies if needed
:: -----------------------------------------------
if not exist "node_modules\electron" (
    echo [*] Installing dependencies (first time only)...
    echo     This may take a few minutes. Please be patient...
    echo.
    call npm install
    if !ERRORLEVEL! NEQ 0 (
        echo.
        echo [ERROR] npm install failed!
        echo         - Check your internet connection
        echo         - Try running this file as Administrator
        echo         - Or run manually: cd llama-overlay ^&^& npm install
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed successfully!
    echo.
) else (
    echo [OK] Dependencies already installed.
    echo.
)

:: -----------------------------------------------
:: 5. Verify electron is actually installed
:: -----------------------------------------------
if not exist "node_modules\electron\dist\electron.exe" (
    echo [WARNING] Electron binary not found. Reinstalling...
    echo.
    call npm install electron
    if !ERRORLEVEL! NEQ 0 (
        echo.
        echo [ERROR] Failed to install Electron!
        echo         Try running: npm install electron
        echo.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Electron installed successfully!
    echo.
)

:: -----------------------------------------------
:: 6. Launch the app
:: -----------------------------------------------
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

call npm start

:: If we get here, the app exited (crash or manual close)
echo.
echo  =============================================
echo   App has stopped.
echo  =============================================
echo.
echo  If the app crashed, check the error above.
echo  Press any key to close this window...
echo.
pause
