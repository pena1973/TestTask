// Тип описывает доступные визуальные паттерны плитки из макета.
export type TilePattern =
  | "wave"
  | "fern"
  | "dot"
  | "star"
  | "diamond"
  | "blueStar"
  | "weave"
  | "bird"
  | "tile01"
  | "tile02"
  | "tile03"
  | "tile04"
  | "tile05"
  | "tile06"
  | "tile07"
  | "tile08"
  | "tile09"
  | "tile10";

// Тип описывает одну позицию корзины: название, количество, цену и паттерн.
export type CartItem = {
  id: string;
  collection: string;
  pattern: TilePattern;
  quantity: number;
  unitPrice: number;
};

// Тип описывает поддерживаемые методы оплаты в форме заказа.
export type PaymentMethod = "card" | "paypal" | "apple" | "bank";

// Тип описывает одну ячейку интерактивной сетки визуализатора.
export type DesignCell = {
  id: string;
  pattern: TilePattern | null;
};

// Тип описывает поля контактной формы и заметок проекта.
export type CheckoutFormValues = {
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: string;
  projectNotes: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
};
