"use client";

import type { CSSProperties, DragEvent } from "react";
import { clearGridCell, moveGridCell, paintGridCell, selectPattern } from "@/store/orderSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { designTileImages, isTilePattern } from "@/data/tileAssets";
import { designPalette } from "@/data/tiles";
import type { DesignCell, TilePattern } from "@/types/order";

// Карта связывает логический id плитки с PNG-файлом из public/mock.
// Размер одной ячейки нужен, чтобы viewport показывал ровно 7x6, а всё поле было 10x10.
const CELL_SIZE = 70;
const SCROLLBAR_RESERVE = 18;
const SCROLLBAR_SIZE = 20;

// DesignTool отображает среднюю колонку: поле раскладки 7x7 и палитру плиток справа.
export function DesignTool() {
  const dispatch = useAppDispatch();
  const grid = useAppSelector((state) => state.order.grid);
  const selectedPattern = useAppSelector((state) => state.order.selectedPattern);
  const paletteTiles: TilePattern[] = [...designPalette, "tile01", "tile02", "tile03", "tile04"];
  const toolSizeVars = {
    "--design-cell-size": `${CELL_SIZE}px`,
    "--design-scrollbar-reserve": `${SCROLLBAR_RESERVE}px`,
    "--design-scrollbar-size": `${SCROLLBAR_SIZE}px`
  } as CSSProperties;

  // handleDrop кладёт копию перетаскиваемой плитки в ячейку; из палитры она не исчезает.
  function handleDrop(cellId: string, pattern: TilePattern, sourceCellId?: string) {
    if (sourceCellId) {
      dispatch(moveGridCell({ fromId: sourceCellId, toId: cellId, pattern }));
      return;
    }

    dispatch(paintGridCell({ id: cellId, pattern }));
  }

  return (
    <section
      id="design"
      className="design-tool-frame hidden w-full max-w-[650px] justify-self-center overflow-hidden rounded-md border-2 border-line bg-paper/80 min-[1300px]:grid min-[1300px]:grid-cols-[minmax(0,1fr)_132px]"
      style={toolSizeVars}
    >
      {/* Левая часть инструмента: заголовок и scroll-поле для создания узора. */}
      <div className="grid min-h-0 min-w-0 grid-rows-[var(--design-header-height)_minmax(0,1fr)] border-r border-line">
        {/* Верхняя подпись повторяет заголовок левой панели из макета. */}
        <div className="border-b border-line px-4 py-3 text-center font-display">
          <h2 className="text-xl font-normal uppercase leading-none">Visualize Your Order:</h2>
          <p className="text-sm font-normal leading-none">Drag and drop tiles here to create patterns.</p>
        </div>

        {/* Scroll-viewport даёт вертикальный и горизонтальный скролл полю раскладки. */}
        <div className="design-scroll relative overflow-auto bg-paper">
          {/* Реальное поле 10x10 больше видимой области, поэтому появляются оба скролла. */}
          <div className="design-grid-lines grid grid-cols-10 grid-rows-10">
            {grid.map((cell) => (
              <DesignCellButton
                key={cell.id}
                cell={cell}
                onDropTile={(pattern, sourceCellId) => handleDrop(cell.id, pattern, sourceCellId)}
                onClear={() => dispatch(clearGridCell(cell.id))}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Правая часть инструмента: палитра, из которой плитки перетаскиваются мышкой. */}
      <aside className="grid min-h-0 grid-rows-[var(--design-header-height)_1fr] bg-sand/70">
        <h3 className="border-b border-line px-2 py-3 text-center font-display text-xl font-normal uppercase leading-none">Design Palate</h3>
        <div className="grid grid-cols-2 content-start gap-[var(--design-palette-gap)] px-[var(--design-palette-pad-x)] pb-[var(--design-palette-pad-bottom)] pt-[var(--design-palette-pad-top)]">
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
  onDropTile,
  onClear
}: {
  cell: DesignCell;
  onDropTile: (pattern: TilePattern, sourceCellId?: string) => void;
  onClear: () => void;
}) {
  // handleDragOver разрешает браузеру принять drop в эту ячейку.
  function handleDragOver(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = event.dataTransfer.types.includes("application/x-design-cell-id") ? "move" : "copy";
  }

  // handleDragStart кладёт в drag-data паттерн и id исходной ячейки, чтобы плитку можно было перенести.
  function handleDragStart(event: DragEvent<HTMLButtonElement>) {
    if (!cell.pattern) {
      event.preventDefault();
      return;
    }

    event.dataTransfer.setData("text/plain", cell.pattern);
    event.dataTransfer.setData("application/x-design-cell-id", cell.id);
    event.dataTransfer.effectAllowed = "copyMove";
  }

  // handleDrop читает id плитки из drag data и размещает её в текущей ячейке.
  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    const pattern = event.dataTransfer.getData("text/plain");
    const sourceCellId = event.dataTransfer.getData("application/x-design-cell-id") || undefined;

    if (isTilePattern(pattern)) {
      onDropTile(pattern, sourceCellId);
    }
  }

  return (
    <button
      type="button"
      draggable={Boolean(cell.pattern)}
      aria-label="Design grid cell"
      className={`interactive-soft grid min-h-0 place-items-center bg-transparent p-0 hover:bg-sand/60 ${cell.pattern ? "cursor-grab active:cursor-grabbing" : ""}`}
      onDoubleClick={onClear}
      onDragStart={handleDragStart}
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
  }

  return (
    <button
      type="button"
      draggable
      aria-label={`Drag ${pattern} tile`}
      className={`interactive-soft grid h-[var(--design-palette-tile-size)] w-[var(--design-palette-tile-size)] cursor-grab place-items-center border bg-paper p-0.5 active:cursor-grabbing ${selected ? "border-navy shadow-sketch" : "border-line"}`}
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
