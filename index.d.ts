declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


declare module '*.png' ;
declare module '*.jpg' ;
declare module '*.webp' ;
declare module '*.mp3' ;
declare module '*.wav' ;