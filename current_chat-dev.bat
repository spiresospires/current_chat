@echo off
cd /d "%~dp0"
echo.
echo  Starting current_chat dev server...
echo  Open your browser at: http://localhost:5174
echo.
npx --yes http-server -p 5174 -c-1 -o /
