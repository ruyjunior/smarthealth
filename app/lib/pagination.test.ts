import { describe, expect, it } from 'vitest';
import { ITEMS_PER_PAGE, PAYMENTS_ITEMS_PER_PAGE } from './pagination';

describe('page sizes', () => {
  it('keeps the shared default and the payments exception apart', () => {
    expect(ITEMS_PER_PAGE).toBe(6);
    expect(PAYMENTS_ITEMS_PER_PAGE).toBe(10);
  });

  it('exposes positive integers so LIMIT/OFFSET cannot receive garbage', () => {
    for (const size of [ITEMS_PER_PAGE, PAYMENTS_ITEMS_PER_PAGE]) {
      expect(Number.isInteger(size)).toBe(true);
      expect(size).toBeGreaterThan(0);
    }
  });
});
