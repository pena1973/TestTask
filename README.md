# The Artisan Kiln: Ceramic Tile Order Form

Frontend implementation for the Tile Expert test task:
https://gitlab.com/tile-expert-test-tasks/frontend

The project is a responsive ceramic tile order form with a shopping cart, checkout form, payment method selector, and desktop design tool.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Redux

The app is frontend-only. There is no backend integration; order submission is handled as a client-side demo action.

## Implemented Features

- Responsive layout based on the provided desktop and mobile designs in `design/`.
- Shopping cart with editable quantity, item removal, totals, and random tile addition.
- Drag-and-drop tile adding from the design palette to the cart.
- Desktop design tool with a scrollable `10x10` grid and visible `7x6` working area.
- Drag-and-drop from the palette into design cells.
- Drag-and-drop movement of already placed tiles between grid cells.
- Double-click removal of a tile from a design cell.
- Checkout form with payment method selection.
- Card block visibility only for the credit/debit card payment method.
- Input masks for card number and expiration date.
- Client-side validation for required fields, email, card number, expiration date, and CVV.
- Mobile-specific customer details and payment layout.
- Shared Redux state for cart, design tool, payment method, and form values.
- Shared helpers for tile assets, input masks, validation, and calculations.
- Lightweight hover/active/focus states for clickable UI elements.

## User Instructions

### Shopping Cart

- Use the `Add` icon in a row to increase the item quantity.
- Use the `Remove` icon in a row to remove that item from the cart.
- Click `Add New Tile To Cart` to add a random tile row.
- Drag a tile from the desktop design palette into the shopping cart to add that tile as a new row.
- Cart totals update automatically.

### Design Tool

The design tool is available on desktop screens.

- Drag a tile from the palette into a grid cell to place it.
- Drag an already placed tile to another cell to move it.
- Double-click a filled cell to remove the tile.
- Use the scrollbars to move through the full `10x10` design grid.

### Checkout

- Fill in customer name, phone, email, and shipping address.
- Email must use a valid format, for example `name@example.com`.
- For card payment, fill in:
  - card number in `0000 0000 0000 0000` format;
  - expiration date in `MM/YY` format;
  - CVV with `3` or `4` digits.
- Choosing PayPal, Apple Pay, or Bank Transfer hides the card input block.
- Click `Place Secure Order` to run frontend validation.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build Check

Create a production build:

```bash
npm run build
```

TypeScript can be checked with:

```bash
npx tsc --noEmit
```

## Project Structure

```text
src/app              Next.js app entry, layout, global styles
src/components       UI components split by interface blocks
src/data             Initial cart data, tile palette, image asset maps
src/store            Redux store, slice, selectors/hooks, calculations
src/types            Shared TypeScript types
src/utils            Input masks and validation helpers
public/images        UI images and icons
public/mock          Tile images used by cart and design tool
design               Desktop and mobile reference images
```

## Notes

- Colors and font families are configured through Tailwind and CSS variables.
- The app uses static assets from `public/`; no remote image loading is required.
- Existing code comments describe the purpose of components, functions, and key UI blocks.
