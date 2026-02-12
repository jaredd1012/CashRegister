'use client';

import { Grid, SegmentedControl, Stack } from '@mantine/core';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { useComputeChangeMutation } from '@/hooks/calculatorMutations';
import type { TransactionPair } from './RegisterInput';
import { ChangeCalculatorEmptyState } from './ChangeCalculatorEmptyState';
import { ChangeCalculatorError } from './ChangeCalculatorError';
import { ChangeCalculatorHeader } from './ChangeCalculatorHeader';
import { ChangeCalculatorInput } from './ChangeCalculatorInput';
import { ChangeCalculatorOutput } from './ChangeCalculatorOutput';

const RegisterInput = dynamic(() => import('./RegisterInput').then((m) => ({ default: m.RegisterInput })), {
  ssr: false,
});

type InputMode = 'keypad' | 'text';

function transactionsToText(tx: TransactionPair[]): string {
  return tx.map((t) => `${t.owed},${t.paid}`).join('\n');
}

function textToTransactions(text: string): TransactionPair[] {
  return text
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [owed = '0', paid = '0'] = line.split(',').map((s) => s.trim());
      return { owed, paid };
    });
}

export function ChangeCalculator() {
  const [lastInput, setLastInput] = useState('');
  const [mode, setMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState('');
  const [transactions, setTransactions] = useState<TransactionPair[]>([]);
  const mutation = useComputeChangeMutation();

  const handleSubmit = useCallback(
    (inputText: string) => {
      const trimmed = inputText.trim();
      mutation.mutate(trimmed, {
        onSuccess: () => setLastInput(trimmed),
      });
    },
    [mutation]
  );

  const handleAddLine = useCallback(() => {
    setTextInput((prev) => `${prev}\n`);
  }, []);

  const handleModeChange = useCallback(
    (nextMode: string) => {
      if (nextMode === 'text' && transactions.length > 0) {
        setTextInput(transactionsToText(transactions));
      } else if (nextMode === 'keypad' && textInput.trim()) {
        const parsed = textToTransactions(textInput);
        if (parsed.length > 0) {
          setTransactions(parsed);
        }
      }
      setMode(nextMode as InputMode);
    },
    [textInput, transactions]
  );

  const outputLines = mutation.data?.lines ?? [];
  const inputLines = lastInput
    ? lastInput.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    : [];
  const hasOutput = outputLines.length > 0;

  useEffect(() => {
    if (mutation.isSuccess && hasOutput) {
      setTransactions([]);
    }
  }, [mutation.isSuccess, hasOutput]);

  return (
    <Grid gutter="lg">
      <Grid.Col span={{ base: 12, lg: 6 }}>
        <Stack gap="lg">
          <ChangeCalculatorHeader />
          <SegmentedControl
            data={[
              { label: 'Text', value: 'text' },
              { label: 'Keypad', value: 'keypad' },
            ]}
            onChange={(v) => handleModeChange(v)}
            radius="lg"
            value={mode}
          />
          {mode === 'keypad' ? (
            <RegisterInput
              isPending={mutation.isPending}
              onSubmit={handleSubmit}
              onTransactionsChange={setTransactions}
              transactions={transactions}
            />
          ) : (
            <ChangeCalculatorInput
              isPending={mutation.isPending}
              onAddLine={handleAddLine}
              onChange={setTextInput}
              onSubmit={() => handleSubmit(textInput)}
              value={textInput}
            />
          )}
          {mutation.isError && (
            <ChangeCalculatorError
              message={mutation.error?.message ?? 'Unknown error'}
            />
          )}
        </Stack>
      </Grid.Col>
      <Grid.Col span={{ base: 12, lg: 6 }}>
        {hasOutput ? (
          <ChangeCalculatorOutput
            inputLines={inputLines}
            lines={outputLines}
          />
        ) : (
          <ChangeCalculatorEmptyState />
        )}
      </Grid.Col>
    </Grid>
  );
}
