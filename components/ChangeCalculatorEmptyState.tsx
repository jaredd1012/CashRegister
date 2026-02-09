'use client';

import { Box, Stack, Text } from '@mantine/core';
import { IconReceipt2 } from '@tabler/icons-react';

export function ChangeCalculatorEmptyState() {
  return (
    <Box
      style={{
        alignItems: 'center',
        background: 'var(--mantine-color-dark-6)',
        border: '2px dashed var(--mantine-color-dark-4)',
        borderRadius: 'var(--mantine-radius-md)',
        display: 'flex',
        justifyContent: 'center',
        minHeight: 320,
        padding: '2rem',
      }}
    >
      <Stack align="center" gap="lg" maw={260}>
        <Box
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-yellow-9) 0%, var(--mantine-color-yellow-7) 100%)',
            borderRadius: '50%',
            color: 'var(--mantine-color-dark-9)',
            padding: '1.5rem',
          }}
        >
          <IconReceipt2 size={56} stroke={1.5} />
        </Box>
        <Stack align="center" gap={4}>
          <Text fw={500} size="md" ta="center">
            Ready for your calculations
          </Text>
          <Text c="dimmed" size="sm" ta="center">
            Enter owed and paid amounts, then click Compute change. Results will
            appear here.
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
}
