import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/page-shell";
import { directoryCount, dofollowCount } from "@/lib/directories";
import { SITE_URL, DATA_YEAR } from "@/lib/hubs";
import { submissionUrl } from "@/lib/submission";
import {
    submissionServices,
    serviceCount,
    cheapestPaid,
    perListing,
    manualCount,
    unreachableCount,
    CHECKED,
    CRITERION_WEIGHTS,
    criteriaScore,
    type CriterionScore,
    type SubmissionService,
} from "@/lib/submission-services";
// Written by scripts/generate-service-screenshots.mjs; empty until it runs, so
// the build never depends on the capture having happened.
import serviceScreenshots from "@/lib/service-screenshots.json";

const title = `Best Directory Submission Services: ${serviceCount} Compared (${DATA_YEAR})`;
const description = `${serviceCount} directory submission services compared on price, volume, turnaround and whether a human does the work. Prices read at source, ${CHECKED}.`;

export const metadata: Metadata = {
    title: { absolute: title },
    description,
    alternates: {
        canonical: "/directory-submission-services",
        types: { "text/markdown": "/directory-submission-services.md" },
    },
    openGraph: {
        title,
        description,
        url: `${SITE_URL}/directory-submission-services`,
        siteName: "Product Hunt Alternatives",
        type: "article",
        // Next replaces rather than merges openGraph, so the image must be
        // repeated here or this page ships without one.
        images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/og.png"],
    },
};

/** Highest published price in the market, from ListingBott's final cohort. */
const PRICE_CEILING = 999;

const P = ({ children }: { children: React.ReactNode }) => (
    <p className="max-w-[68ch] text-base leading-7 text-zinc-700">{children}</p>
);

/** Page-level landmark: a rule, a heading, and the section's own content. */
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
        <section
            id={id}
            className="scroll-mt-24 space-y-5 border-t border-slate-200 pt-10"
        >
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-black">
                {heading}
            </h2>
            {children}
        </section>
    );
}

/** White panel on the page's grey ground — used for every table and card. */
function Card({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}
        >
            {children}
        </div>
    );
}

/** Horizontally scrollable table frame, so wide tables never stretch the page. */
function TableCard({ children }: { children: React.ReactNode }) {
    return (
        <Card>
            <div className="overflow-x-auto">{children}</div>
        </Card>
    );
}

const TH = ({
    children,
    align = "left",
}: {
    children: React.ReactNode;
    align?: "left" | "center";
}) => (
    <th
        scope="col"
        className={`whitespace-nowrap px-3 py-2.5 font-medium ${
            align === "center" ? "text-center" : "text-left"
        }`}
    >
        {children}
    </th>
);

const CRITERIA = [
    {
        name: "A human fills the forms",
        detail: "Directory forms differ from each other, and the ones worth being on are moderated by people who can tell a templated submission from a real one. Automation gets volume; hands get accepted.",
    },
    {
        name: "One published price",
        detail: "A price on a page you can read before you talk to anyone, one-time rather than renewing, and not dependent on a promo countdown.",
    },
    {
        name: "A report that names the listings",
        detail: "A link or a screenshot per submission. Without it you are buying a number, and a number is the one thing that is trivial to inflate.",
    },
    {
        name: "A published turnaround",
        detail: "Any stated delivery window at all. Several services here quote none, and the ones that do range from 48 hours to five weeks.",
    },
    {
        name: "No promises about metrics it does not control",
        detail: "Domain Rating is Ahrefs' number, recalculated from the entire web's link graph on their schedule. A service can guarantee submissions. It cannot guarantee DR.",
    },
];

const CRITERIA_COLUMNS: {
    key: keyof SubmissionService["meets"];
    label: string;
}[] = [
    { key: "manual", label: "By hand" },
    { key: "price", label: "Fixed price" },
    { key: "report", label: "Report" },
    { key: "turnaround", label: "Turnaround" },
    { key: "noMetricPromise", label: "No DR promise" },
];

const ICONS = {
    star: "M11.48 3.5a.58.58 0 0 1 1.04 0l2.12 4.3 4.75.69c.47.07.65.65.31.98l-3.43 3.35.81 4.73c.08.47-.41.82-.83.6L12 15.91l-4.25 2.24c-.42.22-.91-.13-.83-.6l.81-4.73-3.43-3.35a.58.58 0 0 1 .31-.98l4.75-.69 2.12-4.3Z",
    camera: "M6.76 6.5 7.6 4.82A1.5 1.5 0 0 1 8.94 4h6.12a1.5 1.5 0 0 1 1.34.82l.84 1.68H19A2.5 2.5 0 0 1 21.5 9v8a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 17V9A2.5 2.5 0 0 1 5 6.5h1.76Z",
    bolt: "M13.4 2.5 4.9 13.3a.5.5 0 0 0 .39.81h5.04l-.73 7.06a.5.5 0 0 0 .89.36l8.6-10.84a.5.5 0 0 0-.39-.81h-5.05l.72-6.99a.5.5 0 0 0-.89-.39Z",
    tag: "M11.59 3.5H4.5a1 1 0 0 0-1 1v7.09a1 1 0 0 0 .29.7l8.41 8.42a1 1 0 0 0 1.42 0l7.09-7.09a1 1 0 0 0 0-1.42L12.3 3.8a1 1 0 0 0-.71-.3Z",
} as const;

function VerdictIcon({ name }: { name: keyof typeof ICONS }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d={ICONS[name]} />
            {name === "camera" && <circle cx="12" cy="12.75" r="3.25" />}
            {name === "tag" && <circle cx="7.75" cy="7.75" r="1.35" />}
        </svg>
    );
}

