export function sanitizeText(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const input = String(value);
  // Strip 4-byte Unicode characters (e.g., emojis) to protect downstream systems.
  return Array.from(input)
    .filter((char) => (char.codePointAt(0) ?? 0) <= 0xffff)
    .join("");
}
