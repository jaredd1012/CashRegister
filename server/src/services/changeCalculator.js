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
 * Check if owed amount (in cents) triggers the "random change" rule.
 * Extensible: could add more rules (e.g. divisible by 5, or locale-specific).
 */
export function shouldUseRandomChange(owedCents) {
  return owedCents > 0 && owedCents % CHANGE_RULES.randomDivisor === 0;
}

/**
 * Counts to human-readable string: "1 dollar,2 quarters,1 nickel"
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
 * Random valid combination that sums to changeCents.
 * Randomly chooses count for each denomination (0 to max that fits).
 */
export function randomChange(changeCents, denominations = US_DENOMINATIONS) {
  const counts = new Array(denominations.length).fill(0);
  let remaining = changeCents;
  for (let i = 0; i < denominations.length; i++) {
    const { valueCents } = denominations[i];
    const maxCount = Math.floor(remaining / valueCents);
    const count = maxCount === 0 ? 0 : Math.floor(Math.random() * (maxCount + 1));
    counts[i] = count;
    remaining -= count * valueCents;
  }
  // If we under-allocated due to randomness, put remainder in pennies
  if (remaining > 0) {
    const pennyIndex = denominations.findIndex((d) => d.valueCents === 1);
    if (pennyIndex >= 0) counts[pennyIndex] = (counts[pennyIndex] ?? 0) + remaining;
  }
  return formatChange(counts, denominations);
}

/**
 * Compute change string for one line: owed and paid in cents.
 */
export function computeChangeForLine(owedCents, paidCents, denominations = US_DENOMINATIONS) {
  const changeCents = paidCents - owedCents;
  if (changeCents < 0) return 'Insufficient payment';
  if (changeCents === 0) return 'No change';
  if (shouldUseRandomChange(owedCents)) {
    return randomChange(changeCents, denominations);
  }
  return minimumChange(changeCents, denominations);
}

/**
 * Process multiple lines of "owed,paid" and return array of change strings.
 */
export function processInputLines(text) {
  const lines = String(text).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
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
    results.push(computeChangeForLine(owedCents, paidCents));
  }
  return results;
}
