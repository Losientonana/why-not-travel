"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const ScrollToTopInner = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, searchParams]);

  return null;
};

export const ScrollToTop = () => {
  return (
    <Suspense fallback={null}>
      <ScrollToTopInner />
    </Suspense>
  );
};