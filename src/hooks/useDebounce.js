/**
 * Custom React hook that debounces a value by a specified delay.
 *
 * Useful for delaying actions such as API calls or filtering until
 * the user has stopped typing or interacting for a certain period.
 *
 * @param {*} value - The value to debounce.
 * @param {number} [delay=500] - The debounce delay in milliseconds.
 * @returns {*} The debounced value.
 *
 * @example
 * // Example 1: Debouncing an input value
 * const [input, setInput] = useState('');
 * const debouncedInput = useDebounce(input, 300);
 * 
 * <input value={input} onChange={e => setInput(e.target.value)} />
 * // Use debouncedInput for filtering or validation
 *
 * @example
 * // Example 2: Debouncing an API call
 * const [query, setQuery] = useState('');
 * const debouncedQuery = useDebounce(query, 500);
 * 
 * useEffect(() => {
 *   if (debouncedQuery) {
 *     fetchData(debouncedQuery); // Call API only after debounce
 *   }
 * }, [debouncedQuery]);
 */


import { useState, useEffect } from 'react';

export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}
