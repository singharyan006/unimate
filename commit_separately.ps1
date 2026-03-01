$files = git status --porcelain | ForEach-Object { $_.Substring(3) }
if ($files.Count -eq 0) { Write-Host 'No files to commit'; exit }

$count = 0
foreach ($file in $files) {
    # remove quotes if any
    $file = $file -replace '"', ''
    git add "$file"
    
    $msg = "Update $file"
    
    if ($count -lt 5) {
        $env:GIT_COMMITTER_DATE="2026-02-26T12:00:00"
        git commit --date="2026-02-26T12:00:00" -m "$msg"
    } else {
        $env:GIT_COMMITTER_DATE="2026-03-01T12:00:00"
        git commit --date="2026-03-01T12:00:00" -m "$msg"
    }
    $count++
}
