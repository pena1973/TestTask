"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";

// StoreProvider отдаёт Redux store всем клиентским компонентам приложения.
export function StoreProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
