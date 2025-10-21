export const getApiPath = (): string => {
  // First try to get from runtime environment (set by entrypoint.sh)
  if (typeof window !== 'undefined' && window.env && window.env.VITE_API_PATH) {
    return window.env.VITE_API_PATH;
  }
  // Fallback to build-time environment variable
  return import.meta.env.VITE_API_PATH || 'http://localhost:8080';
};
