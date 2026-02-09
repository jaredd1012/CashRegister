'use client';

import {
  Badge,
  Card,
  CopyButton,
  Group,
  Loader,
  Stack,
  Text,
} from '@mantine/core';
import { IconReceipt } from '@tabler/icons-react';
import { useTransactionsQuery } from '@/hooks/transactionsQueries';
import { downloadOutput } from '@/lib/utils';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export default function TransactionsPage() {
  const { data: transactions, isLoading, error } = useTransactionsQuery();

  if (isLoading) {
    return (
      <Group justify="center" p="xl">
        <Loader size="md" />
      </Group>
    );
  }

  if (error) {
    return (
      <Text c="red" size="sm">
        Failed to load transactions. Make sure the server is running and
        DATABASE_URL is set.
      </Text>
    );
  }

  if (!transactions?.length) {
    return (
      <Text c="dimmed" size="sm">
        No transactions yet. Run a calculation on the Calculator or Dashboard to
        see history here.
      </Text>
    );
  }

  return (
    <Stack gap="md">
      <Text fw={600} size="lg">
        Transaction history
      </Text>
      {transactions.map((tx) => {
        const lines = Array.isArray(tx.output_lines)
          ? tx.output_lines
          : (tx.output_lines as unknown as string[]);
        return (
          <Card key={tx.id} padding="md" radius="md" shadow="sm" withBorder>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <IconReceipt size={18} />
                <Text size="sm">{formatDate(tx.created_at)}</Text>
              </Group>
              <Group gap="xs">
                <CopyButton value={lines.join('\n')}>
                  {({ copied, copy }) => (
                    <Badge
                      color={copied ? 'green' : 'gray'}
                      component="button"
                      onClick={copy}
                      size="sm"
                      variant="light"
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </Badge>
                  )}
                </CopyButton>
                <Badge
                  color="blue"
                  component="button"
                  onClick={() => downloadOutput(lines)}
                  size="sm"
                  variant="light"
                >
                  Download
                </Badge>
              </Group>
            </Group>
            <Stack gap="xs">
              <Text c="dimmed" size="xs">
                Input
              </Text>
              <Text size="sm" style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                {tx.input_text || '\u00A0'}
              </Text>
              <Text c="dimmed" mt="xs" size="xs">
                Output
              </Text>
              <Stack gap={2}>
                {lines.map((line, i) => (
                  <Text
                    key={i}
                    size="sm"
                    style={{ fontFamily: 'monospace' }}
                  >
                    {line || '\u00A0'}
                  </Text>
                ))}
              </Stack>
            </Stack>
          </Card>
        );
      })}
    </Stack>
  );
}
