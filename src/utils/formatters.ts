/**
 * Format meters into human-friendly size display:
 * e.g. "1m 45cm 2mm" or "55cm 8mm"
 */
export function formatBallSize(meters: number): string {
  const totalMm = Math.round(meters * 1000);
  const m = Math.floor(totalMm / 1000);
  const cm = Math.floor((totalMm % 1000) / 10);
  const mm = totalMm % 10;

  if (m > 0) {
    return `${m}m ${cm.toString().padStart(2, '0')}cm ${mm}mm`;
  }
  return `${cm}cm ${mm}mm`;
}

/**
 * Format seconds into mm:ss
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
