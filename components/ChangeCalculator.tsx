'use client';

import { Box, Grid, Stack } from '@mantine/core';
import { useCallback, useState } from 'react';
import { useComputeChangeMutation } from '@/hooks/calculatorMutations';
import { ChangeCalculatorEmptyState } from './ChangeCalculatorEmptyState';
import { ChangeCalculatorError } from './ChangeCalculatorError';
import { ChangeCalculatorHeader } from './ChangeCalculatorHeader';
import { ChangeCalculatorInput } from './ChangeCalculatorInput';
import { ChangeCalculatorOutput } from './ChangeCalculatorOutput';

const SAMPLE_INPUT = `2.12,3.00

1.97,2.00

3.33,5.00`;

export function ChangeCalculator() {
  const [input, setInput] = useState(SAMPLE_INPUT);
  const mutation = useComputeChangeMutation();

  const handleSubmit = useCallback(() => {
    mutation.mutate(input.trim());
  }, [input, mutation]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setInput(String(reader.result ?? ''));
      reader.readAsText(file);
      e.target.value = '';
    },
    []
  );

  const outputLines = mutation.data?.lines ?? [];
  const hasOutput = outputLines.length > 0;

  return (
    <Grid gutter="lg">
      <Grid.Col span={{ base: 12, lg: 6 }}>
        <Stack gap="lg">
          <ChangeCalculatorHeader />
          <ChangeCalculatorInput
            isPending={mutation.isPending}
            onFileChange={handleFileChange}
            onChange={setInput}
            onSubmit={handleSubmit}
            value={input}
          />
          {mutation.isError && (
            <ChangeCalculatorError
              message={mutation.error?.message ?? 'Unknown error'}
            />
          )}
        </Stack>
      </Grid.Col>
      <Grid.Col span={{ base: 12, lg: 6 }}>
        {hasOutput ? (
          <ChangeCalculatorOutput lines={outputLines} />
        ) : (
          <ChangeCalculatorEmptyState />
        )}
      </Grid.Col>
    </Grid>
  );
}
