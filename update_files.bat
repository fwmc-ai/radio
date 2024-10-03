@echo off
for /r %%i in (*) do @if not "%%~dpi"=="%CD%\.git\" (
    echo Updating %%i
    copy /b "%%i"+,, "%%i" >nul
)
echo All files updated!