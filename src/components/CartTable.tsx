"use client";

import type { DragEvent, ReactNode } from "react";
import { addTileToCart, incrementQuantity, removeItem, setQuantity } from "@/store/orderSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { calculateShipping, calculateSubtotal, formatMoney } from "@/store/calculations";
import { getCartTileImages, isTilePattern } from "@/data/tileAssets";
import { designPalette } from "@/data/tiles";
import type { CartItem } from "@/types/order";

// Данные связывают позиции корзины с готовыми PNG-плитками из папки public/mock.
// patternTileImages подставляет картинку для строк, которые добавлены перетаскиванием из палитры дизайна.
// tilePatterns нужен для проверки drag-data перед добавлением новой строки в корзину.
// CartTable выводит первую колонку интерфейса: корзину, действия, кнопку добавления и итоги.
export function CartTable() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.order.items);
  const subtotal = calculateSubtotal(items);
  const shipping = calculateShipping(subtotal);

  // handleCartDragOver разрешает drop плитки на всю область Shopping Cart.
  function handleCartDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  // handleCartDrop добавляет новую позицию, когда плитку перетащили из палитры в корзину.
  function handleCartDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    const pattern = event.dataTransfer.getData("text/plain");
    if (isTilePattern(pattern)) {
      dispatch(addTileToCart(pattern));
    }
  }

  // handleAddRandomTile добавляет строку со случайной плиткой из палитры.
  function handleAddRandomTile() {
    const randomPattern = designPalette[Math.floor(Math.random() * designPalette.length)];
    dispatch(addTileToCart(randomPattern));
  }

  return (
    <section id="cart" className="cart-tool w-full min-w-0" onDragOver={handleCartDragOver} onDrop={handleCartDrop}>
      {/* Заголовок первой колонки повторяет крупную подпись из макета. */}
      <h2 className="mb-2 hidden font-display text-[var(--cart-title-size)] font-normal uppercase leading-none tracking-wide md:block">
        Shopping Cart &amp; Design Tool
      </h2>

      {/* Grid-таблица сохраняет пропорции колонок и корректно сжимается вместе с первой областью. */}
      <div className="cart-table-shell w-full overflow-visible border-2 border-b-0 border-l-0 border-line font-display">
        <div className="cart-table-grid cart-table-head grid text-center text-[var(--cart-header-size)] font-normal uppercase leading-tight">
          <HeaderCell>Tile Collection</HeaderCell>
          <HeaderCell>Item</HeaderCell>
          <HeaderCell>Quantity (sq. ft.)</HeaderCell>
          <HeaderCell>Unit Price ($)</HeaderCell>
          <HeaderCell>Actions</HeaderCell>
        </div>

        {/* Строки товаров используют реальные изображения плитки из mock-папки. */}
        {items.map((item) => (
          <CartRow key={item.id} item={item} />
        ))}

      {/* Нижняя зона: рука с плиткой, кнопка добавления и компактные итоги. */}
      <div className="cart-summary-grid cart-table-grid grid font-display font-normal uppercase leading-none">
        <div className="cart-summary-add col-span-2 row-span-3">
          <button type="button" className="interactive-soft block h-auto w-[92%] cursor-pointer p-0 text-left" onClick={handleAddRandomTile} aria-label="Add random tile to cart">
            <img className="block h-auto w-full object-contain object-left-top" src="/images/hand_left.png" alt="" aria-hidden="true" />
          </button>
        </div>
        <span className="cart-total-label col-span-2">Subtotal:</span>
        <output className="cart-total-value">[{formatMoney(subtotal)}]</output>
        <span className="cart-total-label col-span-2">Shipping:</span>
        <output className="cart-total-value">[{formatMoney(shipping)}]</output>
        <span className="cart-total-label col-span-2">Grand Total:</span>
        <output className="cart-total-value cart-total-grand">[{formatMoney(subtotal + shipping)}]</output>
      </div>
      </div>
    </section>
  );
}

// HeaderCell рисует одну ячейку заголовка grid-таблицы.
function HeaderCell({ children }: { children: ReactNode }) {
  return <div className="grid min-h-10 place-items-center border-b-2 border-r-2 border-line px-1 first:border-l-2 last:border-r-0">{children}</div>;
}

// BodyCell рисует одну ячейку строки товара.
function BodyCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`grid min-h-[var(--cart-row-height)] place-items-center border-b-2 border-r-2 border-line px-[var(--cart-cell-padding)] first:border-l-2 last:border-r-0 ${className}`}>{children}</div>;
}

// CartRow отображает одну позицию корзины и действия add/remove.
function CartRow({ item }: { item: CartItem }) {
  const dispatch = useAppDispatch();
  const images = getCartTileImages(item.id, item.pattern);

  // handleQuantityChange записывает новое количество в Redux и не даёт получить отрицательное число.
  function handleQuantityChange(value: string) {
    dispatch(setQuantity({ id: item.id, quantity: Number(value) || 0 }));
  }

  return (
    <div className="cart-table-grid grid text-center font-display">
      {/* Коллекция: маленькая плитка и подпись под ней. */}
      <BodyCell>
        <div className="flex min-w-0 flex-col items-center gap-1">
          <img className="h-[var(--cart-collection-tile)] w-[var(--cart-collection-tile)] object-contain" src={images.collection} alt={item.collection} />
          <span className="max-w-full text-[var(--cart-label-size)] font-normal uppercase leading-none">{item.collection}</span>
        </div>
      </BodyCell>

      {/* Item: крупный образец рисунка плитки. */}
      <BodyCell>
        <img className="h-[var(--cart-item-tile)] w-[var(--cart-item-tile)] object-contain" src={images.item} alt={`${item.collection} pattern`} />
      </BodyCell>

      {/* Quantity: редактируемое число в квадратных скобках, как в макете. */}
      <BodyCell>
        <label className="flex items-center justify-center gap-1 text-[var(--cart-number-size)] font-normal leading-none">
          <span>[</span>
          <input
            className="w-[var(--cart-input-width)] bg-transparent text-center leading-none"
            min={0}
            type="number"
            value={item.quantity}
            onChange={(event) => handleQuantityChange(event.target.value)}
            aria-label={`${item.collection} quantity`}
          />
          <span>]</span>
        </label>
      </BodyCell>

      {/* Unit price: цена за единицу товара. */}
      <BodyCell>
        <span className="text-[var(--cart-price-size)] font-normal leading-none">[ {formatMoney(item.unitPrice)} ]</span>
      </BodyCell>

      {/* Actions: кнопки add/remove используют готовые картинки add.png и bascket.png. */}
      <BodyCell>
        <div className="flex items-center justify-center gap-1">
          <IconAction label="Add" image="/images/add.png" onClick={() => dispatch(incrementQuantity(item.id))} />
          <IconAction label="Remove" image="/images/bascket.png" onClick={() => dispatch(removeItem(item.id))} />
        </div>
      </BodyCell>
    </div>
  );
}

// IconAction рисует маленькую кнопку действия с картинкой и подписью.
function IconAction({ label, image, onClick }: { label: string; image: string; onClick: () => void }) {
  return (
    <button type="button" className="interactive-soft flex flex-col items-center font-display text-[var(--cart-action-size)] font-normal uppercase leading-none" onClick={onClick}>
      <img className="h-[var(--cart-action-icon)] w-[var(--cart-action-icon)] object-contain" src={image} alt="" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
