// Header является первым элементом рабочей области под липким меню.
export function Header() {
  return (
    <div className="px-4 py-4 text-center md:px-8">
      {/* Центральная часть разделена на три зоны: левая иконка, основной текст, правая иконка. */}
      <div className="mx-auto grid max-w-[860px] grid-cols-[130px_minmax(0,1fr)_130px] items-center gap-1">
        {/* Левая часть: картинка мастерской из public/images/pic1.png. */}
        <WorkshopImage />

        {/* Центральная часть: главный заголовок и строка с шестью плитками из public. */}
        <div className="min-w-0">
          {/* Заголовок формы использует узкий Google Font, чтобы повторить вытянутый стиль макета. */}
          <h1 className="brand-title text-[46px] font-normal uppercase leading-none md:text-[54px] lg:text-[62px]">
            Ceramic Tile Order Form
          </h1>

          {/* Нижняя строка повторяет дизайн: три плитки, название мастерской, три плитки. */}
          <div className="mt-2 flex items-center justify-center gap-3">
            <TileImage src="/images/tile1.png" alt="Blue ceramic tile" />
            <TileImage src="/images/tile2.png" alt="Terracotta dot ceramic tile" />
            <TileImage src="/images/tile3.png" alt="Green ceramic tile" />
            <p className="mx-2 whitespace-nowrap font-display text-2xl font-black uppercase leading-none md:text-3xl">
              The Artisan Kiln
            </p>
            <TileImage src="/images/tile4.png" alt="Blue star ceramic tile" />
            <TileImage src="/images/tile5.png" alt="Terracotta flower ceramic tile" />
            <TileImage src="/images/tile6.png" alt="Yellow star ceramic tile" />
          </div>
        </div>

        {/* Правая часть: картинка печи из public/images/pic2.png. */}
        <KilnImage />
      </div>
    </div>
  );
}

// TileImage выводит одну готовую PNG-плитку из папки public/images.
function TileImage({ src, alt }: { src: string; alt: string }) {
  return <img className="h-10 w-10 object-contain" src={src} alt={alt} />;
}

// WorkshopImage выводит левую декоративную картинку здания из папки public.
function WorkshopImage() {
  return <img className="h-[130px] w-[130px] object-contain" src="/images/pic1.png" alt="Workshop" />;
}

// KilnImage выводит правую декоративную картинку печи из папки public.
function KilnImage() {
  return <img className="h-[130px] w-[130px] object-contain" src="/images/pic2.png" alt="Kiln" />;
}
