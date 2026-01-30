"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full w-10 h-10 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-110 active:scale-95 text-slate-700 dark:text-slate-300 relative overflow-hidden group"
            aria-label="Toggle theme"
        >
            <span className="material-icons-outlined absolute transition-all duration-500 rotate-0 scale-100 dark:-rotate-90 dark:scale-0">
                dark_mode
            </span>
            <span className="material-icons-outlined absolute transition-all duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100 text-yellow-400">
                light_mode
            </span>
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
