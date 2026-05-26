import AppKit
import AVFoundation
import CoreGraphics
import CoreVideo
import Foundation

let width = 1080
let height = 1920
let fps: Int32 = 30
let durationSeconds = 8
let frameCount = Int(fps) * durationSeconds
let outputDir = URL(fileURLWithPath: FileManager.default.currentDirectoryPath).appendingPathComponent("videos")
try FileManager.default.createDirectory(at: outputDir, withIntermediateDirectories: true)

struct VideoSpec {
  let filename: String
  let hook: String
  let subhook: String
  let style: String
  let cta: String
}

let specs = [
  VideoSpec(
    filename: "rescue-rush-01-one-percent.mp4",
    hook: "ONLY 1% CLEAR LEVEL 2",
    subhook: "120 tiles. 7 slots. One bad route.",
    style: "challenge",
    cta: "PLAY FREE IN BROWSER"
  ),
  VideoSpec(
    filename: "rescue-rush-02-wrong-tap.mp4",
    hook: "ONE WRONG TAP RUINS IT",
    subhook: "The rescue looks easy... until the tray fills.",
    style: "wrong",
    cta: "CAN YOU SAVE THEM?"
  ),
  VideoSpec(
    filename: "rescue-rush-03-country-clash.mp4",
    hook: "CAN YOUR COUNTRY SAVE MORE?",
    subhook: "Save pets. Push your country up.",
    style: "country",
    cta: "JOIN TODAY'S RESCUE"
  )
]

func clamp(_ value: CGFloat, _ low: CGFloat = 0, _ high: CGFloat = 1) -> CGFloat {
  min(max(value, low), high)
}

func ease(_ t: CGFloat) -> CGFloat {
  let t = clamp(t)
  return t * t * (3 - 2 * t)
}

func color(_ hex: UInt32, _ alpha: CGFloat = 1) -> CGColor {
  CGColor(
    red: CGFloat((hex >> 16) & 255) / 255,
    green: CGFloat((hex >> 8) & 255) / 255,
    blue: CGFloat(hex & 255) / 255,
    alpha: alpha
  )
}

func fillRound(_ ctx: CGContext, _ rect: CGRect, _ radius: CGFloat, _ fill: CGColor, stroke: CGColor? = nil, line: CGFloat = 0) {
  let path = CGPath(roundedRect: rect, cornerWidth: radius, cornerHeight: radius, transform: nil)
  ctx.addPath(path)
  ctx.setFillColor(fill)
  ctx.fillPath()
  if let stroke {
    ctx.addPath(path)
    ctx.setStrokeColor(stroke)
    ctx.setLineWidth(line)
    ctx.strokePath()
  }
}

func drawText(
  _ ctx: CGContext,
  _ text: String,
  rect: CGRect,
  size: CGFloat,
  weight: NSFont.Weight = .bold,
  color fill: NSColor = .white,
  align: NSTextAlignment = .center
) {
  ctx.saveGState()
  let paragraph = NSMutableParagraphStyle()
  paragraph.alignment = align
  paragraph.lineBreakMode = .byWordWrapping
  let attrs: [NSAttributedString.Key: Any] = [
    .font: NSFont.systemFont(ofSize: size, weight: weight),
    .foregroundColor: fill,
    .paragraphStyle: paragraph
  ]
  let graphics = NSGraphicsContext(cgContext: ctx, flipped: false)
  NSGraphicsContext.saveGraphicsState()
  NSGraphicsContext.current = graphics
  (text as NSString).draw(with: rect, options: [.usesLineFragmentOrigin, .usesFontLeading], attributes: attrs)
  NSGraphicsContext.restoreGraphicsState()
  ctx.restoreGState()
}

