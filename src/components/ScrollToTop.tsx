import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop ensures seamless route transitions by resetting scroll position
 * smoothly without jarring jumps, preserving optimal UX across all SPA views.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll instantly to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [pathname, search]);

  return null;
}
