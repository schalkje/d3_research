Param(
  [switch]$WhatIf
)

function Get-ThemeScriptPath {
  param([string]$Content)
  $m = [regex]::Match($Content, 'href="([^"]*dashboard/)flowdash\.css"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if($m.Success){ return ($m.Groups[1].Value + 'js/themeManager.js') }
  $m = [regex]::Match($Content, '(?:src|href)="([^"]*dashboard/)[^"]+"', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if($m.Success){ return ($m.Groups[1].Value + 'js/themeManager.js') }
  return $null
}

function Get-HeadIndent {
  param([string[]]$Lines)
  foreach($line in $Lines){
    if($line -match '^[\t ]+<(?:link|script)\b'){ return ($line -replace '(<.*)$','') }
  }
  return '    '
}

$htmlFiles = Get-ChildItem -Path . -Recurse -Include *.html | Where-Object { $_.FullName -notmatch '\\node_modules\\' }
$updated = 0
foreach($f in $htmlFiles){
  $content = Get-Content -LiteralPath $f.FullName -Raw
  if($content -notmatch 'dashboard/' ){ continue }
  if($content -match 'themeManager\.js'){ continue }
  if($content -notmatch '</head>'){ continue }
  $themePath = Get-ThemeScriptPath -Content $content
  if(-not $themePath){ continue }
  $lines = $content -split "\r?\n"
  $indent = Get-HeadIndent -Lines $lines
  $inject = @()
  $inject += "$indent<script>window.FLOWDASH_THEME = { default: 'light' };</script>"
  $inject += ($indent + '<script src="' + $themePath + '"></script>')
  $replacement = ($inject -join [Environment]::NewLine) + [Environment]::NewLine + '</head>'
  $new = $content.Replace('</head>', $replacement)
  if(-not $WhatIf){
    if($new -and ($new -match 'themeManager\.js')){
      Set-Content -LiteralPath $f.FullName -Value $new -NoNewline
      $updated++
      Write-Host "Injected theme into: $($f.FullName)"
    }
  } else {
    $updated++
    Write-Host "Would inject theme into: $($f.FullName)"
  }
}

Write-Host "Updated $updated HTML files"


