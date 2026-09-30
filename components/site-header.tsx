"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Brand from "@/components/brand";
import { submissionUrl } from "@/lib/submission";

const links = [
    ["/directory-submission-sites", "All directories"],
    ["/launch-platforms", "Launch platforms"],
    ["/ai-tool-directories", "AI tools"],
    ["/saas-directories", "SaaS"],
    ["/startup-directories", "Startups"],
    ["/startup-communities", "Communities"],
    ["/backlink-directories", "Dofollow links"],
];

export default function SiteHeader({ current }: { current?: string }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    return (
        <header className="site-nav">
            <a className="skip-link" href="#main-content">Skip to content</a>
            <div className="site-container flex min-h-14 items-center justify-between gap-4">
                <Brand />
                <nav aria-label="Primary" className="hidden items-center gap-6 text-xs lg:flex">
                    <Link href="/directory-submission-sites" aria-current={current === "directory-submission-sites" ? "page" : undefined}>Explore directories</Link>
                    <Link href="/launch-platforms" aria-current={current === "launch-platforms" ? "page" : undefined}>Launch platforms</Link>
                    <Link href="/#launch-guide">Launch guide</Link>
                </nav>
                <div className="flex items-center gap-2">
                    <a href={submissionUrl("navbar")} className="button-primary nav-cta">Get listed on 100+ directories <span aria-hidden="true">↗</span></a>
                    <button type="button" className="menu-toggle lg:hidden" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
                </div>
            </div>
            {open && <nav id="mobile-navigation" aria-label="Mobile navigation" className="site-container grid gap-1 border-t border-neutral-200 py-4 lg:hidden" onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus(); } }}>
                {links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className="rounded-lg px-3 py-2.5 text-sm hover:bg-neutral-100" onClick={() => setOpen(false)}>{label}</Link>)}
                <Link href="/#launch-guide" className="px-3 py-2.5 text-sm" onClick={() => setOpen(false)}>Launch guide</Link>
            </nav>}
        </header>
    );
}
