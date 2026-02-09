'use client';

import { useQuery } from '@tanstack/react-query';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type Transaction = {
  created_at: string;
  id: number;
  input_text: string;
  output_lines: string[];
};

async function fetchTransactions(): Promise<Transaction[]> {
  const res = await fetch(`${API_BASE}/api/transactions`);
  if (!res.ok) {
    throw new Error('Failed to fetch transactions');
  }
  return res.json() as Promise<Transaction[]>;
}

export const transactionsQueryKeys = {
  all: () => ['transactions'] as const,
};

export function useTransactionsQuery() {
  return useQuery({
    queryKey: transactionsQueryKeys.all(),
    queryFn: fetchTransactions,
  });
}
