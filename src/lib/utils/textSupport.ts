// Several custom pixel fonts in this game (Teeny, the "pixelmix"/"Teeny Tiny
// Pixls" Phaser bitmap fonts) only ship glyphs for printable ASCII
// (code points 0x20-0x7E). Non-Latin scripts (Cyrillic, CJK, etc.) have no
// glyphs to fall back to there, so text using them needs to switch to the
// player's regular UI font (`var(--font-family)` / `getResolvedFontFamily`)
// instead.
const ASCII_ONLY = /^[\x20-\x7E]+$/;

export const isAsciiText = (text: string): boolean => ASCII_ONLY.test(text);
