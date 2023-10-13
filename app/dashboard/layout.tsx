import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import React from "react";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full bg-slate-50">{children}</main>
    </div>
  );
};

export default MainLayout;