func drawBackground(_ ctx: CGContext, _ t: CGFloat, style: String) {
  let baseA: UInt32 = style == "country" ? 0xE7F5FF : 0xFFF0CF
  let baseB: UInt32 = style == "wrong" ? 0xFFE1DD : 0xDDF8EE
  let gradient = CGGradient(
    colorsSpace: CGColorSpaceCreateDeviceRGB(),
    colors: [color(baseA), color(baseB), color(0xF5E9FF)] as CFArray,
    locations: [0, 0.52, 1]
  )!
  ctx.drawLinearGradient(gradient, start: CGPoint(x: 0, y: 0), end: CGPoint(x: CGFloat(width), y: CGFloat(height)), options: [])
  ctx.setFillColor(color(0xFFFFFF, 0.22))
  for i in stride(from: -height, through: width, by: 80) {
    ctx.fill(CGRect(x: CGFloat(i) + sin(t * 6) * 18, y: 0, width: 24, height: CGFloat(height)))
  }
}

func drawPhone(_ ctx: CGContext) {
  fillRound(ctx, CGRect(x: 108, y: 285, width: 864, height: 1260), 70, color(0xFFFFFF, 0.9), stroke: color(0xFFFFFF, 0.9), line: 3)
  fillRound(ctx, CGRect(x: 140, y: 330, width: 800, height: 1168), 52, color(0xFFF7E9, 0.9), stroke: color(0x172033, 0.12), line: 4)
  fillRound(ctx, CGRect(x: 185, y: 370, width: 710, height: 86), 32, color(0x172033), stroke: nil)
  drawText(ctx, "RESCUE RUSH", rect: CGRect(x: 190, y: 390, width: 700, height: 46), size: 36, color: NSColor(calibratedRed: 1, green: 0.76, blue: 0.25, alpha: 1))
}

func tileColor(_ index: Int) -> CGColor {
  let colors: [UInt32] = [0xF6C558, 0xFFB3A6, 0xF6A9C8, 0x9ED8FF, 0x86C97D, 0xD49A58, 0xD6E5D1]
  return color(colors[index % colors.count])
}

func drawTile(_ ctx: CGContext, x: CGFloat, y: CGFloat, icon: String, scale: CGFloat, locked: Bool = false, warn: Bool = false) {
  let s = 92 * scale
  fillRound(ctx, CGRect(x: x, y: y + 10 * scale, width: s, height: s), 18 * scale, color(0x253114, locked ? 0.25 : 0.16), stroke: nil)
  fillRound(ctx, CGRect(x: x, y: y, width: s, height: s), 18 * scale, locked ? color(0xB8C0A6) : color(0xF7FFE0), stroke: warn ? color(0xFF3B30) : color(0x4F7C20), line: warn ? 8 : 4)
  drawText(ctx, icon, rect: CGRect(x: x, y: y + 14 * scale, width: s, height: s), size: 50 * scale, color: .black)
}

func drawBoard(_ ctx: CGContext, progress: CGFloat, style: String) {
  fillRound(ctx, CGRect(x: 175, y: 520, width: 730, height: 690), 34, color(0xFFFFFF, 0.6), stroke: color(0x172033, 0.08), line: 3)
  let icons = ["DOG", "CAT", "RAB", "FOX", "PUP", "PET", "PAW", "KIT"]
  let rows = 6
  let cols = 6
  let wave = ease((progress - 0.08) / 0.45)
  for row in 0..<rows {
    for col in 0..<cols {
      let i = row * cols + col
      let offset = CGFloat((row + col) % 3) * 18
      let x = 220 + CGFloat(col) * 104 + offset * 0.15
      let y = 580 + CGFloat(row) * 86 - offset
      let appear = clamp((wave * CGFloat(rows * cols) - CGFloat(i)) / 5)
      if appear > 0.02 {
        let locked = i % 4 == 0 && progress < 0.62
        let warn = style == "wrong" && i == 20 && progress > 0.43 && progress < 0.62
        drawTile(ctx, x: x, y: y + (1 - appear) * 70, icon: icons[i % icons.count], scale: 0.82 + appear * 0.16, locked: locked, warn: warn)
      }
    }
  }
}

