@echo off
echo Installing required packages for Legal Chatbot...

echo.
echo Installing validators package...
pip install validators

echo.
echo Installing other missing dependencies...
pip install -r requirements.txt

echo.
echo Checking for correct installations:
python -c "import validators; print('validators package is installed successfully!')"
python -c "from docx import Document; print('python-docx is installed successfully!')"
python -c "from flask import Flask; print('flask is installed successfully!')"

echo.
echo Installation completed. 
echo If you see any errors above, try running: pip install -r requirements.txt --force-reinstall
pause
