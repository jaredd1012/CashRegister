import { Box, Button, Group, Stack, Textarea } from '@mantine/core';
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
        <Textarea
          autosize
          label="One line per transaction"
          minRows={1}
          onChange={(e) => onChange(e.currentTarget.value)}
          placeholder={PLACEHOLDER}
          value={value}
        />
        <Group gap="sm">
          <Button
            disabled={!value.trim()}
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
