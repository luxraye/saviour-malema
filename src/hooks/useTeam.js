import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { defaultTeam, TEAM_KEY } from "../lib/constants";

export function useTeam() {
  const [members, setMembers] = useState(defaultTeam);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (!supabase) {
      try {
        const saved = JSON.parse(window.localStorage.getItem(TEAM_KEY) || "null");
        if (Array.isArray(saved) && saved.length > 0) setMembers(saved);
      } catch {}
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("order", { ascending: true });

    if (!error && data?.length > 0) setMembers(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  async function saveMember(member) {
    const entry = {
      ...member,
      id: member.id || `team-${Date.now()}`,
    };

    if (!supabase) {
      setMembers((items) => {
        const idx = items.findIndex((i) => i.id === member.id);
        const updated =
          idx >= 0
            ? items.map((i) => (i.id === member.id ? entry : i))
            : [...items, { ...entry, order: items.length + 1 }];
        window.localStorage.setItem(TEAM_KEY, JSON.stringify(updated));
        return updated;
      });
      return { error: null };
    }

    const { id, ...rest } = entry;
    const exists = members.find((m) => m.id === id);
    if (exists) {
      const { error } = await supabase.from("team_members").update(rest).eq("id", id);
      if (!error) await fetchMembers();
      return { error };
    } else {
      const { error } = await supabase.from("team_members").insert({ id, ...rest });
      if (!error) await fetchMembers();
      return { error };
    }
  }

  async function deleteMember(id) {
    if (!supabase) {
      setMembers((items) => {
        const updated = items.filter((i) => i.id !== id);
        window.localStorage.setItem(TEAM_KEY, JSON.stringify(updated));
        return updated;
      });
      return { error: null };
    }

    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (!error) await fetchMembers();
    return { error };
  }

  return { members, loading, saveMember, deleteMember, refetch: fetchMembers };
}
