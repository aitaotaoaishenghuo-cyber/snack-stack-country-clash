import AppKit
import AVFoundation
import CoreGraphics
import CoreVideo
import Foundation

let width = 1080
let height = 1920
let fps: Int32 = 30
let durationSeconds = 12
let frameCount = Int(fps) * durationSeconds
let outputDir = URL(fileURLWithPath: FileManager.default.currentDirectoryPath).appendingPathComponent("videos")
try FileManager.default.createDirectory(at: outputDir, withIntermediateDirectories: true)
let outputURL = outputDir.appendingPathComponent("rescue-rush-cinematic-wrong-tap.mp4")
try? FileManager.default.removeItem(at: outputURL)

enum Animal: String {
  case panda = "PANDA"
  case capybara = "CAPY"
  case sheep = "SHEEP"
  case lion = "LION"
  case kitten = "KITTEN"
}

struct Tile {
  let animal: Animal
  let x: CGFloat
  let y: CGFloat
  let layer: Int
}

let baseTiles: [Tile] = [
  Tile(animal: .lion, x: 220, y: 530, layer: 0),
  Tile(animal: .panda, x: 350, y: 530, layer: 0),
  Tile(animal: .capybara, x: 480, y: 530, layer: 0),
  Tile(animal: .lion, x: 610, y: 530, layer: 0),
  Tile(animal: .sheep, x: 740, y: 530, layer: 0),
  Tile(animal: .panda, x: 285, y: 660, layer: 1),
  Tile(animal: .lion, x: 415, y: 660, layer: 1),
  Tile(animal: .kitten, x: 545, y: 660, layer: 1),
  Tile(animal: .lion, x: 675, y: 660, layer: 1),
  Tile(animal: .capybara, x: 350, y: 790, layer: 2),
  Tile(animal: .sheep, x: 480, y: 790, layer: 2),
  Tile(animal: .lion, x: 610, y: 790, layer: 2),
  Tile(animal: .sheep, x: 415, y: 920, layer: 3),
  Tile(animal: .sheep, x: 545, y: 920, layer: 3),
  Tile(animal: .panda, x: 480, y: 1050, layer: 4)
]

func clamp(_ value: CGFloat, _ low: CGFloat = 0, _ high: CGFloat = 1) -> CGFloat {
  min(max(value, low), high)
}

func smooth(_ t: CGFloat) -> CGFloat {
  let t = clamp(t)
  return t * t * (3 - 2 * t)
}

func ramp(_ p: CGFloat, _ a: CGFloat, _ b: CGFloat) -> CGFloat {
  smooth((p - a) / (b - a))
}

func c(_ hex: UInt32, _ alpha: CGFloat = 1) -> CGColor {
  CGColor(
    red: CGFloat((hex >> 16) & 255) / 255,
    green: CGFloat((hex >> 8) & 255) / 255,
    blue: CGFloat(hex & 255) / 255,
    alpha: alpha
  )
}

func ns(_ hex: UInt32, _ alpha: CGFloat = 1) -> NSColor {
  NSColor(
    calibratedRed: CGFloat((hex >> 16) & 255) / 255,
    green: CGFloat((hex >> 8) & 255) / 255,
    blue: CGFloat(hex & 255) / 255,
    alpha: alpha
  )
}

