'use client';

import { Card, Grid, Group, Text, ThemeIcon } from '@mantine/core';
import { IconReceipt, IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

const STATS = [
  {
    color: 'blue',
    icon: IconReceipt,
    label: 'Transactions',
    suffix: 'this month',
    value: '$324.00',
  },
  {
    color: 'green',
    icon: IconTrendingUp,
    label: 'Total Profit',
    suffix: 'from last month',
    value: '$324.00',
  },
  {
    color: 'red',
    icon: IconTrendingDown,
    label: 'Total Expenses',
    suffix: 'from last month',
    value: '$324.00',
  },
];

export function DashboardStats() {
  return (
    <Grid>
      {STATS.map((stat) => {
        const Icon = stat.icon;
        return (
          <Grid.Col key={stat.label} span={{ base: 12, sm: 4 }}>
            <Card padding="lg" radius="md" shadow="sm" withBorder>
              <Group justify="space-between" mb="xs">
                <ThemeIcon color={stat.color} size="lg" variant="light">
                  <Icon size={20} />
                </ThemeIcon>
                <Text c="dimmed" size="xs">
                  {stat.suffix}
                </Text>
              </Group>
              <Text fw={700} size="xl">
                {stat.value}
              </Text>
              <Text c="dimmed" size="sm">
                {stat.label}
              </Text>
              <Text c={stat.color} mt="sm" size="sm">
                +40%
              </Text>
            </Card>
          </Grid.Col>
        );
      })}
    </Grid>
  );
}
