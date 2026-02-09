'use client';

import { UnstyledButton } from '@mantine/core';

const KEYS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['.', '0', '⌫'],
];

export interface RegisterKeypadProps {
  onKeyPress: (key: string) => void;
}

function KeyButton({
  char,
  onPress,
}: {
  char: string;
  onPress: () => void;
}) {
  const isBackspace = char === '⌫';
  return (
    <UnstyledButton
      onClick={onPress}
      style={{
        alignItems: 'center',
        background: 'var(--mantine-color-dark-6)',
        border: '1px solid var(--mantine-color-dark-4)',
        borderRadius: 12,
        boxShadow: '0 2px 0 var(--mantine-color-dark-7)',
        display: 'flex',
        fontSize: isBackspace ? 20 : 22,
        fontWeight: 500,
        height: 52,
        justifyContent: 'center',
        transition: 'all 0.1s ease',
      }}
      styles={{
        root: {
          '&:active': {
            boxShadow: 'none',
            transform: 'translateY(2px)',
          },
          '&:hover': {
            background: 'var(--mantine-color-dark-5)',
          },
        },
      }}
    >
      {char}
    </UnstyledButton>
  );
}

export function RegisterKeypad({ onKeyPress }: RegisterKeypadProps) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 10,
        gridTemplateColumns: 'repeat(3, 1fr)',
      }}
    >
      {KEYS.flat().map((key) => (
        <KeyButton
          char={key}
          key={key}
          onPress={() => onKeyPress(key === '⌫' ? 'backspace' : key)}
        />
      ))}
    </div>
  );
}
