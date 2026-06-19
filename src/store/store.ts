import { configureStore } from "@reduxjs/toolkit";
import { orderReducer } from "@/store/orderSlice";

// Store объединяет Redux-состояние корзины, формы и визуализатора.
export const store = configureStore({
  reducer: {
    order: orderReducer
  }
});

// Тип RootState нужен селекторам, чтобы безопасно читать данные из store.
export type RootState = ReturnType<typeof store.getState>;

// Тип AppDispatch нужен компонентам, чтобы dispatch понимал доступные actions.
export type AppDispatch = typeof store.dispatch;
