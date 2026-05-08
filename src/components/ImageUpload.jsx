import { useState } from "react";
import { Image, Upload } from "lucide-react";
import { supabase } from "../lib/supabase";

export function ImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!supabase) {
      const url = URL.createObjectURL(file);
      onChange(url);
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from("media").upload(path, file);

    if (!error) {
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      onChange(data.publicUrl);
    }
    setUploading(false);
  }

  return (
    <div className="grid gap-2">
      <div className="flex gap-2">
        <span className="relative flex-1">
          <Image className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/50" />
          <input
            className="w-full rounded-lg border border-white/15 bg-midnight/50 py-3 pl-10 pr-4 text-sm font-semibold text-white outline-none placeholder:text-white/40 focus:border-gold/80"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or upload below"
          />
        </span>
      </div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm font-bold text-white/70 transition hover:border-gold/50 hover:text-white">
        <Upload className="size-4" aria-hidden="true" />
        {uploading ? "Uploading..." : "Upload image"}
        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
      </label>
      {value && (
        <img src={value} alt="Preview" className="h-24 w-full rounded-lg object-cover" />
      )}
    </div>
  );
}
