import { Box, Flex, Select, Text, Title } from '@mantine/core';

const RANDOM_DIVISOR_OPTIONS = [
  { label: 'Off (always minimum)', value: '0' },
  { label: 'Divisible by 2 (even)', value: '2' },
  { label: 'Divisible by 3', value: '3' },
  { label: 'Divisible by 5', value: '5' },
  { label: 'Divisible by 7', value: '7' },
  { label: 'Divisible by 10', value: '10' },
] as const;

type ChangeCalculatorHeaderProps = {
  randomDivisor: number;
  setRandomDivisor: (v: number) => void;
};

export function ChangeCalculatorHeader({
  randomDivisor,
  setRandomDivisor,
}: ChangeCalculatorHeaderProps) {
  return (
    <Box>
      <Flex align="center" gap="md" justify="space-between" mb="xs" wrap="wrap">
        <Title order={1}>Creative Cash Draw Solutions</Title>
        <Select
          data={RANDOM_DIVISOR_OPTIONS}
          label="Divisor"
          size="xs"
          w={140}
          onChange={(v) => setRandomDivisor(parseInt(v ?? '3', 10))}
          value={String(randomDivisor)}
        />
      </Flex>
      <Text c="dimmed" size="sm">
        One line per transaction: owed,paid. Use Add line for more.
        Or switch to Keypad for tap/type entry.
      </Text>
    </Box>
  );
}
