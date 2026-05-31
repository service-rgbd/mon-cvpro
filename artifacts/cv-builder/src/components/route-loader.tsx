import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import PageLoader from "@/components/page-loader";
import { PAGE_LOADER_MS, shouldShowRouteLoader } from "@/lib/page-loader-config";

interface RouteLoaderProps {
  children: ReactNode;
}

export default function RouteLoader({ children }: RouteLoaderProps) {
  const [location] = useLocation();
  const [visible, setVisible] = useState(true);
  const prevLocation = useRef<string | null>(null);
  const initialDone = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideAfter = (ms: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), ms);
  };

  /* Premier chargement — accueil : 3 secondes */
  useEffect(() => {
    hideAfter(PAGE_LOADER_MS);
    initialDone.current = true;
    prevLocation.current = location;

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- une seule fois au montage
  }, []);

  /* Commencer maintenant / Voir les templates depuis l'accueil */
  useEffect(() => {
    if (!initialDone.current || prevLocation.current === null) return;
    if (prevLocation.current === location) return;

    const from = prevLocation.current;
    prevLocation.current = location;

    if (!shouldShowRouteLoader(from, location)) return;

    setVisible(true);
    hideAfter(PAGE_LOADER_MS);
  }, [location]);

  return (
    <>
      {visible && <PageLoader />}
      {children}
    </>
  );
}
