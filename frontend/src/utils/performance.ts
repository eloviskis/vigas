export interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

export const metrics: PerformanceMetrics = {};

export function collectWebVitals() {
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.lcp = (lastEntry as any).renderTime || (lastEntry as any).loadTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {}
  }

  const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (perfData) {
    metrics.ttfb = perfData.responseStart - perfData.fetchStart;
  }
}
