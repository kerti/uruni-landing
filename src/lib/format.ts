// Indonesian number formatting, done at build time so no figure is hand-typed
// (CONTEXT.md, Formatting).
const number = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });

/** Rp1.250.000: no space after Rp, full stop for thousands. */
export const rupiah = (amount: number) => `Rp${number.format(amount)}`;
