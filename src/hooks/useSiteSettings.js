import { useCallback, useState } from "react";
import { defaultPledgeSettings, PLEDGE_SETTINGS_KEY } from "../lib/constants";

function loadSettings() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(PLEDGE_SETTINGS_KEY) || "null");
    return saved ? { ...defaultPledgeSettings, ...saved } : defaultPledgeSettings;
  } catch {
    return defaultPledgeSettings;
  }
}

export function useSiteSettings() {
  const [pledgeSettings, setPledgeSettings] = useState(loadSettings);

  const saveSettings = useCallback(
    (updates) => {
      const next = { ...pledgeSettings, ...updates };
      window.localStorage.setItem(PLEDGE_SETTINGS_KEY, JSON.stringify(next));
      setPledgeSettings(next);
      return { error: null };
    },
    [pledgeSettings],
  );

  function resetSettings() {
    window.localStorage.removeItem(PLEDGE_SETTINGS_KEY);
    setPledgeSettings(defaultPledgeSettings);
  }

  return { pledgeSettings, saveSettings, resetSettings };
}
