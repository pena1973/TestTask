import type { CartItem, TilePattern } from "@/types/order";

// Начальные позиции корзины повторяют плитки и цены из тестового макета.
export const initialCartItems: CartItem[] = [
  { id: "ocean-wave", collection: "Ocean Wave", pattern: "wave", quantity: 150, unitPrice: 28 },
  { id: "forest-fern", collection: "Forest Fern", pattern: "fern", quantity: 75, unitPrice: 30 },
  { id: "terracotta-dot", collection: "Terracotta Dot", pattern: "dot", quantity: 200, unitPrice: 26 },
  { id: "yellow-star", collection: "Yellow Star", pattern: "star", quantity: 50, unitPrice: 29 }
];

// Палитра визуализатора содержит основные и дополнительные плитки для раскладки 7x7.
export const designPalette: TilePattern[] = [
  "tile01",
  "tile02",
  "tile03",
  "tile04",
  "tile05",
  "tile06",
  "tile07",
  "tile08",
  "tile09",
  "tile10"
];

// Предзаполненная сетка имитирует рисунок, показанный в desktop-макете.
// Поле дизайна хранит 10x10 ячеек, хотя в viewport видно только 7x6.
const seededGridPatterns: Array<TilePattern | null> = [
  "tile04", "tile05", "tile06", "tile02", null, null, null, null, null, null,
  "tile05", "tile01", "tile04", "tile05", null, null, null, null, null, null,
  "tile01", "tile03", "tile07", "tile03", null, null, null, null, null, null,
  "tile01", "tile01", "tile03", "tile10", null, null, null, null, null, null,
  "tile02", "tile01", "tile10", "tile04", null, null, null, null, null, null,
  "tile10", "tile04", "tile03", null, null, null, null, null, null, null
];

// initialGridPatterns дополняет стартовый рисунок пустыми ячейками до полного размера 10x10.
export const initialGridPatterns: Array<TilePattern | null> = Array.from({ length: 100 }, (_, index) => seededGridPatterns[index] ?? null);
