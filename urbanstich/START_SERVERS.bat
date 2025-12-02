@echo off
title UrbanStich - Backend + Frontend Servers
color 0A

echo.
echo ========================================
echo   UrbanStich E-Commerce Platform
echo   Starting Backend and Frontend Servers
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Checking backend dependencies...
cd /d "%~dp0\backend"
if not exist "node_modules" (
    echo        Installing backend dependencies...
    call npm install >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo        Backend dependencies installed
) else (
    echo        Backend dependencies OK
)

echo.
echo [2/4] Checking frontend dependencies...
cd /d "%~dp0\frontend"
if not exist "node_modules" (
    echo        Installing frontend dependencies...
    call npm install >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo        Frontend dependencies installed
) else (
    echo        Frontend dependencies OK
)

echo.
echo [3/4] Starting Backend Server (Port 4000)...
cd /d "%~dp0\backend"
start "UrbanStich Backend" cmd /k "title UrbanStich Backend && node server.js"

REM Wait for backend to start
timeout /t 2 /nobreak >nul

echo [4/4] Starting Frontend Server (Port 3000)...
cd /d "%~dp0\frontend"
start "UrbanStich Frontend" cmd /k "title UrbanStich Frontend && node server.js"

echo.
echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo   Backend API:  http://localhost:4000/api
echo   Frontend:     http://localhost:3000
echo.
echo   Two command windows have opened.
echo   Close them to stop the servers.
echo.
echo   Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul

REM Open browser
start http://localhost:3000

echo.
echo   Browser opened! If not, manually go to:
echo   http://localhost:3000
echo.
pause