/**
 * The four picks a reader actually came for, above everything else. Each one
 * links to the full entry rather than restating it.
 */
const VERDICT = [
    {
        label: "Best overall",
        icon: "star" as const,
        name: "LaunchDirectories",
        id: "launchdirectories",
        price: "$99–$199",
        why: "The only fully manual service with a tier under $169, a published 4–6 business day turnaround, and a report naming what went live.",
        ours: true,
    },
    {
        label: "Best proof",
        icon: "camera" as const,
        name: "List My Site",
        id: "list-my-site",
        price: "$169",
        why: "A live screenshot sheet you watch fill up from day one, instead of a report that arrives at the end.",
    },
    {
        label: "Fastest",
        icon: "bolt" as const,
        name: "SubmitSaaS",
        id: "submitsaas",
        price: "$100",
        why: "100+ listings inside 48 hours. Automated with a human review step, so acceptance depends on a process you cannot see.",
    },
    {
        label: "Free",
        icon: "tag" as const,
        name: "Do it yourself",
        id: "diy",
        price: "$0",
        why: "The directory list is the valuable part and it is free on this site. Budget 20 to 40 hours.",
    },
];

const SCENARIOS = [
    {
        situation: "First launch, no budget",
        pick: "Do it yourself",
        id: "diy",
        why: "The list is the valuable part and it is free here. Work down the dofollow directories by Domain Rating and stop when the returns thin out.",
    },
    {
        situation: "You want hands on the forms without overspending",
        pick: "LaunchDirectories Starter, $99",
        id: "launchdirectories",
        why: "The only fully manual service here with a real tier below $169, so a small product does not have to buy 100 listings to get started.",
    },
    {
        situation: "Your product is an AI tool",
        pick: "AI Directories",
        id: "ai-directories",
        why: "A specialist directory set beats a general one, and the upper tiers absorb the directories' own listing fees.",
    },
    {
        situation: "You need listings live within 48 hours",
        pick: "SubmitSaaS, $100",
        id: "submitsaas",
        why: "The 48-hour window is written into what it guarantees. Everything fully manual here takes days to weeks.",
    },
    {
        situation: "You want the most listings per dollar",
        pick: "BacklinkBot done-for-you, $99",
        id: "backlinkbot",
        why: "Roughly $1 per claimed listing, and it is the only service that publishes its own dofollow and DR counts.",
    },
    {
        situation: "You want money attached to the outcome",
        pick: "ListingBott",
        id: "listingbott",
        why: "The one DR claim here with a stated remedy. You pay three to five times the going rate per listing and wait up to five weeks for it.",
    },
    {
        situation: "You run submissions for many clients",
        pick: "GetMoreBacklinks or the BacklinkBot agent",
        id: "getmorebacklinks",
        why: "Proof screenshots and audits bundled per client, or a monthly seat covering several sites. Check GetMoreBacklinks is taking orders first.",
    },
    {
        situation: "You care about AI answers, not link volume",
        pick: "Orbator Launch",
        id: "orbator-launch",
        why: "Ten sources it measures as AI-cited, rather than a hundred listings. It will not do much for a new domain's link profile.",
    },
];

const NOT_INCLUDED = [
    {
        name: "The directories' own fees",
        detail: "Plenty of directories charge for a listing or for faster review, and most services pass that straight to you. AI Directories is the exception here, folding roughly $59 to $173 of listing fees into its upper tiers — which is why its headline price is not comparable with the others.",
    },
    {
        name: "Your own time",
        detail: "Someone has to write the description, pick the category, and supply the logo and screenshots before any service can submit anything. Budget an hour or two, and expect follow-up emails from directories that want changes.",
    },
    {
        name: "Approval",
        detail: "A submission is not a listing. Moderated directories reject incomplete or templated entries, and no service here guarantees acceptance — only that the form was filled. The report is what tells you which ones went live.",
    },
    {
        name: "Indexing",
        detail: "A live listing does nothing for you until a search engine crawls it. ListingBott puts that at up to two months after submission, which is the most honest number anyone in this market publishes about it.",
    },
];

const RED_FLAGS = [
    {
        flag: "A guaranteed DR number with nothing behind it",
        detail: "A figure with no refund or rework attached is a marketing line, not a commitment. Compare SubmitSaaS, which prints DR targets per tier, with ListingBott, which prints one and attaches a remedy.",
    },
    {
        flag: "No directory list before you pay",
        detail: "If a seller will not show you where your listings are going, assume the answer is link farms. Ask for the list and check a sample against a dataset you trust.",
    },
    {
        flag: "Volume that no moderated directory set can absorb",
        detail: "Offers of 500 or 1,000 submissions are counting sites nobody reads. Search engines learned to discount that pattern years ago, and the listings can be worth less than nothing.",
    },
    {
        flag: "A price that only exists behind a countdown",
        detail: "Rotating promos and cohort-staged pricing are normal in this market, but a price you can only get in the next eleven minutes is a sales tactic, not a discount.",
    },
    {
        flag: "A report that is a number rather than links",
        detail: "\"100 submissions completed\" is unverifiable. A list of URLs, or screenshots per listing, is what you are actually buying.",
    },
    {
        flag: "A site that does not load",
        detail: "This is not hypothetical: one service still recommended by other comparisons has a domain that no longer resolves. Load the site and read the pricing page yourself before sending money.",
    },
];

