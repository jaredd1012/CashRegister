/**
 * US denomination definitions (value in cents, label singular, label plural).
 * Structured to support future locales (e.g. France) via different configs.
 */
export const US_DENOMINATIONS = [
  { valueCents: 100, labelSingular: 'dollar', labelPlural: 'dollars' },
  { valueCents: 25, labelSingular: 'quarter', labelPlural: 'quarters' },
  { valueCents: 10, labelSingular: 'dime', labelPlural: 'dimes' },
  { valueCents: 5, labelSingular: 'nickel', labelPlural: 'nickels' },
  { valueCents: 1, labelSingular: 'penny', labelPlural: 'pennies' },
];

/**
 * Rule config: when to use random change instead of minimum.
 * Client may change the divisor (e.g. 5 instead of 3).
 */
export const CHANGE_RULES = {
  /** When owed amount (in cents) is divisible by this, use random change. */
  randomDivisor: 3,
};
