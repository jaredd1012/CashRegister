import { CHANGE_RULES, US_DENOMINATIONS } from '../config/denominations.js';

/**
 * Parse a dollar string to integer cents (avoids float math).
 * @param {string} amount - e.g. "2.12" or "3.00"
 * @returns {number} cents
 */
export function parseToCents(amount) {
  const trimmed = String(amount).trim();
  if (!trimmed) return NaN;
  const num = parseFloat(trimmed);
  if (Number.isNaN(num) || num < 0) return NaN;
  return Math.round(num * 100);
}

/**
 * Check if owed and paid amounts (in cents) trigger the "random change" rule.
 * Both must be whole-dollar amounts, and both dollar amounts must be divisible by the divisor.
 * @param {number} owedCents
 * @param {number} paidCents
 * @param {number} divisor - use random when owed and paid are whole dollars and both dollars % divisor === 0; 0 = never
 */
function shouldUseRandomChange(owedCents, paidCents, divisor) {
  const d = divisor ?? CHANGE_RULES.randomDivisor;
  if (d <= 0 || owedCents <= 0) return false;
  const owedWholeDollars = owedCents / 100;
  const paidWholeDollars = paidCents / 100;
  const owedNoCents = owedCents % 100 === 0;
  const paidNoCents = paidCents % 100 === 0;
  return (
    owedNoCents &&
    paidNoCents &&
    owedWholeDollars % d === 0 &&
    paidWholeDollars % d === 0
  );
}

/**
 * Counts to human-readable string: "1 dollar,2 quarters,1 nickel"
 * @param {number[]} counts - count per denomination (same order as denominations)
 * @param {Array<{ labelPlural: string, labelSingular: string }>} [denominations]
 * @returns {string}
 */
function formatChange(counts, denominations = US_DENOMINATIONS) {
  const parts = [];
  for (let i = 0; i < denominations.length; i++) {
    const count = counts[i] ?? 0;
    if (count <= 0) continue;
    const { labelSingular, labelPlural } = denominations[i];
    const label = count === 1 ? labelSingular : labelPlural;
    parts.push(`${count} ${label}`);
  }
  return parts.length ? parts.join(',') : 'No change';
}

/**
 * Minimum number of coins/bills (greedy): use largest denominations first.
 * Requires denominations ordered by valueCents descending.
 * @param {number} changeCents
 * @param {Array<{ valueCents: number, labelSingular: string, labelPlural: string }>} [denominations]
 * @returns {string}
 */
export function minimumChange(changeCents, denominations = US_DENOMINATIONS) {
  const counts = new Array(denominations.length).fill(0);
  let remaining = changeCents;
  for (let i = 0; i < denominations.length; i++) {
    const { valueCents } = denominations[i];
    counts[i] = Math.floor(remaining / valueCents);
    remaining -= counts[i] * valueCents;
  }
  return formatChange(counts, denominations);
}

/**
 * Seeded PRNG (mulberry32) - same seed always yields same sequence.
 * Ensures identical inputs produce identical "random" change.
 */
function createSeededRandom(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Random valid combination that sums to changeCents.
 * Uses deterministic seed from owed/paid so same input → same output.
 * Pennies are only used for the remainder that cannot be made with nickels
 * (at most 4 pennies), avoiding impractical outputs like 290 pennies.
 * Requires denominations ordered by valueCents descending.
 * @param {number} changeCents
 * @param {Array<{ valueCents: number, labelSingular: string, labelPlural: string }>} [denominations]
 * @param {number|null} [seed]
 * @returns {string}
 */
export function randomChange(changeCents, denominations = US_DENOMINATIONS, seed = null) {
  const rand = seed != null ? createSeededRandom(seed) : Math.random;
  const pennyRemainder = changeCents % 5; // 0–4 cents must be pennies
  const pennyIndex = pennyRemainder > 0 ? denominations.findIndex((d) => d.valueCents === 1) : -1;
  const remainderForLarger = changeCents - pennyRemainder; // divisible by 5
  const counts = new Array(denominations.length).fill(0);
  let remaining = remainderForLarger;
  // Randomly allocate among dollars, quarters, dimes; nickels get remainder.
  // Bias toward using more of larger denominations (40–100% of max) to avoid
  // impractical results like 59 nickels for $5.
  for (let i = 0; i < denominations.length; i++) {
    if (i === pennyIndex) continue;
    const { valueCents } = denominations[i];
    const isNickels = valueCents === 5;
    const maxCount = Math.floor(remaining / valueCents);
    const count = isNickels
      ? maxCount // nickels get the remainder to ensure full allocation
      : maxCount === 0
        ? 0
        : Math.floor(maxCount * (0.4 + 0.6 * rand()));
    counts[i] = count;
    remaining -= count * valueCents;
  }
  if (pennyIndex >= 0 && pennyRemainder > 0) {
    counts[pennyIndex] = pennyRemainder;
  }
  return formatChange(counts, denominations);
}

/**
 * Compute change string for one line: owed and paid in cents.
 * Uses deterministic seed (owed,paid) for random change so re-computing
 * preserves results for unchanged lines.
 * @param {number} owedCents
 * @param {number} paidCents
 * @param {Array<{ valueCents: number, labelSingular: string, labelPlural: string }>} [denominations]
 * @param {number|null} [randomDivisor] - when owed and paid (whole dollars) both % divisor === 0, use random; 0 = never
 * @returns {string}
 */
export function computeChangeForLine(owedCents, paidCents, denominations = US_DENOMINATIONS, randomDivisor = null) {
  const changeCents = paidCents - owedCents;
  if (changeCents < 0) return 'Insufficient payment';
  if (changeCents === 0) return 'No change';
  // Use minimum for small change (< $1) even when divisor triggers random
  if (changeCents >= 100 && shouldUseRandomChange(owedCents, paidCents, randomDivisor)) {
    const seed = owedCents * 1000000 + paidCents;
    return randomChange(changeCents, denominations, seed);
  }
  return minimumChange(changeCents, denominations);
}

/**
 * Process multiple lines of "owed,paid" and return array of change strings.
 * @param {string} text - newline-separated lines, each "owed,paid" (e.g. "2.00,5.00")
 * @param {number|null} [randomDivisor] - when owed (whole dollars) % divisor === 0, use random change; 0 = never
 * @returns {string[]} one change string per valid line
 */
export function processInputLines(text, randomDivisor = null) {
  const lines = String(text)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const results = [];
  for (const line of lines) {
    const parts = line.split(',').map((p) => p.trim());
    if (parts.length < 2) {
      results.push('Invalid line');
      continue;
    }
    const owedCents = parseToCents(parts[0]);
    const paidCents = parseToCents(parts[1]);
    if (Number.isNaN(owedCents) || Number.isNaN(paidCents)) {
      results.push('Invalid amounts');
      continue;
    }
    results.push(computeChangeForLine(owedCents, paidCents, US_DENOMINATIONS, randomDivisor));
  }
  return results;
}
