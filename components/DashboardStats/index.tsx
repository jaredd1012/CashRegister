'use client';

import { Card, Grid, Group, Loader, Text, ThemeIcon } from '@mantine/core';
import {
  IconCoins,
  IconCurrencyDollar,
  IconReceipt,
} from '@tabler/icons-react';
import { useTransactionsQuery } from '@/hooks/transactionsQueries';
import { computeStats } from '@/lib/transactionStats';
import { useEffect, useState } from 'react';

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    minimumFractionDigits: 2,
    style: 'currency',
  }).format(n);
}

export function DashboardStats() {
  const [mounted, setMounted] = useState(false);
  const { data: transactions = [], isLoading } = useTransactionsQuery(200);
  const stats = computeStats(transactions);

  useEffect(() => {
    setMounted(true);
  }, []);

  const STATS = [
    {
      color: 'blue' as const,
      icon: IconReceipt,
      label: 'Total transactions',
      suffix: 'processed',
      value: stats.transactionCount.toLocaleString(),
    },
    {
      color: 'green' as const,
      icon: IconCurrencyDollar,
      label: 'Total earnings',
      suffix: 'revenue (amount charged)',
      value: formatCurrency(stats.totalOwed),
    },
    {
      color: 'yellow' as const,
      icon: IconCoins,
      label: 'Change returned',
      suffix: 'given back to customers',
      value: formatCurrency(stats.changeGiven),
    },
  ];

  if (!mounted || isLoading) {
    return (
      <Grid>
        {[1, 2, 3].map((i) => (
          <Grid.Col key={i} span={{ base: 12, sm: 4 }}>
            <Card padding="lg" radius="md" shadow="sm" withBorder>
              <Group justify="center" py="xl">
                <Loader size="sm" />
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    );
  }

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
            </Card>
          </Grid.Col>
        );
      })}
    </Grid>
  );
}
