/**
 * Performance Monitoring Utilities
 * Mengukur dan track performa aplikasi
 */

// Web Vitals metrics
interface PerformanceMetrics {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

/**
 * Measure First Contentful Paint (FCP)
 */
export function measureFCP(): void {
  if ('performance' in window && 'PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime, 'ms');
            observer.disconnect();
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      // Ignore
    }
  }
}

/**
 * Measure Largest Contentful Paint (LCP)
 */
export function measureLCP(): void {
  if ('performance' in window && 'PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime, 'ms');
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Ignore
    }
  }
}

/**
 * Measure First Input Delay (FID)
 */
export function measureFID(): void {
  if ('performance' in window && 'PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fid = (entry as any).processingStart - entry.startTime;
          console.log('FID:', fid, 'ms');
          observer.disconnect();
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // Ignore
    }
  }
}

/**
 * Measure Cumulative Layout Shift (CLS)
 */
export function measureCLS(): void {
  if ('performance' in window && 'PerformanceObserver' in window) {
    try {
      let clsScore = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsScore += (entry as any).value;
            console.log('CLS:', clsScore);
          }
        }
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // Ignore
    }
  }
}

/**
 * Get all performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  if (!('performance' in window)) return {};

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');

  const metrics: PerformanceMetrics = {};

  // TTFB
  if (navigation) {
    metrics.TTFB = navigation.responseStart - navigation.requestStart;
  }

  // FCP
  const fcpEntry = paint.find(entry => entry.name === 'first-contentful-paint');
  if (fcpEntry) {
    metrics.FCP = fcpEntry.startTime;
  }

  return metrics;
}

/**
 * Log all performance data
 */
export function logPerformance(): void {
  if (!('performance' in window)) return;

  console.group('🚀 Performance Metrics');
  
  const metrics = getPerformanceMetrics();
  console.table(metrics);

  // Resource timing
  const resources = performance.getEntriesByType('resource');
  console.log('📦 Total Resources:', resources.length);
  
  // Slow resources (> 1s)
  const slowResources = resources.filter(r => r.duration > 1000);
  if (slowResources.length > 0) {
    console.warn('⚠️ Slow Resources (>1s):', slowResources);
  }

  console.groupEnd();
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(): void {
  // Only in browser and development
  if (typeof window === 'undefined') return;
  
  // Wait for page load
  if (document.readyState === 'complete') {
    setupMonitoring();
  } else {
    window.addEventListener('load', setupMonitoring);
  }
}

function setupMonitoring(): void {
  // Measure Web Vitals
  measureFCP();
  measureLCP();
  measureFID();
  measureCLS();

  // Log after 5 seconds
  setTimeout(() => {
    logPerformance();
  }, 5000);
}

/**
 * Mark custom performance point
 */
export function markPerformance(name: string): void {
  if ('performance' in window && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Measure between two marks
 */
export function measureBetweenMarks(name: string, startMark: string, endMark: string): void {
  if ('performance' in window && performance.measure) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      console.log(`⏱️ ${name}:`, measure.duration.toFixed(2), 'ms');
    } catch (e) {
      console.warn('Could not measure:', e);
    }
  }
}

/**
 * Clear performance marks
 */
export function clearPerformanceMarks(): void {
  if ('performance' in window) {
    performance.clearMarks();
    performance.clearMeasures();
  }
}
