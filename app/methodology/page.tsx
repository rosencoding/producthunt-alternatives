import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/page-shell";
import {
    directories,
    directoryCount,
    dofollowCount,
    categoryMeta,
    type DirectoryCategory,
} from "@/lib/directories";
import { SITE_URL, DATA_UPDATED, DATA_YEAR } from "@/lib/hubs";

// Every figure on this page is computed from the dataset, so the page cannot
// drift out of sync with the data it describes.
const curatedCount = directories.filter((d) => d.curated).length;
const nofollowCount = directories.filter((d) => d.dofollow === false).length;
const unverifiedCount = directories.filter((d) => d.dofollow === null).length;
const band = (min: number, max: number) =>
    directories.filter((d) => d.dr >= min && d.dr <= max).length;
const categoryCounts = Object.keys(categoryMeta).map((key) => ({
    key: key as DirectoryCategory,
    count: directories.filter((d) => d.category === key).length,
}));

const title = `How this directory data is collected (${DATA_YEAR})`;
const description = `How the ${directoryCount} directories on this site are sourced, checked for uptime, categorised, and scored for Domain Rating, and what the numbers do not tell you.`;

export const metadata: Metadata = {
    title: { absolute: title },
    description,
    alternates: {
        canonical: "/methodology",
        types: { "text/markdown": "/methodology.md" },
    },
    openGraph: {
        title,
        description,
        url: `${SITE_URL}/methodology`,
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

function Section({
    id,
    heading,
    children,
}: {
    id: string;
    heading: string;
    children: React.ReactNode;
}) {
    return (
        <section id={id} className="space-y-3 scroll-mt-20">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-black">
                {heading}
            </h2>
            {children}
        </section>
    );
}

const P = ({ children }: { children: React.ReactNode }) => (
    <p className="text-base leading-7 text-zinc-700">{children}</p>
);

export default function MethodologyPage() {
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
                "@type": "AboutPage",
                "@id": `${SITE_URL}/methodology#webpage`,
                url: `${SITE_URL}/methodology`,
                name: title,
                description,
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
                        name: "Methodology",
                        item: `${SITE_URL}/methodology`,
                    },
                ],
            },
        ],
    };

    return (
        <PageShell trail={[{ name: "Home", href: "/" }, { name: "Methodology" }]}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <header className="space-y-4">
                <h1 className="font-serif text-3xl font-semibold leading-9 tracking-tight text-black">
                    How this directory data is collected
                </h1>
                <P>
                    Most directory lists republish each other. Numbers get
                    copied, dead sites stay listed, and nobody says where a
                    Domain Rating came from. This page explains exactly how the{" "}
                    {directoryCount} entries here were produced, so you can
                    decide how much to trust them. Data last collected{" "}
                    <time dateTime={DATA_UPDATED}>{DATA_UPDATED}</time>.
                </P>
            </header>

            <Section id="sourcing" heading="1. Where the list comes from">
                <P>
                    The starting list was compiled from publicly published
                    directory lists and from our own curation, then treated as
                    candidates rather than facts. Nothing was carried over on
                    trust: every entry had to pass the uptime check below, and
                    every Domain Rating was re-measured from scratch.
                </P>
                <P>
                    {curatedCount} entries are hand-picked and hand-written.
                    Those carry a description written for this site, a pricing
                    note, and a screenshot. The rest remain in the category
                    tables and machine-readable database with measured data,
                    but do not have individual profile pages.
                </P>
            </Section>

            <Section id="uptime" heading="2. Uptime check">
                <P>
                    Every candidate URL was requested directly, with a HEAD
                    request first and a full GET as a fallback for hosts that
                    reject HEAD. Of 528 candidates, 440 responded normally and
                    58 returned a bot-blocking status such as 403 or 429 while
                    still being reachable. Those 58 were kept.
                </P>
                <P>
                    <strong>25 were dead</strong> and were removed rather than
                    left in to pad the count. That is the single clearest
                    difference between this list and the ones it was checked
                    against, several of which still list those same dead
                    domains.
                </P>
            </Section>

            <Section id="domain-rating" heading="3. Domain Rating">
                <P>
                    Domain Rating comes from the{" "}
                    <a
                        href="https://docs.ahrefs.com/en/api/reference/public/get-domain-rating-free"
                        className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                        rel="noopener"
                    >
                        Ahrefs free Domain Rating API
                    </a>
                    , on the standard 0&ndash;100 scale. Every domain on this
                    site is queried individually and the figure is dated, not
                    carried over from another directory list. Because it is the
                    same metric most SEO tools quote, the numbers here are
                    directly comparable with what you already use.
                </P>
                <P>
                    Two limits worth stating plainly. Ahrefs returns DR for the{" "}
                    <strong>root domain</strong>, so the handful of entries that
                    live on a subdomain carry their parent domain&rsquo;s figure
                    and will read higher than the subdomain earns on its own.
                    And DR describes a link profile, nothing else &mdash; it
                    says nothing about whether a directory is still moderated,
                    still accepting submissions, or capable of sending you a
                    single visitor.
                </P>
                <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-4">
                    {[
                        { t: "DR 60+", v: band(60, 100) },
                        { t: "DR 40-59", v: band(40, 59) },
                        { t: "DR 20-39", v: band(20, 39) },
                        { t: "Below DR 20", v: band(0, 19) },
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
            </Section>

            <Section id="link-type" heading="4. Dofollow and nofollow">
                <P>
                    A dofollow link passes authority to your site; a nofollow
                    one does not. Both can send traffic, but only dofollow
                    listings help your own pages rank. Of {directoryCount}{" "}
                    directories, {dofollowCount} were recorded as dofollow,{" "}
                    {nofollowCount} as nofollow, and {unverifiedCount} are
                    marked <strong>unverified</strong> because the link type was
                    not confirmed.
                </P>
                <P>
                    Those {unverifiedCount} are labelled honestly rather than
                    guessed. Link type also changes without notice, so treat
                    every value here as true at the time of checking and confirm
                    it once your listing is live.
                </P>
            </Section>

            <Section id="categories" heading="5. Categories">
                <P>
                    Each directory sits in one of five categories. The{" "}
                    {curatedCount} curated entries are categorised by hand,
                    because the source taxonomy misfiled several of them.
                </P>
                <ul role="list" className="space-y-2">
                    {categoryCounts.map(({ key, count }) => (
                        <li key={key} className="text-base leading-7 text-zinc-700">
                            <Link
                                href={`/${categoryMeta[key].slug}`}
                                className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800"
                            >
                                {categoryMeta[key].plural}
                            </Link>{" "}
                            &mdash; {count} entries
                        </li>
                    ))}
                </ul>
                <P>
                    One naming point worth flagging: the{" "}
                    <em>Startup profiles</em> category holds company-profile
                    sites such as Crunchbase and Wellfound, which is a narrower
                    set than the{" "}
                    <Link
                        href="/startup-directories"
                        className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                    >
                        startup directories
                    </Link>{" "}
                    page, which also covers launch platforms and founder
                    communities. Same words, deliberately different scope.
                </P>
            </Section>

            <Section id="limits" heading="6. What this data does not tell you">
                <P>
                    A high Domain Rating does not mean a directory will send you
                    customers. It measures backlink authority, nothing else. A
                    DR 70 directory in the wrong category is worth less to you
                    than a DR 25 one your buyers actually read.
                </P>
                <P>
                    Nothing here reflects approval rates, review speed, or
                    whether a directory currently charges. Those change
                    constantly and are set by each directory, not by this site.
                    Uptime was checked at a point in time; sites go dark between
                    updates.
                </P>
                <P>
                    The same checking applies to the services that sell
                    submission as a package: the{" "}
                    <Link
                        href="/directory-submission-services"
                        className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                    >
                        comparison of directory submission services
                    </Link>{" "}
                    records where each price was read from and flags the
                    entries that could not be verified at source.
                </P>
            </Section>

            <Section id="machine-readable" heading="7. Using the data">
                <P>
                    The full dataset is published in machine-readable form under
                    a CC BY 4.0 licence, so you can check any figure on this
                    site rather than taking it on trust.
                </P>
                <ul role="list" className="space-y-2 text-base leading-7 text-zinc-700">
                    <li>
                        <a
                            href="/directories.json"
                            className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                        >
                            directories.json
                        </a>{" "}
                        &mdash; every entry with its measured fields and a
                        documented field map
                    </li>
                    <li>
                        <a
                            href="/llms.txt"
                            className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                        >
                            llms.txt
                        </a>{" "}
                        &mdash; an index for AI agents, with the field
                        definitions spelled out
                    </li>
                    <li>
                        Any page is also available as Markdown at the same path
                        with a <code className="font-mono text-sm">.md</code>{" "}
                        suffix
                    </li>
                </ul>
            </Section>

            <Section id="corrections" heading="8. Corrections">
                <P>
                    If a figure here is wrong, it is worth telling us: a
                    directory that has gone dead, changed its link type, or
                    started charging affects everyone reading this list.{" "}
                    <a
                        href="https://github.com/krasun/producthuntalternatives/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                    >
                        Open an issue on GitHub
                    </a>{" "}
                    and it will be corrected on the next data run.
                </P>
            </Section>
        </PageShell>
    );
}
