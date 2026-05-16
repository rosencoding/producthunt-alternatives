"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/sidebar";
import { useSectionsProgress } from "@/components/sections-progress";

type SectionSummary = {
    id: string;
    title: string;
};

export default function MobileToc({
    sections,
}: {
    sections: SectionSummary[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const { activeSectionId } = useSectionsProgress();

    const activeTitle = useMemo(() => {
        return (
            sections.find((section) => section.id === activeSectionId)?.title ??
            sections[0]?.title ??
            "Contents"
        );
    }, [activeSectionId, sections]);
    const isTocOpen = isOpen && hasScrolled;

    useEffect(() => {
        const getScrollTop = () =>
            Math.max(
                0,
                window.scrollY,
                window.pageYOffset,
                window.visualViewport?.pageTop ?? 0,
                document.scrollingElement?.scrollTop ?? 0,
                -document.documentElement.getBoundingClientRect().top,
                -document.body.getBoundingClientRect().top
            );
        const updateScrollState = () => {
            const next = getScrollTop() > 0;
            setHasScrolled((prev) => (prev === next ? prev : next));
        };

        const viewport = window.visualViewport;
        updateScrollState();
        window.addEventListener("scroll", updateScrollState, { passive: true });
        window.addEventListener("resize", updateScrollState);
        window.addEventListener("orientationchange", updateScrollState);
        viewport?.addEventListener("scroll", updateScrollState, {
            passive: true,
        });
        viewport?.addEventListener("resize", updateScrollState);
        return () => {
            window.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
            window.removeEventListener("orientationchange", updateScrollState);
            viewport?.removeEventListener("scroll", updateScrollState);
            viewport?.removeEventListener("resize", updateScrollState);
        };
    }, []);

    useEffect(() => {
        if (!isTocOpen) return;
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isTocOpen]);

    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleClose = () => setIsOpen(false);

    return (
        <nav
            aria-label="Mobile table of contents"
            className={[
                "fixed left-0 right-0 top-0 z-40 2xl:hidden transition-[transform,opacity] duration-300",
                hasScrolled
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-full opacity-0 pointer-events-none",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className="border-b border-slate-200 bg-white/95 backdrop-blur pt-[env(safe-area-inset-top)]">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-6 py-3 sm:px-16">
                    <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
                            PH Alternatives
                        </div>
                        <div className="truncate text-sm font-semibold text-slate-800">
                            {activeTitle}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleToggle}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm"
                        aria-expanded={isTocOpen}
                        aria-controls="mobile-toc-panel"
                    >
                        {isTocOpen ? "Close" : "Contents"}
                        <span aria-hidden="true" className="relative h-3 w-4">
                            <span
                                className={[
                                    "absolute left-0 top-0 h-[2px] w-full rounded bg-slate-600 transition",
                                    isTocOpen
                                        ? "translate-y-[5px] rotate-45"
                                        : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            />
                            <span
                                className={[
                                    "absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 rounded bg-slate-600 transition",
                                    isTocOpen ? "opacity-0" : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            />
                            <span
                                className={[
                                    "absolute left-0 bottom-0 h-[2px] w-full rounded bg-slate-600 transition",
                                    isTocOpen
                                        ? "-translate-y-[5px] -rotate-45"
                                        : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            />
                        </span>
                    </button>
                </div>
            </div>
            <div
                id="mobile-toc-panel"
                aria-hidden={!isTocOpen}
                className={[
                    "overflow-hidden border-b border-slate-200 bg-white/95 backdrop-blur transition-[max-height,opacity] duration-300",
                    isTocOpen
                        ? "max-h-[60vh] opacity-100"
                        : "max-h-0 opacity-0 pointer-events-none",
                ]
                    .filter(Boolean)
                    .join(" ")}
            >
                <div className="mx-auto max-w-3xl px-6 sm:px-16">
                    <div className="max-h-[50vh] overflow-y-auto pb-4 pt-3 pr-2">
                        <Sidebar
                            sections={sections}
                            showTitle={false}
                            onNavigate={handleClose}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
