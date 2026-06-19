// HeaderMenu отвечает только за липкое верхнее меню, без фоновой картинки рабочей области.
export function HeaderMenu() {
  return (
    <header className="sticky top-0 z-50 bg-paper">
      {/* Верхняя панель: слева точки окна, по центру меню, справа корзина, профиль и имя. */}
      <div className="relative flex h-9 items-center border-y-3 border-line bg-paper px-4">
        {/* Три цветные точки повторяют левую часть верхней полосы из дизайна. */}
        <div className="z-10 flex items-center gap-2" aria-hidden="true">
          <span className="h-3.5 w-3.5 rounded-full border-2 border-line bg-terracotta" />
          <span className="h-3.5 w-3.5 rounded-full border-2 border-line bg-ochre" />
          <span className="h-3.5 w-3.5 rounded-full border-2 border-line bg-teal" />
        </div>

        {/* Desktop-меню закреплено строго по центру всей панели. */}
        <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 whitespace-nowrap font-display text-lg font-black uppercase leading-none md:flex">
          <a href="#cart">Home</a>
          <a href="#cart">Shop</a>
          <a href="#design">Collections</a>
          <a href="#summary">About Us</a>
          <a href="#summary">FAQ</a>
          <a href="#design">Gallery</a>
          <a href="#footer">Blog</a>
        </nav>

        {/* Mobile-меню короче, чтобы не наезжать на правый блок. */}
        <nav className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-6 whitespace-nowrap font-display text-lg font-black uppercase leading-none md:hidden">
          <a href="#cart">Shop</a>
          <a href="#cart">Collections</a>
          <a href="#summary">About Us</a>
        </nav>

        {/* Правый блок содержит иконку корзины, аватар и плашку имени пользователя. */}
        <div className="z-10 ml-auto flex items-center gap-3 font-display font-black">
          <CartIcon />
          <ProfileIcon />
          <button className="rounded-md border-3 border-line bg-navy px-3 py-1 text-sm leading-none text-paper shadow-sketch">
            A. Smith
          </button>
        </div>
      </div>
    </header>
  );
}

// CartIcon рисует корзину из референса: тележка, два колеса и круглый бейдж с числом.
function CartIcon() {
  return (
    <span className="relative block h-8 w-11" aria-label="Cart">
      <svg className="absolute bottom-0 left-0 h-8 w-10" viewBox="0 0 44 34" role="img" aria-hidden="true">
        <path d="M3 4h6l4 18h21l4-13H12" fill="none" stroke="#17140f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <path d="M14 22h20" fill="none" stroke="#17140f" strokeLinecap="round" strokeWidth="3" />
        <circle cx="17" cy="29" r="2.7" fill="#f6efd9" stroke="#17140f" strokeWidth="2.5" />
        <circle cx="32" cy="29" r="2.7" fill="#f6efd9" stroke="#17140f" strokeWidth="2.5" />
      </svg>
      <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full border-3 border-line bg-ochre text-sm leading-none text-ink">
        3
      </span>
    </span>
  );
}

// ProfileIcon рисует круглый аватар: тёмно-синий фон, кремовая голова и плечи.
function ProfileIcon() {
  return (
    <span className="grid h-8 w-8 place-items-center rounded-full border-3 border-line bg-navy" aria-label="Profile">
      <svg className="h-7 w-7" viewBox="0 0 36 36" role="img" aria-hidden="true">
        <circle cx="18" cy="18" r="17" fill="#2f406d" />
        <circle cx="18" cy="13" r="6.5" fill="#f6efd9" stroke="#17140f" strokeWidth="2" />
        <path d="M7.5 32c1.8-8 6.1-12 10.5-12s8.7 4 10.5 12" fill="#f6efd9" stroke="#17140f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      </svg>
    </span>
  );
}
