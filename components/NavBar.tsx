"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Notes" },
  { href: "/mbti", label: "MBTI Test" },
  { href: "/lecture-log", label: "Lecture Log" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header
      className="flex items-center justify-between border-b px-6 py-4"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-8">
        <h1 className="text-xl font-bold tracking-tight">
          <Link href="/">
            <span style={{ color: "var(--primary)" }}>GyanOS</span>
          </Link>
        </h1>

        <nav className="flex gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150"
                style={{
                  backgroundColor: isActive ? "var(--surface)" : "transparent",
                  color: isActive ? "var(--primary)" : "var(--muted)",
                  boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <span
        className="rounded-full px-3 py-1 text-xs font-medium"
        style={{ backgroundColor: "var(--surface-light)", color: "var(--muted)" }}
      >
        Demo
      </span>
    </header>
  );
}
