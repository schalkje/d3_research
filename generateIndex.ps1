$scriptLocation = $PSScriptRoot
Write-Output "Executing script from location: $scriptLocation"

$files = Get-ChildItem -Path . -Recurse -Filter *.html | Where-Object { $_.FullName -notlike '*\node_modules\*' } | ForEach-Object { $_.FullName }

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
    <link rel="stylesheet" type="text/css" href="style.css">
    <script>
        function loadPage(path) {
            document.getElementById('viewer').src = path;
        }
    </script>
</head>
<body>
    <div id="index">
        <h1>Index of HTML Files</h1>
"@

foreach ($group in $groups) {
    # Replace underscores and hyphens with spaces in the group name
    $groupName = $group.Name -replace "[_-]", " "
    # Check if the first part is a number and surround it with a span
    if ($groupName -match "^(\d+)(.*)") {
        $groupName = "<span class='number'>$($matches[1])</span>$($matches[2])"
    }
    $htmlContent += "<h2>$groupName</h2>`n"
    $htmlContent += "<ul>`n"
    foreach ($file in $group.Group) {
        $relativePath = $file -replace '\\', '/'
        $fileParts = $file -split "\\"
        $folderName = $fileParts[1]
        $fileName = [System.IO.Path]::GetFileName($file)
        $displayName = if ($folderName) { "$folderName/$fileName" } else { $fileName }
        $htmlContent += "    <li><span class='folder'>$folderName/</span><a href='#' onclick='loadPage(""$relativePath"");'>$fileName</a> <a href='$relativePath' target='_blank' class='link-icon'>🔗</a></li>`n"
    }
    $htmlContent += "</ul>`n"
}

$htmlContent += @"
    </div>
    <iframe id="viewer"></iframe>
</body>
</html>
"@

Set-Content -Path $outputPath -Value $htmlContent
Write-Output "Index file generated: $outputPath"