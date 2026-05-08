import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { DONATIONS_KEY } from "../lib/constants";

export function useDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = useCallback(async () => {
    if (!supabase) {
      try {
        const saved = JSON.parse(window.localStorage.getItem(DONATIONS_KEY) || "[]");
        setDonations(Array.isArray(saved) ? saved : []);
      } catch {
        setDonations([]);
      }
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("donation_inquiries")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (!error && data) setDonations(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchDonations(); }, [fetchDonations]);

  async function submitInquiry(inquiry) {
    const entry = {
      ...inquiry,
      id: `inquiry-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      submitted_at: new Date().toISOString(),
      status: "new",
    };

    if (!supabase) {
      const current = JSON.parse(window.localStorage.getItem(DONATIONS_KEY) || "[]");
      const updated = [entry, ...current];
      window.localStorage.setItem(DONATIONS_KEY, JSON.stringify(updated));
      setDonations(updated);
      return { error: null };
    }

    const { error } = await supabase.from("donation_inquiries").insert(entry);
    if (!error) await fetchDonations();
    return { error };
  }

  async function updateStatus(id, status) {
    if (!supabase) {
      const current = JSON.parse(window.localStorage.getItem(DONATIONS_KEY) || "[]");
      const updated = current.map((d) => (d.id === id ? { ...d, status } : d));
      window.localStorage.setItem(DONATIONS_KEY, JSON.stringify(updated));
      setDonations(updated);
      return { error: null };
    }

    const { error } = await supabase
      .from("donation_inquiries")
      .update({ status })
      .eq("id", id);
    if (!error) await fetchDonations();
    return { error };
  }

  async function deleteInquiry(id) {
    if (!supabase) {
      const current = JSON.parse(window.localStorage.getItem(DONATIONS_KEY) || "[]");
      const updated = current.filter((d) => d.id !== id);
      window.localStorage.setItem(DONATIONS_KEY, JSON.stringify(updated));
      setDonations(updated);
      return { error: null };
    }

    const { error } = await supabase.from("donation_inquiries").delete().eq("id", id);
    if (!error) await fetchDonations();
    return { error };
  }

  const newCount = donations.filter((d) => d.status === "new").length;

  return { donations, loading, newCount, submitInquiry, updateStatus, deleteInquiry, refetch: fetchDonations };
}
