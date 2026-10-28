// Illustrative figures for every drawing on the page, hand-written and set in
// the demo's world: the CS Shift Sore office fund, whose two accounts the app
// names Tunai and Rekening Bank. One module, so the drawings can't drift apart.
// Toy amounts; nothing here is real.

export const accounts = {
  tunai: { name: 'Tunai', counted: 385_000 },
  bank: { name: 'Rekening Bank', counted: 1_240_500 },
} as const;

/** What the treasurer counted and read off the bank, together. */
export const counted = accounts.tunai.counted + accounts.bank.counted;

/** What the records say. Equal to counted: the hero shows a cek kas that is cocok. */
export const recorded = 1_625_500;
