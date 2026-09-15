import { useEffect, useRef, useState } from 'react';

/**
 * Observe an element and report whether it is intersecting the viewport.
 * Used to park expensive animation work (WebGL frameloops) while the
 * element is scrolled out of view.
 */
export function useInView<T extends Element>(threshold = 0.05): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold });
    io.observe(node);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView];
}
