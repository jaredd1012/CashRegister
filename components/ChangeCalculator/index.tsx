'use client';

import { Grid, SegmentedControl, Stack } from '@mantine/core';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { ChangeCalculatorEmptyState } from '@/components/ChangeCalculatorEmptyState';
import { ChangeCalculatorError } from '@/components/ChangeCalculatorError';
import { ChangeCalculatorHeader } from '@/components/ChangeCalculatorHeader';
import { ChangeCalculatorInput } from '@/components/ChangeCalculatorInput';
import { ChangeCalculatorOutput } from '@/components/ChangeCalculatorOutput';
import type { TransactionPair } from '@/components/RegisterInput';
import { useComputeChangeMutation } from '@/hooks/calculatorMutations';

const RegisterInput = dynamic(
  () => import('@/components/RegisterInput').then((m) => ({ default: m.RegisterInput })),
  { ssr: false }
);

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

function transactionsToText(tx: TransactionPair[]): string {
  return tx.map((t) => `${t.owed},${t.paid}`).join('\n');
}

type InputMode = 'keypad' | 'text';

const INSUFFICIENT_PAYMENT = 'Insufficient payment';

export function ChangeCalculator() {
  const [displayedInputLines, setDisplayedInputLines] = useState<string[]>([]);
  const [displayedOutputLines, setDisplayedOutputLines] = useState<string[]>([]);
  const [insufficientPaymentError, setInsufficientPaymentError] = useState(false);
  const [mode, setMode] = useState<InputMode>('text');
  const [randomDivisor, setRandomDivisor] = useState<number>(3);
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
      mutation.mutate({ inputText: toSend, randomDivisor }, {
        onSuccess: (data) => {
          const hasInsufficient = data.lines.some(
            (line) => line === INSUFFICIENT_PAYMENT
          );
          if (hasInsufficient) {
            setInsufficientPaymentError(true);
            return;
          }
          setDisplayedOutputLines((prevOutput) => {
            const merged: string[] = [];
            for (let i = 0; i < data.lines.length; i++) {
              const inputMatchesPrev = i < displayedInputLines.length && validLines[i] === displayedInputLines[i];
              if (inputMatchesPrev && i < prevOutput.length) {
                merged.push(prevOutput[i]);
              } else {
                merged.push(data.lines[i]);
              }
            }
            return merged;
          });
          setDisplayedInputLines(validLines);
        },
      });
    },
    [mutation, randomDivisor]
  );

  const handleAddLine = useCallback(() => {
    setTextInput((prev) => `${prev}\n`);
  }, []);

  const handleDeleteLine = useCallback((formIndex: number) => {
    const lines = textInput.split(/\r?\n/);
    setTextInput(lines.filter((_, i) => i !== formIndex).join('\n'));
  }, [textInput]);

  const handleClearOutput = useCallback(() => {
    mutation.reset();
    setDisplayedInputLines([]);
    setDisplayedOutputLines([]);
    setInsufficientPaymentError(false);
    setTextInput('');
    setTransactions([]);
  }, [mutation]);

  const handleKeypadTransactionsChange = useCallback((tx: TransactionPair[]) => {
    setTextInput(transactionsToText(tx));
    setTransactions(tx);
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

  const outputLines = displayedOutputLines;
  const inputLines = displayedInputLines;
  const hasOutput = outputLines.length > 0;

  return (
    <Grid gutter="lg">
      <Grid.Col span={{ base: 12, lg: 6 }}>
        <Stack gap="lg">
          <ChangeCalculatorHeader
            randomDivisor={randomDivisor}
            setRandomDivisor={setRandomDivisor}
          />
          <SegmentedControl
            data={[
              { label: 'Text', value: 'text' },
              { label: 'Keypad', value: 'keypad' },
            ]}
            onChange={(v) => handleModeChange(v)}
            radius="lg"
            size="md"
            value={mode}
          />
          {mode === 'keypad' ? (
            <RegisterInput
              computedCount={displayedInputLines.length}
              isPending={mutation.isPending}
              onTransactionsChange={handleKeypadTransactionsChange}
              onSubmit={handleSubmit}
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
        <Stack gap="lg">
          {hasOutput ? (
            <ChangeCalculatorOutput
              inputLines={inputLines}
              lines={outputLines}
              onClear={handleClearOutput}
            />
          ) : (
            <ChangeCalculatorEmptyState />
          )}
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
