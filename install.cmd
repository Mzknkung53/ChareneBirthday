@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
call npm install
echo.
echo Done. Run dev.cmd to start the site.
pause
