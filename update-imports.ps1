# ========================================
# IMPORT PATH UPDATER - Modular Architecture
# ========================================
# Usage: Run from project root
# Purpose: Update all relative imports to @/* path aliases

$srcPath = "c:\Users\Neverland Studio\Documents\Portofolio Muhammad Isaki Prananda\neverlandstudio\src"

Write-Host "🔄 Updating imports to @/* aliases..." -ForegroundColor Cyan
Write-Host ""

# Define replacements (old pattern -> new pattern)
$replacements = @{
    # Auth feature
    "from ['""]\.\.\/context\/AuthContext['""]" = "from '@/features/auth'"
    "from ['""]\.\.\/\.\.\/context\/AuthContext['""]" = "from '@/features/auth'"
    "from ['""]\.\.\/services\/authService['""]" = "from '@/features/auth'"
    "from ['""]\.\./\.\.\/services\/authService['""]" = "from '@/features/auth'"
    "from ['""]\.\.\/components\/auth\/" = "from '@/features/auth/components/"
    "from ['""]\.\.\/\.\.\/components\/auth\/" = "from '@/features/auth/components/"
    
    # Landing feature
    "from ['""]\.\.\/pages\/LandingPage['""]" = "from '@/features/landing'"
    "from ['""]\.\.\/\.\.\/pages\/LandingPage['""]" = "from '@/features/landing'"
    "from ['""]\.\.\/components\/sections\/" = "from '@/features/landing/components/sections/"
    "from ['""]\.\.\/\.\.\/components\/sections\/" = "from '@/features/landing/components/sections/"
    "from ['""]\.\.\/data\/" = "from '@/features/landing/data/"
    "from ['""]\.\.\/\.\.\/data\/" = "from '@/features/landing/data/"
    
    # Dashboard feature  
    "from ['""]\.\.\/pages\/Dashboard['""]" = "from '@/features/dashboard'"
    "from ['""]\.\.\/\.\.\/pages\/Dashboard['""]" = "from '@/features/dashboard'"
    "from ['""]\.\.\/pages\/dashboard\/" = "from '@/features/dashboard/pages/"
    "from ['""]\.\.\/\.\.\/pages\/dashboard\/" = "from '@/features/dashboard/pages/"
    
    # Shared components
    "from ['""]\.\.\/components\/ui\/" = "from '@/shared/components/ui/"
    "from ['""]\.\.\/\.\.\/components\/ui\/" = "from '@/shared/components/ui/"
    "from ['""]\.\.\/components\/layout\/" = "from '@/shared/components/layout/"
    "from ['""]\.\.\/\.\.\/components\/layout\/" = "from '@/shared/components/layout/"
    "from ['""]\.\.\/components\/common\/" = "from '@/shared/components/common/"
    "from ['""]\.\.\/\.\.\/components\/common\/" = "from '@/shared/components/common/"
    
    # Shared utilities
    "from ['""]\.\.\/types\/user['""]" = "from '@/shared/types'"
    "from ['""]\.\.\/\.\.\/types\/user['""]" = "from '@/shared/types'"
    "from ['""]\.\.\/utils\/" = "from '@/shared/utils'"
    "from ['""]\.\.\/\.\.\/utils\/" = "from '@/shared/utils'"
    "from ['""]\.\.\/hooks\/" = "from '@/shared/hooks'"
    "from ['""]\.\.\/\.\.\/hooks\/" = "from '@/shared/hooks'"
    "from ['""]\.\.\/constants\/" = "from '@/shared/constants'"
    "from ['""]\.\.\/\.\.\/constants\/" = "from '@/shared/constants'"
    
    # Core
    "from ['""]\.\.\/routes\/" = "from '@/core/routes/"
    "from ['""]\.\.\/\.\.\/routes\/" = "from '@/core/routes/"
}

# Get all .tsx and .ts files
$files = Get-ChildItem -Path $srcPath -Recurse -Include *.tsx,*.ts -File

$updatedCount = 0
$totalFiles = $files.Count

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    $fileUpdated = $false
    
    # Apply each replacement
    foreach ($pattern in $replacements.Keys) {
        $replacement = $replacements[$pattern]
        if ($content -match $pattern) {
            $content = $content -replace $pattern, $replacement
            $fileUpdated = $true
        }
    }
    
    # Save if changed
    if ($fileUpdated) {
        $content | Set-Content $file.FullName -NoNewline
        $updatedCount++
        $relativePath = $file.FullName.Replace($srcPath, "src")
        Write-Host "✅ Updated: $relativePath" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✨ Import update complete!" -ForegroundColor Cyan
Write-Host "📊 Files scanned: $totalFiles" -ForegroundColor Yellow
Write-Host "📝 Files updated: $updatedCount" -ForegroundColor Green
Write-Host ""
Write-Host "Next: Run 'npm run dev' to test!" -ForegroundColor Magenta
