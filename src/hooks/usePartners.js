import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { defaultPartners, PARTNERS_KEY } from "../lib/constants";

export function usePartners() {
  const [partners, setPartners] = useState(defaultPartners);
  const [loading, setLoading] = useState(true);

  const fetchPartners = useCallback(async () => {
    if (!supabase) {
      try {
        const saved = JSON.parse(window.localStorage.getItem(PARTNERS_KEY) || "null");
        if (Array.isArray(saved) && saved.length > 0) setPartners(saved);
      } catch {}
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("order", { ascending: true });

    if (!error && data?.length > 0) setPartners(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPartners(); }, [fetchPartners]);

  async function savePartner(partner) {
    if (!supabase) {
      setPartners((items) => {
        const idx = items.findIndex((i) => i.id === partner.id);
        const updated =
          idx >= 0
            ? items.map((i) => (i.id === partner.id ? partner : i))
            : [...items, { ...partner, id: `partner-${Date.now()}`, order: items.length + 1 }];
        window.localStorage.setItem(PARTNERS_KEY, JSON.stringify(updated));
        return updated;
      });
      return { error: null };
    }

    const { id, ...rest } = partner;
    if (id && partners.find((p) => p.id === id)) {
      const { error } = await supabase.from("partners").update(rest).eq("id", id);
      if (!error) await fetchPartners();
      return { error };
    } else {
      const { error } = await supabase.from("partners").insert(rest);
      if (!error) await fetchPartners();
      return { error };
    }
  }

  async function deletePartner(id) {
    if (!supabase) {
      setPartners((items) => {
        const updated = items.filter((i) => i.id !== id);
        window.localStorage.setItem(PARTNERS_KEY, JSON.stringify(updated));
        return updated;
      });
      return { error: null };
    }

    const { error } = await supabase.from("partners").delete().eq("id", id);
    if (!error) await fetchPartners();
    return { error };
  }

  return { partners, loading, savePartner, deletePartner, refetch: fetchPartners };
}
