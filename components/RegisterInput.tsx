'use client';

import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { IconTrash, IconUpload } from '@tabler/icons-react';
import { useCallback, useState } from 'react';
import { RegisterDisplay } from './RegisterDisplay';
import { RegisterKeypad } from './RegisterKeypad';

export type TransactionPair = { owed: string; paid: string };

export interface RegisterInputProps {
  isPending: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  onFileChange,
  onSubmit,
  onTransactionsChange,
  transactions,
}: RegisterInputProps) {
  const hasTransactions = transactions.length > 0;
  const [currentAmount, setCurrentAmount] = useState('');
  const [owedAmount, setOwedAmount] = useState<string | null>(null);

  const displayValue = currentAmount || (owedAmount ? '' : '0.00');
  const label = owedAmount ? 'Amount paid' : 'Amount owed';

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

  return (
    <Stack gap="lg">
      <Box
        style={{
          background: 'var(--mantine-color-dark-7)',
          border: '1px solid var(--mantine-color-dark-4)',
          borderRadius: 16,
          padding: '1.5rem',
        }}
      >
        <RegisterDisplay label={label} value={displayValue} />
        <Box mt="md">
          <RegisterKeypad onKeyPress={handleKeyPress} />
        </Box>
        <Group gap="sm" mt="lg">
          <Button
            onClick={handleOwed}
            radius="lg"
            size="md"
            variant="light"
          >
            Owed
          </Button>
          <Button
            disabled={!owedAmount && !currentAmount}
            onClick={handlePaid}
            radius="lg"
            size="md"
            variant="filled"
          >
            Paid
          </Button>
        </Group>
      </Box>

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
          <Group justify="space-between" mb="xs">
            <Text c="dimmed" size="xs" tt="uppercase">
              Transactions
            </Text>
            <Button
              component="label"
              leftSection={<IconUpload size={16} />}
              size="xs"
              variant="subtle"
            >
              Upload
              <input
                accept=".txt,text/plain"
                hidden
                onChange={onFileChange}
                type="file"
              />
            </Button>
          </Group>
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
          <Divider my="sm" />
          <Button
            fullWidth
            loading={isPending}
            onClick={handleCompute}
            radius="lg"
            size="lg"
            variant="filled"
          >
            Compute change
          </Button>
        </Box>
      )}

      {!hasTransactions && (
        <Group>
          <Button component="label" leftSection={<IconUpload size={16} />} variant="subtle">
            Upload file
            <input
              accept=".txt,text/plain"
              hidden
              onChange={onFileChange}
              type="file"
            />
          </Button>
        </Group>
      )}
    </Stack>
  );
}