func drawTray(_ ctx: CGContext, progress: CGFloat, style: String) {
  fillRound(ctx, CGRect(x: 160, y: 1270, width: 760, height: 142), 34, color(0x9C5C16), stroke: color(0x5B3109), line: 5)
  fillRound(ctx, CGRect(x: 195, y: 1298, width: 690, height: 88), 24, color(0x6B3A0D), stroke: nil)
  let fillCount = style == "wrong" ? Int(clamp((progress - 0.22) / 0.48) * 7) : Int(clamp((progress - 0.24) / 0.55) * 5)
  for i in 0..<7 {
    let x = 206 + CGFloat(i) * 96
    fillRound(ctx, CGRect(x: x, y: 1306, width: 76, height: 76), 16, color(0xFFFFFF, 0.2), stroke: color(0xFFFFFF, 0.25), line: 2)
    if i < fillCount {
      drawTile(ctx, x: x + 2, y: 1307, icon: ["DOG", "CAT", "FOX", "PET", "PUP", "RAB", "PAW"][i], scale: 0.78, warn: style == "wrong" && i >= 5)
    }
  }
  if style == "wrong" && fillCount >= 6 {
    drawText(ctx, "TRAY ALMOST FULL", rect: CGRect(x: 195, y: 1420, width: 690, height: 56), size: 40, color: NSColor(calibratedRed: 1, green: 0.18, blue: 0.12, alpha: 1))
  }
}

func drawLeaderboard(_ ctx: CGContext, progress: CGFloat) {
  let reveal = ease((progress - 0.24) / 0.38)
  if reveal <= 0 { return }
  fillRound(ctx, CGRect(x: 185, y: 540, width: 710, height: 520), 34, color(0xFFFFFF, 0.88), stroke: color(0x172033, 0.1), line: 3)
  drawText(ctx, "TODAY'S RESCUE BOARD", rect: CGRect(x: 210, y: 575, width: 660, height: 54), size: 42, color: NSColor(calibratedRed: 0.09, green: 0.13, blue: 0.2, alpha: 1))
  let countries = [("1", "USA", "128,400"), ("2", "BRAZIL", "119,200"), ("3", "JAPAN", "111,400"), ("4", "UK", "102,600")]
  for (idx, row) in countries.enumerated() {
    let y = 660 + CGFloat(idx) * 86
    fillRound(ctx, CGRect(x: 235, y: y, width: 610, height: 64), 18, idx == 0 ? color(0xFFD966) : color(0xF4F7FA), stroke: color(0x172033, 0.08), line: 2)
    drawText(ctx, "\(row.0). \(row.1)", rect: CGRect(x: 260, y: y + 12, width: 310, height: 42), size: 34, color: NSColor(calibratedRed: 0.09, green: 0.13, blue: 0.2, alpha: reveal))
    drawText(ctx, row.2, rect: CGRect(x: 590, y: y + 12, width: 230, height: 42), size: 32, color: NSColor(calibratedRed: 0.38, green: 0.42, blue: 0.5, alpha: reveal))
  }
}

