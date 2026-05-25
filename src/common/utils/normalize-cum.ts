/**
 * Normalizes a CUM code so that suffixes 01-09 become 1-9.
 * Example: "19967068-01" → "19967068-1", "20161254-10" → unchanged.
 */
export function normalizeCum(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const dashIdx = trimmed.lastIndexOf('-');
  if (dashIdx === -1) return trimmed;
  const prefix = trimmed.slice(0, dashIdx);
  const suffix = trimmed.slice(dashIdx + 1);
  return `${prefix}-${suffix.replace(/^0+([1-9])$/, '$1')}`;
}
