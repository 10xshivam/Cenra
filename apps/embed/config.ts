export const EMBED_CONFIG = {
    WIDGET_URL: (typeof document !== 'undefined' && document.currentScript && (document.currentScript as HTMLScriptElement).src) 
      ? new URL((document.currentScript as HTMLScriptElement).src).origin 
      : import.meta.env.VITE_WIDGET_URL || "http://localhost:3001",
    DEFAULT_WORKSPACE_ID: "9dccb986-4d25-46ab-bbd3-96818b6938c7",
    DEFAULT_POSITION: "bottom-right" as const,
};