'use client';

import { useEffect, useState } from 'react';

/** 값이 delay(ms) 동안 안정된 뒤에만 갱신된다. 학과 검색이 타이핑마다 요청을 쏘지 않도록. */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
