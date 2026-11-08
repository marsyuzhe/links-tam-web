// Shared orthographic projection for WebGL and CSS: no layout shift on loading or failure.
export type HitRect = { left: number; top: number; width: number; height: number };
export function deviceLayout(width: number, height: number, count: number, compact = false) {
  const cols = compact ? count : Math.min(count, width < 250 ? 1 : width < 600 ? 2 : 4),
    rows = Math.ceil(count / cols);
  const zoom = Math.min(width / (cols * 2.1 + 0.75), height / (rows * 1.7 + 1.4));
  const positions = Array.from(
    { length: count },
    (_, i) =>
      [((i % cols) - (cols - 1) / 2) * 2.1, 0, (Math.floor(i / cols) - (rows - 1) / 2) * 2.1] as [
        number,
        number,
        number,
      ],
  );
  const bounds = (
    x: number,
    z: number,
    hx: number,
    hz: number,
    y0: number,
    y1: number,
  ): HitRect => {
    const ys = [
      (y0 * 7) / Math.sqrt(113) - ((z - hz) * 8) / Math.sqrt(113),
      (y1 * 7) / Math.sqrt(113) - ((z + hz) * 8) / Math.sqrt(113),
      (y1 * 7) / Math.sqrt(113) - ((z - hz) * 8) / Math.sqrt(113),
      (y0 * 7) / Math.sqrt(113) - ((z + hz) * 8) / Math.sqrt(113),
    ];
    return {
      left: 50 + (((x - hx) * zoom) / width) * 100,
      top: 50 - ((Math.max(...ys) * zoom) / height) * 100,
      width: ((hx * 2 * zoom) / width) * 100,
      height: (((Math.max(...ys) - Math.min(...ys)) * zoom) / height) * 100,
    };
  };
  return {
    cols,
    rows,
    zoom,
    positions,
    rects: positions.map(([x, , z]) => bounds(x, z, 0.83, 0.83, -0.05, 0.46)),
    base: bounds(0, 0, (cols * 2.1 + 0.35) / 2, (rows * 2.1 + 0.3) / 2, -0.29, -0.05),
  };
}
