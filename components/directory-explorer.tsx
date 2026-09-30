"use client";

import Link from "next/link";
import { useState } from "react";
import Favicon from "@/components/favicon";
import type { Directory } from "@/lib/directories";
import { categoryMeta } from "@/lib/directory-categories";

/**
 * Every filtered row is rendered; PAGE_SIZE only controls how many are visible.
 * All 505 links therefore sit in the HTML for crawlers regardless of this value.
 */
const PAGE_SIZE = 24;

export default function DirectoryExplorer({ items }: { items: Directory[] }) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [linkType, setLinkType] = useState("all");
    const [sort, setSort] = useState("picks");
    const [limit, setLimit] = useState(PAGE_SIZE);
    const results = items.filter((item) =>
        (category === "all" || item.category === category) &&
        (linkType === "all" || item.dofollow === (linkType === "dofollow")) &&
        `${item.name} ${item.domain} ${item.description ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()),
    );
    if (sort === "dr") results.sort((a, b) => b.dr - a.dr || a.name.localeCompare(b.name));
    if (sort === "name") results.sort((a, b) => a.name.localeCompare(b.name));
    function reset() { setQuery(""); setCategory("all"); setLinkType("all"); setSort("picks"); setLimit(PAGE_SIZE); }
    return (
        <div>
            <div className="explorer-toolbar">
                <label className="search-field"><span aria-hidden="true">⌕</span><span className="sr-only">Search directories</span><input type="search" placeholder="Search by name, audience, or tool…" value={query} onChange={(event) => { setQuery(event.target.value); setLimit(PAGE_SIZE); }} /></label>
                <label><span className="sr-only">Filter by category</span><select value={category} onChange={(event) => { setCategory(event.target.value); setLimit(PAGE_SIZE); }}><option value="all">All platforms ({items.length})</option>{Object.entries(categoryMeta).map(([value, meta]) => <option key={value} value={value}>{value === "software" ? "SaaS & software" : meta.plural} ({items.filter((item) => item.category === value).length})</option>)}</select></label>
                <label><span className="sr-only">Filter by link type</span><select value={linkType} onChange={(event) => { setLinkType(event.target.value); setLimit(PAGE_SIZE); }}><option value="all">All link types</option><option value="dofollow">Dofollow</option><option value="nofollow">Nofollow</option></select></label>
                <label><span className="sr-only">Sort directories</span><select value={sort} onChange={(event) => { setSort(event.target.value); setLimit(PAGE_SIZE); }}><option value="picks">Curated first</option><option value="dr">Highest DR</option><option value="name">Name A–Z</option></select></label>
            </div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
                <p role="status">Showing {Math.min(limit, results.length)} of {results.length} platforms</p>
                <p>DR = Domain Rating</p>
            </div>
            <ul className="directory-list">
                {results.map((item, index) => <li className="directory-row" key={item.id} hidden={index >= limit}>
                    <Favicon directory={item} size={24} />
                    <div className="directory-row-body">
                        <div className="directory-row-heading">
                            <h3><Link href={`/directory/${item.id}`}>{item.name}</Link></h3>
                            <span className="metric-badge">DR {item.dr}</span>
                            <span className="directory-meta">{categoryMeta[item.category].label} · {item.dofollow === null ? "Link unverified" : item.dofollow ? "Dofollow" : "Nofollow"}</span>
                        </div>
                        <p className="directory-description">{item.description || `Explore ${item.name}, a ${categoryMeta[item.category].labelLower}, and check its listing details before submitting your product.`}</p>
                    </div>
                    <Link className="directory-details" href={`/directory/${item.id}`}>Details <span aria-hidden="true">→</span></Link>
                </li>)}
            </ul>
            {results.length === 0 && <div className="empty-results"><h3>No platforms match these filters.</h3><p>Try a broader search or explore another category.</p><button className="button-secondary mt-4" onClick={reset}>Reset filters</button></div>}
            {results.length > limit && <div className="mt-8 text-center"><button className="button-secondary" onClick={() => setLimit(limit + PAGE_SIZE)}>Show more platforms <span aria-hidden="true">↓</span></button></div>}
            <p className="mt-5 text-center text-sm"><Link href="/directory-submission-sites" className="text-link">View the complete directory comparison →</Link></p>
        </div>
    );
}