func roundRect(_ ctx: CGContext, _ rect: CGRect, _ r: CGFloat, _ fill: CGColor, stroke: CGColor? = nil, line: CGFloat = 0) {
  let path = CGPath(roundedRect: rect, cornerWidth: r, cornerHeight: r, transform: nil)
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

func text(_ ctx: CGContext, _ value: String, _ rect: CGRect, _ size: CGFloat, _ color: NSColor = .white, _ weight: NSFont.Weight = .bold, _ align: NSTextAlignment = .center) {
  let paragraph = NSMutableParagraphStyle()
  paragraph.alignment = align
  paragraph.lineBreakMode = .byWordWrapping
  let attrs: [NSAttributedString.Key: Any] = [
    .font: NSFont.systemFont(ofSize: size, weight: weight),
    .foregroundColor: color,
    .paragraphStyle: paragraph
  ]
  NSGraphicsContext.saveGraphicsState()
  NSGraphicsContext.current = NSGraphicsContext(cgContext: ctx, flipped: false)
  (value as NSString).draw(with: rect, options: [.usesLineFragmentOrigin, .usesFontLeading], attributes: attrs)
  NSGraphicsContext.restoreGraphicsState()
}

func circle(_ ctx: CGContext, x: CGFloat, y: CGFloat, r: CGFloat, fill: CGColor, stroke: CGColor? = nil, line: CGFloat = 0) {
  let rect = CGRect(x: x - r, y: y - r, width: r * 2, height: r * 2)
  ctx.setFillColor(fill)
  ctx.fillEllipse(in: rect)
  if let stroke {
    ctx.setStrokeColor(stroke)
    ctx.setLineWidth(line)
    ctx.strokeEllipse(in: rect)
  }
}

func line(_ ctx: CGContext, _ a: CGPoint, _ b: CGPoint, _ color: CGColor, _ width: CGFloat) {
  ctx.setStrokeColor(color)
  ctx.setLineWidth(width)
  ctx.move(to: a)
  ctx.addLine(to: b)
  ctx.strokePath()
}

func drawFace(_ ctx: CGContext, animal: Animal, center: CGPoint, scale: CGFloat, blink: CGFloat, mood: CGFloat) {
  let head: UInt32
  let ear: UInt32
  switch animal {
  case .panda: head = 0xF7F7EF; ear = 0x1C2430
  case .capybara: head = 0xC99358; ear = 0x8E5B2B
  case .sheep: head = 0xFFF8D8; ear = 0xFFE4A0
  case .lion: head = 0xF2B04C; ear = 0xA75D1A
  case .kitten: head = 0xFFE6B8; ear = 0xF19A6E
  }

  if animal == .sheep {
    for i in 0..<7 {
      let angle = CGFloat(i) / 7 * .pi * 2
      circle(ctx, x: center.x + cos(angle) * 29 * scale, y: center.y + sin(angle) * 25 * scale, r: 18 * scale, fill: c(0xFFFFFF), stroke: c(0xE8D9BC), line: 2)
    }
  }

  if animal == .lion {
    for i in 0..<14 {
      let angle = CGFloat(i) / 14 * .pi * 2
      circle(ctx, x: center.x + cos(angle) * 33 * scale, y: center.y + sin(angle) * 30 * scale, r: 17 * scale, fill: c(0xB86B20), stroke: nil)
    }
  }

  if animal == .kitten {
    let leftEar = [
      CGPoint(x: center.x - 34 * scale, y: center.y - 20 * scale),
      CGPoint(x: center.x - 8 * scale, y: center.y - 52 * scale),
      CGPoint(x: center.x - 2 * scale, y: center.y - 12 * scale)
    ]
    let rightEar = [
      CGPoint(x: center.x + 34 * scale, y: center.y - 20 * scale),
      CGPoint(x: center.x + 8 * scale, y: center.y - 52 * scale),
      CGPoint(x: center.x + 2 * scale, y: center.y - 12 * scale)
    ]
    for points in [leftEar, rightEar] {
      ctx.addLines(between: points)
      ctx.closePath()
      ctx.setFillColor(c(ear))
      ctx.fillPath()
    }
  } else {
    circle(ctx, x: center.x - 31 * scale, y: center.y - 18 * scale, r: 18 * scale, fill: c(ear), stroke: nil)
    circle(ctx, x: center.x + 31 * scale, y: center.y - 18 * scale, r: 18 * scale, fill: c(ear), stroke: nil)
  }

  circle(ctx, x: center.x, y: center.y, r: 43 * scale, fill: c(head), stroke: c(0x3A342C, 0.22), line: 3 * scale)
  if animal == .panda {
    circle(ctx, x: center.x - 17 * scale, y: center.y - 6 * scale, r: 14 * scale, fill: c(0x20242D), stroke: nil)
    circle(ctx, x: center.x + 17 * scale, y: center.y - 6 * scale, r: 14 * scale, fill: c(0x20242D), stroke: nil)
  }

  let eyeH = max(2, 11 * scale * (1 - blink))
  roundRect(ctx, CGRect(x: center.x - 24 * scale, y: center.y - 8 * scale, width: 12 * scale, height: eyeH), eyeH / 2, c(0x1D2530), stroke: nil)
  roundRect(ctx, CGRect(x: center.x + 12 * scale, y: center.y - 8 * scale, width: 12 * scale, height: eyeH), eyeH / 2, c(0x1D2530), stroke: nil)

  if mood > 0.5 {
    line(ctx, CGPoint(x: center.x - 28 * scale, y: center.y - 22 * scale), CGPoint(x: center.x - 9 * scale, y: center.y - 15 * scale), c(0x1D2530), 3 * scale)
    line(ctx, CGPoint(x: center.x + 28 * scale, y: center.y - 22 * scale), CGPoint(x: center.x + 9 * scale, y: center.y - 15 * scale), c(0x1D2530), 3 * scale)
    line(ctx, CGPoint(x: center.x - 12 * scale, y: center.y + 22 * scale), CGPoint(x: center.x + 14 * scale, y: center.y + 16 * scale), c(0x1D2530), 4 * scale)
  } else if animal == .kitten && mood < 0.25 {
    circle(ctx, x: center.x - 20 * scale, y: center.y + 13 * scale, r: 5 * scale, fill: c(0x5EC9FF, 0.85), stroke: nil)
    circle(ctx, x: center.x + 20 * scale, y: center.y + 13 * scale, r: 5 * scale, fill: c(0x5EC9FF, 0.85), stroke: nil)
    line(ctx, CGPoint(x: center.x - 12 * scale, y: center.y + 22 * scale), CGPoint(x: center.x + 12 * scale, y: center.y + 22 * scale), c(0x1D2530), 4 * scale)
  } else {
    line(ctx, CGPoint(x: center.x - 12 * scale, y: center.y + 18 * scale), CGPoint(x: center.x, y: center.y + 24 * scale), c(0x1D2530), 3 * scale)
    line(ctx, CGPoint(x: center.x, y: center.y + 24 * scale), CGPoint(x: center.x + 12 * scale, y: center.y + 18 * scale), c(0x1D2530), 3 * scale)
  }
}

func drawTile(_ ctx: CGContext, animal: Animal, x: CGFloat, y: CGFloat, scale: CGFloat, alpha: CGFloat = 1, mood: CGFloat = 0, glow: CGFloat = 0) {
  let size = 118 * scale
  ctx.saveGState()
  ctx.setAlpha(alpha)
  if glow > 0 {
    roundRect(ctx, CGRect(x: x - 8, y: y - 8, width: size + 16, height: size + 16), 32 * scale, c(0xFFE66D, glow * 0.75), stroke: nil)
  }
  roundRect(ctx, CGRect(x: x + 7 * scale, y: y + 12 * scale, width: size, height: size), 25 * scale, c(0x1D2530, 0.25), stroke: nil)
  roundRect(ctx, CGRect(x: x, y: y, width: size, height: size), 25 * scale, c(0xF9FFE7), stroke: c(0x425C22), line: 4 * scale)
  let blink: CGFloat = 0
  drawFace(ctx, animal: animal, center: CGPoint(x: x + size / 2, y: y + size / 2), scale: scale, blink: blink, mood: mood)
  text(ctx, animal.rawValue, CGRect(x: x, y: y + size - 23 * scale, width: size, height: 20 * scale), 16 * scale, ns(0x1D2530, 0.72), .heavy)
  ctx.restoreGState()
}

func drawBackground(_ ctx: CGContext, p: CGFloat) {
  let danger = ramp(p, 0.53, 0.78)
  let sky = CGGradient(
    colorsSpace: CGColorSpaceCreateDeviceRGB(),
    colors: [
      c(0xBDEBFF),
      c(0xFFF3D8),
      c(0x5A0B17, danger),
      c(0x17101B, danger)
    ] as CFArray,
    locations: [0, 0.55, 0.78, 1]
  )!
  ctx.drawLinearGradient(sky, start: CGPoint(x: 0, y: 0), end: CGPoint(x: CGFloat(width), y: CGFloat(height)), options: [])
  ctx.setFillColor(c(0xFFFFFF, 0.22 * (1 - danger)))
  circle(ctx, x: 220, y: 260, r: 95, fill: c(0xFFFFFF, 0.36 * (1 - danger)))
  circle(ctx, x: 820, y: 345, r: 120, fill: c(0xFFFFFF, 0.28 * (1 - danger)))
  ctx.setFillColor(c(0x000000, 0.22 * danger))
  ctx.fill(CGRect(x: 0, y: 0, width: width, height: height))
}

func drawSelectionBar(_ ctx: CGContext, p: CGFloat) {
  roundRect(ctx, CGRect(x: 105, y: 1445, width: 870, height: 154), 38, c(0xFFFFFF, 0.32), stroke: c(0x9EEBFF, 0.75), line: 5)
  roundRect(ctx, CGRect(x: 130, y: 1476, width: 820, height: 92), 28, c(0x172033, 0.22), stroke: nil)
  let slotAnimals: [Animal] = p < 0.34 ? [.sheep, .sheep, .sheep] : [.panda, .lion, .capybara, .panda, .lion, .sheep]
  let count = p < 0.34 ? Int(ramp(p, 0.12, 0.23) * 3) : Int(3 + ramp(p, 0.37, 0.62) * 3)
  for i in 0..<7 {
    let x = 150 + CGFloat(i) * 112
    roundRect(ctx, CGRect(x: x, y: 1485, width: 90, height: 74), 18, c(0xFFFFFF, 0.22), stroke: c(0xFFFFFF, 0.25), line: 2)
    if i < min(count, slotAnimals.count) {
      drawTile(ctx, animal: slotAnimals[i], x: x + 10, y: 1481, scale: 0.58, mood: p > 0.82 ? 1 : 0)
    }
  }
  if p > 0.60 && p < 0.84 {
    text(ctx, "ONLY 1 SLOT LEFT", CGRect(x: 150, y: 1609, width: 780, height: 58), 44, ns(0xFFDE59), .heavy)
  }
}

func drawConfetti(_ ctx: CGContext, p: CGFloat) {
  let local = ramp(p, 0.24, 0.36)
  guard local > 0 && local < 1 else { return }
  let colors: [UInt32] = [0xFF5F58, 0xFFDE59, 0x55D6FF, 0x7CFF8E, 0xD891FF]
  for i in 0..<70 {
    let angle = CGFloat(i) * 0.67
    let dist = local * CGFloat(70 + (i % 9) * 24)
    let x = 540 + cos(angle) * dist
    let y = 1515 + sin(angle) * dist - local * 180
    ctx.saveGState()
    ctx.translateBy(x: x, y: y)
    ctx.rotate(by: angle + local * 4)
    ctx.setFillColor(c(colors[i % colors.count], 1 - local * 0.75))
    ctx.fill(CGRect(x: -8, y: -5, width: 16, height: 10))
    ctx.restoreGState()
  }
  text(ctx, "POP!", CGRect(x: 360, y: 1355 - local * 70, width: 360, height: 90), 72, ns(0xFFFFFF, 1 - local * 0.2), .heavy)
}

func drawFinger(_ ctx: CGContext, p: CGFloat) {
  let targetWrong = CGPoint(x: 670, y: 950)
  let targetSheep = CGPoint(x: 545, y: 920)
  let first = ramp(p, 0.10, 0.22)
  let second = ramp(p, 0.65, 0.80)
  let hoverShake = p > 0.62 && p < 0.80 ? sin(p * 260) * 7 : 0
  let x = p < 0.42 ? 930 - first * (930 - targetSheep.x) : 930 - second * (930 - targetWrong.x)
  let y = p < 0.42 ? 1320 - first * (1320 - targetSheep.y) : 1320 - second * (1320 - targetWrong.y) + hoverShake
  roundRect(ctx, CGRect(x: x, y: y, width: 82, height: 210), 42, c(0xFFD8C2), stroke: c(0xB36C4B), line: 3)
  circle(ctx, x: x + 40, y: y, r: 42, fill: c(0xFFD8C2), stroke: c(0xB36C4B), line: 3)
  if p > 0.64 && p < 0.80 {
    text(ctx, "DON'T TAP THAT...", CGRect(x: 190, y: 1265, width: 700, height: 72), 50, ns(0xFFFFFF), .heavy)
  }
}

func drawShatter(_ ctx: CGContext, p: CGFloat) {
  let local = ramp(p, 0.82, 0.95)
  guard local > 0 else { return }
  ctx.setStrokeColor(c(0xFFFFFF, 0.85))
  ctx.setLineWidth(5)
  for i in 0..<16 {
    let angle = CGFloat(i) / 16 * .pi * 2
    let end = CGPoint(x: 540 + cos(angle) * (240 + local * 900), y: 950 + sin(angle) * (240 + local * 900))
    ctx.move(to: CGPoint(x: 540 + cos(angle) * 80, y: 950 + sin(angle) * 80))
    ctx.addLine(to: end)
    ctx.strokePath()
  }
  ctx.setFillColor(c(0x08040A, 0.58 * local))
  ctx.fill(CGRect(x: 0, y: 0, width: width, height: height))
  text(ctx, "WRONG TILE.", CGRect(x: 130, y: 520, width: 820, height: 110), 82, ns(0xFFDE59), .heavy)
  text(ctx, "Start over?", CGRect(x: 210, y: 640, width: 660, height: 80), 54, ns(0xFFFFFF), .bold)
}

func drawFrame(_ ctx: CGContext, frame: Int) {
  let p = CGFloat(frame) / CGFloat(frameCount - 1)
  drawBackground(ctx, p: p)
  text(ctx, "THIS LOOKS CUTE...", CGRect(x: 85, y: 88, width: 910, height: 80), 62, ns(0x172033, p < 0.55 ? 1 : 0), .heavy)
  text(ctx, "UNTIL ONE TAP RUINS IT", CGRect(x: 85, y: 88, width: 910, height: 92), 58, ns(0xFFFFFF, p > 0.54 ? 1 : 0), .heavy)

  roundRect(ctx, CGRect(x: 96, y: 270, width: 888, height: 1130), 62, c(0xFFFFFF, 0.55), stroke: c(0xFFFFFF, 0.48), line: 4)
  for tile in baseTiles.sorted(by: { $0.layer < $1.layer }) {
    var y = tile.y
    var x = tile.x
    var alpha: CGFloat = 1
    var mood: CGFloat = 0
    if tile.animal == .sheep && p > 0.18 && p < 0.34 {
      let slide = ramp(p, 0.18 + CGFloat(tile.layer) * 0.01, 0.30 + CGFloat(tile.layer) * 0.01)
      if tile.layer >= 2 {
        y = tile.y + slide * (1510 - tile.y)
        x = tile.x + slide * (520 - tile.x)
        alpha = 1 - ramp(p, 0.30, 0.35)
      }
    }
    if tile.animal == .kitten {
      alpha = p > 0.42 ? 1 : 0.34
      mood = 0.08
      if p > 0.52 && p < 0.78 {
        text(ctx, "TRAPPED KITTEN", CGRect(x: 280, y: 1175, width: 520, height: 48), 38, ns(0xFFDE59), .heavy)
      }
    }
    if p > 0.84 {
      mood = 1
    }
    drawTile(ctx, animal: tile.animal, x: x, y: y, scale: 0.92, alpha: alpha, mood: mood, glow: tile.animal == .kitten && p > 0.55 && p < 0.78 ? 0.7 : 0)
  }
  drawSelectionBar(ctx, p: p)
  drawConfetti(ctx, p: p)
  drawFinger(ctx, p: p)
  drawShatter(ctx, p: p)
  if p > 0.93 {
    roundRect(ctx, CGRect(x: 132, y: 1640, width: 816, height: 126), 38, c(0xFF5F58), stroke: c(0xFFFFFF, 0.5), line: 4)
    text(ctx, "CAN YOU SAVE IT?", CGRect(x: 160, y: 1672, width: 760, height: 58), 52, ns(0xFFFFFF), .heavy)
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

let writer = try AVAssetWriter(outputURL: outputURL, fileType: .mp4)
let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
  AVVideoCodecKey: AVVideoCodecType.h264,
  AVVideoWidthKey: width,
  AVVideoHeightKey: height,
  AVVideoCompressionPropertiesKey: [
    AVVideoAverageBitRateKey: 8_000_000,
    AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel
  ]
])
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
  let ctx = CGContext(
    data: CVPixelBufferGetBaseAddress(pb),
    width: width,
    height: height,
    bitsPerComponent: 8,
    bytesPerRow: CVPixelBufferGetBytesPerRow(pb),
    space: CGColorSpaceCreateDeviceRGB(),
    bitmapInfo: CGImageAlphaInfo.premultipliedFirst.rawValue
  )!
  drawFrame(ctx, frame: frame)
  CVPixelBufferUnlockBaseAddress(pb, [])
  adaptor.append(pb, withPresentationTime: CMTime(value: CMTimeValue(frame), timescale: fps))
}

input.markAsFinished()
let done = DispatchSemaphore(value: 0)
writer.finishWriting { done.signal() }
done.wait()
print("Wrote \(outputURL.path)")
