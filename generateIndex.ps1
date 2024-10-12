$scriptLocation = $PSScriptRoot
Write-Output "Executing script from location: $scriptLocation"

$files = Get-ChildItem -Path . -Recurse -Filter *.html | ForEach-Object { $_.FullName }

$outputPath = 'index.html'

# Exclude the output file from the list
$files = $files | Where-Object { $_ -notlike "*$outputPath" }
$files = $files | ForEach-Object { $_.Replace($scriptLocation + "\", "") }

$groups = $files | Group-Object { ($_ -split "\\" | Select-Object -First 1) }

$htmlContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Index of HTML Files</title>
</head>
<body>
    <h1>Index of HTML Files</h1>
"@

foreach ($group in $groups) {
    $htmlContent += "<h2>$($group.Name)</h2>`n"
    $htmlContent += "<ul>`n"
    foreach ($file in $group.Group) {
        $relativePath = $file -replace '\\', '/'
        $fileParts = $file -split "\\"
        $folderName = $fileParts[1]
        $fileName = [System.IO.Path]::GetFileName($file)
        $displayName = if ($folderName) { "$folderName/$fileName" } else { $fileName }
        $htmlContent += "    <li>$folderName/<a href='$relativePath'>$fileName</a></li>`n"
    }
    $htmlContent += "</ul>`n"
}

$htmlContent += @"
</body>
</html>
"@

Set-Content -Path $outputPath -Value $htmlContent
Write-Output "Index file generated: $outputPath"