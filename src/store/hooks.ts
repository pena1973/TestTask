"use client";

import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";

// Хук возвращает типизированный dispatch для отправки Redux actions.
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Хук возвращает типизированный selector для чтения Redux state.
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
