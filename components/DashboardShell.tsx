'use client';

import {
  ActionIcon,
  AppShell,
  Avatar,
  Burger,
  Group,
  Input,
  NavLink,
  Text,
  useMantineColorScheme,
} from '@mantine/core';
import {
  IconBell,
  IconCalculator,
  IconChartBar,
  IconDashboard,
  IconMail,
  IconReceipt,
  IconSearch,
  IconSun,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { href: '/', icon: IconDashboard, label: 'Dashboard' },
  { href: '/calculator', icon: IconCalculator, label: 'Calculator' },
  { href: '/transactions', icon: IconReceipt, label: 'Transactions' },
  { href: '/statistics', icon: IconChartBar, label: 'Statistics' },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [opened, setOpened] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
        width: 240,
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" justify="space-between" px="md">
          <Burger
            hiddenFrom="sm"
            onClick={() => setOpened((o) => !o)}
            opened={opened}
            size="sm"
          />
          <Input
            leftSection={<IconSearch size={16} />}
            placeholder="Search here.."
            style={{ flex: 1, maxWidth: 400 }}
            visibleFrom="sm"
          />
          <Group gap="xs">
            <ActionIcon size="lg" variant="subtle">
              <IconBell size={20} />
            </ActionIcon>
            <ActionIcon size="lg" variant="subtle">
              <IconMail size={20} />
            </ActionIcon>
            <ActionIcon
              onClick={() => toggleColorScheme()}
              size="lg"
              variant="subtle"
            >
              <IconSun size={20} />
            </ActionIcon>
            <Avatar color="yellow" radius="xl" size="sm" />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section>
          <Text
            fw={700}
            mb="md"
            size="xl"
            style={{ color: 'var(--mantine-color-yellow-5)' }}
          >
            Cash Register
          </Text>
        </AppShell.Section>
        <AppShell.Section grow>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <NavLink
                active={active}
                color="yellow"
                component={Link}
                href={item.href}
                key={item.href}
                label={item.label}
                leftSection={<Icon size={20} />}
                mb="xs"
              />
            );
          })}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
