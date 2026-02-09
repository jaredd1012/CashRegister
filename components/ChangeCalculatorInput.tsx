import { Box, Button, Stack, Textarea } from '@mantine/core';

export interface ChangeCalculatorInputProps {
  isPending: boolean;
  onChange: (value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  value: string;
}

const SAMPLE_PLACEHOLDER = `2.12,3.00
1.97,2.00
3.33,5.00`;

export function ChangeCalculatorInput({
  isPending,
  onChange,
  onFileChange,
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
          label="One line per transaction: amount owed, amount paid"
          minRows={6}
          onChange={(e) => onChange(e.currentTarget.value)}
          placeholder={SAMPLE_PLACEHOLDER}
          value={value}
        />
        <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
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
            component="label"
            radius="lg"
            variant="light"
          >
            Upload file
            <input
              accept=".txt,text/plain"
              hidden
              onChange={onFileChange}
              type="file"
            />
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
