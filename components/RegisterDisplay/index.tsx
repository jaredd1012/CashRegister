'use client';

import { Box, Text } from '@mantine/core';
import styles from './RegisterDisplay.module.css';

export interface RegisterDisplayProps {
  isActive?: boolean;
  label?: string;
  value: string;
}

export function RegisterDisplay({
  isActive = false,
  label,
  value,
}: RegisterDisplayProps) {
  const displayText = value || '0.00';
  return (
    <Box
      className={`${styles.displayBox} ${isActive ? styles.displayBoxActive : ''}`}
    >
      {label && (
        <Text c="dimmed" mb={4} size="xs" tt="uppercase">
          {label}
        </Text>
      )}
      <Text className={styles.amount} fw={500} size="xl">
        ${displayText}
        {isActive && <span className={styles.cursor}>{'\u00A0'}</span>}
      </Text>
    </Box>
  );
}
