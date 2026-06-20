import { CartTable } from "@/components/CartTable";
import { CheckoutForm } from "@/components/CheckoutForm";
import { DesignTool } from "@/components/DesignTool";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeaderMenu } from "@/components/HeaderMenu";
import { MobileCustomerDetails } from "@/components/MobileCustomerDetails";

// OrderPage собирает главное дерево: липкое меню отдельно, рабочая область с фоном отдельно.
export function OrderPage() {
  return (
    <main className="relative min-h-screen">
      {/* HeaderMenu: отдельное липкое меню без фоновой картинки. */}
      <HeaderMenu />

      {/* Рабочая область: здесь начинается растянутый background.png. */}
      <div className="page-background relative overflow-hidden">
        {/* Header: первый элемент рабочей области с центральным заголовком заказа. */}
        <Header />

        {/* Content: корзина, desktop-визуализатор и checkout-форма. */}
        <div className="workspace-grid relative z-10 mx-auto grid max-w-[1700px] px-[clamp(12px,1.4vw,24px)] py-6 md:grid-cols-[35fr_20fr] min-[1300px]:grid-cols-[35fr_45fr_20fr]">
          {/* MobileCustomerDetails: на узком экране поля клиента стоят над таблицей, как в PNG-макете. */}
          <MobileCustomerDetails />

          {/* CartTable: таблица товаров, количество, удаление и локальные итоги корзины. */}
          <CartTable />

          {/* DesignTool: интерактивная сетка 7x7, видимая только на desktop. */}
          <DesignTool />

          {/* CheckoutForm: данные клиента, метод оплаты, валидация и итог заказа. */}
          <CheckoutForm />
        </div>

        {/* Footer: юридические ссылки и копирайт внутри рабочей области с фоном. */}
        <Footer />
      </div>
    </main>
  );
}
