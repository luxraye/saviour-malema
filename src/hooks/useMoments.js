import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { defaultMoments, STORAGE_KEY } from "../lib/constants";

export function useMoments() {
  const [moments, setMoments] = useState(defaultMoments);
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
    }
    setLoading(false);
  }, []);

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
    const existing = moments.find((m) => m.id === id);

    if (existing) {
      const { error } = await supabase.from("moments").update(rest).eq("id", id);
      if (!error) await fetchMoments();
      return { error };
    } else {
      const { error } = await supabase.from("moments").insert(rest);
      if (!error) await fetchMoments();
      return { error };
    }
  }

  async function deleteMoment(id) {
    if (!supabase) {
      setMoments((items) => {
        const next = items.filter((i) => i.id !== id);
        return next.length > 0 ? next : defaultMoments;
      });
      return { error: null };
    }

    const { error } = await supabase.from("moments").delete().eq("id", id);
    if (!error) await fetchMoments();
    return { error };
  }

  return { moments, loading, saveMoment, deleteMoment, refetch: fetchMoments };
}
