import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { defaultServices, SERVICES_KEY } from "../lib/constants";

export function useServices() {
  const [services, setServices] = useState(defaultServices);
  const [loading, setLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    if (!supabase) {
      try {
        const saved = JSON.parse(window.localStorage.getItem(SERVICES_KEY) || "null");
        if (Array.isArray(saved) && saved.length > 0) setServices(saved);
      } catch {}
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("order", { ascending: true });

    if (!error && data?.length > 0) setServices(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  async function saveService(service) {
    const entry = {
      ...service,
      id: service.id || `svc-${Date.now()}`,
    };

    if (!supabase) {
      setServices((items) => {
        const idx = items.findIndex((i) => i.id === service.id);
        const updated =
          idx >= 0
            ? items.map((i) => (i.id === service.id ? entry : i))
            : [...items, { ...entry, order: items.length + 1 }];
        window.localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));
        return updated;
      });
      return { error: null };
    }

    const { id, ...rest } = entry;
    const exists = services.find((s) => s.id === id);
    if (exists) {
      const { error } = await supabase.from("services").update(rest).eq("id", id);
      if (!error) await fetchServices();
      return { error };
    } else {
      const { error } = await supabase.from("services").insert({ id, ...rest });
      if (!error) await fetchServices();
      return { error };
    }
  }

  async function deleteService(id) {
    if (!supabase) {
      setServices((items) => {
        const updated = items.filter((i) => i.id !== id);
        window.localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));
        return updated;
      });
      return { error: null };
    }

    const { error } = await supabase.from("services").delete().eq("id", id);
    if (!error) await fetchServices();
    return { error };
  }

  return { services, loading, saveService, deleteService, refetch: fetchServices };
}
