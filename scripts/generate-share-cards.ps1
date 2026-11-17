param(
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$libraryPath = Join-Path $ProjectRoot 'assets\data\library.json'
$outputDirectory = Join-Path $ProjectRoot 'assets\share-cards'
$library = Get-Content -LiteralPath $libraryPath -Raw -Encoding UTF8 | ConvertFrom-Json
[System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null

function New-RoundedPath {
  param([float]$X, [float]$Y, [float]$Width, [float]$Height, [float]$Radius)
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $diameter = $Radius * 2
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Get-Label {
  param($Items, [string]$Id, [string]$Fallback)
  $match = $Items | Where-Object { $_.id -eq $Id } | Select-Object -First 1
  if ($match -and $match.label) { return [string]$match.label }
  return $Fallback
}

function Draw-Pill {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Text,
    [float]$X,
    [float]$Y,
    [System.Drawing.Font]$Font,
    [System.Drawing.Color]$Background,
    [System.Drawing.Color]$Foreground,
    [float]$Height = 42,
    [float]$PaddingX = 18
  )
  $textWidth = $Graphics.MeasureString($Text, $Font).Width
  $pillWidth = [Math]::Ceiling($textWidth + ($PaddingX * 2))
  $path = New-RoundedPath -X $X -Y $Y -Width $pillWidth -Height $Height -Radius ($Height / 2)
  $brush = [System.Drawing.SolidBrush]::new($Background)
  $textBrush = [System.Drawing.SolidBrush]::new($Foreground)
  $format = [System.Drawing.StringFormat]::new()
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $Graphics.FillPath($brush, $path)
  $Graphics.DrawString($Text, $Font, $textBrush, [System.Drawing.RectangleF]::new($X + $PaddingX, $Y, $textWidth + 4, $Height), $format)
  $format.Dispose()
  $textBrush.Dispose()
  $brush.Dispose()
  $path.Dispose()
  return [float]$pillWidth
}

function Get-WrappedLines {
  param(
    [System.Drawing.Graphics]$Graphics,
    [string]$Text,
    [System.Drawing.Font]$Font,
    [float]$MaxWidth,
    [int]$MaxLines
  )
  $lines = [System.Collections.Generic.List[string]]::new()
  $current = ''
  foreach ($character in $Text.ToCharArray()) {
    $candidate = $current + $character
    if ($current.Length -gt 0 -and $Graphics.MeasureString($candidate, $Font).Width -gt $MaxWidth) {
      $lines.Add($current.TrimEnd())
      $current = [string]$character
    } else {
      $current = $candidate
    }
  }
  if ($current) { $lines.Add($current.TrimEnd()) }
  if ($lines.Count -gt $MaxLines) {
    while ($lines.Count -gt $MaxLines) { $lines.RemoveAt($lines.Count - 1) }
    $last = $lines[$MaxLines - 1]
    while ($last.Length -gt 0 -and $Graphics.MeasureString($last + '…', $Font).Width -gt $MaxWidth) {
      $last = $last.Substring(0, $last.Length - 1)
    }
    $lines[$MaxLines - 1] = $last.TrimEnd() + '…'
  }
  return $lines
}

function Draw-CoverImage {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.Image]$Image,
    [System.Drawing.RectangleF]$Bounds,
    [float]$Radius = 24
  )
  $path = New-RoundedPath -X $Bounds.X -Y $Bounds.Y -Width $Bounds.Width -Height $Bounds.Height -Radius $Radius
  $state = $Graphics.Save()
  $Graphics.SetClip($path)
  if ($Image) {
    $scale = [Math]::Max($Bounds.Width / $Image.Width, $Bounds.Height / $Image.Height)
    $drawWidth = $Image.Width * $scale
    $drawHeight = $Image.Height * $scale
    $destination = [System.Drawing.RectangleF]::new(
      $Bounds.X + (($Bounds.Width - $drawWidth) / 2),
      $Bounds.Y + (($Bounds.Height - $drawHeight) / 2),
      $drawWidth,
      $drawHeight
    )
    $Graphics.DrawImage($Image, $destination)
  } else {
    $fallback = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
      $Bounds,
      [System.Drawing.ColorTranslator]::FromHtml('#eef5ff'),
      [System.Drawing.ColorTranslator]::FromHtml('#dbeaff'),
      35
    )
    $Graphics.FillRectangle($fallback, $Bounds)
    $fallback.Dispose()
  }
  $Graphics.Restore($state)
  $border = [System.Drawing.Pen]::new([System.Drawing.ColorTranslator]::FromHtml('#dbe6f4'), 2)
  $Graphics.DrawPath($border, $path)
  $border.Dispose()
  $path.Dispose()
}

