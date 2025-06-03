import React from "react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";

export const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div>
      <SidebarProvider>
        <Sidebar />
        <main className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1" />
            <ModeToggle />
          </header>
          <div className="flex-1 p-4">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}
