import { useEffect, useState } from 'react';

/**
 * Check if component is mounted (useful for preventing hydration mismatches)
 * @returns boolean indicating if the component is mounted
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
