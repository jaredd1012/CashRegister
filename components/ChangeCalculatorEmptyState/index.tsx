'use client';

import { Box, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconReceipt2 } from '@tabler/icons-react';
import styles from './ChangeCalculatorEmptyState.module.css';

export function ChangeCalculatorEmptyState() {
  return (
    <Box className={styles.root}>
      <Stack align="center" gap="lg" maw={260}>
        <ThemeIcon color="yellow" radius="xl" size={88} variant="light">
          <IconReceipt2 size={48} stroke={1.5} />
        </ThemeIcon>
        <Stack align="center" gap={4}>
          <Text fw={500} size="md" ta="center">
            Ready for your calculations
          </Text>
          <Text c="dimmed" size="sm" ta="center">
            Use the keypad or switch to Text to paste transactions.
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
}
