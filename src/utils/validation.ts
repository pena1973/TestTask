import type { CheckoutFormValues, PaymentMethod } from "@/types/order";

// FormErrors описывает ошибки формы по именам полей, чтобы компоненты могли подсвечивать нужные input.
export type FormErrors = Partial<Record<keyof CheckoutFormValues, string>>;

// validateEmail проверяет, что email заполнен и похож на рабочий адрес: name@domain.zone.
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

// getCardDigits оставляет в номере карты только цифры, чтобы пользователь мог вводить пробелы.
function getCardDigits(cardNumber: string): string {
  return cardNumber.replace(/\D/g, "");
}

// validateCardNumber проверяет формат карты для демо-формы: ровно 16 цифр, пробелы разрешены маской.
function validateCardNumber(cardNumber: string): boolean {
  const digits = getCardDigits(cardNumber);
  return digits.length === 16;
}

// validateExpiration проверяет формат MM/YY или MM/YYYY и не пропускает просроченную карту.
function validateExpiration(expiration: string): boolean {
  const match = expiration.trim().match(/^(0[1-9]|1[0-2])\s*\/\s*(\d{2}|\d{4})$/);
  if (!match) return false;

  const month = Number(match[1]);
  const yearPart = match[2];
  const year = yearPart.length === 2 ? Number(`20${yearPart}`) : Number(yearPart);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return year > currentYear || (year === currentYear && month >= currentMonth);
}

// getFormErrors собирает обязательные поля, формат email и карточные данные в одну карту ошибок.
export function getFormErrors(form: CheckoutFormValues, paymentMethod: PaymentMethod): FormErrors {
  const errors: FormErrors = {};

  if (!form.customerName.trim()) errors.customerName = "Required";
  if (!form.phone.trim()) errors.phone = "Required";
  if (!form.email.trim()) {
    errors.email = "Required";
  } else if (!validateEmail(form.email)) {
    errors.email = "Invalid email";
  }
  if (!form.shippingAddress.trim()) errors.shippingAddress = "Required";

  if (paymentMethod === "card") {
    if (!form.cardNumber.trim()) {
      errors.cardNumber = "Required";
    } else if (!validateCardNumber(form.cardNumber)) {
      errors.cardNumber = "Invalid card";
    }

    if (!form.expiration.trim()) {
      errors.expiration = "Required";
    } else if (!validateExpiration(form.expiration)) {
      errors.expiration = "Invalid date";
    }

    if (!form.cvv.trim()) {
      errors.cvv = "Required";
    } else if (!/^\d{3,4}$/.test(form.cvv.trim())) {
      errors.cvv = "Invalid CVV";
    }
  }

  return errors;
}
