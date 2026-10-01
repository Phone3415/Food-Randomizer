"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LightModeIcon, DarkModeIcon } from "./Icons";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse shrink-0" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer flex items-center justify-center shrink-0 shadow-2xs"
      title={isDark ? "สลับเป็นโหมดสว่าง" : "สลับเป็นโหมดมืด"}
      aria-label={isDark ? "สลับเป็นโหมดสว่าง" : "สลับเป็นโหมดมืด"}
    >
      {isDark ? (
        <LightModeIcon className="text-lg" />
      ) : (
        <DarkModeIcon className="text-lg" />
      )}
    </button>
  );
}
