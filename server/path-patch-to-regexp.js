// server/patch-path-to-regexp.js
const p2r = require("path-to-regexp/dist/index.js"); // load the CJS build
const originalParse = p2r.parse;

function safeParse(str, options) {
  try {
    return originalParse(str, options);
  } catch (err) {
    // only catch the “Missing parameter name” case
    if (err.message.includes("Missing parameter name")) {
      // escape any stray "://" sequences so parse() doesn’t choke
      const sanitized = str.replace(/:\/\//g, "__COLON_SLASHSLASH__");
      const tokens = originalParse(sanitized, options);
      // restore the URL
      return tokens.map(t =>
        typeof t === "string"
          ? t.replace(/__COLON_SLASHSLASH__/g, "://")
          : t
      );
    }
    throw err;
  }
}

// now overwrite the CJS export
p2r.parse = safeParse;
