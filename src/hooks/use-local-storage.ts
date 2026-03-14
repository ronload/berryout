"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const cacheRef = useRef<{ raw: string | null; value: T } | null>(null);

  const subscribe = useCallback(
    (onChange: () => void) => {
      const handler = (e: StorageEvent) => {
        if (e.key === key) onChange();
      };
      window.addEventListener("storage", handler);
      return () => {
        window.removeEventListener("storage", handler);
      };
    },
    [key],
  );

  const getSnapshot = useCallback((): T => {
    const raw = window.localStorage.getItem(key);
    if (cacheRef.current?.raw === raw) {
      return cacheRef.current.value;
    }
    const value = raw !== null ? (JSON.parse(raw) as T) : initialValue;
    cacheRef.current = { raw, value };
    return value;
  }, [key, initialValue]);

  const getServerSnapshot = useCallback((): T => initialValue, [initialValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = getSnapshot();
      const resolved = next instanceof Function ? next(prev) : next;
      const raw = JSON.stringify(resolved);
      window.localStorage.setItem(key, raw);
      cacheRef.current = { raw, value: resolved };
      window.dispatchEvent(new StorageEvent("storage", { key }));
    },
    [key, getSnapshot],
  );

  return [value, setValue];
}
