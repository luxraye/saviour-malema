import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { defaultMoments, STORAGE_KEY } from "../lib/constants";
import { isUuid } from "../utils/isUuid";

export function useMoments({ fallbackToDefaults = false } = {}) {
  const [moments, setMoments] = useState(fallbackToDefaults ? defaultMoments : []);
  const [loading, setLoading] = useState(true);

  const fetchMoments = useCallback(async () => {
    if (!supabase) {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) setMoments(parsed);
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      } else if (fallbackToDefaults) {
        setMoments(defaultMoments);
      }
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("moments")
      .select("*")
      .order("date", { ascending: false });

    if (!error && data?.length > 0) {
      setMoments(data);
    } else if (!error && data?.length === 0) {
      setMoments(fallbackToDefaults ? defaultMoments : []);
    } else {
      setMoments(fallbackToDefaults ? defaultMoments : []);
    }
    setLoading(false);
  }, [fallbackToDefaults]);

  useEffect(() => { fetchMoments(); }, [fetchMoments]);

  useEffect(() => {
    if (!supabase) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(moments));
    }
  }, [moments]);

  async function saveMoment(moment) {
    if (!supabase) {
      setMoments((items) => {
        const idx = items.findIndex((i) => i.id === moment.id);
        if (idx >= 0) return items.map((i) => (i.id === moment.id ? moment : i));
        return [...items, moment];
      });
      return { error: null };
    }

    const { id, ...rest } = moment;

    if (isUuid(id)) {
      const { error } = await supabase.from("moments").update(rest).eq("id", id);
      if (!error) await fetchMoments();
      return { error };
    }

    // String ids come from local seed data — insert as a new Supabase row.
    const { error } = await supabase.from("moments").insert(rest);
    if (!error) await fetchMoments();
    return { error };
  }

  async function deleteMoment(id) {
    if (!supabase) {
      setMoments((items) => {
        const next = items.filter((i) => i.id !== id);
        return next.length > 0 ? next : defaultMoments;
      });
      return { error: null };
    }

    if (!isUuid(id)) {
      setMoments((items) => items.filter((i) => i.id !== id));
      return { error: null };
    }

    const { error } = await supabase.from("moments").delete().eq("id", id);
    if (!error) await fetchMoments();
    return { error };
  }

  return { moments, loading, saveMoment, deleteMoment, refetch: fetchMoments };
}