const FAQ = [
    {
        q: "What is the best directory submission service in 2026?",
        a: `On the five criteria on this page — manual submission, a published one-time price, a report naming the listings, a published turnaround, and no guarantees about metrics nobody controls — LaunchDirectories comes out first, at $99 to $199, with the whole run published at 4–6 business days. It is run by the same people as this site, so weigh that. If you want the most listings per dollar instead, BacklinkBot and SubmitSaaS are near $1 per claimed listing; if you want a refund-backed outcome and can wait five weeks, ListingBott is the one that puts money behind its claim.`,
    },
    {
        q: "How much does directory submission cost?",
        a: `Published prices across these ${serviceCount} options run from $${cheapestPaid} to $999, with most one-time packages for roughly 100 listings landing between $99 and $299. That works out at about $1 to $4 per listing. Doing it yourself costs nothing but 20 to 40 hours, and some directories charge their own listing fee on top of whatever the service costs.`,
    },
    {
        q: "Is a done-for-you submission service worth it?",
        a: "It is worth it if your time is worth more than about $4 an hour and you were genuinely going to do the submissions anyway. What you are buying is 20 to 40 hours back, not a ranking. Submit to the first ten directories yourself before you buy: an hour of that tells you whether the remaining ninety are worth paying for, and it tells you more about the state of the directory market than any roundup can.",
    },
    {
        q: "Do directory backlinks still work for SEO?",
        a: `Relevant, moderated, dofollow directories still pass authority, and for a new domain with almost no links they are one of the few link sources available without outreach. Bulk submission to anything that will accept you does not work and has not for years. Of the ${directoryCount} directories tracked on this site, ${dofollowCount} give dofollow links; prioritising those and skipping the rest is the whole strategy.`,
    },
    {
        q: "Should I trust a service that guarantees a Domain Rating increase?",
        a: "Treat it as marketing rather than as a deliverable. Domain Rating is a third-party metric owned by Ahrefs and recalculated from the whole web's link graph, so no submission service controls it, and a new domain's DR moves on links that have nothing to do with your listings. ListingBott is the one service here that attaches a remedy — continued work or a refund — which is more than a bare claim. SubmitSaaS advertises DR figures per tier without one.",
    },
    {
        q: "Manual or automated submission?",
        a: "Manual, if the directories are moderated — and the ones with any authority are. Automation is why SubmitSaaS can deliver 100+ listings in 48 hours for $100, and the trade-off is that acceptance depends on a review step you cannot see. The fully manual services cost roughly twice as much per listing and take days rather than hours.",
    },
    {
        q: "How many directories should I submit to?",
        a: "Start with the 20 to 30 that are genuinely relevant to your product and give dofollow links, which is what most of the $99 tiers cover. Beyond about 100, you are into directories nobody reads and search engines discount. Volume is the easiest thing for a service to sell and the least useful thing to buy.",
    },
    {
        q: "Can I just do it myself?",
        a: `Yes, and the expensive part is free: the ${directoryCount}-directory database on this site is live-checked, carries a measured Domain Rating per domain, marks dofollow status, and downloads as JSON. The services are selling the hours, not the list.`,
    },
];

function MethodBadge({ method }: { method: SubmissionService["method"] }) {
    const tone =
        method === "Manual"
            ? "border-green-200 bg-green-50 text-green-800"
            : method === "You"
              ? "border-blue-200 bg-blue-50 text-blue-800"
              : "border-slate-200 bg-slate-50 text-slate-600";
    return (
        <span
            className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${tone}`}
        >
            {method}
        </span>
    );
}

/**
 * A glyph rather than a word, so a twelve-row matrix reads as a shape. The
 * word stays in the DOM for screen readers and for the Markdown mirror.
 */
function Mark({ score, label }: { score: CriterionScore; label: string }) {
    const map = {
        yes: {
            glyph: "✓",
            word: "Yes",
            cls: "border-green-200 bg-green-50 text-green-700",
        },
        partial: {
            glyph: "~",
            word: "Partly",
            cls: "border-amber-200 bg-amber-50 text-amber-700",
        },
        no: {
            glyph: "×",
            word: "No",
            cls: "border-slate-200 bg-slate-50 text-slate-400",
        },
    } as const;
    const m = map[score];
    return (
        <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${m.cls}`}
            title={`${label}: ${m.word}`}
        >
            <span className="sr-only">
                {label}: {m.word}
            </span>
            <span aria-hidden="true">{m.glyph}</span>
        </span>
    );
}

function SourceNote({ service }: { service: SubmissionService }) {
    if (service.sourced === "vendor") return null;
    return (
        <span className="whitespace-nowrap rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
            {service.sourced === "unreachable"
                ? "Site unreachable at last check"
                : "Price not confirmed at source"}
        </span>
    );
}

