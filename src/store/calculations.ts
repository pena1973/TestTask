import type { CartItem } from "@/types/order";

// Функция считает сумму корзины по формуле: количество * цена за единицу.
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

// Функция считает доставку: бесплатно при сумме выше $500, иначе фиксированные $25.
export function calculateShipping(subtotal: number): number {
  return subtotal > 500 ? 0 : 25;
}

// Функция считает итог заказа как сумму товаров и доставки.
export function calculateGrandTotal(items: CartItem[]): number {
  const subtotal = calculateSubtotal(items);
  return subtotal + calculateShipping(subtotal);
}

// Функция форматирует деньги в стиле макета с долларом и двумя знаками.
export function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}
