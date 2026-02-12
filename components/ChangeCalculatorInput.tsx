import { Box, Button, Group, Stack, TextInput } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

export interface ChangeCalculatorInputProps {
  isPending: boolean;
  onAddLine: () => void;
  onChange: (value: string) => void;
  onSubmit: () => void;
  value: string;
}

const PLACEHOLDER = 'amount owed, amount paid';

export function ChangeCalculatorInput({
  isPending,
  onAddLine,
  onChange,
  onSubmit,
  value,
}: ChangeCalculatorInputProps) {
  const lines = value.split(/\r?\n/);
  const hasContent = lines.some((l) => l.trim().length > 0);

  const handleLineChange = (index: number, lineValue: string) => {
    const next = [...lines];
    next[index] = lineValue;
    onChange(next.join('\n'));
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
          {lines.map((line, i) => (
            <TextInput
              key={i}
              onChange={(e) => handleLineChange(i, e.currentTarget.value)}
              placeholder={PLACEHOLDER}
              value={line}
            />
          ))}
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
