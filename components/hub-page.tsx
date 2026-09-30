import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/page-shell";
import DirectoryTable from "@/components/directory-table";
import { SITE_URL, DATA_UPDATED, findHub, type Hub } from "@/lib/hubs";
import { dofollowCount, directoryCount } from "@/lib/directories";

export function hubMetadata(slug: string): Metadata {
    const h = findHub(slug)!;
    return {
        title: { absolute: h.title },
        description: h.description,
        alternates: {
            canonical: `/${slug}`,
            types: { "text/markdown": `/${slug}.md` },
        },
        openGraph: {
            title: h.title,
            description: h.description,
            url: `${SITE_URL}/${slug}`,
            siteName: "Product Hunt Alternatives",
            type: "article",
            images: [{ url: "/og.png", width: 1200, height: 630 }],
        },
        twitter: {
            card: "summary_large_image",
            title: h.title,
            description: h.description,
            images: ["/og.png"],
        },
    };
}

/**
 * A submission order derived from the hub's own measured Domain Ratings.
 * Competing lists talk about "tiers" using copied DA figures; these are
 * computed from the rows on the page, so the counts always match the table.
 */
function submissionTiers(hub: Hub) {
    const tier = (min: number, max: number) =>
        hub.items.filter((d) => d.dr >= min && d.dr <= max);

    return [
        {
            name: "Start here",
            range: "DR 60 and above",
            items: tier(60, 100),
            advice:
                "Highest authority and the slowest to review. Submit these first so the approval clock starts early, and write the description by hand.",
        },
        {
            name: "Then these",
            range: "DR 40 to 59",
            items: tier(40, 59),
            advice:
                "The best ratio of authority to effort. Most approve within a couple of weeks and several send real referral traffic, not just a link.",
        },
        {
            name: "Fill in with",
            range: "DR 20 to 39",
            items: tier(20, 39),
            advice:
                "Fast approvals and niche audiences. Worth doing in a batch once the tiers above are submitted, but they will not move rankings alone.",
        },
        {
            name: "Skip unless relevant",
            range: "Below DR 20",
            items: tier(0, 19),
            advice:
                "Low authority. Only submit where the audience genuinely matches your product, otherwise the time is better spent elsewhere.",
        },
    ].filter((t) => t.items.length > 0);
}

function hubFaq(hub: Hub) {
    const dofollow = hub.items.filter((d) => d.dofollow === true).length;
    const free = hub.items.filter((d) => d.pricing === "Free").length;
    const top = hub.items[0];
    const label = hub.h1.replace(/^\d+\s+/, "").toLowerCase();

    return [
        {
            q: `How many ${label} are there?`,
            a: `This list tracks ${hub.items.length}, each verified to return a live response. ${dofollow} of them give dofollow links that pass authority to your site; the rest are nofollow or unverified.`,
        },
        {
            q: `Which has the highest Domain Rating?`,
            a: top
                ? `${top.name} (${top.domain}) at Domain Rating ${top.dr}. Domain Rating here is measured through DataForSEO on a 0-100 scale rather than copied from other directory lists, which tend to republish stale and inflated figures.`
                : `No entries are currently listed.`,
        },
        {
            q: `Should I submit to all of them?`,
            a: `No. Submitting to every directory on a list is the exact pattern search engines learned to discount. Pick the ones genuinely relevant to your product, start with the highest Domain Rating dofollow entries, and write a unique description for each.`,
        },
        {
            q: `Are these free to submit to?`,
            a: free > 0
                ? `${free} are marked free to submit. Many others accept free listings but charge for faster review or a featured slot, and some require a badge on your site in exchange for a free listing.`
                : `Pricing varies. Many accept free listings but charge for faster review or a featured slot; check each directory's submission page.`,
        },
    ];
}

function HubJsonLd({ hub }: { hub: Hub }) {
    const graph = [
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
                    name: hub.h1,
                    item: `${SITE_URL}/${hub.slug}`,
                },
            ],
        },
        {
            "@type": "CollectionPage",
            "@id": `${SITE_URL}/${hub.slug}#webpage`,
            url: `${SITE_URL}/${hub.slug}`,
            name: hub.h1,
            description: hub.description,
            datePublished: DATA_UPDATED,
            dateModified: DATA_UPDATED,
            publisher: { "@id": `${SITE_URL}/#org` },
            isPartOf: { "@id": `${SITE_URL}/#website` },
        },
        {
            "@type": "ItemList",
            name: hub.h1,
            description: hub.description,
            numberOfItems: hub.items.length,
            itemListElement: hub.items.slice(0, 100).map((d, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: d.name,
                url: d.url,
            })),
        },
        {
            "@type": "FAQPage",
            mainEntity: hubFaq(hub).map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
        },
        {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: SITE_URL,
            name: "Product Hunt Alternatives",
            publisher: { "@id": `${SITE_URL}/#org` },
        },
        {
            "@type": "Dataset",
            name: "Product Hunt Alternatives directory database",
            description:
                "Directories, launch platforms, and communities that accept product submissions, with measured Domain Rating and dofollow status.",
            url: `${SITE_URL}/directory-submission-sites`,
            license: "https://creativecommons.org/licenses/by/4.0/",
            isAccessibleForFree: true,
            creator: { "@id": `${SITE_URL}/#org` },
            dateModified: DATA_UPDATED,
            distribution: [
                {
                    "@type": "DataDownload",
                    encodingFormat: "application/json",
                    contentUrl: `${SITE_URL}/directories.json`,
                },
                {
                    "@type": "DataDownload",
                    encodingFormat: "text/markdown",
                    contentUrl: `${SITE_URL}/${hub.slug}.md`,
                },
            ],
        },
    ];

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
            }}
        />
    );
}

