'use client';

import { Box, Text } from '@mantine/core';

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
      style={{
        background: isActive
          ? 'linear-gradient(180deg, #252a32 0%, #14171b 100%)'
          : 'linear-gradient(180deg, #1a1d23 0%, #0d0f12 100%)',
        border: `1px solid ${isActive ? 'var(--mantine-color-yellow-6)' : 'var(--mantine-color-dark-4)'}`,
        borderRadius: 12,
        boxShadow: isActive ? '0 0 0 2px rgba(234, 179, 8, 0.2)' : undefined,
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
        ${displayText}
        {isActive && (
          <span
            style={{
              borderRight: '2px solid var(--mantine-color-yellow-5)',
              marginLeft: 2,
            }}
          >
            {'\u00A0'}
          </span>
        )}
      </Text>
    </Box>
  );
}
