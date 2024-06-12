/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly SOURCE_GOOGLE_SPREADSHEET_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
