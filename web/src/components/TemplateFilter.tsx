"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "creators", label: "Creators" },
  { value: "developers", label: "Developers" },
  { value: "marketers", label: "Marketers" },
  { value: "saas", label: "SaaS" },
];

export function TemplateFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const active = searchParams.get("category") ?? "";

  const setCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setCategory(value)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            active === value
              ? "bg-accent text-white"
              : "bg-surface-alt text-text-muted hover:text-text"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
