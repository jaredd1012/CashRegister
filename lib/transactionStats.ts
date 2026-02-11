import type { Transaction } from '@/hooks/transactionsQueries';

function parseOwedPaidPairs(inputText: string): { owed: number; paid: number }[] {
  return inputText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [owedStr = '0', paidStr = '0'] = line.split(',').map((s) => s.trim());
      const owed = parseFloat(owedStr) || 0;
      const paid = parseFloat(paidStr) || 0;
      return { owed, paid };
    });
}

export type TransactionStats = {
  changeGiven: number;
  totalOwed: number;
  transactionCount: number;
};

export function computeStats(transactions: Transaction[]): TransactionStats {
  let transactionCount = 0;
  let totalOwed = 0;
  let changeGiven = 0;

  for (const tx of transactions) {
    const pairs = parseOwedPaidPairs(tx.input_text || '');
    for (const { owed, paid } of pairs) {
      transactionCount += 1;
      totalOwed += owed;
      changeGiven += paid - owed;
    }
  }

  return { changeGiven, totalOwed, transactionCount };
}
