declare module 'tailwindcss' {
  export interface Config {
    content?: string | string[];
    presets?: unknown[];
    theme?: {
      extend?: Record<string, unknown>;
    };
    plugins?: unknown[];
  }
}