export default function HubPage({ slug }: { slug: string }) {
    const hub = findHub(slug)!;
    const dofollow = hub.items.filter((d) => d.dofollow === true).length;
    const topDr = hub.items[0]?.dr ?? 0;

    return (
        <PageShell
            currentHub={slug}
            trail={[{ name: "Home", href: "/" }, { name: hub.h1 }]}
        >
            <HubJsonLd hub={hub} />
            <header className="space-y-4">
                <h1 className="font-serif text-3xl font-semibold leading-9 tracking-tight text-black">
                    {hub.h1}
                </h1>
                <p className="text-lg leading-8 text-zinc-600">
                    {hub.description}
                </p>
                <dl className="grid grid-cols-3 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
                    <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-500">
                            Listed
                        </dt>
                        <dd className="font-mono text-lg font-semibold text-slate-900">
                            {hub.items.length}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-500">
                            Dofollow
                        </dt>
                        <dd className="font-mono text-lg font-semibold text-slate-900">
                            {dofollow}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs uppercase tracking-wide text-slate-500">
                            Highest DR
                        </dt>
                        <dd className="font-mono text-lg font-semibold text-slate-900">
                            {topDr}
                        </dd>
                    </div>
                </dl>
            </header>

            <section className="space-y-4">
                {hub.intro.map((p) => (
                    <p key={p.slice(0, 40)} className="text-base leading-7 text-zinc-700">
                        {p}
                    </p>
                ))}
            </section>

            <section className="space-y-4">
                <h2 className="font-serif text-2xl font-semibold tracking-tight text-black">
                    All {hub.items.length}, ranked by Domain Rating
                </h2>
                <DirectoryTable items={hub.items} />
            </section>

            <section className="space-y-4">
                <h2 className="font-serif text-2xl font-semibold tracking-tight text-black">
                    What order to submit in
                </h2>
                <p className="text-base leading-7 text-zinc-700">
                    Submitting alphabetically wastes the approval window. The
                    high-authority directories take the longest to review, so
                    they should go out first. These bands are computed from the
                    measured Domain Ratings of the {hub.items.length} entries on
                    this page.
                </p>
                <ol className="space-y-4">
                    {submissionTiers(hub).map((tier) => (
                        <li
                            key={tier.range}
                            className="rounded-lg border border-slate-200 p-4"
                        >
                            <div className="flex flex-wrap items-baseline gap-2">
                                <span className="font-semibold text-slate-900">
                                    {tier.name}
                                </span>
                                <span className="font-mono text-xs text-slate-500">
                                    {tier.range}
                                </span>
                                <span className="text-xs text-slate-500">
                                    {tier.items.length} listed ·{" "}
                                    {
                                        tier.items.filter(
                                            (d) => d.dofollow === true,
                                        ).length
                                    }{" "}
                                    dofollow
                                </span>
                            </div>
                            <p className="mt-2 text-base leading-7 text-zinc-700">
                                {tier.advice}
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                                Top of this band:{" "}
                                {tier.items.slice(0, 4).map((d, i) => (
                                    <span key={d.id}>
                                        {i > 0 && ", "}
                                        <Link
                                            href={`/directory/${d.id}`}
                                            className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                                        >
                                            {d.name}
                                        </Link>
                                    </span>
                                ))}
                            </p>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="space-y-4">
                <h2 className="font-serif text-2xl font-semibold tracking-tight text-black">
                    Common questions
                </h2>
                <dl className="space-y-4">
                    {hubFaq(hub).map((item) => (
                        <div key={item.q} className="space-y-1">
                            <dt className="text-base font-semibold text-slate-900">
                                {item.q}
                            </dt>
                            <dd className="text-base leading-7 text-zinc-700">
                                {item.a}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section className="space-y-3">
                <h2 className="font-serif text-2xl font-semibold tracking-tight text-black">
                    How this list is maintained
                </h2>
                <p className="text-base leading-7 text-zinc-700">
                    Every URL here was requested directly and returned a live
                    response; entries that had gone dead were removed rather
                    than carried over. Domain Rating is measured through
                    DataForSEO on a 0&ndash;100 scale, not copied from other
                    directory lists. Republished DR figures tend to run stale and
                    high. Link type reflects what the directory used
                    at the time of checking and can change without notice. The{" "}
                    <Link
                        href="/methodology"
                        className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                    >
                        full methodology
                    </Link>{" "}
                    walks through every step.
                </p>
                <p className="text-base leading-7 text-zinc-700">
                    The full database covers{" "}
                    <Link
                        href="/directory-submission-sites"
                        className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                    >
                        {directoryCount} directory submission sites
                    </Link>
                    , {dofollowCount} of them dofollow. If you are starting from
                    scratch, the{" "}
                    <Link
                        href="/"
                        className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                    >
                        curated Product Hunt alternatives guide
                    </Link>{" "}
                    explains which channels to use in what order. The whole
                    database is also available as{" "}
                    <a
                        href="/directories.json"
                        className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                    >
                        JSON
                    </a>{" "}
                    and as{" "}
                    <a
                        href={`/${slug}.md`}
                        className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                    >
                        Markdown
                    </a>
                    .
                </p>
            </section>
        </PageShell>
    );
}
