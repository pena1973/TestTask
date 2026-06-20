import type { TilePattern } from "@/types/order";

// TileImagePair описывает пару картинок: маленькую плитку коллекции и крупный item-образец.
export type TileImagePair = {
  collection: string;
  item: string;
};

// cartTileImages связывает стартовые id строк корзины с PNG-плитками из public/mock.
export const cartTileImages: Record<string, TileImagePair> = {
  "ocean-wave": { collection: "/mock/ocean_wave.png", item: "/mock/ocean_wave_item.png" },
  "forest-fern": { collection: "/mock/forest_fern.png", item: "/mock/forest_fern_item.png" },
  "terracotta-dot": { collection: "/mock/terracita_dot.png", item: "/mock/terracota_dot_item.png" },
  "yellow-star": { collection: "/mock/yellow_star.png", item: "/mock/yellow_star_item.png" }
};

// patternTileImages связывает логический pattern с картинками для строк, добавленных drag-drop из палитры.
export const patternTileImages: Record<TilePattern, TileImagePair> = {
  wave: { collection: "/mock/ocean_wave.png", item: "/mock/ocean_wave_item.png" },
  fern: { collection: "/mock/forest_fern.png", item: "/mock/forest_fern_item.png" },
  dot: { collection: "/mock/terracita_dot.png", item: "/mock/terracota_dot_item.png" },
  star: { collection: "/mock/yellow_star.png", item: "/mock/yellow_star_item.png" },
  diamond: { collection: "/mock/tile_02.png", item: "/mock/tile_02.png" },
  blueStar: { collection: "/mock/tile_05.png", item: "/mock/tile_05.png" },
  weave: { collection: "/mock/tile_06.png", item: "/mock/tile_06.png" },
  bird: { collection: "/mock/tile_10.png", item: "/mock/tile_10.png" },
  tile01: { collection: "/mock/tile_01.png", item: "/mock/tile_01.png" },
  tile02: { collection: "/mock/tile_02.png", item: "/mock/tile_02.png" },
  tile03: { collection: "/mock/tile_03.png", item: "/mock/tile_03.png" },
  tile04: { collection: "/mock/tile_04.png", item: "/mock/tile_04.png" },
  tile05: { collection: "/mock/tile_05.png", item: "/mock/tile_05.png" },
  tile06: { collection: "/mock/tile_06.png", item: "/mock/tile_06.png" },
  tile07: { collection: "/mock/tile_07.png", item: "/mock/tile_07.png" },
  tile08: { collection: "/mock/tile_08.png", item: "/mock/tile_08.png" },
  tile09: { collection: "/mock/tile_09.png", item: "/mock/tile_09.png" },
  tile10: { collection: "/mock/tile_10.png", item: "/mock/tile_10.png" }
};

// designTileImages даёт DesignTool одну PNG-картинку для ячейки поля и палитры.
export const designTileImages: Record<TilePattern, string> = {
  wave: "/mock/ocean_wave_item.png",
  fern: "/mock/forest_fern_item.png",
  dot: "/mock/terracota_dot_item.png",
  star: "/mock/yellow_star_item.png",
  diamond: "/mock/tile_02.png",
  blueStar: "/mock/tile_05.png",
  weave: "/mock/tile_06.png",
  bird: "/mock/tile_10.png",
  tile01: "/mock/tile_01.png",
  tile02: "/mock/tile_02.png",
  tile03: "/mock/tile_03.png",
  tile04: "/mock/tile_04.png",
  tile05: "/mock/tile_05.png",
  tile06: "/mock/tile_06.png",
  tile07: "/mock/tile_07.png",
  tile08: "/mock/tile_08.png",
  tile09: "/mock/tile_09.png",
  tile10: "/mock/tile_10.png"
};

// tilePatternSet нужен для проверки строк из drag-data перед записью в Redux.
const tilePatternSet = new Set<TilePattern>(Object.keys(patternTileImages) as TilePattern[]);

// isTilePattern защищает drag-drop от посторонних строк и сохраняет строгий тип TilePattern.
export function isTilePattern(value: string): value is TilePattern {
  return tilePatternSet.has(value as TilePattern);
}

// getCartTileImages выбирает картинки строки корзины: сначала по id, затем по pattern.
export function getCartTileImages(id: string, pattern: TilePattern): TileImagePair {
  return cartTileImages[id] ?? patternTileImages[pattern] ?? cartTileImages["ocean-wave"];
}
