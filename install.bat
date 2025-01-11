@echo off
echo Installing required modules...

call npm install cheerio
cls
call npm install dotenv
cls
call npm install discord
cls
call npm install discord.js
cls
call npm install axios
cls

echo Registering commands...
node src/register-cmds.js
pause
