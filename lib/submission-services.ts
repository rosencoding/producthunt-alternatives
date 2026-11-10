/**
 * Directory submission services compared on /directory-submission-services.
 *
 * Every price here was read off the vendor's own pricing page on the date in
 * CHECKED, not copied from another roundup. Where that was not possible the
 * entry carries `sourced: "third-party"` or `sourced: "unreachable"` and the
 * page says so in the row, because an unverified price presented as verified
 * is the exact failure mode this site exists to avoid.
 */

/** When every price and claim on this page was last read from the source. */
export const CHECKED = "2026-11-10";

export type SubmissionMethod =
    | "Manual"
    | "Automation + human review"
    | "AI research + manual"
    | "Automated agent"
    | "Freelancer"
    | "You";

/**
 * How each service scores against the five criteria the page states before the
 * ranking. These record what the vendor *publishes*, not what it privately
 * does: "no" means not published anywhere we could find it on the date in
 * CHECKED, which is the only thing a buyer can actually verify before paying.
 */
export type CriterionScore = "yes" | "partial" | "no";

export type CriteriaScores = {
    /** A person fills the forms, not a bulk tool. */
    manual: CriterionScore;
    /** One published price, one-time, not promo-dependent. */
    price: CriterionScore;
    /** A report or sheet naming the live listings. */
    report: CriterionScore;
    /** Any stated delivery window. */
    turnaround: CriterionScore;
    /** Makes no promise about Domain Rating or other third-party metrics. */
    noMetricPromise: CriterionScore;
};

export type SubmissionService = {
    id: string;
    name: string;
    domain: string;
    url: string;
    /** Short price string for the comparison table. */
    price: string;
    /** Lowest published entry price in USD, for the range stat. null = n/a. */
    priceFrom: number | null;
    /** The tier that gets you ~100 listings: [price, claimed count]. */
    hundredTier: { price: number; count: number } | null;
    /** Claimed directory volume, in the vendor's own words where possible. */
    volume: string;
    turnaround: string;
    method: SubmissionMethod;
    guarantee: string;
    bestFor: string;
    /** Where the pricing above came from. */
    sourced: "vendor" | "third-party" | "unreachable";
    /** Page to screenshot, when the tiers live somewhere other than `url`. */
    screenshotUrl?: string;
    /** Body copy. Each string is one paragraph. */
    notes: string[];
    meets: CriteriaScores;
    /** Short, factual, both directions. */
    strengths: string[];
    limits: string[];
};

/**
 * Ranked against the five criteria stated on the page, in this order:
 * human submission, one published price, a delivery report, a published
 * turnaround, and no guarantees about metrics the service does not control.
 */
