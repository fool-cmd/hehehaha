Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get the folder where this script is located
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
appDir = scriptDir & "\llama-overlay"

' Check if node_modules exist — if not, run setup first (visible)
If Not fso.FolderExists(appDir & "\node_modules\electron") Then
    WshShell.CurrentDirectory = scriptDir
    WshShell.Run "cmd /k """ & scriptDir & "\setup_and_run.bat""", 1, True
Else
    ' Run the app completely hidden (no terminal window)
    WshShell.CurrentDirectory = appDir
    WshShell.Run "cmd /c npm start", 0, False
End If

Set fso = Nothing
Set WshShell = Nothing
