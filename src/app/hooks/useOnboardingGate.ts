import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "hasOnboarded";

export function useOnboardingGate() {
  const [loading, setLoading] = useState(true);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(KEY);
        setShouldShowOnboarding(v !== "true");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const markDone = async () => {
    await AsyncStorage.setItem(KEY, "true");
    setShouldShowOnboarding(false);
  };

  return { loading, shouldShowOnboarding, markDone };
}