export const submissionServices: SubmissionService[] = [
    {
        id: "launchdirectories",
        name: "LaunchDirectories",
        domain: "launchdirectories.com",
        url: "https://launchdirectories.com/pricing",
        price: "$99 / $149 / $199 one-time",
        priceFrom: 99,
        hundredTier: { price: 199, count: 100 },
        volume: "30+, 60+ or 100+ directories by tier",
        turnaround: "4–6 business days",
        method: "Manual",
        guarantee: "No metric guarantee claimed",
        bestFor: "Founders who want a human to fill the forms at a fixed price",
        sourced: "vendor",
        notes: [
            "Three one-time tiers, each a manual submission run: Starter at $99 for 30+ directories, Pro at $149 for 60+, and Premium at $199 for 100+. Every tier includes paid launches on selected partner directories and a submission report listing what went live. Its FAQ puts the whole process at 4–6 business days, the fastest of the fully manual services here that state a number at all.",
            "It leads this list on the criteria set out above rather than on volume: the price is published and one-time, submission is done by hand, the report names the listings, and it does not promise a Domain Rating figure it cannot control. Services that beat it on raw cost per listing do so by adding automation, a subscription, or a metric guarantee.",
        ],
        meets: {
            manual: "yes",
            price: "yes",
            report: "yes",
            turnaround: "yes",
            noMetricPromise: "yes",
        },
        strengths: [
            "Three standing tiers, so a small product need not buy 100 listings",
            "One-time price with no renewal",
            "Submission report naming the live listings",
        ],
        limits: [
            "No refund policy published on the pricing page, only a consent waiver of the 14-day withdrawal right",
            "Fewer listings per dollar than the automation-assisted services",
        ],
    },
    {
        id: "list-my-site",
        name: "List My Site",
        domain: "listmy.site",
        url: "https://listmy.site/",
        price: "$169 one-time; $99 limited offer for 60",
        priceFrom: 99,
        hundredTier: { price: 169, count: 100 },
        volume: "100+ submissions, or 60 on the banner offer",
        turnaround: "About 10 days, 7–10 submissions a day",
        method: "Manual",
        guarantee: "Money-back guarantee",
        bestFor: "Screenshot proof arriving as the work happens",
        sourced: "vendor",
        notes: [
            "A single $169 package, hand-submitted by the founder rather than run through a bulk tool, with directories picked by product category. The thing that sets it apart is the live Google tracking sheet from day one: submission status and screenshots appear as the work is done, instead of arriving as a report at the end.",
            "The standing package is the only one, but a banner offer of 60 submissions for $99 was running when this page was checked, which undercuts every comparable manual tier here. Treat it as a promotion rather than a tier: it may not be there when you arrive. The money-back guarantee is about the service rather than about a metric, which is a meaningfully different promise from guaranteeing a DR number.",
        ],
        meets: {
            manual: "yes",
            price: "yes",
            report: "yes",
            turnaround: "yes",
            noMetricPromise: "yes",
        },
        strengths: [
            "Cheapest standing fully manual 100+ package, with a money-back guarantee",
            "Live tracking sheet with screenshots from day one",
            "You keep ownership of the listings",
        ],
        limits: [
            "The $99 price is a rotating banner offer, not a standing tier",
            "Roughly 10 days, slower than the 48-hour services",
        ],
    },
    {
        id: "nick-launches",
        name: "Nick Launches",
        domain: "nicklaunches.com",
        url: "https://nicklaunches.com/",
        price: "$99–$199 one-time",
        priceFrom: 99,
        hundredTier: { price: 199, count: 100 },
        volume: "30+, 60+ or 100+ directories by tier",
        turnaround: "Starts within 48 hours, 7–14 days in full",
        method: "Manual",
        guarantee: "None published",
        bestFor: "A hand-submitted run with a dofollow-first directory pick",
        sourced: "third-party",
        notes: [
            "Hand submission across the same 30+/60+/100+ tier shape as LaunchDirectories, at $99–$199, starting within 48 hours and completing in 7 to 14 days, with a stated preference for directories that give dofollow links.",
            "Treat the pricing above as indicative: the site returned a server error when it was checked for this page on 10 November 2026, so these figures come from Orbator's published roundup rather than from the vendor. Confirm them before paying.",
        ],
        meets: {
            manual: "yes",
            price: "partial",
            report: "no",
            turnaround: "yes",
            noMetricPromise: "yes",
        },
        strengths: [
            "Tiered pricing, so a $99 entry point exists",
            "Dofollow-focused directory selection",
        ],
        limits: [
            "Site was returning a 500 error at the last check — prices unconfirmed at source",
            "No published guarantee or refund policy",
        ],
    },
    {
        id: "submitsaas",
        name: "SubmitSaaS",
        domain: "submitsaas.com",
        url: "https://submitsaas.com/",
        price: "$60 / $100 / $140 one-time",
        priceFrom: 60,
        hundredTier: { price: 100, count: 100 },
        volume: "60+, 100+ or 140+ submissions guaranteed",
        turnaround: "48 hours",
        method: "Automation + human review",
        guarantee: "Submission count, 48-hour delivery, and a DR increase claim",
        bestFor: "The most listings per dollar, fast",
        sourced: "vendor",
        screenshotUrl: "https://submitsaas.com/pricing",
        notes: [
            "The cheapest way to get volume on this page: $60 for 60+ listings, $100 for 100+, $140 for 140+, all delivered inside 48 hours with a tracking sheet. It is explicit that this is smart automation with human review rather than pure hand submission, which is how the price and the speed are possible.",
            "Each tier also advertises a Domain Rating increase — up to DR 10, 15 and 20 respectively. Be careful with that: Domain Rating is Ahrefs' third-party metric, recalculated on their schedule from the whole web's link graph. No submission service controls it, and a new domain's DR can move on links that have nothing to do with your listings. Read it as a statement of ambition, not as a deliverable, and judge the service on the submissions it guarantees instead.",
        ],
        meets: {
            manual: "no",
            price: "yes",
            report: "yes",
            turnaround: "yes",
            noMetricPromise: "no",
        },
        strengths: [
            "Around $1 per claimed listing — the lowest here",
            "48-hour turnaround, guaranteed in writing",
            "Submission count is guaranteed, which is a promise it can actually keep",
        ],
        limits: [
            "Automation-assisted, so listing quality depends on the review step",
            "Advertises DR outcomes that no service controls",
        ],
    },
    {
        id: "ai-directories",
        name: "AI Directories",
        domain: "aidirectori.es",
        url: "https://www.aidirectori.es/",
        price: "$49 / $99 / $149 (promo; list $149 / $199 / $249)",
        priceFrom: 49,
        hundredTier: { price: 149, count: 100 },
        volume: "30+, 60+ or 100+ AI directories by tier",
        turnaround: "Within 48 hours",
        method: "Manual",
        guarantee: "Satisfaction guarantee, rework or refund",
        bestFor: "AI products specifically, where the directory set is different",
        sourced: "vendor",
        screenshotUrl: "https://www.aidirectori.es/pricing",
        notes: [
            "Manual submission to AI-tool directories only, by hand, within 48 hours. Prices were showing a Black Friday discount when checked — $49, $99 and $149 against list prices of $149, $199 and $249, with the banner giving 30 November 2026 as the end date — so what you pay depends on when you arrive.",
            "The upper tiers fold in the directories' own listing fees, around $59 of paid placements on Pro and around $173 on Premium, which is the part most roundups miss when they compare headline prices. If your product is an AI tool, a specialist set beats a general one; if it is not, this is the wrong list and the general services above apply.",
        ],
        meets: {
            manual: "yes",
            price: "partial",
            report: "no",
            turnaround: "yes",
            noMetricPromise: "yes",
        },
        strengths: [
            "Specialist AI directory set, not a general list",
            "Paid directory fees included in the upper tiers",
            "48-hour manual turnaround with a refund path",
        ],
        limits: [
            "Only useful if your product is an AI tool",
            "Headline prices are promotional — list prices are $100 higher",
        ],
    },
    {
        id: "backlinkbot",
        name: "BacklinkBot",
        domain: "backlinkbot.ai",
        url: "https://backlinkbot.ai/",
        price: "$99 one-time (done-for-you) or $19 first month, then from $49/mo",
        priceFrom: 19,
        hundredTier: { price: 99, count: 100 },
        volume: "100+ manual submissions; 1,289 directories tracked, 681 dofollow",
        turnaround: "Weeks rather than days",
        method: "Automated agent",
        guarantee: "None published",
        bestFor: "Running directory submission and outreach as an ongoing process",
        sourced: "vendor",
        screenshotUrl: "https://backlinkbot.ai/pricing",
        notes: [
            "Two products under one roof. The done-for-you directory run is $99 one-time for 100+ manual submissions, with 200+ and 300+ plans above it. Separately, an outreach agent runs monthly from $19 for the first month and then from $49, prospecting ranking pages and drafting emails that you approve before anything sends.",
            "It is the only option here that publishes its own directory counts — 1,289 tracked, 681 dofollow, 447 at DR 50 or above — and it re-checks live links weekly. It is also candid that outreach takes weeks because it depends on people replying, which is the right expectation to set.",
        ],
        meets: {
            manual: "partial",
            price: "partial",
            report: "yes",
            turnaround: "partial",
            noMetricPromise: "yes",
        },
        strengths: [
            "$99 for 100+ manual submissions is the joint-cheapest at that volume",
            "Publishes its own dofollow and DR counts",
            "Approve-first outreach, with weekly live-link re-checks",
        ],
        limits: [
            "The agent is a subscription, so the cost does not stop",
            "Outreach results arrive over weeks, not days",
        ],
    },
    {
        id: "listingbott",
        name: "ListingBott",
        domain: "listingbott.com",
        url: "https://listingbott.com/",
        price: "$299 promo, rising to $499 and $999",
        priceFrom: 299,
        hundredTier: { price: 299, count: 100 },
        volume: "100 hand-picked listings from a 12,000+ directory database",
        turnaround: "Up to 5 weeks",
        method: "AI research + manual",
        guarantee: "DR 0 to 15 within 2 months, or continued work or a refund",
        bestFor: "Buyers who want a refund-backed outcome and can wait",
        sourced: "vendor",
        notes: [
            "The most expensive package here and the slowest: 100 listings picked by AI research from a database it says exceeds 12,000 directories, submitted by humans over about a month, with indexing taking up to two months more. Pricing is staged by cohort — $299 for the first 100 buyers, then $399, $499 and eventually $999 — so the number you see depends on when you look. A $99/month tier covers 20 directories.",
            "It is the one service that puts a refund behind a Domain Rating promise: DR 0 to 15 within two months of the report, or it keeps working on your listings, or it refunds you. That is a stronger version of the claim SubmitSaaS makes, because there is a stated remedy attached. It is still a promise about somebody else's metric, and at $3 to $5 per listing you are paying several times the rate of the services above.",
        ],
        meets: {
            manual: "partial",
            price: "no",
            report: "yes",
            turnaround: "yes",
            noMetricPromise: "no",
        },
        strengths: [
            "The DR claim comes with a written remedy, not just a number",
            "Full refund offered if you are not satisfied",
            "Largest stated directory database",
        ],
        limits: [
            "$3–$5 per listing, the most expensive here",
            "Up to 5 weeks before the work is done",
            "Price rises as cohorts fill",
        ],
    },
    {
        id: "getmorebacklinks",
        name: "GetMoreBacklinks",
        domain: "getmorebacklinks.org",
        url: "https://www.getmorebacklinks.org/",
        price: "$379 / $579 / $779 list, heavily discounted in promos",
        priceFrom: 379,
        hundredTier: { price: 379, count: 100 },
        volume: "100–200 listings across 200+ directories",
        turnaround: "14 working days",
        method: "Automation + human review",
        guarantee: "None published",
        bestFor: "Agencies wanting proof screenshots and audits bundled in",
        sourced: "vendor",
        notes: [
            "Three tiers at $379, $579 and $779 list price for 100 to 200 listings, delivered in 14 working days with proof screenshots, an SEO report and a landing page audit. A \"67% OFF\" sale banner was running when this page was checked, though the discounted figures shown beside each tier did not match a 67% reduction — a gap wide enough that neither number is a reliable comparison point on its own.",
            "One practical note: the site said new orders were unavailable due to demand when it was checked on 10 November 2026. Check whether it is taking work before planning around it.",
        ],
        meets: {
            manual: "partial",
            price: "partial",
            report: "yes",
            turnaround: "yes",
            noMetricPromise: "yes",
        },
        strengths: [
            "Proof screenshots, SEO report and landing page audit bundled",
            "Up to 200 listings on the upper tiers",
        ],
        limits: [
            "New orders were closed at the last check",
            "List prices are the highest per listing on this page",
            "No published performance guarantee",
        ],
    },
    {
        id: "orbator-launch",
        name: "Orbator Launch",
        domain: "orbator.io",
        url: "https://www.orbator.io/best-directory-submission-tools",
        price: "$49, then $39/month after 30 days",
        priceFrom: 49,
        hundredTier: null,
        volume: "The top 10 AI-cited sources in your category",
        turnaround: "Not published",
        method: "Manual",
        guarantee: "None published",
        bestFor: "Chasing citations in AI answers rather than listing volume",
        sourced: "third-party",
        notes: [
            "A different bet from everything above: instead of volume, it submits to roughly the ten sources it measures as being cited by AI engines for your category, then charges $39 a month to keep watching that visibility. The argument behind it — that most directories are read by neither buyers nor AI engines — is a fair one, and it is worth taking seriously even if you buy a volume package.",
            "Two caveats. It auto-renews at $39 a month after the first 30 days, so it is a subscription dressed as a launch fee, and the figures here come from Orbator's own roundup because its /launch page returned a 404 when checked. Ten listings also will not do what a hundred do for a brand-new domain's link profile.",
        ],
        meets: {
            manual: "yes",
            price: "no",
            report: "no",
            turnaround: "no",
            noMetricPromise: "yes",
        },
        strengths: [
            "Targets sources it has measured as AI-cited, rather than counting listings",
            "Low entry price",
        ],
        limits: [
            "Auto-renews at $39/month unless cancelled",
            "Around ten sources, so little link-profile effect",
            "Product page 404'd at the last check",
        ],
    },
    {
        id: "blastra",
        name: "Blastra",
        domain: "blastra.co",
        url: "https://www.orbator.io/best-directory-submission-tools",
        price: "Tiered one-time packages; promos rotate",
        priceFrom: null,
        hundredTier: null,
        volume: "Not published",
        turnaround: "Not published",
        method: "Manual",
        guarantee: "None published",
        bestFor: "Nothing verifiable at the last check",
        sourced: "unreachable",
        notes: [
            "Packaged directory submission with a startup and AI directory focus, named in other roundups as a tiered one-time service with rotating promotional pricing.",
            "Its domain did not resolve at all when checked on 10 November 2026. It is listed here for completeness and because other comparisons still carry it, not as a recommendation. Do not send money to a service you cannot load.",
        ],
        meets: {
            manual: "no",
            price: "no",
            report: "no",
            turnaround: "no",
            noMetricPromise: "no",
        },
        strengths: [],
        limits: [
            "Domain did not resolve at the last check",
            "No price, volume or turnaround confirmable at source",
        ],
    },
    {
        id: "fiverr",
        name: "Fiverr gigs",
        domain: "fiverr.com",
        url: "https://www.fiverr.com/",
        price: "$10–$50 per gig",
        priceFrom: 10,
        hundredTier: null,
        volume: "Whatever the individual seller's list contains",
        turnaround: "Set by the seller",
        method: "Freelancer",
        guarantee: "Platform dispute process only",
        bestFor: "The smallest possible spend, with the quality risk that implies",
        sourced: "third-party",
        notes: [
            "The floor of the market. A freelancer submits your site to their own directory list for $10 to $50, with delivery and quality entirely dependent on the individual seller.",
            "The risk is not the price, it is what you get listed on. Gigs promising hundreds of submissions are usually hitting low-value link farms, which is the pattern search engines learned to discount years ago. If you go this route, ask for the directory list up front and check a sample against a dataset you trust — the one on this site is free and downloadable.",
        ],
        meets: {
            manual: "yes",
            price: "partial",
            report: "no",
            turnaround: "no",
            noMetricPromise: "yes",
        },
        strengths: ["Cheapest paid option", "Platform-level dispute process"],
        limits: [
            "Directory quality is unverified and varies by seller",
            "High-volume gigs often mean link farms",
        ],
    },
    {
        id: "diy",
        name: "Do it yourself",
        domain: "producthuntalternatives.com",
        url: "/directory-submission-sites",
        price: "$0 plus 20–40 hours",
        priceFrom: 0,
        hundredTier: null,
        volume: "As many as you work through",
        turnaround: "However fast you type",
        method: "You",
        guarantee: "Total control",
        bestFor: "Pre-revenue products, and anyone wanting to see the forms first",
        sourced: "vendor",
        notes: [
            "Every service on this page is selling you back the hours. Filling 100 directory forms takes most founders 20 to 40 hours, and nothing about it is technically hard — it is repetitive, and the accounts and confirmation emails end up in your own inbox, which is where they belong.",
            "The part worth paying for is the list, and that part is free here: the full database on this site is live-checked, carries a measured Domain Rating per domain, and marks link type, so you can start at the top and stop when the returns thin out. Do the first ten yourself before you buy anything. You will know within an hour whether the remaining ninety are worth $199 of your time.",
        ],
        meets: {
            manual: "yes",
            price: "yes",
            report: "yes",
            turnaround: "yes",
            noMetricPromise: "yes",
        },
        strengths: [
            "No cost, and you own every account",
            "You see exactly which directories you are on",
            "The directory list itself is free and verifiable",
        ],
        limits: [
            "20–40 hours of repetitive form filling",
            "You pay the directories' own listing fees yourself",
        ],
    },
];