/** Sections in page order, for the "on this page" bar under the header. */
const TOC = [
    { id: "criteria", label: "How these were judged" },
    { id: "comparison", label: "At a glance" },
    { id: "manual-vs-automated", label: "Manual vs automated" },
    { id: "ranked", label: "The services, ranked" },
    { id: "which", label: "Which one fits" },
    { id: "per-listing", label: "Cost per listing" },
    { id: "not-included", label: "What the price excludes" },
    { id: "ai-answers", label: "AI answers" },
    { id: "before-you-buy", label: "Before you pay" },
    { id: "red-flags", label: "Red flags" },
    { id: "faq", label: "Questions" },
    { id: "maintenance", label: "Methodology" },
];
export default function SubmissionServicesPage() {
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
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: SITE_URL,
                name: "Product Hunt Alternatives",
                publisher: { "@id": `${SITE_URL}/#org` },
            },
            {
                "@type": "ItemList",
                name: title,
                description,
                numberOfItems: serviceCount,
                itemListElement: submissionServices.map((s, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    name: s.name,
                    url: s.url.startsWith("/") ? `${SITE_URL}${s.url}` : s.url,
                })),
            },
            {
                "@type": "Article",
                "@id": `${SITE_URL}/directory-submission-services#webpage`,
                url: `${SITE_URL}/directory-submission-services`,
                headline: title,
                description,
                datePublished: CHECKED,
                dateModified: CHECKED,
                publisher: { "@id": `${SITE_URL}/#org` },
                isPartOf: { "@id": `${SITE_URL}/#website` },
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
                        name: "Directory submission services",
                        item: `${SITE_URL}/directory-submission-services`,
                    },
                ],
            },
            {
                "@type": "FAQPage",
                mainEntity: FAQ.map((item) => ({
                    "@type": "Question",
                    name: item.q,
                    acceptedAnswer: { "@type": "Answer", text: item.a },
                })),
            },
        ],
    };

    return (
        <PageShell
            trail={[
                { name: "Home", href: "/" },
                { name: "Directory submission services" },
            ]}
        >
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <header className="space-y-5">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                    Buyer&rsquo;s guide &middot; updated{" "}
                    <time dateTime={CHECKED}>{CHECKED}</time>
                </p>
                <h1 className="font-serif text-3xl font-semibold leading-9 tracking-tight text-black">
                    Best directory submission services, {serviceCount} compared
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-zinc-600">
                    What each one charges, how many directories it claims, how
                    long it takes, and whether a human actually fills the forms.
                    Every price below was read from the vendor&rsquo;s own page
                    on <time dateTime={CHECKED}>{CHECKED}</time>.
                </p>
            </header>

            <section aria-labelledby="verdict-heading">
                <Card className="border-t-[3px] border-t-[var(--brand)]">
                    <h2
                        id="verdict-heading"
                        className="border-b border-slate-100 bg-slate-50/70 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                        The short answer
                    </h2>
                    <dl className="divide-y divide-slate-100">
                        {VERDICT.map((v) => (
                            <div
                                key={v.id}
                                className="gap-x-5 px-5 py-4 sm:flex sm:items-start"
                            >
                                <dt className="flex shrink-0 items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:w-44">
                                    <span
                                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                            v.ours
                                                ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        <VerdictIcon name={v.icon} />
                                    </span>
                                    {v.label}
                                </dt>
                                <dd className="min-w-0 sm:flex-1">
                                    <p className="flex flex-wrap items-baseline gap-x-2">
                                        <a
                                            href={`#${v.id}`}
                                            className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:text-blue-700"
                                        >
                                            {v.name}
                                        </a>
                                        <span className="font-mono text-sm font-semibold tabular-nums text-slate-900">
                                            {v.price}
                                        </span>
                                    </p>
                                    <p className="mt-1 max-w-[62ch] text-sm leading-6 text-zinc-700">
                                        {v.why}
                                    </p>
                                    {v.ours && (
                                        <a
                                            href={submissionUrl(
                                                "services_verdict",
                                            )}
                                            target="_blank"
                                            rel="noopener"
                                            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-hover)]"
                                        >
                                            See packages &amp; pricing
                                            <span aria-hidden="true">
                                                &rarr;
                                            </span>
                                        </a>
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </Card>
            </section>

                <dl className="flex flex-wrap gap-x-10 gap-y-4 border-y border-slate-200 py-4">
                    {[
                        { t: "Compared", v: String(serviceCount) },
                        { t: "Fully manual", v: String(manualCount) },
                        {
                            t: "Price range",
                            v: `$${cheapestPaid}–$${PRICE_CEILING}`,
                        },
                        { t: "Per listing", v: "$1–$4" },
                    ].map((s) => (
                        <div key={s.t}>
                            <dt className="text-xs uppercase tracking-wider text-slate-500">
                                {s.t}
                            </dt>
                            <dd className="mt-0.5 font-mono text-lg font-semibold tabular-nums text-slate-900">
                                {s.v}
                            </dd>
                        </div>
                    ))}
                </dl>


            <nav aria-label="On this page">
                <ul
                    role="list"
                    className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-500"
                >
                    {TOC.map((item) => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                className="underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-900"
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <section className="space-y-4">
                <P>
                    Directory submission is repetitive work that someone has to
                    do: a hundred forms, a hundred confirmation emails, a
                    hundred slightly different descriptions of the same
                    product. A market has grown up around selling those hours
                    back to you, at anything from $10 on Fiverr to $999 for a
                    managed run, and the roundups comparing that market tend to
                    be written by people selling into it.
                </P>
                <div className="max-w-[72ch] border-l-2 border-[var(--brand)] pl-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Disclosure
                    </p>
                    <p className="mt-2 text-base leading-7 text-zinc-700">
                        This one is too, so here it is up front:{" "}
                        <strong className="text-slate-900">
                            LaunchDirectories, which ranks first below, is run
                            by the same people as this site
                        </strong>
                        , and it pays for the free {directoryCount}-directory
                        database here. The criteria it is judged against are
                        stated before the ranking rather than after it, every
                        competitor&rsquo;s price comes from their own pricing
                        page, and where a service could not be verified the row
                        says so &mdash; {unreachableCount} of the{" "}
                        {serviceCount} entries carry that flag, including one
                        whose domain no longer resolves and which other
                        comparisons still recommend.
                    </p>
                </div>
            </section>

            <Section id="criteria" heading="How these were judged">
                <P>
                    Volume is the easiest thing to sell and the least useful
                    thing to compare, because a claimed directory count costs
                    nothing to inflate. These five criteria are what separates a
                    service that does the work from one that reports having done
                    it, in the order they are weighted.
                </P>
                <ol role="list" className="max-w-[72ch] space-y-5">
                        {CRITERIA.map((c, i) => (
                            <li key={c.name} className="flex gap-4">
                                <span
                                    aria-hidden="true"
                                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 font-mono text-xs font-semibold text-white"
                                >
                                    {i + 1}
                                </span>
                                <div className="min-w-0">
                                    <p className="font-semibold text-slate-900">
                                        {c.name}
                                    </p>
                                    <p className="mt-1.5 text-base leading-7 text-zinc-700">
                                        {c.detail}
                                    </p>
                                </div>
                            </li>
                        ))}
                </ol>
                <P>
                    Scored across all {serviceCount} options, this is what each
                    one <em>publishes</em>. &ldquo;No&rdquo; means we could not
                    find it stated anywhere on their site on {CHECKED}, which is
                    the only thing you can check before paying rather than
                    after.
                </P>
                <TableCard>
                    <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <tr>
                                <TH>Service</TH>
                                {CRITERIA_COLUMNS.map((c) => (
                                    <TH key={c.key} align="center">
                                        {c.label}
                                    </TH>
                                ))}
                                <TH align="center">Score</TH>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {submissionServices.map((s) => (
                                <tr
                                    key={s.id}
                                    className={`transition-colors ${
                                        s.id === "launchdirectories"
                                            ? "bg-[var(--brand-soft)]"
                                            : "hover:bg-slate-50"
                                    }`}
                                >
                                    <th
                                        scope="row"
                                        className="whitespace-nowrap px-3 py-2.5 text-left font-medium"
                                    >
                                        <a
                                            href={`#${s.id}`}
                                            className="text-slate-900 underline decoration-slate-300 underline-offset-4 hover:text-blue-700"
                                        >
                                            {s.name}
                                        </a>
                                    </th>
                                    {CRITERIA_COLUMNS.map((c) => (
                                        <td
                                            key={c.key}
                                            className="px-3 py-2.5 text-center"
                                        >
                                            <Mark
                                                score={s.meets[c.key]}
                                                label={c.label}
                                            />
                                        </td>
                                    ))}
                                    <td className="px-3 py-2.5 text-center font-mono text-sm font-semibold tabular-nums text-slate-900">
                                        {criteriaScore(s)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableCard>
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                        <span
                            aria-hidden="true"
                            className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-green-200 bg-green-50 text-[10px] font-semibold text-green-700"
                        >
                            ✓
                        </span>
                        published
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span
                            aria-hidden="true"
                            className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-[10px] font-semibold text-amber-700"
                        >
                            ~
                        </span>
                        partly
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <span
                            aria-hidden="true"
                            className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-400"
                        >
                            ×
                        </span>
                        not stated anywhere on their site
                    </span>
                </p>
                <div className="max-w-[68ch] border-l-2 border-slate-200 pl-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        How the score is calculated
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                        Out of 100, from the five criteria only. A full mark
                        scores the weight, a partial scores half, a miss scores
                        nothing.
                    </p>
                    <ul
                        role="list"
                        className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-700"
                    >
                        {CRITERION_WEIGHTS.map((c) => (
                            <li key={c.key}>
                                {c.label}{" "}
                                <span className="font-mono font-semibold tabular-nums text-slate-900">
                                    {c.weight}
                                </span>
                            </li>
                        ))}
                    </ul>
<p className="mt-3 text-sm leading-6 text-zinc-700">
                        The score measures only what a vendor publishes; the
                        ranking also weighs whether those figures could be
                        confirmed at source and how long the run takes, which
                        is why GetMoreBacklinks scores{" "}
                        {criteriaScore(
                            submissionServices.find(
                                (x) => x.id === "getmorebacklinks",
                            )!,
                        )}{" "}
                        and still ranks eighth.
                    </p>
                </div>
                <P>
                    Three clear all five: LaunchDirectories, List My Site, and
                    doing it yourself. LaunchDirectories takes the top spot on
                    two things the matrix cannot show &mdash; 4&ndash;6
                    business days against about ten, and three standing tiers
                    against a single $169 package.
                </P>
            </Section>

            <Section
                id="comparison"
                heading={`All ${serviceCount} at a glance`}
            >
                <TableCard>
                    <table className="w-full min-w-[46rem] table-fixed border-collapse text-left text-[13px]">
                        <colgroup>
                            <col className="w-10" />
                            <col className="w-[22%]" />
                            <col className="w-[20%]" />
                            <col className="w-[21%]" />
                            <col className="w-[15%]" />
                            <col className="w-[18%]" />
                        </colgroup>
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <tr>
                                <TH>#</TH>
                                <TH>Service</TH>
                                <TH>Price</TH>
                                <TH>Directories</TH>
                                <TH>Turnaround</TH>
                                <TH>Method</TH>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {submissionServices.map((s, i) => (
                                <tr
                                    key={s.id}
                                    className={`align-top transition-colors ${
                                        s.id === "launchdirectories"
                                            ? "bg-[var(--brand-soft)]"
                                            : "hover:bg-slate-50"
                                    }`}
                                >
                                    <td className="px-3 py-3 font-mono text-xs tabular-nums text-slate-400">
                                        {i + 1}
                                    </td>
                                    <td className="px-3 py-3">
                                        <a
                                            href={`#${s.id}`}
                                            className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:text-blue-700"
                                        >
                                            {s.name}
                                        </a>
                                        {s.id === "launchdirectories" && (
                                            <span className="ml-2 rounded-full bg-[var(--brand)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                                                Best
                                            </span>
                                        )}
                                        <span className="mt-0.5 block truncate text-xs text-slate-500">
                                            {s.domain}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 text-slate-700">
                                        {s.price}
                                    </td>
                                    <td className="px-3 py-3 text-slate-700">
                                        {s.volume}
                                    </td>
                                    <td className="px-3 py-3 text-slate-700">
                                        {s.turnaround}
                                    </td>
                                    <td className="px-3 py-3">
                                        <MethodBadge method={s.method} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableCard>
                <p className="text-sm leading-6 text-slate-500">
                    Directory counts are what each service claims, not counts
                    this site has verified. Promotional prices move; the figures
                    are as published on {CHECKED}.
                </p>
            </Section>

            <Section
                id="manual-vs-automated"
                heading="Manual, automated, or hybrid"
            >
                <P>
                    This is the choice that decides most of the others, and it
                    is the one the price is really tracking. {manualCount} of
                    the {serviceCount} options here are fully manual; the rest
                    run a tool over the forms, with or without someone checking
                    the output.
                </P>
                <Card>
                    <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
                        <div className="bg-white p-5">
                            <p className="font-semibold text-slate-900">
                                A person fills the forms
                            </p>
                            <p className="mt-1 font-mono text-sm tabular-nums text-slate-500">
                                ~$1.70–$2.00 per listing · days to weeks
                            </p>
                            <ul
                                role="list"
                                className="mt-3 space-y-1.5 text-sm leading-6 text-zinc-700"
                            >
                                <li>
                                    Gets through moderation, because the
                                    directories worth being on are reviewed by
                                    people who can tell a templated entry from
                                    a real one.
                                </li>
                                <li>
                                    Category and description can be adapted per
                                    directory rather than pasted.
                                </li>
                                <li>
                                    Costs roughly twice as much per listing and
                                    takes days rather than hours.
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white p-5">
                            <p className="font-semibold text-slate-900">
                                A tool fills the forms
                            </p>
                            <p className="mt-1 font-mono text-sm tabular-nums text-slate-500">
                                ~$1.00 per listing · hours to days
                            </p>
                            <ul
                                role="list"
                                className="mt-3 space-y-1.5 text-sm leading-6 text-zinc-700"
                            >
                                <li>
                                    Volume and speed: SubmitSaaS delivers 100+
                                    submissions inside 48 hours for $100, which
                                    nothing manual here comes close to.
                                </li>
                                <li>
                                    Acceptance depends on a review step you
                                    cannot see, so the submission count and the
                                    live-listing count can diverge.
                                </li>
                                <li>
                                    The report matters more, not less: it is
                                    the only thing separating a hundred
                                    submissions from a hundred listings.
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
                <P>
                    The honest rule is that automation is fine for the long
                    tail and poor for the directories you actually want. If you
                    are buying 100 listings, the first 30 are worth a human and
                    the last 70 mostly are not &mdash; which is the argument
                    for a cheap automated run plus doing the top of the list
                    yourself, and the reason the tiered services exist.
                </P>
            </Section>

            <Section id="ranked" heading="The services, ranked">
                <P>
                    Each entry below gives what the service charges, what it
                    does for the money, and what it does not do. Links go to
                    the vendor&rsquo;s own pricing page where one exists.
                </P>
                <div className="space-y-5">
                    {submissionServices.map((s, i) => {
                        const hasShot = (
                            serviceScreenshots as string[]
                        ).includes(s.id);
                        const top = s.id === "launchdirectories";
                        return (
                            <article
                                key={s.id}
                                id={s.id}
                                className={
                                    top
                                        ? "scroll-mt-24 rounded-xl border border-[var(--brand-border)] border-t-[3px] border-t-[var(--brand)] bg-[var(--brand-soft)] p-6"
                                        : "scroll-mt-24 border-t border-slate-200 pt-8"
                                }
                            >
                                {top && (
                                    <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
                                        <span
                                            aria-hidden="true"
                                            className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand)] text-white"
                                        >
                                            <VerdictIcon name="star" />
                                        </span>
                                        Best overall
                                    </p>
                                )}
                                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                    {!top && (
                                        <span
                                            aria-hidden="true"
                                            className="font-mono text-sm tabular-nums text-slate-400"
                                        >
                                            {i + 1}
                                        </span>
                                    )}
                                    <h3 className="font-serif text-xl font-semibold tracking-tight text-black">
                                        {s.name}
                                    </h3>
                                    <span className="font-mono text-sm font-semibold text-slate-900">
                                        {s.price}
                                    </span>
                                    <MethodBadge method={s.method} />
                                    <SourceNote service={s} />
                                </div>
                                <p className="mt-1.5 text-sm text-slate-500">
                                    {s.volume} &middot; {s.turnaround} &middot;{" "}
                                    {s.guarantee} &middot;{" "}
                                    <span className="tabular-nums">
                                        {criteriaScore(s)}/100 on the criteria
                                    </span>
                                </p>

                                <div className="mt-4 flex flex-col gap-6 sm:flex-row">
                                    <div className="min-w-0 flex-1 space-y-3">
                                        {s.notes.map((n) => (
                                            <p
                                                key={n.slice(0, 40)}
                                                className="text-base leading-7 text-zinc-700"
                                            >
                                                {n}
                                            </p>
                                        ))}
                                    </div>
                                    {hasShot && (
                                        <a
                                            href={s.url}
                                            target="_blank"
                                            rel="noopener noreferrer nofollow"
                                            tabIndex={-1}
                                            aria-hidden="true"
                                            className="block w-full shrink-0 self-start overflow-hidden rounded-md border border-slate-200 sm:order-last sm:w-56"
                                        >
                                            <Image
                                                src={`/screenshots/services/${s.id}.webp`}
                                                alt={`Screenshot of the ${s.name} pricing page, captured ${CHECKED}`}
                                                width={640}
                                                height={400}
                                                unoptimized
                                                className="block h-auto w-full"
                                            />
                                        </a>
                                    )}
                                </div>

                                <div className="mt-5 grid gap-x-10 gap-y-4 sm:grid-cols-2">
                                    {s.strengths.length > 0 && (
                                        <ul
                                            role="list"
                                            className="space-y-1.5 text-sm leading-6 text-zinc-700"
                                        >
                                            {s.strengths.map((x) => (
                                                <li key={x} className="flex gap-2">
                                                    <span
                                                        aria-hidden="true"
                                                        className="shrink-0 font-semibold text-green-600"
                                                    >
                                                        +
                                                    </span>
                                                    <span>{x}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <ul
                                        role="list"
                                        className="space-y-1.5 text-sm leading-6 text-zinc-700"
                                    >
                                        {s.limits.map((x) => (
                                            <li key={x} className="flex gap-2">
                                                <span
                                                    aria-hidden="true"
                                                    className="shrink-0 font-semibold text-slate-400"
                                                >
                                                    &minus;
                                                </span>
                                                <span>{x}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
                                    {s.id === "launchdirectories" ? (
                                        <a
                                            href={submissionUrl("services_roundup")}
                                            target="_blank"
                                            rel="noopener"
                                            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-hover)]"
                                        >
                                            See packages &amp; pricing
                                            <span aria-hidden="true">&rarr;</span>
                                        </a>
                                    ) : s.url.startsWith("/") ? (
                                        <Link
                                            href={s.url}
                                            className="text-sm text-blue-600 underline underline-offset-2 hover:text-blue-800"
                                        >
                                            Browse the free directory database
                                        </Link>
                                    ) : (
                                        <a
                                            href={s.url}
                                            target="_blank"
                                            rel="noopener noreferrer nofollow"
                                            className="text-sm text-blue-600 underline underline-offset-2 hover:text-blue-800"
                                        >
                                            {s.sourced === "unreachable"
                                                ? `Where this entry's figures come from`
                                                : `Visit ${s.domain}`}
                                        </a>
                                    )}
                                    <p className="text-sm text-slate-500">
                                        Best for:{" "}
                                        <span className="text-zinc-700">
                                            {s.bestFor}
                                        </span>
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </Section>

            <Section id="which" heading="Which one fits your situation">
                <P>
                    The ranking above answers &ldquo;which is best&rdquo;. This
                    answers the more useful question, which is what to buy given
                    what you actually have &mdash; a budget, a deadline, or a
                    product that needs a particular kind of directory.
                </P>
                <ul role="list" className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
                    {SCENARIOS.map((sc) => (
                        <li key={sc.situation} className="flex flex-col">
                            <p className="font-semibold text-slate-900">
                                {sc.situation}
                            </p>
                            <p className="mt-3 text-base leading-7 text-zinc-700">
                                {sc.why}
                            </p>
                            <div className="mt-auto pt-3">
                                <p className="text-sm">
                                    <span className="text-slate-500">
                                        Pick:
                                    </span>{" "}
                                    <a
                                        href={`#${sc.id}`}
                                        className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-800"
                                    >
                                        {sc.pick}
                                    </a>
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section id="per-listing" heading="What you actually pay per listing">
                <P>
                    Headline prices are not comparable across services, because
                    the tiers cover different volumes. This is each
                    service&rsquo;s roughly-100-listing tier divided by the
                    listings it claims &mdash; the only like-for-like number on
                    this page, and the one place where the ranking above does
                    not match the ordering.
                </P>
                <TableCard>
                    <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <tr>
                                <TH>Service</TH>
                                <TH>Tier</TH>
                                <TH>Claimed listings</TH>
                                <TH>Each</TH>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {perListing.map((row) => (
                                <tr
                                    key={row.id}
                                    className="transition-colors hover:bg-slate-50"
                                >
                                    <td className="px-3 py-2.5">
                                        <a
                                            href={`#${row.id}`}
                                            className="text-slate-900 underline decoration-slate-300 underline-offset-4 hover:text-blue-700"
                                        >
                                            {row.name}
                                        </a>
                                    </td>
                                    <td className="px-3 py-2.5 font-mono tabular-nums text-slate-700">
                                        ${row.price}
                                    </td>
                                    <td className="px-3 py-2.5 font-mono tabular-nums text-slate-700">
                                        {row.count}+
                                    </td>
                                    <td className="px-3 py-2.5 font-mono font-semibold tabular-nums text-slate-900">
                                        ${row.each.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </TableCard>
                <P>
                    Cost per listing is a rate, not a verdict. The two cheapest
                    rows get there with automation or a subscription, and a
                    listing on a directory nobody reads is poor value at any
                    price. Use this to spot which services are charging three
                    or four times the going rate, not to pick a winner.
                </P>
            </Section>

            <Section
                id="not-included"
                heading="What the price does not include"
            >
                <P>
                    Every quote on this page covers the same narrow thing:
                    somebody filling in forms. Four costs sit outside it, and
                    they are the reason a $99 package and a $499 one can end up
                    closer in practice than the headline suggests.
                </P>
                <dl className="max-w-[72ch] space-y-5">
                        {NOT_INCLUDED.map((item) => (
                            <div key={item.name}>
                                <dt className="text-base font-semibold text-slate-900">
                                    {item.name}
                                </dt>
                                <dd className="mt-1.5 text-base leading-7 text-zinc-700">
                                    {item.detail}
                                </dd>
                            </div>
                        ))}
                </dl>
            </Section>

            <Section
                id="ai-answers"
                heading="Do directory listings help you show up in AI answers?"
            >
                <P>
                    Partly, and not in the way the marketing around it
                    suggests. When ChatGPT, Perplexity or Google&rsquo;s AI
                    answers are asked for &ldquo;the best X tools&rdquo;, they
                    lean on pages that already list and compare tools in that
                    category &mdash; which is exactly what a directory page is.
                    A listing on a directory that gets cited puts your product
                    inside the source the model is reading.
                </P>
                <P>
                    That is the real mechanism, and it has three consequences
                    worth pricing in. Relevance beats volume by more than it
                    does for ordinary SEO, because a model pulling an answer
                    about AI writing tools is not reading a general business
                    directory. The directory has to be crawlable, and a listing
                    behind a login or rendered only in JavaScript does nothing.
                    And it is slow: the listing has to be live, crawled, and
                    then picked up, which is months rather than weeks.
                </P>
                <P>
                    One service here sells this directly &mdash;{" "}
                    <a
                        href="#orbator-launch"
                        className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                    >
                        Orbator Launch
                    </a>{" "}
                    targets ten sources it measures as AI-cited rather than a
                    hundred listings, which is a defensible trade if AI
                    visibility is what you are buying and a poor one if you
                    need links. Treat any guaranteed number of AI mentions the
                    same way as a guaranteed Domain Rating: nobody controls the
                    model&rsquo;s output, and a promise about it is a marketing
                    line rather than a deliverable.
                </P>
            </Section>

            <Section
                id="before-you-buy"
                heading="Three things worth knowing before you pay anyone"
            >
                <div className="max-w-[72ch] space-y-5">
                        <div>
                            <p className="font-semibold text-slate-900">
                                Nobody can guarantee you a Domain Rating.
                            </p>
                            <p className="mt-1.5 text-base leading-7 text-zinc-700">
                                Two services on this page advertise DR outcomes.
                                DR is Ahrefs&rsquo; metric, computed from the
                                entire web&rsquo;s link graph and recalculated
                                on their schedule, which means it moves for
                                reasons that have nothing to do with your
                                submissions. A service can guarantee how many
                                forms it fills and what the report shows. Hold
                                it to that.
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">
                                The directory list is the valuable part, and it
                                is free.
                            </p>
                            <p className="mt-1.5 text-base leading-7 text-zinc-700">
                                What separates a good run from a wasted one is
                                which {directoryCount} sites you pick and which{" "}
                                {dofollowCount} of them actually pass authority
                                &mdash; and{" "}
                                <Link
                                    href="/directory-submission-sites"
                                    className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                                >
                                    that data sits on this site at no cost
                                </Link>
                                , live-checked, with a Domain Rating measured
                                per domain. Before buying any package, ask the
                                seller for their list and check a sample against
                                it.
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">
                                Do the first ten yourself.
                            </p>
                            <p className="mt-1.5 text-base leading-7 text-zinc-700">
                                An hour of filling forms tells you what no
                                roundup can: how long each one really takes,
                                which directories are still moderated, and
                                whether paying $199 for the remaining ninety is
                                a bargain or a waste. Start with{" "}
                                <Link
                                    href="/backlink-directories"
                                    className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                                >
                                    the dofollow list
                                </Link>{" "}
                                and work down by Domain Rating.
                            </p>
                        </div>
                    </div>
            </Section>

            <Section
                id="red-flags"
                heading="How to spot a service worth avoiding"
            >
                <P>
                    This market has a low floor. These six things are checkable
                    in the few minutes before you pay, and every one of them
                    appears somewhere in the {serviceCount} options above.
                </P>
                <ul role="list" className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                    {RED_FLAGS.map((item) => (
                        <li
                            key={item.flag}
                            className="border-l-2 border-amber-300 pl-4"
                        >
                            <p className="font-semibold text-slate-900">
                                {item.flag}
                            </p>
                            <p className="mt-2 text-base leading-7 text-zinc-700">
                                {item.detail}
                            </p>
                        </li>
                    ))}
                </ul>
            </Section>

            <Section id="faq" heading="Common questions">
                <div className="max-w-[72ch]">
                    {FAQ.map((item) => (
                        <details
                            key={item.q}
                            className="group border-b border-slate-200"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-3.5 text-base font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                                {item.q}
                                <span
                                    aria-hidden="true"
                                    className="shrink-0 text-lg font-normal text-slate-400 transition-transform group-open:rotate-45"
                                >
                                    +
                                </span>
                            </summary>
                            <p className="pb-4 text-base leading-7 text-zinc-700">
                                {item.a}
                            </p>
                        </details>
                    ))}
                </div>
            </Section>

            <Section id="maintenance" heading="How this comparison is maintained">
                <P>
                    Every price, tier, directory claim, turnaround and guarantee
                    on this page was read from the vendor&rsquo;s own site on{" "}
                    <time dateTime={CHECKED}>{CHECKED}</time>, not copied from
                    another roundup. {unreachableCount} entries could not be
                    verified that way and are labelled in place rather than
                    quietly presented as checked: one domain did not resolve,
                    one product page returned a 404, one site returned a server
                    error, and one is a marketplace rather than a single
                    service.
                </P>
                <P>
                    Promotional pricing in this market rotates constantly and
                    several of these services stage prices by cohort, so treat
                    every figure as true on the date above and confirm it at
                    checkout. The same approach applies to the directory data
                    itself, which has its own{" "}
                    <Link
                        href="/methodology"
                        className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                    >
                        written methodology
                    </Link>
                    . If a price here is wrong,{" "}
                    <a
                        href="https://github.com/krasun/producthuntalternatives/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                    >
                        open an issue
                    </a>{" "}
                    and it will be corrected on the next pass.
                </P>
            </Section>
        </PageShell>
    );
}
