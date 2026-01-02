import { useState, useCallback, useEffect, useRef } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/**
 * Custom hook untuk Intersection Observer
 * Berguna untuk lazy loading dan animasi on scroll
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false
  } = options;

  const elementRef = useRef<Element | null>(null);
  const frozen = useRef(false);

  const [isIntersecting, setIsIntersecting] = useState(false);

  const callback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (freezeOnceVisible && entry.isIntersecting) {
        frozen.current = true;
      }

      if (!frozen.current) {
        setIsIntersecting(entry.isIntersecting);
      }
    },
    [freezeOnceVisible]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(callback, {
      threshold,
      root,
      rootMargin
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [callback, threshold, root, rootMargin]);

  return { elementRef, isIntersecting };
}

/**
 * Custom hook untuk debounce - mengurangi frequency function calls
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook untuk throttle - membatasi execution rate
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRun.current;

      if (timeSinceLastRun >= delay) {
        callback(...args);
        lastRun.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          callback(...args);
          lastRun.current = Date.now();
        }, delay - timeSinceLastRun);
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Custom hook untuk media query - responsive design
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Modern approach
    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}

/**
 * Custom hook untuk idle detection - menjalankan task saat browser idle
 */
export function useIdleCallback(callback: () => void, options?: IdleRequestOptions) {
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const handle = requestIdleCallback(callback, options);
      return () => cancelIdleCallback(handle);
    } else {
      // Fallback untuk browser yang tidak support
      const timeout = setTimeout(callback, 1);
      return () => clearTimeout(timeout);
    }
  }, [callback, options]);
}
