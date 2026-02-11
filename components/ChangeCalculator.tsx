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

export function ChangeCalculator() {
  const [mode, setMode] = useState<InputMode>('text');
  const [transactions, setTransactions] = useState<TransactionPair[]>([]);
  const [textInput, setTextInput] = useState('');
  const mutation = useComputeChangeMutation();

  const handleSubmit = useCallback(
    (inputText: string) => mutation.mutate(inputText.trim()),
    [mutation]
  );

  const handleAddLine = useCallback(() => {
    setTextInput((prev) => (prev.trim() ? `${prev.trim()}\n0.00,0.00` : '0.00,0.00'));
  }, []);

  const outputLines = mutation.data?.lines ?? [];
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
            onChange={(v) => setMode(v as InputMode)}
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
          <ChangeCalculatorOutput lines={outputLines} />
        ) : (
          <ChangeCalculatorEmptyState />
        )}
      </Grid.Col>
    </Grid>
  );
}
