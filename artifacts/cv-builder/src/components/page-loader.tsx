const headerGifSrc = `${import.meta.env.BASE_URL}MonCV-PRLOGO.gif`;

/** Taille dédiée au loader (plus grande que le header) */
const LOADER_GIF_HEIGHT = 168;
const LOADER_GIF_WIDTH = Math.round(LOADER_GIF_HEIGHT * (1600 / 912));

export default function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-white"
      role="status"
      aria-live="polite"
      aria-label="Chargement"
    >
      <div className="flex flex-col items-center gap-9">
        <img
          src={headerGifSrc}
          alt=""
          width={LOADER_GIF_WIDTH}
          height={LOADER_GIF_HEIGHT}
          className="object-contain pointer-events-none select-none shrink-0"
          style={{ width: LOADER_GIF_WIDTH, height: LOADER_GIF_HEIGHT, maxWidth: "none" }}
          draggable={false}
        />
        <div className="page-loader-ball" aria-hidden="true" />
      </div>
    </div>
  );
}
