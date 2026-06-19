"use client";

import type { ReactNode } from "react";
import { incrementQuantity, removeItem, setQuantity } from "@/store/orderSlice";
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
    <section id="cart" className="w-full min-w-0">
      {/* Заголовок первой колонки повторяет крупную подпись из макета. */}
      <h2 className="mb-2 font-display text-[clamp(28px,2.1vw,40px)] font-black uppercase leading-none font-normal tracking-wide">
        Shopping Cart &amp; Design Tool
      </h2>

      {/* Grid-таблица сохраняет пропорции колонок и корректно сжимается вместе с первой областью. */}
      <div className="w-full overflow-hidden border-2 border-b-0 border-line bg-paper/70 font-display">
        <div className="grid grid-cols-[25%_22%_18%_18%_17%] text-center text-[clamp(12px,0.78vw,16px)] font-black uppercase leading-tight">
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
      <div className="col-span-2 grid grid-cols-[64.5%_18%_17.5%] font-display text-[clamp(16px,1.14vw,18px)] font-black uppercase leading-none">
        <img className="block h-auto w-[92%] object-contain object-left-top" src="/images/hand_left.png" alt="" aria-hidden="true" />
        <div>
          <span className="flex min-h-8 items-center justify-end pr-2 text-right font-normal tracking-wide">Subtotal:</span>
          <span className="flex min-h-8 items-center justify-end pr-2 text-right font-normal tracking-wide">Shipping:</span>
          <span className="flex min-h-8 items-center justify-end pr-2 text-right font-normal tracking-wide">Grand Total:</span>
        </div>

        <div>
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
  return <div className={`grid min-h-[clamp(76px,7vw,104px)] place-items-center border-b-2 border-r-2 border-line px-1 last:border-r-0 ${className}`}>{children}</div>;
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
    <div className="grid grid-cols-[25%_22%_18%_18%_17%] text-center font-display">
      {/* Коллекция: маленькая плитка и подпись под ней. */}
      <BodyCell>
        <div className="flex min-w-0 flex-col items-center gap-1">
          <img className="h-[clamp(42px,4.4vw,64px)] w-[clamp(42px,4.4vw,64px)] object-contain" src={images.collection} alt={item.collection} />
          <span className="max-w-full text-[clamp(11px,0.78vw,15px)] font-black uppercase leading-none">{item.collection}</span>
        </div>
      </BodyCell>

      {/* Item: крупный образец рисунка плитки. */}
      <BodyCell>
        <img className="h-[clamp(56px,5.7vw,86px)] w-[clamp(56px,5.7vw,86px)] object-contain" src={images.item} alt={`${item.collection} pattern`} />
      </BodyCell>

      {/* Quantity: редактируемое число в квадратных скобках, как в макете. */}
      <BodyCell>
        <label className="flex items-center justify-center gap-1 text-[clamp(17px,1.25vw,24px)] font-black leading-none">
          <span>[</span>
          <input
            className="w-[clamp(42px,3vw,62px)] bg-transparent text-center leading-none"
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
        <span className="text-[clamp(15px,1vw,20px)] font-black leading-none">[ {formatMoney(item.unitPrice)} ]</span>
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
    <button type="button" className="flex flex-col items-center font-display text-[clamp(9px,0.62vw,12px)] font-black uppercase leading-none" onClick={onClick}>
      <img className="h-[clamp(24px,2.1vw,34px)] w-[clamp(24px,2.1vw,34px)] object-contain" src={image} alt="" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
