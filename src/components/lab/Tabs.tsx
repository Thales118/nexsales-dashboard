import React, { createContext, useContext, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// 1. Context
type TabsContextType = {
  activeTab: number;
  setActiveTab: (index: number) => void;
};
const TabsContext = createContext<TabsContextType | undefined>(undefined);

// 2. Parent Component
interface TabsProps {
  children: ReactNode;
  defaultIndex?: number;
  className?: string;
}
export const Tabs = ({ children, defaultIndex = 0, className }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultIndex);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

// 3. Child Components
const TabsList = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("flex space-x-1 rounded-lg bg-secondary/50 p-1 mb-4", className)}>
    {children}
  </div>
);

const Tab = ({ index, children }: { index: number; children: ReactNode }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tab must be used within Tabs");
  const isActive = context.activeTab === index;
  
  return (
    <button
      className={cn(
        "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
        isActive 
          ? "bg-background text-foreground shadow-sm" 
          : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
      )}
      onClick={() => context.setActiveTab(index)}
    >
      {children}
    </button>
  );
};

const Panel = ({ index, children }: { index: number; children: ReactNode }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Panel must be used within Tabs");
  if (context.activeTab !== index) return null;
  return <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">{children}</div>;
};

// 4. Attach
Tabs.List = TabsList;
Tabs.Tab = Tab;
Tabs.Panel = Panel;