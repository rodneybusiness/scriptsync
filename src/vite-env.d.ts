/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_ACTIVE_PROJECT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