$fontRegular = [System.Drawing.Font]::new('Malgun Gothic', 18, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fontSmall = [System.Drawing.Font]::new('Malgun Gothic', 20, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$fontPill = [System.Drawing.Font]::new('Malgun Gothic', 22, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fontTitle = [System.Drawing.Font]::new('Malgun Gothic', 42, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fontBrand = [System.Drawing.Font]::new('Malgun Gothic', 38, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$fontBrandSub = [System.Drawing.Font]::new('Malgun Gothic', 20, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg' | Select-Object -First 1
$encoderParameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
$encoderParameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]92)

try {
  foreach ($material in $library.materials) {
    $bitmap = [System.Drawing.Bitmap]::new(1200, 630)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
    $image = $null

    try {
      $background = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        [System.Drawing.Rectangle]::new(0, 0, 1200, 630),
        [System.Drawing.ColorTranslator]::FromHtml('#f8fbff'),
        [System.Drawing.ColorTranslator]::FromHtml('#edf4fc'),
        25
      )
      $graphics.FillRectangle($background, 0, 0, 1200, 630)
      $background.Dispose()

      $header = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        [System.Drawing.Rectangle]::new(0, 0, 1200, 108),
        [System.Drawing.ColorTranslator]::FromHtml('#092f59'),
        [System.Drawing.ColorTranslator]::FromHtml('#1d72cf'),
        0
      )
      $graphics.FillRectangle($header, 0, 0, 1200, 108)
      $header.Dispose()

      $whiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
      $blueWhiteBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#d6e9ff'))
      $graphics.DrawString('NICE HUB', $fontBrand, $whiteBrush, 58, 25)
      $graphics.DrawString('현장 영업 자료허브', $fontBrandSub, $blueWhiteBrush, 260, 43)
      [void](Draw-Pill -Graphics $graphics -Text '고객 공유 자료' -X 960 -Y 31 -Font $fontSmall -Background ([System.Drawing.Color]::FromArgb(45, 255, 255, 255)) -Foreground ([System.Drawing.Color]::White) -Height 46 -PaddingX 20)

      $shadowBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(18, 30, 65, 105))
      $shadowPath = New-RoundedPath -X 48 -Y 140 -Width 1104 -Height 444 -Radius 32
      $graphics.FillPath($shadowBrush, $shadowPath)
      $shadowPath.Dispose()
      $shadowBrush.Dispose()

      $cardPath = New-RoundedPath -X 42 -Y 132 -Width 1116 -Height 444 -Radius 32
      $graphics.FillPath($whiteBrush, $cardPath)
      $cardPath.Dispose()

      $thumbnailPath = if ($material.thumbnail) { Join-Path $ProjectRoot ([string]$material.thumbnail).Replace('/', '\') } else { '' }
      if ($thumbnailPath -and (Test-Path -LiteralPath $thumbnailPath)) { $image = [System.Drawing.Image]::FromFile($thumbnailPath) }
      Draw-CoverImage -Graphics $graphics -Image $image -Bounds ([System.Drawing.RectangleF]::new(72, 162, 470, 326))

      $categoryLabel = Get-Label -Items $library.categories -Id $material.category -Fallback 'NICE HUB'
      $typeLabel = Get-Label -Items $library.materialTypes -Id $material.type -Fallback '자료'
      $pillX = 590
      $pillX += (Draw-Pill -Graphics $graphics -Text $categoryLabel -X $pillX -Y 172 -Font $fontPill -Background ([System.Drawing.ColorTranslator]::FromHtml('#eaf3ff')) -Foreground ([System.Drawing.ColorTranslator]::FromHtml('#1769c7'))) + 12
      [void](Draw-Pill -Graphics $graphics -Text $typeLabel -X $pillX -Y 172 -Font $fontPill -Background ([System.Drawing.ColorTranslator]::FromHtml('#eef2f7')) -Foreground ([System.Drawing.ColorTranslator]::FromHtml('#42566f')))

      $titleBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#10233f'))
      $lines = Get-WrappedLines -Graphics $graphics -Text ([string]$material.title) -Font $fontTitle -MaxWidth 500 -MaxLines 3
      for ($lineIndex = 0; $lineIndex -lt $lines.Count; $lineIndex++) {
        $graphics.DrawString($lines[$lineIndex], $fontTitle, $titleBrush, 590, (235 + ($lineIndex * 59)))
      }

      $noticePath = New-RoundedPath -X 590 -Y 438 -Width 500 -Height 58 -Radius 16
      $noticeBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#f1f7ff'))
      $graphics.FillPath($noticeBrush, $noticePath)
      $noticeBrush.Dispose()
      $noticePath.Dispose()
      $checkBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#1769c7'))
      $graphics.FillEllipse($checkBrush, 606, 453, 28, 28)
      $checkPen = [System.Drawing.Pen]::new([System.Drawing.Color]::White, 3)
      $graphics.DrawLine($checkPen, 613, 467, 618, 472)
      $graphics.DrawLine($checkPen, 618, 472, 627, 461)
      $noticeTextBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#244466'))
      $graphics.DrawString('항상 최신 자료로 연결됩니다', $fontPill, $noticeTextBrush, 648, 451)
      $footerBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#6a7e95'))
      $graphics.DrawString('NICE HUB에서 안전하고 편리하게 확인하세요', $fontRegular, $footerBrush, 590, 525)

      $outputPath = Join-Path $outputDirectory (([string]$material.id) + '.jpg')
      $bitmap.Save($outputPath, $jpegEncoder, $encoderParameters)
      Write-Host ('Generated ' + (Split-Path -Leaf $outputPath))

      $footerBrush.Dispose()
      $noticeTextBrush.Dispose()
      $checkPen.Dispose()
      $checkBrush.Dispose()
      $titleBrush.Dispose()
      $blueWhiteBrush.Dispose()
      $whiteBrush.Dispose()
    } finally {
      if ($image) { $image.Dispose() }
      $graphics.Dispose()
      $bitmap.Dispose()
    }
  }
} finally {
  $encoderParameters.Dispose()
  $fontBrandSub.Dispose()
  $fontBrand.Dispose()
  $fontTitle.Dispose()
  $fontPill.Dispose()
  $fontSmall.Dispose()
  $fontRegular.Dispose()
}

Write-Host ("Generated {0} NICE HUB share cards." -f $library.materials.Count)
