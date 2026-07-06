"use client";

import { useSettingsStore } from "@/store/settings-store";

export function SettingsAi() {
  const {
    defaultModel,
    temperature,
    confidenceThreshold,
    showCitations,
    enableCrossReference,
    enableHallucinationDetection,
    enableContradictionAnalysis,
    setAiPreferences,
  } = useSettingsStore();

  const modelOptions = [
    { label: "Gemini 1.5 Pro (Google)", value: "gemini-1.5-pro" },
    { label: "Claude 3.5 Sonnet (Anthropic)", value: "claude-3.5-sonnet" },
    { label: "GPT-4o (OpenAI)", value: "gpt-4o" },
    { label: "Local Llama 3 (Meta/Ollama)", value: "llama-3-local" },
  ];

  const toggleItems = [
    {
      id: "showCitations" as const,
      label: "Always Show Citations & Source Excerpts",
      description: "Embed direct highlighted document passages inside review sheets.",
      checked: showCitations,
    },
    {
      id: "enableCrossReference" as const,
      label: "Enable Knowledge Graph Cross-Reference",
      description: "Verify SOP rules against all existing files in the index graph.",
      checked: enableCrossReference,
    },
    {
      id: "enableHallucinationDetection" as const,
      label: "Enable Auto Hallucination Detection",
      description: "Score the extracted rules for accuracy against raw text sources.",
      checked: enableHallucinationDetection,
    },
    {
      id: "enableContradictionAnalysis" as const,
      label: "Enable Contradiction Analysis",
      description: "Analyze new procedure clauses for logic conflicts against existing SOP database.",
      checked: enableContradictionAnalysis,
    },
  ];

  return (
    <div className="space-y-6 max-w-lg select-none">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground/90">AI Preferences</h3>
        <p className="text-xs text-muted-foreground/75 leading-relaxed">
          Configure default language models, temperature thresholds, and automate background context pipeline verification stages.
        </p>
      </div>

      <div className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 space-y-5">
        {/* Model Selector */}
        <div className="space-y-1.5">
          <label htmlFor="ai-model-select" className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            Default Extraction Model
          </label>
          <select
            id="ai-model-select"
            value={defaultModel}
            onChange={(e) => setAiPreferences({ defaultModel: e.target.value })}
            className="w-full h-9 rounded-lg border border-border/40 bg-background/50 px-3 text-xs text-foreground/90 outline-none focus:border-primary/45 focus:bg-background transition-all duration-150 cursor-pointer"
          >
            {modelOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Temperature slider */}
        <div className="space-y-1.5 pt-2 border-t border-border/10">
          <div className="flex items-center justify-between">
            <label htmlFor="temperature-slider" className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Extraction Temperature (Placeholder)
            </label>
            <span className="text-[11px] font-mono text-muted-foreground/80 font-medium">
              {temperature.toFixed(1)}
            </span>
          </div>
          <input
            id="temperature-slider"
            type="range"
            min={0.0}
            max={1.0}
            step={0.1}
            value={temperature}
            onChange={(e) => setAiPreferences({ temperature: parseFloat(e.target.value) })}
            className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span className="block text-[9px] text-muted-foreground/60 leading-none">
            Lower temperatures produce more consistent, literal text extractions.
          </span>
        </div>

        {/* Confidence Threshold slider */}
        <div className="space-y-1.5 pt-2 border-t border-border/10">
          <div className="flex items-center justify-between">
            <label htmlFor="confidence-slider" className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
              Minimum Confidence Auto-Threshold
            </label>
            <span className="text-[11px] font-mono text-muted-foreground/80 font-medium">
              {confidenceThreshold}%
            </span>
          </div>
          <input
            id="confidence-slider"
            type="range"
            min={50}
            max={100}
            step={5}
            value={confidenceThreshold}
            onChange={(e) => setAiPreferences({ confidenceThreshold: parseInt(e.target.value) })}
            className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <span className="block text-[9px] text-muted-foreground/60 leading-none">
            Documents with validation scores below this threshold require human approval.
          </span>
        </div>
      </div>

      {/* Toggles */}
      <div className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 space-y-4">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75 leading-none mb-1">
          Automated Pipeline Stages
        </h4>
        
        {toggleItems.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0 ${
              index > 0 ? "border-t border-border/10" : ""
            }`}
          >
            <div className="space-y-0.5 leading-none">
              <label
                htmlFor={`ai-toggle-${item.id}`}
                className="text-xs font-semibold text-foreground/90 cursor-pointer"
              >
                {item.label}
              </label>
              <p className="text-[11px] text-muted-foreground/80 leading-normal max-w-[320px] mt-1 select-text">
                {item.description}
              </p>
            </div>

            {/* Toggle Switch */}
            <button
              id={`ai-toggle-${item.id}`}
              type="button"
              role="switch"
              aria-checked={item.checked}
              onClick={() => setAiPreferences({ [item.id]: !item.checked })}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
                item.checked ? "bg-primary" : "bg-muted/70"
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  item.checked ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
