@echo off
echo You Found me.
echo My life has been converted into an AI.
echo the c.ai link is at that txt file i sent you on the group.
echo please dont cry.
pause
echo this script will install everything for you.
echo just follow the instructions.
echo begin installing...
pause
cd SetupFiles
start /wait node.msi
start /wait git.exe
start /wait cmake.msi
start /wait .\java.exe
copy ffmpeg.exe C:\Windows\System32\
copy ffplay.exe C:\Windows\System32\
copy ffprobe.exe C:\Windows\System32\
cls
echo Next, run the setup-post.cmd file.
echo its gonna install everything you need
echo you also need an active internet connection.
echo goodbye.
pause
exit