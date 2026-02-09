import { Box, Button, CopyButton, Paper, Stack, Text } from '@mantine/core';
import { downloadOutput } from '@/lib/utils';

export interface ChangeCalculatorOutputProps {
  lines: string[];
}

export function ChangeCalculatorOutput({ lines }: ChangeCalculatorOutputProps) {
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
          </Box>
        </Box>
        <Stack gap="xs">
          {lines.map((line, i) => (
            <Text key={i} size="sm" style={{ fontFamily: 'monospace' }}>
              {line || '\u00A0'}
            </Text>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
