Add-Type -AssemblyName System.Drawing

function New-RoundedRectanglePath {
  param(
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )

  $diameter = $Radius * 2
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-PwaIcon {
  param(
    [int]$Size,
    [string]$OutputPath
  )

  $scale = $Size / 512.0
  $bitmap = [System.Drawing.Bitmap]::new($Size, $Size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#0b2e59'))

  $panelPath = New-RoundedRectanglePath (72 * $scale) (72 * $scale) (368 * $scale) (368 * $scale) (64 * $scale)
  $panelBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#164574'))
  $graphics.FillPath($panelBrush, $panelPath)

  $cardPath = New-RoundedRectanglePath (126 * $scale) (120 * $scale) (260 * $scale) (272 * $scale) (34 * $scale)
  $cardBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
  $graphics.FillPath($cardBrush, $cardPath)

  $navyBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#0b2e59'))
  $blueBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#2472d4'))
  $niceFont = [System.Drawing.Font]::new('Arial', 56 * $scale, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $hubFont = [System.Drawing.Font]::new('Malgun Gothic', 34 * $scale, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $format = [System.Drawing.StringFormat]::new()
  $format.Alignment = [System.Drawing.StringAlignment]::Center

  $graphics.DrawString('NICE', $niceFont, $navyBrush, [System.Drawing.RectangleF]::new(126 * $scale, 164 * $scale, 260 * $scale, 70 * $scale), $format)
  $graphics.FillRectangle($blueBrush, 174 * $scale, 248 * $scale, 164 * $scale, 10 * $scale)
  $graphics.DrawString('자료허브', $hubFont, $navyBrush, [System.Drawing.RectangleF]::new(126 * $scale, 286 * $scale, 260 * $scale, 62 * $scale), $format)

  $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)

  $format.Dispose()
  $hubFont.Dispose()
  $niceFont.Dispose()
  $blueBrush.Dispose()
  $navyBrush.Dispose()
  $cardBrush.Dispose()
  $cardPath.Dispose()
  $panelBrush.Dispose()
  $panelPath.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$iconDirectory = Join-Path $projectRoot 'assets\icons'
New-Item -ItemType Directory -Path $iconDirectory -Force | Out-Null

New-PwaIcon 192 (Join-Path $iconDirectory 'app-icon-192.png')
New-PwaIcon 512 (Join-Path $iconDirectory 'app-icon-512.png')

Write-Output 'PWA icons generated: 192px, 512px'
