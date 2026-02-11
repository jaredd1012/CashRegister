import { Box, Text, Title } from '@mantine/core';

export function ChangeCalculatorHeader() {
  return (
    <Box>
      <Title mb="xs" order={1}>
        Creative Cash Draw Solutions
      </Title>
      <Text c="dimmed" size="sm">
        One line per transaction: owed,paid. Use Add line for more.
        Or switch to Keypad for tap/type entry.
      </Text>
    </Box>
  );
}
