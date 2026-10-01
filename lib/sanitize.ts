export function sanitizeHtml(input: string | null | undefined): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  let sanitized = input
    // Strip null bytes and non-printable control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Remove entire script and style blocks including their inner contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    // Remove protocol handler vectors
    .replace(/javascript\s*:/gi, "")
    .replace(/vbscript\s*:/gi, "")
    .replace(/data\s*:/gi, "");

  let previous: string;
  do {
    previous = sanitized;
    sanitized = sanitized.replace(/<[^>]*>?/gm, "");
  } while (sanitized !== previous);

  return sanitized.replace(/\s+/g, " ").trim();
}
