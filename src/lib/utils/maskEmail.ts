/**
 * Mask an email address. The local part is always masked; the domain
 * is kept visible only when it is `gmail.com` (extremely common, so
 * revealing it leaks little), otherwise the domain is masked with the
 * same algorithm — corporate / personal domains are identifying.
 *
 * Masking rule for each part:
 * - length ≥ 7 → keep the first two and last two characters
 *   (e.g. `johndoeow` → `jo*****ow`, `sunflower-land.com` →
 *   `su**************om`).
 * - length < 7 → reveal only the first two and pad with at least three
 *   asterisks (e.g. `elias` → `el***`).
 */
const maskPart = (part: string): string => {
  if (part.length >= 7) {
    const head = part.slice(0, 2);
    const tail = part.slice(-2);
    const stars = "*".repeat(part.length - 4);
    return `${head}${stars}${tail}`;
  }
  const head = part.slice(0, Math.min(2, part.length));
  const stars = "*".repeat(Math.max(3, part.length - head.length));
  return `${head}${stars}`;
};

export const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@");
  if (!domain) return email;

  const maskedLocal = maskPart(local);
  const maskedDomain =
    domain.toLowerCase() === "gmail.com" ? domain : maskPart(domain);
  return `${maskedLocal}@${maskedDomain}`;
};
