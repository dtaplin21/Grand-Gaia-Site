// 1 client/src/lib/config.ts
 /** 
  * API_BASE_URL will be:
  *  - "" (relative) during local dev
  *  - the value of VITE_API_URL in production if set
  */
 export const API_BASE_URL =
   import.meta.env.DEV
     ? "" 
     : (import.meta.env.VITE_API_URL ?? "");
