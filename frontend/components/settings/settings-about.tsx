"use client";

import { Info, Github } from "lucide-react";

export function SettingsAbout() {
  const versionItems = [
    { label: "Frontend Framework", value: "Next.js 15.5 (React 19)" },
    { label: "Backend Framework", value: "FastAPI 0.111 (Python 3.13)" },
    { label: "Primary Database Schema", value: "PostgreSQL 16 (docker container)" },
    { label: "Vector Search Engine", value: "Qdrant Vector Cluster (docker container)" },
    { label: "Build Date & Version Stamp", value: "July 6, 2026 · v0.1.0 (MVP Release)" },
    { label: "Environment Tier", value: "Development (DEV_MODE enabled)" },
    { label: "Git Repository Source", value: "pavitragit09/neura-brain (main branch)" },
  ];

  return (
    <div className="space-y-6 max-w-lg select-none">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground/90">About NEURA</h3>
        <p className="text-xs text-muted-foreground/75 leading-relaxed">
          Technical specifications, system environments, and deployment licensing metadata.
        </p>
      </div>

      <div className="rounded-xl border border-border/25 bg-card p-5 shadow-sm/5 space-y-4">
        <h4 className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/75 leading-none mb-1">
          <Info className="size-3.5 text-primary" />
          Technical Specifications
        </h4>

        {versionItems.map((item, index) => (
          <div
            key={item.label}
            className={`space-y-1 py-3 first:pt-0 last:pb-0 ${
              index > 0 ? "border-t border-border/10" : ""
            }`}
          >
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 leading-none">
              {item.label}
            </span>
            <span className="block text-xs font-semibold text-foreground/85 font-mono leading-normal pt-0.5">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/20 bg-secondary/15 p-4.5 flex items-center justify-between gap-4 text-xs">
        <div className="space-y-0.5">
          <span className="block font-semibold text-foreground/85">Open Source Repository</span>
          <p className="text-[11px] text-muted-foreground/75 leading-relaxed">
            Inspect source controls, report issues, or review pull requests.
          </p>
        </div>
        <a
          href="https://github.com/pavitragit09/neura-brain"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border/30 bg-background/50 hover:bg-secondary text-foreground text-xs font-semibold select-none cursor-pointer transition-colors duration-150"
        >
          <Github className="size-3.5" />
          <span>GitHub</span>
        </a>
      </div>
    </div>
  );
}
