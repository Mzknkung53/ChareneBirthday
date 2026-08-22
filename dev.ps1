$nodeDir = "C:\Program Files\nodejs"
$env:Path = "$nodeDir;" + [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
Set-Location $PSScriptRoot
& "$nodeDir\npm.cmd" run dev
