'use client';

import { ChangeCalculator } from '@/components/ChangeCalculator';
import { DashboardStats } from '@/components/DashboardStats';
import { Stack } from '@mantine/core';

export default function Home() {
  return (
    <Stack gap="lg">
      <DashboardStats />
      <ChangeCalculator />
    </Stack>
  );
}
