"use client";

import { useState, useTransition, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDocuments } from "@/lib/api/client";
import type { DocumentItem, ConnectorItem } from "@/types/knowledge";
import { NetworkHealth } from "./network-health";
import { ConnectorSearch } from "./connector-search";
import { ConnectorGrid } from "./connector-grid";
import { ConnectorDetailSheet } from "./connector-detail-sheet";

const baseConnectors: Omit<ConnectorItem, "assetsCount">[] = [
  // Document Systems
  {
    id: "pdf",
    name: "PDF Library",
    category: "documents",
    status: "connected",
    description: "Import offline reports, corporate handbooks, and policy manuals directly.",
    icon: "pdf",
    lastSync: "Just now",
  },
  {
    id: "gdrive",
    name: "Google Drive",
    category: "documents",
    status: "coming_soon",
    description: "Index files, spreadsheets, and slides across team folders.",
    icon: "gdrive",
  },
  {
    id: "onedrive",
    name: "OneDrive",
    category: "documents",
    status: "coming_soon",
    description: "Sync corporate spreadsheets and assets from Microsoft environments.",
    icon: "onedrive",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    category: "documents",
    status: "coming_soon",
    description: "Access shared archives, media, and raw project structures.",
    icon: "dropbox",
  },
  {
    id: "box",
    name: "Box Directory",
    category: "documents",
    status: "coming_soon",
    description: "Sync secure content repositories, catalogs, and vaults.",
    icon: "box",
  },
  // Collaboration
  {
    id: "slack",
    name: "Slack Channels",
    category: "collaboration",
    status: "coming_soon",
    description: "Index chat rooms, conversation history, and engineering threads.",
    icon: "slack",
  },
  {
    id: "github",
    name: "GitHub Codebases",
    category: "collaboration",
    status: "coming_soon",
    description: "Synchronize READMEs, issue lists, and code logs.",
    icon: "github",
  },
  {
    id: "gmail",
    name: "Gmail Inbox",
    category: "collaboration",
    status: "coming_soon",
    description: "Access client threads, vendor updates, and mail history.",
    icon: "gmail",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    category: "collaboration",
    status: "coming_soon",
    description: "Synchronize meeting transcripts and channel chats.",
    icon: "teams",
  },
  {
    id: "calendar",
    name: "Google Calendar",
    category: "collaboration",
    status: "coming_soon",
    description: "Sync calendar events, logs, and attendee descriptions.",
    icon: "calendar",
  },
  // Knowledge Bases
  {
    id: "notion",
    name: "Notion Workspaces",
    category: "knowledge",
    status: "coming_soon",
    description: "Index company wikis, database pages, and documentation boards.",
    icon: "notion",
  },
  {
    id: "confluence",
    name: "Confluence Spaces",
    category: "knowledge",
    status: "coming_soon",
    description: "Sync spaces, guides, and technical specification writeups.",
    icon: "confluence",
  },
  {
    id: "sharepoint",
    name: "SharePoint Sites",
    category: "knowledge",
    status: "coming_soon",
    description: "Index intranet sites, portals, and shared wiki documents.",
    icon: "sharepoint",
  },
  {
    id: "zendesk",
    name: "Zendesk Tickets",
    category: "knowledge",
    status: "coming_soon",
    description: "Index customer support tickets and help center guides.",
    icon: "zendesk",
  },
  // Engineering
  {
    id: "jira",
    name: "Jira Projects",
    category: "engineering",
    status: "coming_soon",
    description: "Sync software boards, epic checklists, and task issue logs.",
    icon: "jira",
  },
];

