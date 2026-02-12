import {
  Box,
  Button,
  CopyButton,
  Group,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import { IconCoin, IconCurrencyDollar, IconTrash } from '@tabler/icons-react';
import { downloadOutput } from '@/lib/utils';

export interface ChangeCalculatorOutputProps {
  inputLines?: string[];
  lines: string[];
  onClear?: () => void;
}

type DenomPart = { count: number; unit: string };

/** Format raw "owed,paid" input for display: "Owed $4.00, Paid $25.00" */
function formatInputLabel(raw: string): string {
  const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);
  const owed = parts[0] ?? '0';
  const paid = parts[1] ?? '0';
  const owedNum = parseFloat(owed);
  const paidNum = parseFloat(paid);
  const owedStr = Number.isNaN(owedNum) ? owed : owedNum.toFixed(2);
  const paidStr = Number.isNaN(paidNum) ? paid : paidNum.toFixed(2);
  return `Owed $${owedStr}, Paid $${paidStr}`;
}

function parseChangeLine(line: string): DenomPart[] | null {
  if (!line.trim()) return null;
  const parts: DenomPart[] = [];
  const segments = line.split(',').map((s) => s.trim()).filter(Boolean);
  for (const seg of segments) {
    const match = seg.match(/^(\d+)\s+(.+)$/);
    if (match) {
      parts.push({ count: parseInt(match[1], 10), unit: match[2] });
    }
  }
  return parts.length ? parts : null;
}

function isDollar(unit: string): boolean {
  return unit === 'dollar' || unit === 'dollars';
}

function DenomChip({ count, unit }: DenomPart) {
  const isBill = isDollar(unit);
  const Icon = isBill ? IconCurrencyDollar : IconCoin;
  const color = isBill
    ? 'var(--mantine-color-green-5)'
    : unit === 'penny' || unit === 'pennies'
      ? 'var(--mantine-color-orange-6)'
      : 'var(--mantine-color-gray-4)';
  return (
    <Group
      gap={6}
      style={{
        background: 'var(--mantine-color-dark-6)',
        borderRadius: 8,
        padding: '0.35rem 0.6rem',
      }}
    >
      <Icon color={color} size={18} stroke={1.5} />
      <Text size="sm">
        <Text span fw={600}>
          {count}
        </Text>{' '}
        {unit}
      </Text>
    </Group>
  );
}

function ChangeLine({
  inputLabel,
  line,
}: {
  inputLabel?: string;
  line: string;
}) {
  const parts = parseChangeLine(line);
  if (!parts) {
    return (
      <Stack gap={4}>
        {inputLabel && (
          <Text c="dimmed" size="xs">
            {inputLabel}
          </Text>
        )}
        <Text c="dimmed" size="sm">
          {line || '\u00A0'}
        </Text>
      </Stack>
    );
  }
  return (
    <Stack gap={4}>
      {inputLabel && (
        <Text c="dimmed" size="xs">
          {inputLabel}
        </Text>
      )}
      <Group gap="xs" wrap="wrap">
        {parts.map((p, i) => (
          <DenomChip count={p.count} key={i} unit={p.unit} />
        ))}
      </Group>
    </Stack>
  );
}

export function ChangeCalculatorOutput({
  inputLines = [],
  lines,
  onClear,
}: ChangeCalculatorOutputProps) {
  return (
    <Paper p="md" radius="md" shadow="sm" withBorder>
      <Stack gap="md">
        <Box
          style={{
            alignItems: 'center',
            display: 'flex',
            gap: '0.5rem',
            justifyContent: 'space-between',
          }}
        >
          <Text fw={600} size="sm">
            Output (change to return)
          </Text>
          <Box style={{ display: 'flex', gap: '0.5rem' }}>
            <CopyButton value={lines.join('\n')}>
              {({ copied, copy }) => (
                <Button onClick={copy} size="xs" variant="subtle">
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              )}
            </CopyButton>
            <Button
              onClick={() => downloadOutput(lines)}
              size="xs"
              variant="subtle"
            >
              Download .txt
            </Button>
            {onClear && (
              <Button
                leftSection={<IconTrash size={14} />}
                onClick={onClear}
                size="xs"
                variant="subtle"
              >
                Clear
              </Button>
            )}
          </Box>
        </Box>
        <Stack gap="md">
          {lines.map((line, i) => (
            <ChangeLine
              inputLabel={
                inputLines[i]
                  ? `Transaction ${i + 1}: ${formatInputLabel(inputLines[i])}`
                  : undefined
              }
              key={i}
              line={line}
            />
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
