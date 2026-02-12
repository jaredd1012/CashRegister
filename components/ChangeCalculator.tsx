'use client';

import { Grid, SegmentedControl, Stack } from '@mantine/core';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
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

const INSUFFICIENT_PAYMENT = 'Insufficient payment';

export function ChangeCalculator() {
  const [displayedInputLines, setDisplayedInputLines] = useState<string[]>([]);
  const [displayedOutputLines, setDisplayedOutputLines] = useState<string[]>([]);
  const [insufficientPaymentError, setInsufficientPaymentError] = useState(false);
  const [mode, setMode] = useState<InputMode>('text');
  const [textInput, setTextInput] = useState('');
  const [transactions, setTransactions] = useState<TransactionPair[]>([]);
  const mutation = useComputeChangeMutation();

  const handleSubmit = useCallback(
    (inputText: string) => {
      setInsufficientPaymentError(false);
      const trimmed = inputText.trim();
      const allLines = trimmed
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const validLines = allLines.filter((line) => {
        const parts = line.split(',').map((p) => p.trim());
        if (parts.length < 2) return false;
        const owed = parseFloat(parts[0]);
        const paid = parseFloat(parts[1]);
        return !Number.isNaN(owed) && !Number.isNaN(paid) && owed >= 0 && paid >= 0;
      });
      const toSend = validLines.join('\n');
      if (!toSend) return;
      mutation.mutate(toSend, {
        onSuccess: (data) => {
          const hasInsufficient = data.lines.some(
            (line) => line === INSUFFICIENT_PAYMENT
          );
          if (hasInsufficient) {
            setInsufficientPaymentError(true);
            return;
          }
          setDisplayedOutputLines(data.lines);
          setDisplayedInputLines(validLines);
        },
      });
    },
    [mutation]
  );

  const handleAddLine = useCallback(() => {
    setTextInput((prev) => `${prev}\n`);
  }, []);

  const handleDeleteLine = useCallback((formIndex: number) => {
    const lines = textInput.split(/\r?\n/);
    setTextInput(lines.filter((_, i) => i !== formIndex).join('\n'));
  }, []);

  const handleClearOutput = useCallback(() => {
    mutation.reset();
    setDisplayedInputLines([]);
    setDisplayedOutputLines([]);
    setInsufficientPaymentError(false);
    setTextInput('');
    setTransactions([]);
  }, [mutation]);

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

  const outputLines = displayedOutputLines;
  const inputLines = displayedInputLines;
  const hasOutput = outputLines.length > 0;

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
              computedCount={displayedInputLines.length}
              isPending={mutation.isPending}
              onSubmit={handleSubmit}
              onTransactionsChange={setTransactions}
              transactions={transactions}
            />
          ) : (
            <ChangeCalculatorInput
              computedCount={displayedInputLines.length}
              isPending={mutation.isPending}
              onAddLine={handleAddLine}
              onChange={setTextInput}
              onDeleteLine={handleDeleteLine}
              onSubmit={() => handleSubmit(textInput)}
              outputLines={outputLines}
              value={textInput}
            />
          )}
          {(mutation.isError || insufficientPaymentError) && (
            <ChangeCalculatorError
              message={
                insufficientPaymentError
                  ? 'One or more transactions have insufficient payment (paid is less than owed). Fix amounts and try again.'
                  : mutation.error?.message ?? 'Unknown error'
              }
            />
          )}
        </Stack>
      </Grid.Col>
      <Grid.Col span={{ base: 12, lg: 6 }}>
        {hasOutput ? (
          <ChangeCalculatorOutput
            inputLines={inputLines}
            lines={outputLines}
            onClear={handleClearOutput}
          />
        ) : (
          <ChangeCalculatorEmptyState />
        )}
      </Grid.Col>
    </Grid>
  );
}
