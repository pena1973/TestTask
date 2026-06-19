"use client";

import type { FormEvent } from "react";
import { calculateShipping, calculateSubtotal, formatMoney } from "@/store/calculations";
import { setPaymentMethod, submitOrder, updateFormField } from "@/store/orderSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { CheckoutFormValues, PaymentMethod } from "@/types/order";

// validateEmail проверяет базовый формат email для checkout-формы.
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// validateCardNumber проверяет, что номер карты содержит не меньше 12 цифр.
function validateCardNumber(cardNumber: string): boolean {
  return cardNumber.replace(/\D/g, "").length >= 12;
}

// getFormErrors собирает ошибки обязательных полей и платёжных данных.
function getFormErrors(form: CheckoutFormValues, paymentMethod: PaymentMethod): Partial<Record<keyof CheckoutFormValues, string>> {
  const errors: Partial<Record<keyof CheckoutFormValues, string>> = {};

  if (!form.customerName.trim()) errors.customerName = "Required";
  if (!form.phone.trim()) errors.phone = "Required";
  if (!validateEmail(form.email)) errors.email = "Invalid email";
  if (!form.shippingAddress.trim()) errors.shippingAddress = "Required";

  if (paymentMethod === "card") {
    if (!validateCardNumber(form.cardNumber)) errors.cardNumber = "Invalid card";
    if (!form.expiration.trim()) errors.expiration = "Required";
    if (!/^\d{3,4}$/.test(form.cvv.trim())) errors.cvv = "Invalid CVV";
  }

  return errors;
}

// CheckoutForm рисует компактный правый блок Order Summary из desktop-макета.
export function CheckoutForm() {
  const dispatch = useAppDispatch();
  const { items, paymentMethod, form, submitted } = useAppSelector((state) => state.order);
  const subtotal = calculateSubtotal(items);
  const shipping = calculateShipping(subtotal);
  const errors = getFormErrors(form, paymentMethod);
  const isValid = Object.keys(errors).length === 0;

  // handleFieldChange обновляет одно поле формы по его имени.
  function handleFieldChange(field: keyof CheckoutFormValues, value: string) {
    dispatch(updateFormField({ field, value }));
  }

  // handleSubmit запускает клиентскую валидацию без backend-запроса.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(submitOrder());
  }

  return (
    <section id="summary" className="p-1">
      {/* Заголовок блока сделан вкладкой: рамка только вокруг текста, а нижняя линия уходит вправо. */}
      <div className="mb-2 flex items-end">
        <h2 className="w-1/2 border-2 border-line border-b-0 bg-sand px-2 py-0.5 font-display text-xl font-black uppercase leading-none font-normal tracking-wide">
          Order Summary
        </h2>
        <span className="h-0 flex-1 border-b-2 border-line" />
      </div>

      <form className="space-y-2" onSubmit={handleSubmit} noValidate>
        {/* Контактные данные сделаны плотными строками, как на референсе. */}
        <div className="hidden font-display text-sm font-black uppercase leading-tight lg:block">
          <CompactField label="Customer Name" placeholder="A. Smith" value={form.customerName} error={submitted ? errors.customerName : undefined} onChange={(value) => handleFieldChange("customerName", value)} />
          <div className="grid grid-cols-[42%_minmax(0,58%)] gap-2 overflow-hidden">
            <CompactField label="Phone" placeholder="+1 555 0100" value={form.phone} error={submitted ? errors.phone : undefined} onChange={(value) => handleFieldChange("phone", value)} />
            <CompactField label="Email" placeholder="a.smith@email.com" value={form.email} error={submitted ? errors.email : undefined} onChange={(value) => handleFieldChange("email", value)} />
          </div>
          <CompactField label="Shipping Address" placeholder="21 Kiln Street, Portland" value={form.shippingAddress} error={submitted ? errors.shippingAddress : undefined} onChange={(value) => handleFieldChange("shippingAddress", value)} />
          <CompactField label="Project Notes" placeholder="Kitchen backsplash" value={form.projectNotes} onChange={(value) => handleFieldChange("projectNotes", value)} />
        </div>

        {/* Горизонтальная линия отделяет контактные данные от итогов заказа. */}
        <div className="hidden border-t-3 border-line pt-2 lg:block">
          <div className="ml-auto w-[150px] font-display text-base font-black uppercase leading-tight">
            <SummaryLine label="Subtotal" value={formatMoney(subtotal)} />
            <SummaryLine label="Shipping" value={formatMoney(shipping)} />
            <SummaryLine label="Grand Total" value={formatMoney(subtotal + shipping)} />
          </div>
        </div>

        {/* Методы оплаты: верхняя строка с Credit Card и PayPal. */}
        <div>
          <h3 className="mb-1 inline-block border-3 border-line bg-sand px-2 py-0.5 font-display text-base font-black uppercase leading-none">
            Select Payment Method:
          </h3>
          <div className="mb-1 grid grid-cols-2 gap-2 font-display text-sm font-black uppercase">
            <PaymentRadio id="card" label="Credit/Debit Card" selected={paymentMethod === "card"} onSelect={() => dispatch(setPaymentMethod("card"))} />
            <PaymentRadio id="paypal" label="PayPal" selected={paymentMethod === "paypal"} onSelect={() => dispatch(setPaymentMethod("paypal"))} />
          </div>
        </div>

        {/* Блок карты остаётся компактным и похожим на нарисованную карточку в макете. */}
        <div className="rounded-md border-3 border-line bg-sand/70 p-2">
          <div className="mb-1 flex items-center gap-2">
            <span className={`h-4 w-4 rounded-full border-2 border-line ${paymentMethod === "card" ? "bg-ochre" : "bg-paper"}`} />
            <span className="rounded border-2 border-line bg-paper px-2 font-display text-sm font-black text-navy">VISA</span>
            <span className="flex h-5 w-9 items-center justify-center rounded border-2 border-line bg-paper">
              <span className="h-3.5 w-3.5 rounded-full bg-terracotta" />
              <span className="-ml-1 h-3.5 w-3.5 rounded-full bg-ochre" />
            </span>
          </div>
          <CompactInput label="Card Number" placeholder="1234 4556 7723 8990" value={form.cardNumber} error={submitted ? errors.cardNumber : undefined} onChange={(value) => handleFieldChange("cardNumber", value)} />
          <div className="mt-1 grid grid-cols-2 gap-2">
            <CompactInput label="Expiration /" placeholder="05/29" value={form.expiration} error={submitted ? errors.expiration : undefined} onChange={(value) => handleFieldChange("expiration", value)} />
            <CompactInput label="CVV" placeholder="123" value={form.cvv} error={submitted ? errors.cvv : undefined} onChange={(value) => handleFieldChange("cvv", value)} />
          </div>
        </div>

        {/* Нижняя строка содержит две крупные кнопки Apple Pay и Bank Transfer. */}
        <div className="grid grid-cols-2 gap-2">
          <PaymentTile id="apple" title="Apple Pay" icon="Apple Pay" selected={paymentMethod === "apple"} onSelect={() => dispatch(setPaymentMethod("apple"))} />
          <PaymentTile id="bank" title="Bank Transfer" icon="Bank" selected={paymentMethod === "bank"} onSelect={() => dispatch(setPaymentMethod("bank"))} />
        </div>

        {/* Кнопка отправки запускает только frontend-валидацию. */}
        <button type="submit" className="w-full rounded-md border-3 border-line bg-navy px-3 py-2 font-display text-xl font-black uppercase leading-none text-paper shadow-sketch">
          Place Secure Order
        </button>

        {/* Статус сообщает результат проверки формы. */}
        {submitted ? (
          <p className={`font-display text-base font-black uppercase leading-tight ${isValid ? "text-teal" : "text-terracotta"}`}>
            {isValid ? "Order is ready for frontend demo checkout." : "Please complete the highlighted fields."}
          </p>
        ) : null}
      </form>
    </section>
  );
}

