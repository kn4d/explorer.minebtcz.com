export function detectQueryType(q) {
  const query = q.trim();

  if (/^[0-9]+$/.test(query)) return "block-height";
  if (/^[0-9a-fA-F]{64}$/.test(query)) return "hash-or-tx";
  if (/^[A-Za-z0-9]{24,}$/.test(query)) return "address";

  return "unknown";
}
