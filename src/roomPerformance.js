export function pixelRatioLimit(width, height, mobile) {
  const pixels = Math.max(1, width * height);
  return Math.min(mobile ? 1 : 1.25, Math.sqrt(1600000 / pixels));
}

export function adjustPixelRatio(current, ceiling, fps) {
  const floor = Math.min(ceiling, 0.7);
  if (fps < 45) return Math.max(floor, current - 0.15);
  if (fps > 57) return Math.min(ceiling, current + 0.05);
  return current;
}