func drawFrame(ctx: CGContext, spec: VideoSpec, frame: Int) {
  let p = CGFloat(frame) / CGFloat(frameCount - 1)
  drawBackground(ctx, p, style: spec.style)
  let bump = 1 + 0.025 * sin(p * .pi * 10)
  ctx.saveGState()
  ctx.translateBy(x: CGFloat(width) * (1 - bump) / 2, y: 0)
  ctx.scaleBy(x: bump, y: 1)
  drawPhone(ctx)
  if spec.style == "country" {
    drawLeaderboard(ctx, progress: p)
  } else {
    drawBoard(ctx, progress: p, style: spec.style)
    drawTray(ctx, progress: p, style: spec.style)
  }
  ctx.restoreGState()

  fillRound(ctx, CGRect(x: 80, y: 84, width: 920, height: 220), 46, color(0x172033, 0.94), stroke: color(0xFFFFFF, 0.18), line: 3)
  drawText(ctx, spec.hook, rect: CGRect(x: 120, y: 116, width: 840, height: 92), size: 58, color: .white)
  drawText(ctx, spec.subhook, rect: CGRect(x: 130, y: 214, width: 820, height: 48), size: 30, weight: .semibold, color: NSColor(calibratedRed: 1, green: 0.84, blue: 0.36, alpha: 1))

  let ctaAlpha = ease((p - 0.64) / 0.18)
  if ctaAlpha > 0 {
    fillRound(ctx, CGRect(x: 132, y: 1600, width: 816, height: 140), 44, color(0xFF5F58, ctaAlpha), stroke: color(0xFFFFFF, 0.55 * ctaAlpha), line: 4)
    drawText(ctx, spec.cta, rect: CGRect(x: 162, y: 1638, width: 756, height: 64), size: 52, color: NSColor(calibratedRed: 1, green: 1, blue: 1, alpha: ctaAlpha))
    drawText(ctx, "RescueRush.online", rect: CGRect(x: 220, y: 1758, width: 640, height: 42), size: 32, weight: .semibold, color: NSColor(calibratedRed: 0.09, green: 0.13, blue: 0.2, alpha: ctaAlpha))
  }
}

func makePixelBuffer() -> CVPixelBuffer {
  var pixelBuffer: CVPixelBuffer?
  let attrs: [CFString: Any] = [
    kCVPixelBufferCGImageCompatibilityKey: true,
    kCVPixelBufferCGBitmapContextCompatibilityKey: true,
    kCVPixelBufferPixelFormatTypeKey: kCVPixelFormatType_32ARGB
  ]
  CVPixelBufferCreate(kCFAllocatorDefault, width, height, kCVPixelFormatType_32ARGB, attrs as CFDictionary, &pixelBuffer)
  return pixelBuffer!
}

func renderVideo(_ spec: VideoSpec) throws {
  let outputURL = outputDir.appendingPathComponent(spec.filename)
  try? FileManager.default.removeItem(at: outputURL)
  let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
  let settings: [String: Any] = [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: width,
    AVVideoHeightKey: height,
    AVVideoCompressionPropertiesKey: [
      AVVideoAverageBitRateKey: 6_000_000,
      AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel
    ]
  ]
  let input = AVAssetWriterInput(mediaType: .video, outputSettings: settings)
  input.expectsMediaDataInRealTime = false
  let adaptor = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: input, sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32ARGB,
    kCVPixelBufferWidthKey as String: width,
    kCVPixelBufferHeightKey as String: height
  ])
  writer.add(input)
  writer.startWriting()
  writer.startSession(atSourceTime: .zero)

  for frame in 0..<frameCount {
    while !input.isReadyForMoreMediaData {
      Thread.sleep(forTimeInterval: 0.002)
    }
    let pb = makePixelBuffer()
    CVPixelBufferLockBaseAddress(pb, [])
    let bytesPerRow = CVPixelBufferGetBytesPerRow(pb)
    let ctx = CGContext(
      data: CVPixelBufferGetBaseAddress(pb),
      width: width,
      height: height,
      bitsPerComponent: 8,
      bytesPerRow: bytesPerRow,
      space: CGColorSpaceCreateDeviceRGB(),
      bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue
    )!
    drawFrame(ctx: ctx, spec: spec, frame: frame)
    CVPixelBufferUnlockBaseAddress(pb, [])
    adaptor.append(pb, withPresentationTime: CMTime(value: CMTimeValue(frame), timescale: fps))
  }
  input.markAsFinished()
  let semaphore = DispatchSemaphore(value: 0)
  writer.finishWriting {
    semaphore.signal()
  }
  semaphore.wait()
  print("Wrote \(outputURL.path)")
}

for spec in specs {
  try renderVideo(spec)
}
