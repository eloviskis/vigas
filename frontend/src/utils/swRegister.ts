/**
 * Service Worker Registration
 * Registra o SW para caching em produção
 */

export function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        console.log('SW registered:', registration);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // a cada minuto
      } catch (error) {
        console.error('SW registration failed:', error);
      }
    });
  }
}

/**
 * Cache Storage API para dados do usuário
 */
export const cacheStorage = {
  async set(key: string, value: any, ttl: number = 3600000) {
    const data = {
      value,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(`cache:${key}`, JSON.stringify(data));
  },

  async get(key: string) {
    const stored = localStorage.getItem(`cache:${key}`);
    if (!stored) return null;

    const data = JSON.parse(stored);
    const isExpired = Date.now() - data.timestamp > data.ttl;

    if (isExpired) {
      localStorage.removeItem(`cache:${key}`);
      return null;
    }

    return data.value;
  },

  async remove(key: string) {
    localStorage.removeItem(`cache:${key}`);
  },

  async clear() {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('cache:')) {
        localStorage.removeItem(key);
      }
    });
  },
};
