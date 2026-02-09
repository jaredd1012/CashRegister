'use client';

import { Box, Text } from '@mantine/core';

export interface RegisterDisplayProps {
  value: string;
  label?: string;
}

export function RegisterDisplay({ label, value }: RegisterDisplayProps) {
  return (
    <Box
      style={{
        background: 'linear-gradient(180deg, #1a1d23 0%, #0d0f12 100%)',
        border: '1px solid var(--mantine-color-dark-4)',
        borderRadius: 12,
        padding: '1rem 1.25rem',
      }}
    >
      {label && (
        <Text c="dimmed" mb={4} size="xs" tt="uppercase">
          {label}
        </Text>
      )}
      <Text
        fw={500}
        size="xl"
        style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          letterSpacing: '0.05em',
          minHeight: '1.5em',
        }}
      >
        ${value || '0.00'}
      </Text>
    </Box>
  );
}