function KnowledgeFlow() {
  return (
    <div className="relative border border-border/20 bg-secondary/15 rounded-xl p-5 overflow-hidden flex flex-col items-center justify-center select-none h-44">
      {/* Background grids */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" />

      {/* SVG Canvas */}
      <svg className="w-full max-w-lg h-28 z-10" viewBox="0 0 500 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Pulsing connections */}
        <path d="M 50 15 C 150 15, 150 50, 250 50" stroke="currentColor" className="text-muted-foreground/20" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M 50 15 C 150 15, 150 50, 250 50" stroke="currentColor" className="text-primary/70" strokeWidth="1.5" strokeDasharray="4 4" strokeDashoffset="10">
          <animate attributeName="stroke-dashoffset" values="40;0" dur="4s" repeatCount="indefinite" />
        </path>

        <path d="M 50 85 C 150 85, 150 50, 250 50" stroke="currentColor" className="text-muted-foreground/20" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M 50 85 C 150 85, 150 50, 250 50" stroke="currentColor" className="text-primary/70" strokeWidth="1.5" strokeDasharray="4 4" strokeDashoffset="10">
          <animate attributeName="stroke-dashoffset" values="40;0" dur="3s" repeatCount="indefinite" />
        </path>

        <path d="M 50 50 L 250 50" stroke="currentColor" className="text-muted-foreground/20" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M 50 50 L 250 50" stroke="currentColor" className="text-emerald-500/70" strokeWidth="1.5" strokeDasharray="4 4" strokeDashoffset="10">
          <animate attributeName="stroke-dashoffset" values="40;0" dur="2s" repeatCount="indefinite" />
        </path>

        <path d="M 250 50 L 450 50" stroke="currentColor" className="text-muted-foreground/20" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M 250 50 L 450 50" stroke="currentColor" className="text-emerald-500/70" strokeWidth="1.5" strokeDasharray="4 4" strokeDashoffset="0">
          <animate attributeName="stroke-dashoffset" values="0;40" dur="2.5s" repeatCount="indefinite" />
        </path>

        {/* Left Nodes */}
        <circle cx="50" cy="15" r="7" className="fill-card stroke-border/60" strokeWidth="1.5" />
        <text x="50" y="17.5" textAnchor="middle" className="fill-muted-foreground font-mono text-[7px]" fontSize="7">N</text>

        <circle cx="50" cy="50" r="7" className="fill-card stroke-emerald-500/30" strokeWidth="1.5" />
        <text x="50" y="52.5" textAnchor="middle" className="fill-emerald-500 font-mono text-[7px]" fontSize="7">P</text>

        <circle cx="50" cy="85" r="7" className="fill-card stroke-border/60" strokeWidth="1.5" />
        <text x="50" y="87.5" textAnchor="middle" className="fill-muted-foreground font-mono text-[7px]" fontSize="7">S</text>

        {/* Center Node (NEURA Engine Core) */}
        <g>
          <circle cx="250" cy="50" r="11" className="fill-card stroke-primary/30" strokeWidth="2" />
          <circle cx="250" cy="50" r="11" className="stroke-primary/20 animate-ping" strokeWidth="1" />
          <text x="250" y="53" textAnchor="middle" className="fill-primary font-semibold text-[8px]" fontSize="8">NEURA</text>
        </g>

        {/* Right Node (Verified Graph) */}
        <circle cx="450" cy="50" r="8" className="fill-card stroke-emerald-500/30" strokeWidth="1.5" />
        <text x="450" y="52.5" textAnchor="middle" className="fill-emerald-600 font-mono text-[7px]" fontSize="7">G</text>
      </svg>

      <span className="text-[10px] text-muted-foreground/80 tracking-wide select-none leading-none mt-1">
        Connected channels ingest raw streams, mapping nodes into NEURA&apos;s verified knowledge graph.
      </span>
    </div>
  );
}

export function NetworkWorkspace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConnector, setSelectedConnector] = useState<ConnectorItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [, startTransition] = useTransition();

  // Query documents count from backend
  const { data: documents = [] } = useQuery<DocumentItem[]>({
    queryKey: ["documents"],
    queryFn: getDocuments,
  });

  // Hydrate baseConnectors with dynamic values
  const connectors = useMemo(() => {
    return baseConnectors.map((conn) => {
      if (conn.id === "pdf") {
        return {
          ...conn,
          assetsCount: documents.length,
          chunksCount: documents.length * 12, // mock chunks indicator
        } as ConnectorItem;
      }
      return conn as ConnectorItem;
    });
  }, [documents]);

  const handleSearchChange = (val: string) => {
    startTransition(() => {
      setSearchQuery(val);
    });
  };

  // Process search filters locally
  const filteredConnectors = useMemo(() => {
    if (!searchQuery.trim()) {
      return connectors;
    }
    const term = searchQuery.toLowerCase();
    return connectors.filter(
      (conn) =>
        conn.name.toLowerCase().includes(term) ||
        conn.description.toLowerCase().includes(term)
    );
  }, [connectors, searchQuery]);

  const handleCardClick = (conn: ConnectorItem) => {
    setSelectedConnector(conn);
    setIsSheetOpen(true);
  };

  // Count active vs coming soon metrics
  const activeCount = connectors.filter((c) => c.status === "connected").length;
  const availableCount = connectors.filter((c) => c.status === "coming_soon").length;

  return (
    <div className="space-y-6">
      {/* Hero Header block */}
      <div className="flex flex-col gap-4.5 sm:flex-row sm:items-center sm:justify-between border-b border-border/20 pb-4 select-none">
        <div className="space-y-1">
          <h2 className="text-xl font-medium tracking-tight text-foreground/90">Knowledge Network</h2>
          <p className="text-xs text-muted-foreground/75 font-normal max-w-[480px] leading-relaxed">
            Connect the systems your organization already uses. NEURA continuously indexes, verifies, and synchronizes trusted organizational knowledge.
          </p>
          <p className="text-[11px] text-muted-foreground/60 italic font-normal leading-none pt-0.5">
            Connected sources automatically become part of NEURA&apos;s continuously verified knowledge graph.
          </p>
        </div>

        {/* Local search input */}
        <ConnectorSearch value={searchQuery} onChange={handleSearchChange} />
      </div>

      {/* SVG Animated Knowledge Ingestion Flow */}
      <KnowledgeFlow />

      {/* Status Health widgets */}
      <NetworkHealth connectedCount={activeCount} availableCount={availableCount} />

      {/* Category Connector Grids */}
      <div className="pt-2">
        <ConnectorGrid
          connectors={filteredConnectors}
          onCardClick={handleCardClick}
          searchQuery={searchQuery}
        />
      </div>

      {/* Slide-over details peeking sheet */}
      <ConnectorDetailSheet
        connector={selectedConnector}
        isOpen={isSheetOpen}
        onClose={() => {
          setIsSheetOpen(false);
          setSelectedConnector(null);
        }}
      />
    </div>
  );
}
