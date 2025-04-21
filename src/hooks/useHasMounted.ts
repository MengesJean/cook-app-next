"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook to determine if the component has mounted on the client.
 * Useful for preventing hydration errors with client-only code.
 */
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}
