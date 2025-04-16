
import * as ptr from "path-to-regexp";

  // Wrap the original `parse` so it never throws
 const originalParse = ptr.parse as typeof ptr.parse;
  (ptr as any).parse = function safeParse(input: string, options?: any) {
    try {
      return originalParse(input, options);
    } catch (err) {
      console.warn(
       "[path-to-regexp] parse failed for:",
       JSON.stringify(input),
       "– falling back to literal match"
     );
     // Return a single ‘text’ token so routing still works (exact literal)
     return new (ptr as any).TokenData([{ type: "text", value: input }]);
   }
 };

 // Also patch `compile` to delegate through our safeParse
 const originalCompile = ptr.compile as typeof ptr.compile;
 (ptr as any).compile = function safeCompile(path: any, opts?: any) {
   if (typeof path === "string") {
     path = ptr.parse(path, opts);
   }
   return originalCompile(path, opts);
 };
