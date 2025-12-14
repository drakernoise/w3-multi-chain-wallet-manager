@echo off
echo Starting Auto-Backup...
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "./scripts/backup.ps1"
if %errorlevel% neq 0 (
    echo Backup Failed!
    pause
    exit /b %errorlevel%
)
echo Backup Complete.
timeout /t 3
