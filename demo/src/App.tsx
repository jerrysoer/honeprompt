import { DemoHero } from "./components/DemoHero";
import { ReplayPlayer } from "./components/ReplayPlayer";
import { CostTable } from "./components/CostTable";
import { CTASection } from "./components/CTASection";

export function App() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 pb-16">
        <DemoHero />
        <ReplayPlayer />
        <div className="mt-12">
          <CostTable />
        </div>
        <CTASection />
        <footer className="text-center text-xs text-text-muted pt-8 border-t border-border">
          <p>
            Built with HonePrompt — autonomous prompt optimization using the Karpathy autoresearch pattern.
          </p>
          <p className="mt-1">
            Data from a real optimization run. No API calls are made by this demo.
          </p>
        </footer>
      </div>
    </div>
  );
}
