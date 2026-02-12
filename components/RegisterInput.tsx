'use client';

import {
  ActionIcon,
  Box,
  Button,
  Group,
  SegmentedControl,
  Stack,
  Text,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useCallback, useRef, useState } from 'react';
import { RegisterDisplay } from './RegisterDisplay';
import { RegisterKeypad } from './RegisterKeypad';

export type TransactionPair = { owed: string; paid: string };

export interface RegisterInputProps {
  computedCount?: number;
  isPending: boolean;
  onSubmit: (inputText: string) => void;
  onTransactionsChange: (tx: TransactionPair[]) => void;
  transactions: TransactionPair[];
}

function formatAmount(s: string): string {
  const cleaned = s.replace(/[^\d.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) return formatAmount(parts[0] + '.' + parts.slice(1).join(''));
  if (parts[1]?.length > 2) return parts[0] + '.' + parts[1].slice(0, 2);
  return cleaned || '0';
}

function parseAmount(s: string): number {
  const n = parseFloat(s);
  return Number.isNaN(n) ? 0 : n;
}

export function RegisterInput({
  computedCount = 0,
  isPending,
  onSubmit,
  onTransactionsChange,
  transactions,
}: RegisterInputProps) {
  const inputRef = useRef<HTMLDivElement>(null);
  const [currentAmount, setCurrentAmount] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [owedAmount, setOwedAmount] = useState<string | null>(null);

  const hasTransactions = transactions.length > 0;
  const hasCurrentPair =
    !!owedAmount &&
    !!currentAmount &&
    parseAmount(owedAmount) > 0 &&
    parseAmount(currentAmount) >= 0;
  const canCompute = hasTransactions || hasCurrentPair;

  const isOwedMode = !owedAmount;
  const displayValue = currentAmount || (owedAmount ? '' : '0.00');
  const label = owedAmount ? 'Amount paid' : 'Amount owed';
  const stepHint = owedAmount
    ? `Owed $${parseFloat(owedAmount).toFixed(2)} set — enter paid amount or switch to edit owed`
    : 'Enter amount owed or switch to paid after setting owed';

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'backspace') {
      setCurrentAmount((prev) => prev.slice(0, -1));
      return;
    }
    setCurrentAmount((prev) => formatAmount(prev + key));
  }, []);

  const handleOwed = useCallback(() => {
    const amount = currentAmount || '0';
    if (parseAmount(amount) > 0) {
      setOwedAmount(amount);
      setCurrentAmount('');
    }
  }, [currentAmount]);

  const handleSwitchToOwed = useCallback(() => {
    if (owedAmount) {
      setCurrentAmount(owedAmount);
      setOwedAmount(null);
    }
    inputRef.current?.focus();
  }, [owedAmount]);

  const handleSwitchToPaid = useCallback(() => {
    if (!owedAmount && currentAmount && parseFloat(currentAmount) > 0) {
      setOwedAmount(currentAmount);
      setCurrentAmount('');
    }
    inputRef.current?.focus();
  }, [currentAmount, owedAmount]);

  const handlePaid = useCallback(() => {
    const paid = currentAmount || '0';
    const owed = owedAmount || '0';
    if (parseAmount(owed) > 0 || parseAmount(paid) > 0) {
      onTransactionsChange([...transactions, { owed, paid }]);
      setOwedAmount(null);
      setCurrentAmount('');
    }
  }, [currentAmount, owedAmount, onTransactionsChange, transactions]);

  const handleRemoveTransaction = useCallback(
    (index: number) => {
      onTransactionsChange(transactions.filter((_, i) => i !== index));
    },
    [onTransactionsChange, transactions]
  );

  const handleCompute = useCallback(() => {
    const currentPair =
      owedAmount && currentAmount && parseAmount(owedAmount) > 0
        ? [{ owed: owedAmount, paid: currentAmount }]
        : [];
    const allPairs = [...transactions, ...currentPair];
    if (allPairs.length === 0) return;
    const inputText = allPairs
      .map((t) => `${t.owed},${t.paid}`)
      .join('\n');
    onSubmit(inputText);
    if (currentPair.length > 0) {
      onTransactionsChange([...transactions, currentPair[0]]);
      setOwedAmount(null);
      setCurrentAmount('');
    }
  }, [
    currentAmount,
    onTransactionsChange,
    onSubmit,
    owedAmount,
    transactions,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (owedAmount) {
          handlePaid();
        } else if (currentAmount) {
          handleOwed();
        } else if (canCompute) {
          handleCompute();
        }
        return;
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        handleKeyPress('backspace');
        return;
      }
      if (/^[0-9.]$/.test(e.key)) {
        e.preventDefault();
        handleKeyPress(e.key);
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
      }
    },
    [
      canCompute,
      currentAmount,
      handleCompute,
      handleKeyPress,
      handleOwed,
      handlePaid,
      owedAmount,
    ]
  );

  return (
    <Stack gap="lg">
      {hasTransactions && (
        <Box
          style={{
            background: 'var(--mantine-color-dark-7)',
            border: '1px solid var(--mantine-color-dark-4)',
            borderRadius: 16,
            overflow: 'hidden',
            padding: '1rem',
          }}
        >
          <Text c="dimmed" mb="xs" size="xs" tt="uppercase">
            Transactions
          </Text>
          <Stack gap={6}>
            {transactions.map((tx, i) => {
              const isLocked = i < computedCount;
              return (
                <Group
                  key={i}
                  justify="space-between"
                  style={{
                    background: 'var(--mantine-color-dark-6)',
                    borderRadius: 8,
                    padding: '0.5rem 0.75rem',
                  }}
                >
                  <Text size="sm">
                    ${parseFloat(tx.owed || '0').toFixed(2)} → $
                    {parseFloat(tx.paid || '0').toFixed(2)}
                  </Text>
                  {!isLocked && (
                    <ActionIcon
                      color="red"
                      onClick={() => handleRemoveTransaction(i)}
                      size="sm"
                      variant="subtle"
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  )}
                </Group>
              );
            })}
          </Stack>
        </Box>
      )}

      <Box
        style={{
          background: 'var(--mantine-color-dark-7)',
          border: '1px solid var(--mantine-color-dark-4)',
          borderRadius: 16,
          padding: '1.5rem',
        }}
      >
        <Group align="center" justify="space-between" mb="sm">
          <SegmentedControl
            data={[
              {
                label: owedAmount
                  ? `Edit owed $${parseFloat(owedAmount).toFixed(2)}`
                  : 'Amount owed',
                value: 'owed',
              },
              { label: 'Amount paid', value: 'paid' },
            ]}
            onChange={(v) => (v === 'owed' ? handleSwitchToOwed() : handleSwitchToPaid())}
            radius="lg"
            value={isOwedMode ? 'owed' : 'paid'}
          />
          <Button
            disabled={!canCompute}
            loading={isPending}
            onClick={handleCompute}
            radius="lg"
            size="md"
            variant="filled"
          >
            Compute change
          </Button>
        </Group>
        <Box
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          onClick={() => inputRef.current?.focus()}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          tabIndex={0}
          style={{ cursor: 'text', outline: 'none' }}
        >
          <RegisterDisplay
            isActive={currentAmount.length > 0 || isFocused}
            label={label}
            value={displayValue}
          />
        </Box>
        <Text c="dimmed" mt="xs" size="xs">
          {stepHint}
        </Text>
        <Box mt="md">
          <RegisterKeypad onKeyPress={handleKeyPress} />
        </Box>
      </Box>

    </Stack>
  );
}
