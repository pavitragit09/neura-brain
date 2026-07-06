"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SettingsState = {
  // Workspace
  workspaceName: string;
  setWorkspaceName: (name: string) => void;
  
  // Appearance
  density: "compact" | "comfortable";
  timezone: string;
  dateFormat: string;
  setAppearance: (prefs: {
    density?: "compact" | "comfortable";
    timezone?: string;
    dateFormat?: string;
  }) => void;
  
  // Notifications
  emailNotifications: boolean;
  reviewReminders: boolean;
  connectorAlerts: boolean;
  failedSyncAlerts: boolean;
  weeklySummary: boolean;
  setNotifications: (prefs: {
    emailNotifications?: boolean;
    reviewReminders?: boolean;
    connectorAlerts?: boolean;
    failedSyncAlerts?: boolean;
    weeklySummary?: boolean;
  }) => void;
  
  // AI preferences
  defaultModel: string;
  temperature: number;
  confidenceThreshold: number;
  showCitations: boolean;
  enableCrossReference: boolean;
  enableHallucinationDetection: boolean;
  enableContradictionAnalysis: boolean;
  setAiPreferences: (prefs: {
    defaultModel?: string;
    temperature?: number;
    confidenceThreshold?: number;
    showCitations?: boolean;
    enableCrossReference?: boolean;
    enableHallucinationDetection?: boolean;
    enableContradictionAnalysis?: boolean;
  }) => void;

  // Sync Frequencies
  googleDriveSyncFreq: string;
  postgresSyncFreq: string;
  slackSyncFreq: string;
  setSyncFreqs: (freqs: {
    googleDriveSyncFreq?: string;
    postgresSyncFreq?: string;
    slackSyncFreq?: string;
  }) => void;

  // Reset
  resetPreferences: () => void;
};

const DEFAULT_SETTINGS = {
  workspaceName: "NEURA Corp",
  density: "comfortable" as const,
  timezone: "Asia/Kolkata",
  dateFormat: "d MMM, hh:mm A",
  emailNotifications: true,
  reviewReminders: true,
  connectorAlerts: false,
  failedSyncAlerts: true,
  weeklySummary: false,
  defaultModel: "gemini-1.5-pro",
  temperature: 0.7,
  confidenceThreshold: 85,
  showCitations: true,
  enableCrossReference: true,
  enableHallucinationDetection: true,
  enableContradictionAnalysis: true,
  googleDriveSyncFreq: "Every 6 Hours",
  postgresSyncFreq: "Daily",
  slackSyncFreq: "Real-time",
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      
      setWorkspaceName: (name) => set({ workspaceName: name }),
      
      setAppearance: (prefs) => set((state) => ({ ...state, ...prefs })),
      
      setNotifications: (prefs) => set((state) => ({ ...state, ...prefs })),
      
      setAiPreferences: (prefs) => set((state) => ({ ...state, ...prefs })),

      setSyncFreqs: (freqs) => set((state) => ({ ...state, ...freqs })),
      
      resetPreferences: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: "neura-workspace-settings",
    }
  )
);
