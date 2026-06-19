// Footer содержит служебные ссылки и копирайт из нижней части макета.
export function Footer() {
  return (
    <footer id="footer" className="relative z-10 mt-8 pb-4 text-center font-display text-sm font-black uppercase md:mt-6">
      {/* Ссылки имитируют footer-навигацию из desktop-дизайна. */}
      <nav className="flex flex-wrap justify-center gap-x-3 gap-y-1">
        <a href="#summary">Terms of Service</a>
        <span>|</span>
        <a href="#summary">Privacy Policy</a>
        <span>|</span>
        <a href="#summary">Shipping Info</a>
        <span>|</span>
        <a href="#summary">Contact Us</a>
      </nav>
      <p className="mt-1">(c) 2026 The Artisan Kiln. All rights reserved.</p>
    </footer>
  );
}
