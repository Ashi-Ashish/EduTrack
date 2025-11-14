/// <reference types="vite/client" />

// Extend ImportMeta environment variables
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}
