'use client';

import { Grid, SegmentedControl, Stack } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { useComputeChangeMutation } from '@/hooks/calculatorMutations';
import type { TransactionPair } from './RegisterInput';
import { ChangeCalculatorEmptyState } from './ChangeCalculatorEmptyState';
import { ChangeCalculatorError } from './ChangeCalculatorError';
import { ChangeCalculatorHeader } from './ChangeCalculatorHeader';
import { ChangeCalculatorInput } from './ChangeCalculatorInput';
import { ChangeCalculatorOutput } from './ChangeCalculatorOutput';
import { RegisterInput } from './RegisterInput';

const SAMPLE_INPUT = `2.12,3.00

1.97,2.00

3.33,5.00`;

type InputMode = 'keypad' | 'text';

export function ChangeCalculator() {
  const [mode, setMode] = useState<InputMode>('keypad');
  const [transactions, setTransactions] = useState<TransactionPair[]>([]);
  const [textInput, setTextInput] = useState(SAMPLE_INPUT);
  const mutation = useComputeChangeMutation();

  const handleSubmit = useCallback(
    (inputText: string) => mutation.mutate(inputText.trim()),
    [mutation]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result ?? '');
        if (mode === 'keypad') {
          const pairs: TransactionPair[] = text
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
              const [owed = '0', paid = '0'] = line.split(',').map((s) => s.trim());
              return { owed, paid };
            });
          setTransactions(pairs);
        } else {
          setTextInput(text);
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [mode]
  );

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
              { label: 'Keypad', value: 'keypad' },
              { label: 'Text / File', value: 'text' },
            ]}
            onChange={(v) => setMode(v as InputMode)}
            radius="lg"
            value={mode}
          />
          {mode === 'keypad' ? (
            <RegisterInput
              isPending={mutation.isPending}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
              onTransactionsChange={setTransactions}
              transactions={transactions}
            />
          ) : (
            <ChangeCalculatorInput
              isPending={mutation.isPending}
              onChange={setTextInput}
              onFileChange={handleFileChange}
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
