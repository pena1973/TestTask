"use client";

import { decrementQuantity, incrementQuantity, setQuantity } from "@/store/orderSlice";
import { useAppDispatch } from "@/store/hooks";

type QuantityControlProps = {
  id: string;
  quantity: number;
};

// QuantityControl отвечает за ручное изменение количества плитки в строке корзины.
export function QuantityControl({ id, quantity }: QuantityControlProps) {
  const dispatch = useAppDispatch();

  // handleChange записывает число из поля ввода в Redux store.
  function handleChange(value: string) {
    dispatch(setQuantity({ id, quantity: Number(value) || 0 }));
  }

  return (
    <div className="flex min-w-[96px] items-center justify-center gap-1 font-display text-xl font-black">
      {/* Кнопка минуса уменьшает количество на один шаг. */}
      <button
        type="button"
        aria-label="Decrease quantity"
        className="grid h-7 w-7 place-items-center border-2 border-line bg-sand leading-none"
        onClick={() => dispatch(decrementQuantity(id))}
      >
        -
      </button>

      {/* Поле количества сохраняет значение в квадратных футах. */}
      <input
        aria-label="Quantity"
        className="h-8 w-16 border-2 border-line bg-paper text-center"
        min={0}
        type="number"
        value={quantity}
        onChange={(event) => handleChange(event.target.value)}
      />

      {/* Кнопка плюса увеличивает количество на один шаг. */}
      <button
        type="button"
        aria-label="Increase quantity"
        className="grid h-7 w-7 place-items-center border-2 border-line bg-teal text-paper leading-none"
        onClick={() => dispatch(incrementQuantity(id))}
      >
        +
      </button>
    </div>
  );
}
