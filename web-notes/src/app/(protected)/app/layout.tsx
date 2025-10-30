import { ReactNode } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr]">
      <header className="flex items-center justify-between gap-4 px-4 h-12 border-b bg-background/60 backdrop-blur">
        <Link href="/app" className="font-semibold">Obsidian Online</Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>
      <main className="grid grid-cols-[260px,1fr] h-[calc(100vh-3rem)]">
        <aside className="border-r p-3 overflow-y-auto">
          {/* Sidebar content (folders, search) can go here later */}
          <div className="text-sm text-muted-foreground">Навигация</div>
        </aside>
        <section className="overflow-y-auto">{children}</section>
      </main>
    </div>
  );
}
