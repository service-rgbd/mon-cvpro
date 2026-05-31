export const PAGE_LOADER_MS = 3000;

/** Afficher le loader au premier chargement et vers builder / templates depuis l'accueil */
export function shouldShowRouteLoader(from: string, to: string): boolean {
  if (to === "/builder" || to === "/templates") {
    return from === "/" || from === "";
  }
  return false;
}
