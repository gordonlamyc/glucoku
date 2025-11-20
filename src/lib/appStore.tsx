import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type LogEntry = {
  id: string;
  timestamp: string; // ISO
  glucose: number;
  status?: "normal" | "high" | "low";
  meal?: string | null;
  notes?: string | null;
  source?: "scanner" | "manual" | "device";
};

export type ChatMessage = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export type Settings = {
  language: string;
  voiceEnabled: boolean;
  offlineMode: boolean;
};

type AppStore = {
  logs: LogEntry[];
  settings: Settings;
  chatMessages: ChatMessage[];
  latestGlucose: number | null;
  addLog: (entry: Omit<LogEntry, "id" | "timestamp">) => void;
  clearLogs: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
  addChatMessage: (message: Omit<ChatMessage, "id">) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  clearChatMessages: () => void;
  setLatestGlucose: (value: number | null) => void;
};

const LOCAL_KEY = "glucoku.app.v1";

const defaultSettings: Settings = {
  language: "en",
  voiceEnabled: true,
  offlineMode: false,
};

const AppContext = createContext<AppStore | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [latestGlucose, setLatestGlucose] = useState<number | null>(null);
  
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return parsed.logs ?? [];
    } catch {
      return [];
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      
      // Convert string timestamps back to Date objects
      const messages = parsed.chatMessages ?? [];
      return messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return defaultSettings;
      const parsed = JSON.parse(raw);
      return { ...defaultSettings, ...(parsed.settings ?? {}) };
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ logs, settings, chatMessages }));
    } catch {
      // ignore storage errors
    }
  }, [logs, settings, chatMessages]);

  const addLog = (entry: Omit<LogEntry, "id" | "timestamp">) => {
    const newEntry: LogEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setLogs((s) => [newEntry, ...s]);
  };

  const clearLogs = () => setLogs([]);

  const updateSettings = (patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch }));
  
  const addChatMessage = (message: Omit<ChatMessage, "id">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };
  
  const clearChatMessages = () => setChatMessages([]);

  const value = useMemo(
    () => ({ 
      logs, 
      settings, 
      chatMessages,
      latestGlucose,
      addLog, 
      clearLogs, 
      updateSettings, 
      addChatMessage, 
      setChatMessages,
      clearChatMessages,
      setLatestGlucose
    }), 
    [logs, settings, chatMessages, latestGlucose]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppStore = (): AppStore => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppProvider");
  return ctx;
};
