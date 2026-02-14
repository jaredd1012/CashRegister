'use client';

import { Card, Grid, Group, RingProgress, Stack, Text } from '@mantine/core';
import styles from './DashboardOverview.module.css';

export function DashboardOverview() {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card padding="lg" radius="md" shadow="sm" withBorder>
          <Text fw={600} mb="md" size="sm">
            Most Usable (Visits)
          </Text>
          <Group align="flex-end" gap="xl" justify="space-between">
            <RingProgress
              label={null}
              sections={[
                { color: 'grape', value: 50 },
                { color: 'blue', value: 50 },
              ]}
              size={120}
              thickness={12}
            />
            <Stack gap={4}>
              <Group gap="xs">
                <div className={styles.legendDotGrape} />
                <Text size="sm">App Visits — 2530</Text>
              </Group>
              <Group gap="xs">
                <div className={styles.legendDotBlue} />
                <Text size="sm">Active Users — 2530</Text>
              </Group>
            </Stack>
          </Group>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card padding="lg" radius="md" shadow="sm" withBorder>
          <Text fw={600} mb="md" size="sm">
            Receiving Bookings
          </Text>
          <Stack gap="md">
            <Group justify="space-between">
              <Text size="sm">Active booking</Text>
              <Text size="sm">37205</Text>
            </Group>
            <Group gap="xs" grow>
              <div className={styles.barTrack}>
                <div
                  className={`${styles.barFill} ${styles.barFillGrape}`}
                  style={{ width: '65%' }}
                />
              </div>
              <Text size="xs">65%</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">Happy Customer</Text>
              <Text size="sm">37205</Text>
            </Group>
            <Group gap="xs" grow>
              <div className={styles.barTrack}>
                <div
                  className={`${styles.barFill} ${styles.barFillGreen}`}
                  style={{ width: '65%' }}
                />
              </div>
              <Text size="xs">65%</Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm">Cancelled</Text>
              <Text size="sm">37205</Text>
            </Group>
            <Group gap="xs" grow>
              <div className={styles.barTrack}>
                <div
                  className={`${styles.barFill} ${styles.barFillRed}`}
                  style={{ width: '65%' }}
                />
              </div>
              <Text size="xs">65%</Text>
            </Group>
          </Stack>
        </Card>
      </Grid.Col>
    </Grid>
  );
}
