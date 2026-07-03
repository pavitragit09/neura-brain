export const suggestedQuestions = [
  "What is our refund policy?",
  "Show onboarding checklist",
  "Leave policy",
  "Engineering deployment SOP",
  "Who approves vendor contracts?",
  "Summarize last quarter product roadmap",
] as const;

export type RecentKnowledgeItem = {
  id: string;
  title: string;
  source: string;
  updatedAt: string;
};

export const recentKnowledge: RecentKnowledgeItem[] = [
  {
    id: "1",
    title: "Employee Leave Policy",
    source: "HR Handbook",
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    title: "Deployment SOP v3.2",
    source: "Engineering Wiki",
    updatedAt: "Yesterday",
  },
  {
    id: "3",
    title: "Customer Refund Guidelines",
    source: "Support Playbook",
    updatedAt: "3 days ago",
  },
  {
    id: "4",
    title: "Vendor Onboarding Checklist",
    source: "Operations",
    updatedAt: "Last week",
  },
];

export type RecentConversationItem = {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
};

export const recentConversations: RecentConversationItem[] = [
  {
    id: "1",
    title: "Refund policy for enterprise accounts",
    preview: "Summarized eligibility windows and escalation paths.",
    timestamp: "Today, 9:14 AM",
  },
  {
    id: "2",
    title: "Onboarding checklist for new hires",
    preview: "Listed IT setup, HR paperwork, and first-week milestones.",
    timestamp: "Yesterday",
  },
  {
    id: "3",
    title: "Deployment rollback procedure",
    preview: "Outlined staging verification and incident communication steps.",
    timestamp: "Monday",
  },
];

export type AdminWidgetItem = {
  id: string;
  label: string;
  value: string;
  detail: string;
};

export const adminWidgets: AdminWidgetItem[] = [
  {
    id: "pending-reviews",
    label: "Pending Reviews",
    value: "3",
    detail: "Awaiting approval",
  },
  {
    id: "failed-jobs",
    label: "Failed Processing Jobs",
    value: "1",
    detail: "Needs attention",
  },
  {
    id: "knowledge-health",
    label: "Knowledge Health",
    value: "94%",
    detail: "Sources indexed",
  },
];