// CompactField рисует строку с подписью и тонкой линией ввода.
function CompactField({ label, placeholder, value, error, onChange }: { label: string; placeholder: string; value: string; error?: string; onChange: (value: string) => void }) {
  return (
    <label className="flex min-w-0 items-end gap-1 overflow-hidden">
      <span className="shrink-0">{label}:</span>
      <input
        className={`min-w-0 flex-1 border-b-2 bg-transparent px-1 leading-none placeholder:text-ink/70 ${error ? "border-terracotta" : "border-line"}`}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

// CompactInput рисует маленькое поле внутри карточного блока.
function CompactInput({ label, placeholder, value, error, onChange }: { label: string; placeholder: string; value: string; error?: string; onChange: (value: string) => void }) {
  return (
    <label className="block font-display text-xs font-black uppercase leading-tight">
      <span>{label}</span>
      <input
        className={`mt-0.5 h-7 w-full rounded border-2 bg-paper px-2 text-sm normal-case placeholder:text-ink/70 ${error ? "border-terracotta" : "border-line"}`}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

// SummaryLine выводит одну строку финансового итога.
function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span>{label}:</span>
      <output>[ {value} ]</output>
    </div>
  );
}

// PaymentRadio рисует компактный radio-переключатель метода оплаты.
function PaymentRadio({ label, selected, onSelect }: { id: PaymentMethod; label: string; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" className="flex items-center gap-2 text-left leading-none" onClick={onSelect}>
      <span className={`h-4 w-4 rounded-full border-2 border-line ${selected ? "bg-ochre" : "bg-paper"}`} />
      <span>{label}</span>
    </button>
  );
}

// PaymentTile рисует крупную нижнюю плитку метода оплаты.
function PaymentTile({ title, icon, selected, onSelect }: { id: PaymentMethod; title: string; icon: string; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" className={`min-h-16 rounded border-3 p-2 font-display font-black uppercase leading-none ${selected ? "bg-sand shadow-sketch" : "bg-paper/70"}`} onClick={onSelect}>
      <span className="mb-1 flex items-center gap-2 text-left text-sm">
        <span className={`h-4 w-4 rounded-full border-2 border-line ${selected ? "bg-ochre" : "bg-paper"}`} />
        <span className="text-lg normal-case">{icon}</span>
      </span>
      <span className="block text-base">{title}</span>
    </button>
  );
}
