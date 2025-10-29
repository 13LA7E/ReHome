# Build script that uses JDK 21 for Android (Gradle 8.x doesn't support JDK 25 yet)
# Usage: .\build-with-jdk21.ps1

# Check if JDK 21 is installed
$jdk21Path = "C:\Program Files\Java\jdk-21"

if (Test-Path $jdk21Path) {
    Write-Host "Using JDK 21 for Android build..." -ForegroundColor Green
    $env:JAVA_HOME = $jdk21Path
    $env:PATH = "$jdk21Path\bin;" + $env:PATH
    
    # Navigate to android directory
    Set-Location $PSScriptRoot
    
    # Run Gradle build
    & .\gradlew.bat clean assembleDebug
} else {
    Write-Host "ERROR: JDK 21 not found at: $jdk21Path" -ForegroundColor Red
    Write-Host "Please install JDK 21 from: https://www.oracle.com/java/technologies/downloads/#java21" -ForegroundColor Yellow
    Write-Host "`nNote: Gradle 8.12 doesn't support JDK 25 yet. You need JDK 21 or earlier." -ForegroundColor Yellow
}
