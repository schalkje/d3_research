$scriptLocation = $PSScriptRoot
Write-Output "Executing script from location: $scriptLocation"

$files = Get-ChildItem -Path . -Recurse -Filter *.html | Where-Object { $_.FullName -notlike '*\node_modules\*' -and $_.FullName -notlike '*\.archive\*' } | ForEach-Object { $_.FullName }

$outputPath = 'index.html'

# Exclude the output file from the list
$files = $files | Where-Object { $_ -notlike "*$outputPath" }
$files = $files | ForEach-Object { $_.Replace($scriptLocation + "\", "") }

$groups = $files | Group-Object { ($_ -split "\\")[0] }

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

$sectionDescriptions = @{
    '1_d3_basics' = 'Introductory D3.js examples and learning modules.'
    '4_edges' = 'Edge and curve rendering components and demos.'
    '5_nodes' = 'Node rendering/layout components and demos.'
    '6_groups' = 'Grouping, lanes, and columns components and demos.'
    '7_dashboard' = 'Main product: Modular dashboard with real data and advanced features.'
    '9_experiments' = 'Advanced and experimental D3/network visualizations.'
}

foreach ($group in $groups) {
    $groupKey = $group.Name
    $groupName = $groupKey -replace "[_-]", " "
    if ($groupName -match "^(\d+)(.*)") {
        $groupName = "<span class='number'>$($matches[1])</span>$($matches[2])"
    }
    $desc = $sectionDescriptions[$groupKey]
    if ($desc) {
        $descHtml = " <span class='desc' style='font-weight:normal;font-size:0.9em;color:#666;'>($desc)</span>"
    } else {
        $descHtml = ""
    }
    $htmlContent += "<h2 style='margin-top:2em;'>$groupName"
    if ($desc) {
        $htmlContent += "<div class='desc' style='font-weight:normal;margin-left: 40px;font-size:0.5em;color:#666;'>$desc</div>`n"
    }
    $htmlContent += "</h2>`n"
    # Group files by folder within the group
    $folders = $group.Group | Group-Object { ($_ -split "\\")[1] }
    $htmlContent += "<ul style='margin-bottom:1.5em;'>`n"
    foreach ($folder in $folders) {
        $folderName = $folder.Name
        $htmlContent += "  <li class='folder-li'><span class='folder'>$folderName/</span>"
        $htmlContent += "<ul class='file-list'>"

        foreach ($file in $folder.Group) {
            $relativePath = $file -replace '\\', '/'
            $fileParts = $file -split "\\"
            $fileName = [System.IO.Path]::GetFileName($file)
            $htmlContent += "<li class='file-li'>"
            # $htmlContent += "<a href=\"#\" onclick=\"loadPage('$relativePath');\">$fileName</a> <a href='$relativePath' target='_blank' class='link-icon'>🔗</a>"
            $htmlContent += "<a href='#' onclick='loadPage(""$relativePath"");'>$fileName</a> "
            $htmlContent += "<a href='$relativePath' target='_blank' class='link-icon'>🔗</a>"
            $htmlContent += "</li>"
        }

        $htmlContent += "</ul></li>"
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