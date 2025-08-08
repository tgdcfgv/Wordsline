import { describe, it, expect } from 'vitest';
import { highlightWordInText } from './helpers.js';

describe('highlightWordInText', () => {
  it('highlights normal words', () => {
    const text = 'This is a simple test for simple word.';
    const result = highlightWordInText(text, 'simple');
    const expected = 'This is a <strong class="text-indigo-600 dark:text-indigo-400">simple</strong> test for <strong class="text-indigo-600 dark:text-indigo-400">simple</strong> word.';
    expect(result).toBe(expected);
  });

  it('handles words with regex characters', () => {
    const text = 'Special a+b and again a+b.';
    const result = highlightWordInText(text, 'a+b');
    const expected = 'Special <strong class="text-indigo-600 dark:text-indigo-400">a+b</strong> and again <strong class="text-indigo-600 dark:text-indigo-400">a+b</strong>.';
    expect(result).toBe(expected);
  });
});
