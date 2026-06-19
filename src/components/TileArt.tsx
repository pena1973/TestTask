import type { TilePattern } from "@/types/order";

const patternClass: Record<TilePattern, string> = {
  wave: "tile-wave",
  fern: "tile-fern",
  dot: "tile-dot",
  star: "tile-star",
  diamond: "tile-diamond",
  blueStar: "tile-blueStar",
  weave: "tile-weave",
  bird: "tile-bird"
};

// TileArt рисует плитку выбранного паттерна средствами CSS без растровых заглушек.
export function TileArt({ pattern, className = "" }: { pattern: TilePattern; className?: string }) {
  return <span aria-hidden="true" className={`tile-art ${patternClass[pattern]} ${className}`} />;
}