export const serviceCount = submissionServices.length;

/** Cheapest published entry price across the paid services. */
export const cheapestPaid = Math.min(
    ...submissionServices
        .map((s) => s.priceFrom)
        .filter((p): p is number => p !== null && p > 0),
);

/** Highest published entry price, for the "from X to Y" range. */
export const dearestEntry = Math.max(
    ...submissionServices
        .map((s) => s.priceFrom)
        .filter((p): p is number => p !== null),
);

/** Cost per claimed listing at the ~100-directory tier, cheapest first. */
export const perListing = submissionServices
    .filter((s) => s.hundredTier !== null)
    .map((s) => ({
        name: s.name,
        id: s.id,
        price: s.hundredTier!.price,
        count: s.hundredTier!.count,
        each: s.hundredTier!.price / s.hundredTier!.count,
    }))
    .sort((a, b) => a.each - b.each);

export const manualCount = submissionServices.filter(
    (s) => s.method === "Manual",
).length;

export const unreachableCount = submissionServices.filter(
    (s) => s.sourced !== "vendor",
).length;

/**
 * The weights behind the criteria score, published so a reader can redo the
 * arithmetic. They follow the order the page argues for: who fills the form
 * matters most, then whether you get told what went live, then whether the
 * price is knowable before you talk to anyone.
 */
export const CRITERION_WEIGHTS: {
    key: keyof CriteriaScores;
    label: string;
    weight: number;
}[] = [
    { key: "manual", label: "A human fills the forms", weight: 30 },
    { key: "report", label: "A report that names the listings", weight: 25 },
    { key: "price", label: "One published price", weight: 20 },
    { key: "turnaround", label: "A published turnaround", weight: 15 },
    { key: "noMetricPromise", label: "No metric promises", weight: 10 },
];

/**
 * 0–100 from the five criteria alone. It deliberately measures only what a
 * vendor *publishes*, so it does not reproduce the ranking: the ranking also
 * weighs whether the figures could be verified at source and how long the run
 * actually takes, neither of which the matrix can express. Where the two
 * disagree, the entry says why.
 */
export function criteriaScore(service: SubmissionService): number {
    const value = { yes: 1, partial: 0.5, no: 0 } as const;
    return Math.round(
        CRITERION_WEIGHTS.reduce(
            (total, c) => total + c.weight * value[service.meets[c.key]],
            0,
        ),
    );
}

/** The highest criteria score that is not also the editorial top pick. */
export const bestCriteriaScore = Math.max(
    ...submissionServices.map(criteriaScore),
);
