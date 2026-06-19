"use client";

import type { DragEvent } from "react";
import { clearGridCell, paintGridCell, selectPattern } from "@/store/orderSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { designPalette } from "@/data/tiles";
import type { DesignCell, TilePattern } from "@/types/order";

// Карта связывает логический id плитки с PNG-файлом из public/mock.
const designTileImages: Record<TilePattern, string> = {
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

// Размер одной ячейки нужен, чтобы viewport показывал ровно 7x6, а всё поле было 10x10.
const CELL_SIZE = 70;
const SCROLLBAR_SIZE = 18;

// DesignTool отображает среднюю колонку: поле раскладки 7x7 и палитру плиток справа.
export function DesignTool() {
  const dispatch = useAppDispatch();
  const grid = useAppSelector((state) => state.order.grid);
  const selectedPattern = useAppSelector((state) => state.order.selectedPattern);
  const paletteTiles: TilePattern[] = [...designPalette, "tile01", "tile02", "tile03", "tile04"];

  // handleDrop кладёт копию перетаскиваемой плитки в ячейку; из палитры она не исчезает.
  function handleDrop(cellId: string, pattern: TilePattern) {
    dispatch(selectPattern(pattern));
    dispatch(paintGridCell(cellId));
  }

  return (
    <section id="design" className="hidden h-[506px] w-full max-w-[650px] justify-self-center overflow-hidden rounded-md border-2 border-line bg-paper/80 lg:grid lg:grid-cols-[minmax(0,1fr)_132px]">
      {/* Левая часть инструмента: заголовок и scroll-поле для создания узора. */}
      <div className="grid min-w-0 grid-rows-[61px_1fr] border-r border-line">
        {/* Верхняя подпись повторяет заголовок левой панели из макета. */}
        <div className="border-b border-line px-4 py-3 text-center font-display">
          <h2 className="text-xl font-black uppercase leading-none">Visualize Your Order:</h2>
          <p className="text-sm font-black leading-none">Drag and drop tiles here to create patterns.</p>
        </div>

        {/* Scroll-viewport даёт вертикальный и горизонтальный скролл полю раскладки. */}
        <div
          className="design-scroll relative overflow-auto bg-paper"
          style={{
            width: CELL_SIZE * 7 + SCROLLBAR_SIZE,
            height: CELL_SIZE * 6 + SCROLLBAR_SIZE
          }}
        >
          {/* Реальное поле 10x10 больше видимой области, поэтому появляются оба скролла. */}
          <div
            className="design-grid-lines grid grid-cols-10 grid-rows-10"
            style={{
              width: CELL_SIZE * 10,
              height: CELL_SIZE * 10
            }}
          >
            {grid.map((cell) => (
              <DesignCellButton
                key={cell.id}
                cell={cell}
                selectedPattern={selectedPattern}
                onDropTile={(pattern) => handleDrop(cell.id, pattern)}
                onPaint={() => dispatch(paintGridCell(cell.id))}
                onClear={() => dispatch(clearGridCell(cell.id))}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Правая часть инструмента: палитра, из которой плитки перетаскиваются мышкой. */}
      <aside className="grid min-h-0 grid-rows-[61px_1fr] bg-sand/70">
        <h3 className="border-b border-line px-2 py-3 text-center font-display text-xl font-black uppercase leading-none">Design Palate</h3>
        <div className="grid grid-cols-2 content-start gap-2 px-2 pb-2 pt-1">
          {paletteTiles.map((pattern, index) => (
            <PaletteButton key={`${pattern}-${index}`} pattern={pattern} selected={pattern === selectedPattern} onSelect={() => dispatch(selectPattern(pattern))} />
          ))}
        </div>
      </aside>
    </section>
  );
}

// DesignCellButton отвечает за одну ячейку поля: клик кладёт выбранную плитку, drop кладёт перетаскиваемую.
function DesignCellButton({
  cell,
  selectedPattern,
  onDropTile,
  onPaint,
  onClear
}: {
  cell: DesignCell;
  selectedPattern: TilePattern;
  onDropTile: (pattern: TilePattern) => void;
  onPaint: () => void;
  onClear: () => void;
}) {
  // handleDragOver разрешает браузеру принять drop в эту ячейку.
  function handleDragOver(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
  }

  // handleDrop читает id плитки из drag data и размещает её в текущей ячейке.
  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    const pattern = event.dataTransfer.getData("text/plain") as TilePattern;
    if (pattern) {
      onDropTile(pattern);
    }
  }

  return (
    <button
      type="button"
      aria-label="Design grid cell"
      className="grid min-h-0 place-items-center bg-transparent p-0 transition hover:bg-sand/60"
      onClick={onPaint}
      onDoubleClick={onClear}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Если ячейка пустая, показываем только фон; если заполнена — PNG-плитку. */}
      {cell.pattern ? <DesignTileImage pattern={cell.pattern} className="h-full w-full" /> : null}
    </button>
  );
}

// PaletteButton показывает плитку в палитре и делает её draggable без удаления из палитры.
function PaletteButton({ pattern, selected, onSelect }: { pattern: TilePattern; selected: boolean; onSelect: () => void }) {
  // handleDragStart кладёт id плитки в drag data, чтобы поле знало, что разместить.
  function handleDragStart(event: DragEvent<HTMLButtonElement>) {
    event.dataTransfer.setData("text/plain", pattern);
    event.dataTransfer.effectAllowed = "copy";
    onSelect();
  }

  return (
    <button
      type="button"
      draggable
      aria-label={`Drag ${pattern} tile`}
      className={`grid h-[45px] w-[45px] place-items-center border bg-paper p-0.5 transition ${selected ? "border-navy shadow-sketch" : "border-line"}`}
      onClick={onSelect}
      onDragStart={handleDragStart}
    >
      <DesignTileImage pattern={pattern} className="h-full w-full" />
    </button>
  );
}

// DesignTileImage выводит PNG-плитку по её логическому id.
function DesignTileImage({ pattern, className }: { pattern: TilePattern; className: string }) {
  return <img className={`${className} object-cover`} src={designTileImages[pattern]} alt="" aria-hidden="true" draggable={false} />;
}
