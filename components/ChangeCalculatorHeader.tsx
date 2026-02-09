import { Box, Text, Title } from '@mantine/core';

export function ChangeCalculatorHeader() {
  return (
    <Box>
      <Title mb="xs" order={1}>
        Creative Cash Draw Solutions
      </Title>
      <Text c="dimmed" size="sm">
        Enter or upload lines of &quot;amount owed, amount paid&quot; (e.g.
        2.12,3.00). When the amount owed is divisible by 3, change is returned
        in random denominations.
      </Text>
    </Box>
  );
}
