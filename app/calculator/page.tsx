'use client';

import { ChangeCalculator } from '@/components/ChangeCalculator';
import { Box } from '@mantine/core';

export default function CalculatorPage() {
  return (
    <Box maw={720} mx="auto">
      <ChangeCalculator />
    </Box>
  );
}
