import { Box, Text, Title } from '@mantine/core';

export function ChangeCalculatorHeader() {
  return (
    <Box>
      <Title mb="xs" order={1}>
        Creative Cash Draw Solutions
      </Title>
      <Text c="dimmed" size="sm">
        Use the keypad or paste/upload a file (one line per transaction: owed,paid).
        When owed is divisible by 3, change uses random denominations.
      </Text>
    </Box>
  );
}
