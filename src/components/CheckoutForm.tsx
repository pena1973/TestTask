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
    <section id="summary" className="summary-tool p-[var(--summary-padding)] md:col-start-2 min-[1300px]:col-start-3">
      {/* MobilePaymentPanel: отдельная мобильная версия блока оплаты и заметок из макета. */}
      <MobilePaymentPanel paymentMethod={paymentMethod} projectNotes={form.projectNotes} onSelect={(method) => dispatch(setPaymentMethod(method))} onProjectNotesChange={(value) => handleFieldChange("projectNotes", value)} />
      {/* Заголовок блока сделан вкладкой: рамка только вокруг текста, а нижняя линия уходит вправо. */}
      <div className="mb-2 hidden items-end md:flex">
        <h2 className="w-1/2 border-2 border-line border-b-0 bg-sand px-[var(--summary-title-x)] py-0.5 font-display text-[var(--summary-title-size)] font-normal uppercase leading-none tracking-wide">
          Order Summary
        </h2>
        <span className="h-0 flex-1 border-b-2 border-line" />
      </div>

      <form className="hidden space-y-[var(--summary-gap)] md:block" onSubmit={handleSubmit} noValidate>
        {/* Контактные данные сделаны плотными строками, как на референсе. */}
        <div className="hidden font-display text-[var(--summary-field-size)] font-normal uppercase leading-tight md:block">
          <CompactField label="Customer Name" placeholder="A. Smith" value={form.customerName} error={submitted ? errors.customerName : undefined} onChange={(value) => handleFieldChange("customerName", value)} />
          <div className="grid grid-cols-[42%_minmax(0,58%)] gap-[var(--summary-gap)] overflow-hidden">
            <CompactField label="Phone" placeholder="+1 555 0100" value={form.phone} error={submitted ? errors.phone : undefined} onChange={(value) => handleFieldChange("phone", value)} />
            <CompactField label="Email" placeholder="a.smith@email.com" value={form.email} error={submitted ? errors.email : undefined} onChange={(value) => handleFieldChange("email", value)} />
          </div>
          <CompactField label="Shipping Address" placeholder="21 Kiln Street, Portland" value={form.shippingAddress} error={submitted ? errors.shippingAddress : undefined} onChange={(value) => handleFieldChange("shippingAddress", value)} />
          <CompactField label="Project Notes" placeholder="Kitchen backsplash" value={form.projectNotes} multiline onChange={(value) => handleFieldChange("projectNotes", value)} />
          
        </div>

        {/* Горизонтальная линия отделяет контактные данные от итогов заказа. */}
        <div className="hidden border-t-0 order-line pt-2 md:block">
          <div className="ml-auto w-[70%] font-display text-[var(--summary-total-size)] font-normal uppercase leading-tight">
            <SummaryLine label="Subtotal" value={formatMoney(subtotal)} />
            <SummaryLine label="Shipping" value={formatMoney(shipping)} />
            <SummaryLine label="Grand Total" value={formatMoney(subtotal + shipping)} />
          </div>
        </div>

        {/* Методы оплаты: верхняя строка с Credit Card и PayPal. */}
        <div>
          <h3 className="mb-1 inline-block border border-line bg-sand px-[var(--summary-title-x)] py-0.5 font-display text-[var(--summary-method-title-size)] font-normal uppercase leading-none">
            Select Payment Method:
          </h3>
          <div className="mb-1 grid grid-cols-2 gap-[var(--summary-gap)] font-display text-[var(--summary-radio-size)] font-normal uppercase">
            <PaymentRadio id="card" label="Credit/Debit Card" selected={paymentMethod === "card"} onSelect={() => dispatch(setPaymentMethod("card"))} />
            <PaymentRadio id="paypal" label="PayPal" logo="/images/payment_desktop_paypal.png" selected={paymentMethod === "paypal"} onSelect={() => dispatch(setPaymentMethod("paypal"))} />
          </div>
        </div>

        {/* Блок карты остаётся компактным и похожим на нарисованную карточку в макете. */}
        <div className={`rounded-md border-2 border-line bg-sand/70 p-[var(--summary-card-padding)] ${paymentMethod === "card" ? "block" : "hidden"}`}>
          <div className="mb-1 flex items-center gap-[var(--summary-gap)]">
            <span className={`h-4 w-4 rounded-full border border-line ${paymentMethod === "card" ? "bg-ochre" : "bg-paper"}`} />
            <span className="rounded border border-line bg-paper px-[var(--summary-title-x)] font-display text-[var(--summary-radio-size)] font-normal text-navy">VISA</span>
            <span className="flex h-5 w-9 items-center justify-center rounded border border-line bg-paper">
              <span className="h-3.5 w-3.5 rounded-full bg-terracotta" />
              <span className="-ml-1 h-3.5 w-3.5 rounded-full bg-ochre" />
            </span>
          </div>
          <CompactInput label="Card Number" placeholder="1234 4556 7723 8990" value={form.cardNumber} error={submitted ? errors.cardNumber : undefined} onChange={(value) => handleFieldChange("cardNumber", value)} />
          <div className="mt-1 grid grid-cols-2 gap-[var(--summary-gap)]">
            <CompactInput label="Expiration /" placeholder="05/29" value={form.expiration} error={submitted ? errors.expiration : undefined} onChange={(value) => handleFieldChange("expiration", value)} />
            <CompactInput label="CVV" placeholder="123" value={form.cvv} error={submitted ? errors.cvv : undefined} onChange={(value) => handleFieldChange("cvv", value)} />
          </div>
        </div>

        {/* Нижняя строка содержит две крупные кнопки Apple Pay и Bank Transfer. */}
        <div className="grid grid-cols-2 gap-[var(--summary-gap)] ">
          <PaymentTile 
          id="apple" 
          title="Apple Pay" 
          icon="/images/payment_desktop_apple.png" 
          selected={paymentMethod === "apple"} 
          onSelect={() => dispatch(setPaymentMethod("apple"))} />
          <PaymentTile id="bank" title="Bank Transfer" icon="/images/payment_desktop_bank.png" iconClassName="h-10 w-24 translate-x-2" selected={paymentMethod === "bank"} onSelect={() => dispatch(setPaymentMethod("bank"))} />
        </div>

        {/* Кнопка отправки запускает только frontend-валидацию. */}
        <button type="submit" className="w-full rounded-md border border-line bg-navy px-3 py-[var(--summary-button-y)] font-display text-[var(--summary-button-size)] font-normal uppercase leading-none text-paper shadow-sketch">
          Place Secure Order
        </button>

        {/* Статус сообщает результат проверки формы. */}
        {submitted ? (
          <p className={`font-display text-[var(--summary-method-title-size)] font-normal uppercase leading-tight ${isValid ? "text-teal" : "text-terracotta"}`}>
            {isValid ? "Order is ready for frontend demo checkout." : "Please complete the highlighted fields."}
          </p>
        ) : null}
      </form>
    </section>
  );
}

