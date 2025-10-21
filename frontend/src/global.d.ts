declare global {
  interface Window {
    env: {
      VITE_API_PATH: string;
    };
  }
}

export {};