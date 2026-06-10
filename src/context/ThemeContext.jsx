import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { DEFAULT_THEME, THEMES, THEME_KEY } from "../lib/constants";

const ThemeContext = createContext(null);

const VALID_IDS = THEMES.map((t) => t.id);

function normalize(id) {
  return VALID_IDS.includes(id) ? id : DEFAULT_THEME;
}

function applyTheme(id) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", id);
  }
}

function readLocalTheme() {
  try {
    return normalize(window.localStorage.getItem(THEME_KEY));
  } catch {
    return DEFAULT_THEME;
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readLocalTheme);

  // Apply immediately so first paint matches the stored choice.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // When Supabase is configured, the admin's saved choice is the source of truth.
  useEffect(() => {
    let active = true;
    if (!supabase) return;

    (async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "theme")
        .maybeSingle();

      if (active && !error && data?.value) {
        const next = normalize(data.value);
        setThemeState(next);
        try {
          window.localStorage.setItem(THEME_KEY, next);
        } catch {}
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const setTheme = useCallback(async (id) => {
    const next = normalize(id);
    setThemeState(next);
    applyTheme(next);

    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {}

    if (supabase) {
      await supabase
        .from("site_settings")
        .upsert({ key: "theme", value: next }, { onConflict: "key" });
    }

    return { error: null };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
