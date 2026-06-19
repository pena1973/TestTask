"use client";

import type { ReactNode } from "react";
import { decrementQuantity, incrementQuantity, setQuantity } from "@/store/orderSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { calculateShipping, calculateSubtotal, formatMoney } from "@/store/calculations";
import type { CartItem } from "@/types/order";

// Данные связывают позиции корзины с готовыми PNG-плитками из папки public/mock.
const tileImages: Record<string, { collection: string; item: string }> = {
  "ocean-wave": { collection: "/mock/ocean_wave.png", item: "/mock/ocean_wave_item.png" },
  "forest-fern": { collection: "/mock/forest_fern.png", item: "/mock/forest_fern_item.png" },
  "terracotta-dot": { collection: "/mock/terracita_dot.png", item: "/mock/terracota_dot_item.png" },
  "yellow-star": { collection: "/mock/yellow_star.png", item: "/mock/yellow_star_item.png" }
};

// CartTable выводит первую колонку интерфейса: корзину, действия, кнопку добавления и итоги.
export function CartTable() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.order.items);
  const subtotal = calculateSubtotal(items);
  const shipping = calculateShipping(subtotal);

  return (
    <section id="cart" className="cart-tool w-full min-w-0">
      {/* Заголовок первой колонки повторяет крупную подпись из макета. */}
      <h2 className="mb-2 hidden font-display text-[var(--cart-title-size)] font-normal uppercase leading-none tracking-wide md:block">
        Shopping Cart &amp; Design Tool
      </h2>

      {/* Grid-таблица сохраняет пропорции колонок и корректно сжимается вместе с первой областью. */}
      <div className="w-full overflow-hidden border-2 border-b-0 border-line bg-paper/70 font-display">
        <div className="cart-table-grid grid text-center text-[var(--cart-header-size)] font-normal uppercase leading-tight">
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
      </div>

      {/* Нижняя зона: рука с плиткой, кнопка добавления и компактные итоги. */}
      <div className="cart-totals-grid col-span-2 grid font-display font-normal uppercase leading-none">
        <img className="block h-auto w-[92%] object-contain object-left-top" src="/images/hand_left.png" alt="" aria-hidden="true" />
        <div className="cart-total-labels">
          <span className="flex min-h-8 items-center justify-end pr-2 text-right font-normal tracking-wide">Subtotal:</span>
          <span className="flex min-h-8 items-center justify-end pr-2 text-right font-normal tracking-wide">Shipping:</span>
          <span className="flex min-h-8 items-center justify-end pr-2 text-right font-normal tracking-wide">Grand Total:</span>
        </div>

        <div className="cart-total-values">
          <output className="flex min-h-8 w-full items-center justify-end border-b-2 border-l-2 border-r-2 border-line bg-paper px-1 text-right font-normal">[{formatMoney(subtotal)}]</output>
          <output className="flex min-h-8 w-full items-center justify-end border-b-2 border-l-2 border-r-2 border-line bg-paper px-1 text-right font-normal">[{formatMoney(shipping)}]</output>
          <output className="flex min-h-8 w-full items-center justify-end border-b-2 border-l-2 border-r-2 border-line bg-paper px-1 text-right font-normal">[{formatMoney(subtotal + shipping)} ]</output>
        </div>

      </div>
      {/* </div> */}
    </section>
  );
}

// HeaderCell рисует одну ячейку заголовка grid-таблицы.
function HeaderCell({ children }: { children: ReactNode }) {
  return <div className="grid min-h-10 place-items-center border-b-2 border-r-2 border-line px-1 last:border-r-0">{children}</div>;
}

// BodyCell рисует одну ячейку строки товара.
function BodyCell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`grid min-h-[var(--cart-row-height)] place-items-center border-b-2 border-r-2 border-line px-[var(--cart-cell-padding)] last:border-r-0 ${className}`}>{children}</div>;
}

// CartRow отображает одну позицию корзины и действия add/remove.
function CartRow({ item }: { item: CartItem }) {
  const dispatch = useAppDispatch();
  const images = tileImages[item.id] ?? tileImages["ocean-wave"];

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
          <IconAction label="Remove" image="/images/bascket.png" onClick={() => dispatch(decrementQuantity(item.id))} />
        </div>
      </BodyCell>
    </div>
  );
}

// IconAction рисует маленькую кнопку действия с картинкой и подписью.
function IconAction({ label, image, onClick }: { label: string; image: string; onClick: () => void }) {
  return (
    <button type="button" className="flex flex-col items-center font-display text-[var(--cart-action-size)] font-normal uppercase leading-none" onClick={onClick}>
      <img className="h-[var(--cart-action-icon)] w-[var(--cart-action-icon)] object-contain" src={image} alt="" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
