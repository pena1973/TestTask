import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { designPalette, initialCartItems, initialGridPatterns } from "@/data/tiles";
import type { CartItem, CheckoutFormValues, DesignCell, PaymentMethod, TilePattern } from "@/types/order";

// Форма получает пустые значения, чтобы валидация честно реагировала на ввод пользователя.
const emptyForm: CheckoutFormValues = {
  customerName: "",
  phone: "",
  email: "",
  shippingAddress: "",
  projectNotes: "",
  cardNumber: "",
  expiration: "",
  cvv: ""
};

// Начальная сетка превращается в массив ячеек с id для стабильного рендера React.
const initialGrid: DesignCell[] = initialGridPatterns.map((pattern, index) => ({
  id: `cell-${index}`,
  pattern
}));

// Тип описывает всё глобальное состояние интерактивной формы заказа.
type OrderState = {
  items: CartItem[];
  selectedPattern: TilePattern;
  grid: DesignCell[];
  paymentMethod: PaymentMethod;
  form: CheckoutFormValues;
  submitted: boolean;
};

// Начальное состояние берёт товары и выбранную плитку из макета.
const initialState: OrderState = {
  items: initialCartItems,
  selectedPattern: designPalette[0],
  grid: initialGrid,
  paymentMethod: "card",
  form: emptyForm,
  submitted: false
};

// Slice хранит все действия корзины, визуализатора и формы в одном доменном модуле.
export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Изменяет количество плитки, не позволяя уйти ниже нуля.
    setQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((entry) => entry.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(0, action.payload.quantity);
      }
    },

    // Увеличивает количество выбранной позиции на один квадратный фут.
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },

    // Уменьшает количество позиции и оставляет минимум ноль.
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((entry) => entry.id === action.payload);
      if (item) {
        item.quantity = Math.max(0, item.quantity - 1);
      }
    },

    // Удаляет плитку из корзины по id.
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // Добавляет демонстрационную плитку в корзину, если пользователь нажал кнопку добавления.
    addTileToCart: (state) => {
      const nextIndex = state.items.length + 1;
      state.items.push({
        id: `custom-tile-${nextIndex}`,
        collection: `Custom Tile ${nextIndex}`,
        pattern: state.selectedPattern,
        quantity: 25,
        unitPrice: 27
      });
    },

    // Запоминает плитку, которую пользователь выбрал в палитре дизайна.
    selectPattern: (state, action: PayloadAction<TilePattern>) => {
      state.selectedPattern = action.payload;
    },

    // Размещает выбранную плитку в конкретной ячейке сетки 7x7.
    paintGridCell: (state, action: PayloadAction<string>) => {
      const cell = state.grid.find((entry) => entry.id === action.payload);
      if (cell) {
        cell.pattern = state.selectedPattern;
      }
    },

    // Очищает конкретную ячейку, если пользователь решил убрать плитку.
    clearGridCell: (state, action: PayloadAction<string>) => {
      const cell = state.grid.find((entry) => entry.id === action.payload);
      if (cell) {
        cell.pattern = null;
      }
    },

    // Переключает активный способ оплаты в форме заказа.
    setPaymentMethod: (state, action: PayloadAction<PaymentMethod>) => {
      state.paymentMethod = action.payload;
    },

    // Обновляет одно поле checkout-формы без потери остальных значений.
    updateFormField: (state, action: PayloadAction<{ field: keyof CheckoutFormValues; value: string }>) => {
      state.form[action.payload.field] = action.payload.value;
      state.submitted = false;
    },

    // Помечает форму отправленной, чтобы пользователь увидел ошибки или успешный статус.
    submitOrder: (state) => {
      state.submitted = true;
    }
  }
});

export const {
  setQuantity,
  incrementQuantity,
  decrementQuantity,
  removeItem,
  addTileToCart,
  selectPattern,
  paintGridCell,
  clearGridCell,
  setPaymentMethod,
  updateFormField,
  submitOrder
} = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
