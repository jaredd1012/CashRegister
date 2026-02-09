/**
 * Query keys and query hooks for calculator data.
 * Use these keys for cache invalidation or when adding new calculator queries.
 */
export const calculatorQueryKeys = {
  all: () => ['calculator'] as const,
};
