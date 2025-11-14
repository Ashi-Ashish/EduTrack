// Global type declarations for EduTrack Web

// Vite client types
/// <reference types="vite/client" />

// DOM types should be available from tsconfig lib
declare global {
    // Extend ImportMeta environment variables  
    interface ImportMetaEnv {
        readonly VITE_API_BASE_URL?: string;
    }
}

export { };
