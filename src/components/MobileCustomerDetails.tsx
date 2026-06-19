"use client";

import { updateFormField } from "@/store/orderSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { CheckoutFormValues } from "@/types/order";

// MobileCustomerDetails показывает контактные поля перед корзиной, как в мобильном макете.
export function MobileCustomerDetails() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.order.form);

  // handleFieldChange обновляет выбранное поле клиента в общем Redux-состоянии.
  function handleFieldChange(field: keyof CheckoutFormValues, value: string) {
    dispatch(updateFormField({ field, value }));
  }

  return (
    <section className="lg:hidden">
      {/* Группа customer fields повторяет верхнюю часть mobile-дизайна. */}
      <div className="grid gap-3 font-display text-xl font-black uppercase">
        <MobileField label="Customer Name" value={form.customerName} onChange={(value) => handleFieldChange("customerName", value)} />
        <div className="grid grid-cols-2 gap-3">
          <MobileField label="Phone" value={form.phone} onChange={(value) => handleFieldChange("phone", value)} />
          <MobileField label="Email" value={form.email} onChange={(value) => handleFieldChange("email", value)} />
        </div>
        <MobileField label="Shipping Address" value={form.shippingAddress} onChange={(value) => handleFieldChange("shippingAddress", value)} />
      </div>
    </section>
  );
}

// MobileField рисует одну строку с подписью и линией ввода.
function MobileField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span>{label}:</span>
      <input className="w-full border-b-3 border-line bg-transparent px-2 py-1 normal-case" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
