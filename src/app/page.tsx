import { StoreProvider } from "@/components/StoreProvider";
import { OrderPage } from "@/components/OrderPage";

// HomePage является точкой входа: подключает Redux и главное дерево интерфейса.
export default function HomePage() {
  return (
    <StoreProvider>
      {/* Главное дерево приложения: декоративная рамка, шапка, корзина, визуализатор и checkout. */}
      <OrderPage />
    </StoreProvider>
  );
}
