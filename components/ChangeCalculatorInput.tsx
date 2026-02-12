import { Box, Button, Group, Stack, TextInput } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

const ERROR_RESULTS = ['Invalid line', 'Invalid amounts', 'Insufficient payment'];
const OWED_PLACEHOLDER = 'amount owed';
const PAID_PLACEHOLDER = 'amount paid';

function parseLine(line: string): [string, string] {
  const parts = line.split(',').map((p) => p.trim());
  return [parts[0] ?? '', parts[1] ?? ''];
}

function formatLine(owed: string, paid: string): string {
  return `${owed},${paid}`;
}

function isErrorResult(result: string): boolean {
  return ERROR_RESULTS.includes(result);
}

export interface ChangeCalculatorInputProps {
  isPending: boolean;
  onAddLine: () => void;
  onChange: (value: string) => void;
  onSubmit: () => void;
  outputLines?: string[];
  value: string;
}

export function ChangeCalculatorInput({
  isPending,
  onAddLine,
  onChange,
  onSubmit,
  outputLines = [],
  value,
}: ChangeCalculatorInputProps) {
  const lines = value.split(/\r?\n/);
  const parsed = lines.map(parseLine);
  const hasContent = parsed.some(([owed, paid]) => owed.trim() || paid.trim());

  const getLineError = (formIndex: number): string | undefined => {
    const submittedIndex = parsed
      .slice(0, formIndex)
      .filter(([o, p]) => o.trim() || p.trim()).length;
    const hasLineContent = parsed[formIndex][0].trim() || parsed[formIndex][1].trim();
    if (!hasLineContent || submittedIndex >= outputLines.length) return undefined;
    const result = outputLines[submittedIndex];
    return isErrorResult(result) ? result : undefined;
  };

  const handleOwedChange = (lineIndex: number, owed: string) => {
    const [_, paid] = parsed[lineIndex];
    const next = [...parsed];
    next[lineIndex] = [owed, paid];
    onChange(next.map(([o, p]) => formatLine(o, p)).join('\n'));
  };

  const handlePaidChange = (lineIndex: number, paid: string) => {
    const [owed] = parsed[lineIndex];
    const next = [...parsed];
    next[lineIndex] = [owed, paid];
    onChange(next.map(([o, p]) => formatLine(o, p)).join('\n'));
  };

  return (
    <Box
      style={{
        background: 'var(--mantine-color-dark-7)',
        border: '1px solid var(--mantine-color-dark-4)',
        borderRadius: 16,
        padding: '1.5rem',
      }}
    >
      <Stack gap="md">
        <Stack gap="xs">
          <Box component="label" size="sm" style={{ fontWeight: 500 }}>
            One line per transaction
          </Box>
          {parsed.map(([owed, paid], i) => {
            const error = getLineError(i);
            return (
              <Stack key={i} gap={4}>
                <Group gap="xs" wrap="nowrap">
                  <TextInput
                    onChange={(e) => handleOwedChange(i, e.currentTarget.value)}
                    placeholder={OWED_PLACEHOLDER}
                    style={{ flex: 1 }}
                    value={owed}
                  />
                  <Box component="span" style={{ alignSelf: 'center' }}>
                    ,
                  </Box>
                  <TextInput
                    onChange={(e) => handlePaidChange(i, e.currentTarget.value)}
                    placeholder={PAID_PLACEHOLDER}
                    style={{ flex: 1 }}
                    value={paid}
                  />
                </Group>
                {error && (
                  <Box
                    component="span"
                    style={{ color: 'var(--mantine-color-red-6)', fontSize: '0.75rem' }}
                  >
                    {error}
                  </Box>
                )}
              </Stack>
            );
          })}
        </Stack>
        <Group gap="sm">
          <Button
            disabled={!hasContent}
            loading={isPending}
            onClick={onSubmit}
            radius="lg"
            variant="filled"
          >
            Compute change
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={onAddLine}
            radius="lg"
            variant="light"
          >
            Add line
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
