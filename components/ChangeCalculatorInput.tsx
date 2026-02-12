import { ActionIcon, Box, Button, Group, Stack, TextInput } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';

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

function isValidLine(owed: string, paid: string): boolean {
  const o = parseFloat(owed.trim());
  const p = parseFloat(paid.trim());
  return !Number.isNaN(o) && !Number.isNaN(p) && o >= 0 && p >= 0;
}

/** Allow only digits and at most one decimal with 2 places. */
function sanitizeNumeric(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('');
  if (parts[1]?.length > 2) return (parts[0] ?? '') + '.' + (parts[1] ?? '').slice(0, 2);
  return cleaned;
}

export interface ChangeCalculatorInputProps {
  computedCount?: number;
  isPending: boolean;
  onAddLine: () => void;
  onChange: (value: string) => void;
  onDeleteLine?: (index: number) => void;
  onSubmit: () => void;
  outputLines?: string[];
  value: string;
}

export function ChangeCalculatorInput({
  computedCount = 0,
  isPending,
  onAddLine,
  onChange,
  onDeleteLine,
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
    next[lineIndex] = [sanitizeNumeric(owed), paid];
    onChange(next.map(([o, p]) => formatLine(o, p)).join('\n'));
  };

  const handlePaidChange = (lineIndex: number, paid: string) => {
    const [owed] = parsed[lineIndex];
    const next = [...parsed];
    next[lineIndex] = [owed, sanitizeNumeric(paid)];
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
            const validBefore = parsed
              .slice(0, i)
              .filter(([o, p]) => isValidLine(o, p)).length;
            const isLocked =
              computedCount > 0 &&
              isValidLine(owed, paid) &&
              validBefore < computedCount;
            return (
              <Stack key={i} gap={4}>
                <Group gap="xs" wrap="nowrap">
                  <TextInput
                    inputMode="decimal"
                    onChange={
                      isLocked
                        ? undefined
                        : (e) => handleOwedChange(i, e.currentTarget.value)
                    }
                    placeholder={OWED_PLACEHOLDER}
                    readOnly={isLocked}
                    style={{ flex: 1 }}
                    value={owed}
                  />
                  <Box component="span" style={{ alignSelf: 'center' }}>
                    ,
                  </Box>
                  <TextInput
                    inputMode="decimal"
                    onChange={
                      isLocked
                        ? undefined
                        : (e) => handlePaidChange(i, e.currentTarget.value)
                    }
                    placeholder={PAID_PLACEHOLDER}
                    readOnly={isLocked}
                    style={{ flex: 1 }}
                    value={paid}
                  />
                  {onDeleteLine && !isLocked && i > 0 && (
                    <ActionIcon
                      color="red"
                      onClick={() => onDeleteLine(i)}
                      size="sm"
                      variant="subtle"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  )}
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
