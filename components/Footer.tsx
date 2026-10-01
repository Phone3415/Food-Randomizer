import React from "react";

export function Footer() {
  return (
    <footer className="max-w-4xl mx-auto w-full pt-10 pb-6 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3 font-body">
      <div>
        <span>พัฒนาโดย </span>
        <strong className="font-heading font-semibold text-zinc-700 dark:text-zinc-200">
          นาย ณะชพล เลิศอุดม
        </strong>
      </div>
      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
        <span>กดแป้น</span>
        <kbd className="font-mono px-2 py-0.5 border border-zinc-200 dark:border-zinc-700 rounded text-[11px] bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium shadow-2xs">
          SPACE
        </kbd>
        <span>เพื่อสุ่มเมนูอาหารทันที</span>
      </div>
    </footer>
  );
}
