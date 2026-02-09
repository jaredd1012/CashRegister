import { Box, Button, Paper, Stack, Textarea } from '@mantine/core';

export interface ChangeCalculatorInputProps {
  isPending: boolean;
  onChange: (value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  value: string;
}

export function ChangeCalculatorInput({
  isPending,
  onChange,
  onFileChange,
  onSubmit,
  value,
}: ChangeCalculatorInputProps) {
  return (
    <Paper p="md" radius="md" shadow="sm" withBorder>
      <Stack gap="md">
        <Textarea
          autosize
          label="Input (one line per transaction: owed,paid)"
          minRows={6}
          onChange={(e) => onChange(e.currentTarget.value)}
          placeholder="2.12,3.00"
          value={value}
        />
        <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Button
            loading={isPending}
            onClick={onSubmit}
            variant="filled"
          >
            Compute change
          </Button>
          <Button component="label" variant="light">
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
    </Paper>
  );
}
