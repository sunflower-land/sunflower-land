/**
 * Mask the local part of an email while leaving the domain visible
 * (e.g. `johndoeow@example.com` → `jo*****ow@example.com`). Keeps the
 * first two and last two characters of the local part only when it is
 * at least 7 chars long; for shorter locals, just the first two are
 * shown so we don't reveal most of a short address (e.g. `elias` →
 * `el***`, not `el*as`). Padding stays at ≥ 3 asterisks so very short
 * locals still look masked.
 */
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@");
  if (!domain) return email;

  if (local.length >= 7) {
    const head = local.slice(0, 2);
    const tail = local.slice(-2);
    const stars = "*".repeat(local.length - 4);
    return `${head}${stars}${tail}@${domain}`;
  }

  const head = local.slice(0, Math.min(2, local.length));
  const stars = "*".repeat(Math.max(3, local.length - head.length));
  return `${head}${stars}@${domain}`;
};
