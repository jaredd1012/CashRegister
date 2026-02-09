'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsQueryKeys } from './transactionsQueries';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type ChangeResponse = { lines: string[] };

async function computeChange(inputText: string): Promise<ChangeResponse> {
  const res = await fetch(`${API_BASE}/api/change`, {
    body: inputText,
    headers: { 'Content-Type': 'text/plain' },
    method: 'POST',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? 'Failed to compute change');
  }
  return res.json() as Promise<ChangeResponse>;
}

export function useComputeChangeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: computeChange,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionsQueryKeys.all() });
    },
  });
}