// CompactField рисует строку с подписью и тонкой линией ввода.
// MobilePaymentPanel показывает компактный выбор оплаты и поле заметок в мобильном макете.
function MobilePaymentPanel({
  paymentMethod,
  projectNotes,
  onSelect,
  onProjectNotesChange
}: {
  paymentMethod: PaymentMethod;
  projectNotes: string;
  onSelect: (method: PaymentMethod) => void;
  onProjectNotesChange: (value: string) => void;
}) {
  return (
    <div className="mobile-payment-panel md:hidden">
      {/* Заголовок мобильного выбора оплаты сделан вкладкой, как в референсе. */}
      <h3 className="inline-block border border-line bg-sand px-2 py-0.5 font-display text-[clamp(15px,3.4vw,20px)] font-normal uppercase leading-none">
        Select Payment Method:
      </h3>

      {/* Сетка методов оплаты: четыре одинаковые ячейки в одну строку. */}
      <div className="grid grid-cols-4 border border-line font-display uppercase leading-none">
        <MobilePayButton method="card" title="Credit/Debit Card" icon="card" selected={paymentMethod === "card"} onSelect={onSelect} />
        <MobilePayButton method="paypal" title="PayPal" icon="paypal" selected={paymentMethod === "paypal"} onSelect={onSelect} />
        <MobilePayButton method="apple" title="Apple Pay" icon="apple" selected={paymentMethod === "apple"} onSelect={onSelect} />
        <MobilePayButton method="bank" title="Bank Transfer" icon="bank" selected={paymentMethod === "bank"} onSelect={onSelect} />
      </div>

      {/* Project notes в мобильном дизайне перенесены под оплату отдельной строкой. */}
      <label className="mt-3 flex items-end gap-3 font-display text-[clamp(16px,3.5vw,22px)] font-normal uppercase leading-none">
        <span className="shrink-0">Project Name / Notes:</span>
        <input className="min-w-0 flex-1 border-b-3 border-line bg-transparent px-2 leading-none" value={projectNotes} onChange={(event) => onProjectNotesChange(event.target.value)} />        
      </label>       
      
    </div>
  );
}

