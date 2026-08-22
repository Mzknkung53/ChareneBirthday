$nodeDir = "C:\Program Files\nodejs"
$env:Path = "$nodeDir;" + $env:Path
Set-Location $PSScriptRoot

Write-Host "Node: $( & "$nodeDir\node.exe" -v )"
Write-Host "npm:  $( & "$nodeDir\npm.cmd" -v )"
Write-Host ""
Write-Host "PATH updated for this session."
Write-Host "You can now run: npm i   or   npm run dev"
