import { Alert } from '@mantine/core';

export interface ChangeCalculatorErrorProps {
  message: string;
}

export function ChangeCalculatorError({ message }: ChangeCalculatorErrorProps) {
  return (
    <Alert color="red" title="Error">
      {message}
    </Alert>
  );
}
