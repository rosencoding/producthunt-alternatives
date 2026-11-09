import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/page-shell";
import DirectoryTable from "@/components/directory-table";
import { DrBadge, LinkTypeBadge, PricingBadge } from "@/components/badges";
import Favicon from "@/components/favicon";
import {
    categoryMeta,
    detailDirectories,
    directoryCount,
    findDirectory,
    similarDirectories,
} from "@/lib/directories";
import {
    describeDirectory,
    directoryFacts,
    relatedHubLinks,
} from "@/lib/directory-copy";
import { displayName } from "@/lib/directories";
import { DATA_YEAR, DATA_UPDATED, SITE_URL, hubForCategory } from "@/lib/hubs";

type Params = { id: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
    return detailDirectories.map((d) => ({ id: d.id }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { id } = await params;
    const d = findDirectory(id);
    if (!d) return {};

    const label = displayName(d);
    const suffix = ` Alternatives & Submission Guide (DR ${d.dr}, ${DATA_YEAR})`;
    // Long scraped names would blow past the ~60 char SERP cut-off.
    const short = ` Alternatives (DR ${d.dr}, ${DATA_YEAR})`;
    const title =
        label.length + suffix.length <= 62
            ? `${label}${suffix}`
            : label.length + short.length <= 62
              ? `${label}${short}`
              : `${d.name}${short}`;
    const linkNote =
        d.dofollow === true
            ? "dofollow"
            : d.dofollow === false
              ? "nofollow"
              : "link type unverified";
    const full = `${label} (${d.domain}): DR ${d.dr}, ${linkNote}. How to submit, what a listing is worth, and the closest alternatives.`;
    const description =
        full.length <= 160
            ? full
            : `${d.name}: DR ${d.dr}, ${linkNote}. How to submit and the closest alternatives.`;

    return {
        title: { absolute: title },
        description,
        alternates: {
            canonical: `/directory/${d.id}`,
            types: { "text/markdown": `/directory/${d.id}.md` },
        },
        openGraph: {
            title,
            description,
            url: `${SITE_URL}/directory/${d.id}`,
            siteName: "Product Hunt Alternatives",
            type: "article",
            images: [{ url: "/og.png", width: 1200, height: 630 }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/og.png"],
        },
    };
}

export default async function DirectoryPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { id } = await params;
    const d = findDirectory(id)!;
    const facts = directoryFacts(d);
    const cat = categoryMeta[d.category];
    const hub = relatedHubLinks(d);
    const alternatives = similarDirectories(d, 12);
    const categoryHub = hubForCategory(d.category);
    const body = d.description
        ? [d.description, ...describeDirectory(d, facts).slice(1)]
        : describeDirectory(d, facts);

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${SITE_URL}/#org`,
                name: "Product Hunt Alternatives",
                url: SITE_URL,
                logo: `${SITE_URL}/logo.svg`,
                sameAs: [
                    "https://github.com/krasun/producthuntalternatives",
                    "https://launchdirectories.com",
                ],
            },
            {
                "@type": "WebPage",
                "@id": `${SITE_URL}/directory/${d.id}#webpage`,
                url: `${SITE_URL}/directory/${d.id}`,
                name: `${displayName(d)} review, Domain Rating and alternatives`,
                datePublished: DATA_UPDATED,
                dateModified: DATA_UPDATED,
                publisher: { "@id": `${SITE_URL}/#org` },
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Product Hunt Alternatives",
                        item: SITE_URL,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: cat.plural,
                        item: `${SITE_URL}${hub.categoryHref}`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: d.name,
                        item: `${SITE_URL}/directory/${d.id}`,
                    },
                ],
            },
            {
                "@type": "WebSite",
                name: d.name,
                url: d.url,
                description: body[0],
            },
            {
                "@type": "ItemList",
                name: `Alternatives to ${d.name}`,
                numberOfItems: alternatives.length,
                itemListElement: alternatives.map((o, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    name: o.name,
                    url: o.curated ? `${SITE_URL}/directory/${o.id}` : o.url,
                })),
            },
        ],
    };

    return (
        <PageShell
            currentHub={cat.slug}
            trail={[
                { name: "Home", href: "/" },
                { name: cat.plural, href: hub.categoryHref },
                { name: d.name },
            ]}
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <header className="space-y-4">
                <div className="flex items-start gap-3">
                    <Favicon directory={d} size={40} />
                    <h1 className="font-serif text-3xl font-semibold leading-9 tracking-tight text-black">
                        {displayName(d)}: Submission Guide, Domain Rating
                        &amp; Alternatives
                    </h1>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <DrBadge dr={d.dr} />
                    <LinkTypeBadge dofollow={d.dofollow} />
                    {d.pricing && <PricingBadge pricing={d.pricing} />}
                    <Link
                        href={hub.categoryHref}
                        className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-800"
                    >
                        {cat.label}
                    </Link>
                </div>
                {d.curated && (
                    <a
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={-1}
                        className="block aspect-video max-w-md overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                    >
                        <Image
                            src={`/screenshots/${d.id}.webp`}
                            alt={`Screenshot of the ${d.name} homepage`}
                            width={640}
                            height={360}
                            unoptimized
                            className="h-full w-full object-cover"
                        />
                    </a>
                )}
            </header>

            <section className="space-y-4">
                {body.map((p) => (
                    <p
                        key={p.slice(0, 40)}
                        className="text-base leading-7 text-zinc-700"
                    >
                        {p}
                    </p>
                ))}
                <p>
                    <a
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        Visit {d.domain}
                    </a>
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="font-serif text-2xl font-semibold tracking-tight text-black">
                    At a glance
                </h2>
                <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-4">
                    {[
                        { t: "Domain Rating", v: `${d.dr}/100` },
                        {
                            t: "Overall rank",
                            v: `#${facts.overallRank} of ${directoryCount}`,
                        },
                        {
                            t: `In ${facts.peerSetName}`,
                            v: `#${facts.categoryRank} of ${facts.categorySize}`,
                        },
                        {
                            t: "Link type",
                            v:
                                d.dofollow === true
                                    ? "Dofollow"
                                    : d.dofollow === false
                                      ? "Nofollow"
                                      : "Unverified",
                        },
                    ].map((s) => (
                        <div key={s.t} className="bg-white p-3">
                            <dt className="text-xs uppercase tracking-wide text-slate-500">
                                {s.t}
                            </dt>
                            <dd className="font-mono text-sm font-semibold text-slate-900">
                                {s.v}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="space-y-3">
                <h2 className="font-serif text-2xl font-semibold tracking-tight text-black">
                    How to submit to {d.name}
                </h2>
                <ol className="list-decimal space-y-2 pl-5 text-base leading-7 text-zinc-700">
                    <li>
                        Open{" "}
                        <a
                            href={d.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                        >
                            {d.domain}
                        </a>{" "}
                        and look for the submit, add product, or get listed
                        link, usually in the header or footer.
                    </li>
                    <li>
                        Have your assets ready before you start: a one-line
                        pitch, a longer description, a logo, and two or three
                        screenshots. Most rejections are for incomplete
                        listings, not bad products.
                    </li>
                    <li>
                        Write the description for this directory specifically.
                        Pasting the same paragraph everywhere is the single
                        clearest signal of a low-effort submission, both to
                        moderators and to search engines.
                    </li>
                    <li>
                        {d.dofollow === true
                            ? `Because ${d.name} links out with dofollow, make sure the URL you submit is the page you actually want to rank, usually your homepage or the most relevant product page.`
                            : d.dofollow === false
                              ? `${d.name} uses nofollow links, so optimise for the click rather than the link: lead with the benefit, not the keyword.`
                              : `Check the listing source for rel="nofollow" once you are live, so you know whether the link is doing anything for your rankings.`}
                    </li>
                    <li>
                        Record where and when you submitted. Approval on
                        directories at this authority level can take days to
                        weeks, and you will want to follow up.
                    </li>
                </ol>
            </section>

            <section className="space-y-4">
                <h2 className="font-serif text-2xl font-semibold tracking-tight text-black">
                    {alternatives.length} alternatives to {d.name}
                </h2>
                <p className="text-base leading-7 text-zinc-700">
                    The closest matches by category and authority. Submitting to
                    several directories in the same tier usually beats chasing a
                    single high-DR listing, because approval is never
                    guaranteed.
                </p>
                <DirectoryTable items={alternatives} />
                <p className="text-base leading-7 text-zinc-700">
                    See all{" "}
                    <Link
                        href={hub.categoryHref}
                        className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                    >
                        {categoryHub?.items.length ?? facts.categorySize}{" "}
                        {hub.categoryLabel.toLowerCase()}
                    </Link>{" "}
                    or browse the{" "}
                    <Link
                        href="/directory-submission-sites"
                        className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                    >
                        full database of {directoryCount} directories
                    </Link>
                    .
                </p>
            </section>
        </PageShell>
    );
}
