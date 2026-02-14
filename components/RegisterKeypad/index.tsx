'use client';

import { UnstyledButton } from '@mantine/core';
import styles from './RegisterKeypad.module.css';

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
      className={`${styles.keyButton} ${isBackspace ? styles.keyButtonBackspace : ''}`}
      onClick={onPress}
    >
      {char}
    </UnstyledButton>
  );
}

export function RegisterKeypad({ onKeyPress }: RegisterKeypadProps) {
  return (
    <div className={styles.grid}>
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
