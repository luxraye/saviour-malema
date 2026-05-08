import { useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bold, Italic, Heading2, Heading3, Quote, List, ListOrdered,
  Link, Code, Minus, Image, Eye, Edit3,
} from "lucide-react";

function insertMarkdown(textarea, before, after = "") {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end);
  const replacement = before + (selected || (after ? "text" : "")) + after;
  const newValue =
    textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
  const cursor = start + before.length + (selected || (after ? "text" : "")).length + after.length;
  return { value: newValue, cursor };
}

function insertLinePrefix(textarea, prefix) {
  const start = textarea.selectionStart;
  const lineStart = textarea.value.lastIndexOf("\n", start - 1) + 1;
  const newValue =
    textarea.value.substring(0, lineStart) + prefix + textarea.value.substring(lineStart);
  const cursor = start + prefix.length;
  return { value: newValue, cursor };
}

export function RichTextEditor({ value, onChange, placeholder = "Write your article here…" }) {
  const [tab, setTab] = useState("write");
  const textareaRef = useRef(null);

  function applyFormat(action) {
    const el = textareaRef.current;
    if (!el) return;
    el.focus();

    let result;
    switch (action) {
      case "bold":        result = insertMarkdown(el, "**", "**"); break;
      case "italic":      result = insertMarkdown(el, "*", "*"); break;
      case "h2":          result = insertLinePrefix(el, "## "); break;
      case "h3":          result = insertLinePrefix(el, "### "); break;
      case "quote":       result = insertLinePrefix(el, "> "); break;
      case "ul":          result = insertLinePrefix(el, "- "); break;
      case "ol":          result = insertLinePrefix(el, "1. "); break;
      case "code":        result = insertMarkdown(el, "`", "`"); break;
      case "link":        result = insertMarkdown(el, "[", "](https://)"); break;
      case "image":       result = insertMarkdown(el, "![alt](", ")"); break;
      case "hr":          result = insertMarkdown(el, "\n\n---\n\n"); break;
      default: return;
    }

    onChange(result.value);
    requestAnimationFrame(() => {
      el.setSelectionRange(result.cursor, result.cursor);
    });
  }

  const toolbarButtons = [
    { action: "bold",   Icon: Bold,         title: "Bold (**text**)" },
    { action: "italic", Icon: Italic,        title: "Italic (*text*)" },
    { action: "h2",     Icon: Heading2,      title: "Heading 2" },
    { action: "h3",     Icon: Heading3,      title: "Heading 3" },
    { sep: true },
    { action: "quote",  Icon: Quote,         title: "Blockquote" },
    { action: "ul",     Icon: List,          title: "Bullet list" },
    { action: "ol",     Icon: ListOrdered,   title: "Numbered list" },
    { sep: true },
    { action: "link",   Icon: Link,          title: "Insert link" },
    { action: "image",  Icon: Image,         title: "Insert image" },
    { action: "code",   Icon: Code,          title: "Inline code" },
    { action: "hr",     Icon: Minus,         title: "Horizontal rule" },
  ];

  return (
    <div className="rounded-lg border border-white/15 bg-midnight/50 overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <div className="flex flex-wrap gap-1">
          {toolbarButtons.map((btn, i) =>
            btn.sep ? (
              <div key={`sep-${i}`} className="mx-1 h-6 w-px self-center bg-white/15" />
            ) : (
              <button
                key={btn.action}
                type="button"
                title={btn.title}
                disabled={tab !== "write"}
                onClick={() => applyFormat(btn.action)}
                className="grid size-7 place-items-center rounded text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
              >
                <btn.Icon className="size-3.5" />
              </button>
            ),
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={`flex items-center gap-1.5 rounded px-3 py-1 text-xs font-bold transition ${
              tab === "write" ? "bg-gold/20 text-gold" : "text-white/50 hover:text-white"
            }`}
          >
            <Edit3 className="size-3" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`flex items-center gap-1.5 rounded px-3 py-1 text-xs font-bold transition ${
              tab === "preview" ? "bg-gold/20 text-gold" : "text-white/50 hover:text-white"
            }`}
          >
            <Eye className="size-3" />
            Preview
          </button>
        </div>
      </div>

      {tab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[22rem] resize-y bg-transparent px-4 py-4 font-mono text-sm text-white outline-none placeholder:text-white/30"
        />
      ) : (
        <div className="min-h-[22rem] px-5 py-5">
          {value ? (
            <div className="blog-prose">
              <Markdown remarkPlugins={[remarkGfm]}>{value}</Markdown>
            </div>
          ) : (
            <p className="text-sm italic text-white/30">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