// MobilePayButton рисует одну мобильную кнопку способа оплаты с круглым индикатором.
function MobilePayButton({ method, title, icon, selected, onSelect }: { method: PaymentMethod; title: string; icon: "card" | "paypal" | "apple" | "bank"; selected: boolean; onSelect: (method: PaymentMethod) => void }) {
  return (
    <button type="button" className="grid min-h-[82px] grid-cols-[18px_1fr] items-start border-r-2 border-line px-1.5 py-2 text-left last:border-r-0" onClick={() => onSelect(method)}>
      <span className={`mt-2 h-4 w-4 rounded-full border-2 border-line ${selected ? "bg-ochre" : "bg-paper"}`} />
      <span className="grid justify-items-center gap-1 text-center">
        <MobilePayIcon icon={icon} />
        <span className="max-w-[82px] text-[clamp(12px,2.6vw,16px)] font-normal leading-none">{title}</span>
      </span>
    </button>
  );
}

// MobilePayIcon имитирует простые пиктограммы из мобильного макета без внешних библиотек.
function MobilePayIcon({ icon }: { icon: "card" | "paypal" | "apple" | "bank" }) {
  const icons = {
    card: "/images/payment_card.png",
    paypal: "/images/payment_paypal.png",
    apple: "/images/payment_apple.png",
    bank: "/images/payment_bank.png"
  };

  return <img className="h-[34px] w-[58px] object-contain" src={icons[icon]} alt="" aria-hidden="true" />;
}

function CompactField({ label, placeholder, value, error, multiline = false, onChange }: { label: string; placeholder: string; value: string; error?: string; multiline?: boolean; onChange: (value: string) => void }) {
  const [firstLine = "", secondLine = ""] = multiline ? value.split("\n") : [value, ""];

  // handleMultilineChange соединяет две строки project notes в одно поле формы.
  function handleMultilineChange(nextFirstLine: string, nextSecondLine: string) {
    onChange([nextFirstLine, nextSecondLine].filter(Boolean).join("\n"));
  }

  return (
    <label className={multiline ? "grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-end gap-x-1 gap-y-1 overflow-hidden" : "flex min-w-0 items-end gap-1 overflow-hidden"}>
      <span className="shrink-0">{label}:</span>
      <input
        className={`min-w-0 flex-1 border-b-2 bg-transparent px-1 leading-none placeholder:text-ink/70 ${error ? "border-terracotta" : "border-line"}`}
        placeholder={placeholder}
        value={multiline ? firstLine : value}
        onChange={(event) => (multiline ? handleMultilineChange(event.target.value, secondLine) : onChange(event.target.value))}
      />
      {multiline ? (
        <input
          className="col-span-2 min-w-0 border-b-2 border-line bg-transparent px-1 leading-none placeholder:text-ink/70"
          value={secondLine}
          onChange={(event) => handleMultilineChange(firstLine, event.target.value)}
          aria-label={`${label} second line`}
        />
      ) : null}
    </label>
  );
}

// CompactInput рисует маленькое поле внутри карточного блока.
function CompactInput({ label, placeholder, value, error, onChange }: { label: string; placeholder: string; value: string; error?: string; onChange: (value: string) => void }) {
  return (
    <label className="block font-display text-xs font-normal uppercase leading-tight">
      <span>{label}</span>
      <input
        className={`mt-0.5 h-[var(--summary-input-height)] w-full rounded border bg-paper px-[var(--summary-title-x)] text-[var(--summary-radio-size)] normal-case placeholder:text-ink/70 ${error ? "border-terracotta" : "border-line"}`}
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
    <div className="grid grid-cols-[42%_58%] items-center gap-1">
      <span>{label}:</span>
      <output className="text-right">[ {value} ]</output>
    </div>
  );
}

// PaymentRadio рисует компактный radio-переключатель метода оплаты.
function PaymentRadio({ label, logo, selected, onSelect }: { id: PaymentMethod; label: string; logo?: string; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" className="flex items-center gap-2 text-left leading-none" onClick={onSelect}>
      <span className={`h-4 w-4 rounded-full border-2 border-line ${selected ? "bg-ochre" : "bg-paper"}`} />
      {logo ? <img className="h-6 w-16 object-contain object-left" src={logo} alt={label} /> : <span>{label}</span>}
    </button>
  );
}

// PaymentTile рисует крупную нижнюю плитку метода оплаты.
function PaymentTile({ title, icon, iconClassName = "h-8 w-20", selected, onSelect }: { id: PaymentMethod; title: string; icon: string; iconClassName?: string; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" className={`min-h-16 rounded border border-line p-2 font-display font-normal uppercase leading-none ${selected ? "bg-sand shadow-sketch" : "bg-paper/70"}`} onClick={onSelect}>
      <span className="mb-1 flex items-center gap-2 text-left text-sm">
        <span className={`h-4 w-4 shrink-0 rounded-full border-2 border-line ${selected ? "bg-ochre" : "bg-paper"}`} />
        <img className={`${iconClassName} object-contain object-left`} src={icon} alt={title} />
      </span>
      <span className="block text-base">{title}</span>
    </button>
  );
}
