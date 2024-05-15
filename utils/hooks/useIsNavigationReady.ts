import { useRootNavigationState } from 'expo-router';
import { useEffect, useState } from 'react';

export function useNavigationReady() {
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (navigationState?.key) {
      setIsNavigationReady(true);
    }
  }, [navigationState]);

  return isNavigationReady;
}
