// Illustrative figures for every drawing on the page, hand-written and set in
// the demo's world: the CS Shift Sore office fund, whose two accounts the app
// names Tunai and Rekening Bank. One module, so the drawings can't drift apart.
// The amounts are the demo's seeded balances, so the hero and the demo
// screenshots (scripts/demo-shots.mjs) show the same fund. Nothing here is real.

export const accounts = {
  tunai: { name: 'Tunai', counted: 2_152_000 },
  bank: { name: 'Rekening Bank', counted: 3_324_500 },
} as const;

/** What the treasurer counted and read off the bank, together. */
export const counted = accounts.tunai.counted + accounts.bank.counted;

/** What the records say. Equal to counted: the hero shows a cek kas that is cocok. */
export const recorded = 5_476_500;

/**
 * The other outcome, for the Kenapa section: a cek kas where the cash is cocok
 * but the bank reads less than the records, so the selisih shows on that
 * location alone.
 */
export const selisihCheck = {
  tunai: { counted: accounts.tunai.counted, recorded: accounts.tunai.counted },
  bank: { counted: 3_274_500, recorded: accounts.bank.counted },
} as const;
