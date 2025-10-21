interface Window {
  env: {
    VITE_API_PATH: string;
    [key: string]: string | undefined; // optional, for any other vars
  };
}
