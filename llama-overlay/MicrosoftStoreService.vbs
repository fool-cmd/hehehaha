Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\PREDATOR\Desktop\the mcq project\llama-overlay"
WshShell.Run "cmd /c npm start", 0, False
Set WshShell = Nothing
