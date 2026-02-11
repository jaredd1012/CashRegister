'use client';

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { IconCheck, IconTrash } from '@tabler/icons-react';
import { useCallback, useState } from 'react';
import { RegisterDisplay } from './RegisterDisplay';
import { RegisterKeypad } from './RegisterKeypad';

export type TransactionPair = { owed: string; paid: string };

export interface RegisterInputProps {
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
  isPending,
  onSubmit,
  onTransactionsChange,
  transactions,
}: RegisterInputProps) {
  const hasTransactions = transactions.length > 0;
  const [currentAmount, setCurrentAmount] = useState('');
  const [owedAmount, setOwedAmount] = useState<string | null>(null);

  const displayValue = currentAmount || (owedAmount ? '' : '0.00');
  const label = owedAmount ? 'Amount paid' : 'Amount owed';
  const stepHint = owedAmount
    ? `Owed $${parseFloat(owedAmount).toFixed(2)} set — enter paid amount, press Enter`
    : 'Enter amount owed, press Enter or tap Amount owed';

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

  const handleClearOwed = useCallback(() => {
    if (owedAmount) {
      setCurrentAmount(owedAmount);
      setOwedAmount(null);
    }
  }, [owedAmount]);

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
    if (transactions.length === 0) return;
    const inputText = transactions
      .map((t) => `${t.owed},${t.paid}`)
      .join('\n');
    onSubmit(inputText);
  }, [onSubmit, transactions]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (owedAmount) {
          handlePaid();
        } else if (currentAmount) {
          handleOwed();
        } else if (hasTransactions) {
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
      currentAmount,
      handleCompute,
      handleKeyPress,
      handleOwed,
      handlePaid,
      hasTransactions,
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
            {transactions.map((tx, i) => (
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
                <ActionIcon
                  color="red"
                  onClick={() => handleRemoveTransaction(i)}
                  size="sm"
                  variant="subtle"
                >
                  <IconTrash size={14} />
                </ActionIcon>
              </Group>
            ))}
          </Stack>
        </Box>
      )}

      <Box
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{
          background: 'var(--mantine-color-dark-7)',
          border: '1px solid var(--mantine-color-dark-4)',
          borderRadius: 16,
          outline: 'none',
          padding: '1.5rem',
        }}
      >
        {owedAmount && (
          <Badge
            color="green"
            component="button"
            leftSection={<IconCheck size={12} />}
            mb="sm"
            onClick={handleClearOwed}
            size="sm"
            variant="light"
          >
            Owed ${parseFloat(owedAmount).toFixed(2)} • click to change
          </Badge>
        )}
        <RegisterDisplay label={label} value={displayValue} />
        <Text c="dimmed" mt="xs" size="xs">
          {stepHint}
        </Text>
        <Box mt="md">
          <RegisterKeypad onKeyPress={handleKeyPress} />
        </Box>
        <Group justify="space-between" mt="lg">
          <Group gap="sm">
            <Button
              disabled={!!owedAmount || !currentAmount}
              onClick={handleOwed}
              radius="lg"
              size="md"
              variant="light"
            >
              Amount owed
            </Button>
            <Button
              disabled={!owedAmount}
              onClick={handlePaid}
              radius="lg"
              size="md"
              variant="filled"
            >
              Amount paid
            </Button>
          </Group>
          <Button
            disabled={!hasTransactions}
            loading={isPending}
            onClick={handleCompute}
            radius="lg"
            size="md"
            variant="filled"
          >
            Compute change
          </Button>
        </Group>
      </Box>

    </Stack>
  );
}
