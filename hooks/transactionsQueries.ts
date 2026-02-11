'use client';

import { useQuery } from '@tanstack/react-query';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export type Transaction = {
  created_at: string;
  id: number;
  input_text: string;
  output_lines: string[];
};

async function fetchTransactions(limit?: number): Promise<Transaction[]> {
  const url = limit
    ? `${API_BASE}/api/transactions?limit=${limit}`
    : `${API_BASE}/api/transactions`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch transactions');
  }
  return res.json() as Promise<Transaction[]>;
}

export const transactionsQueryKeys = {
  all: () => ['transactions'] as const,
  list: (limit?: number) => ['transactions', limit] as const,
};

export function useTransactionsQuery(limit?: number) {
  return useQuery({
    queryKey: transactionsQueryKeys.list(limit),
    queryFn: () => fetchTransactions(limit),
  });
}
