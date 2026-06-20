import type { CheckoutFormValues } from "@/types/order";

// formatCardNumber оставляет только цифры, ограничивает номер 16 цифрами и группирует блоками по четыре.
export function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

// formatExpiration оставляет только цифры, ограничивает месяц диапазоном 01-12 и ставит разделитель MM/YY.
export function formatExpiration(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (!digits) {
    return "";
  }

  if (digits.length === 1) {
    return Number(digits) > 1 ? `0${digits}/` : digits;
  }

  const rawMonth = Number(digits.slice(0, 2));
  const month = Math.min(Math.max(rawMonth, 1), 12).toString().padStart(2, "0");
  const year = digits.slice(2);

  return year ? `${month}/${year}` : month;
}

// maskCheckoutField применяет маску только к тем полям checkout, которым она нужна.
export function maskCheckoutField(field: keyof CheckoutFormValues, value: string): string {
  if (field === "cardNumber") {
    return formatCardNumber(value);
  }

  if (field === "expiration") {
    return formatExpiration(value);
  }

  return value;
}
