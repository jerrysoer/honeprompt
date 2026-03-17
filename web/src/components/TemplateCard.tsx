import Link from "next/link";

const CATEGORY_COLORS: Record<string, string> = {
  creators: "bg-purple-100 text-purple-700",
  developers: "bg-blue-100 text-blue-700",
  marketers: "bg-amber-100 text-amber-700",
  saas: "bg-emerald-100 text-emerald-700",
  general: "bg-gray-100 text-gray-600",
};

interface TemplateCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  testCaseCount: number;
  estimatedCost: string;
}

export function TemplateCard({
  id,
  name,
  description,
  category,
  testCaseCount,
  estimatedCost,
}: TemplateCardProps) {
  const pill = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.general;

  return (
    <Link
      href={`/templates/${id}`}
      className="group block rounded-2xl border border-border bg-surface p-5 hover:bg-surface-alt transition-colors"
    >
      <div className="mb-3">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${pill}`}
        >
          {category}
        </span>
      </div>
      <h3 className="font-heading text-lg font-semibold mb-1 group-hover:text-accent transition-colors">
        {name}
      </h3>
      <p className="text-text-muted text-sm line-clamp-2 mb-4">{description}</p>
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{testCaseCount} test cases</span>
        <span>{estimatedCost}</span>
      </div>
      <div className="mt-3 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
        Use this template &rarr;
      </div>
    </Link>
  );
}
