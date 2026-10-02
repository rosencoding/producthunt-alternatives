import {
    directories,
    byCategory,
    type Directory,
    type DirectoryCategory,
} from "@/lib/directories";

export const SITE_URL = "https://producthuntalternatives.com";
export const DATA_YEAR = 2026;
/** When the directory data was last collected and re-measured. */
export const DATA_UPDATED = "2026-10-02";

export type Hub = {
    slug: string;
    /** Short name for inline prose, e.g. "startup directories". */
    shortName: string;
    /** Page <title>; keep the count and year — that is what wins these SERPs. */
    title: string;
    h1: string;
    description: string;
    intro: string[];
    items: Directory[];
    category?: DirectoryCategory;
};

const dofollowOnly = directories.filter((d) => d.dofollow === true);

// Founder-facing set: places you list the company or launch it, as opposed to
// the product/tool-facing SaaS and AI directories.
const founderFacing = directories.filter(
    (d) =>
        d.category === "startup" ||
        d.category === "launchpad" ||
        d.category === "community",
);

const SHORT_NAMES: Record<string, string> = {
    "ai-tool-directories": "AI tool directories",
    "saas-directories": "SaaS directories",
    "startup-directories": "startup directories",
    "launch-platforms": "launch platforms",
    "startup-communities": "founder communities",
    "backlink-directories": "dofollow directories",
    "directory-submission-sites": "directory submission sites",
};

function hub(
    slug: string,
    items: Directory[],
    h1: (n: number) => string,
    title: (n: number) => string,
    description: (n: number) => string,
    intro: (n: number) => string[],
    category?: DirectoryCategory,
): Hub {
    const n = items.length;
    return {
        slug,
        items,
        category,
        h1: h1(n),
        shortName: SHORT_NAMES[slug] ?? slug.replace(/-/g, " "),
        title: title(n),
        description: description(n),
        intro: intro(n),
    };
}

export const hubs: Hub[] = [
    hub(
        "ai-tool-directories",
        byCategory("ai"),
        (n) => `${n} AI Tool Directories to Submit Your AI Product`,
        (n) => `${n} AI Tool Directories to Submit Your AI Tool (${DATA_YEAR})`,
        (n) =>
            `${n} AI tool directories, each checked for uptime and ranked by Domain Rating. See which accept free submissions and which give dofollow links.`,
        (n) => [
            `AI directories are the fastest-moving corner of product discovery, and also the noisiest. Dozens launch every month, and plenty are dead within a year. Every one of the ${n} directories below returned a live response when this list was last verified, and each carries a Domain Rating measured directly rather than copied from another list.`,
            `Submit to the high-DR entries first: they are the ones people actually browse, and the ones whose links carry weight. Directories marked dofollow pass link equity to your site; nofollow listings still bring referral traffic and brand mentions that AI assistants pick up when they answer questions about tools like yours.`,
        ],
        "ai",
    ),
    hub(
        "saas-directories",
        byCategory("software"),
        (n) => `${n} SaaS & Software Directories to Submit Your Product`,
        (n) => `${n} SaaS Directories to Submit Your Product (${DATA_YEAR})`,
        (n) =>
            `${n} SaaS and software directories ranked by Domain Rating, with dofollow status and free-submission flags. Every URL verified live.`,
        (n) => [
            `Software directories are the long game of product marketing. A launch platform gives you one day of traffic; a listing on a directory with real search visibility keeps sending buyers for years, because people search "best CRM software" or "Notion alternatives" long after your launch week is over.`,
            `These ${n} directories are sorted by Domain Rating, so the ones most likely to rank, and most likely to pass authority to your site, sit at the top. Start with those, then work down. Listings on the biggest review sites often take weeks to get approved, so submit early even if you plan to launch later.`,
        ],
        "software",
    ),
    hub(
        "startup-directories",
        founderFacing,
        (n) => `${n} Startup Directories to Submit Your Startup`,
        (n) =>
            `${n} Startup Directories to Submit Your Startup (${DATA_YEAR})`,
        (n) =>
            `${n} startup directories with verified links, Domain Rating, and dofollow status. Free and paid submission options for founders.`,
        (n) => [
            `Startup directories put your company in front of investors, journalists, and early adopters who browse these lists deliberately rather than stumbling on them. They are also among the most durable backlinks a young company can get, because directory listings rarely get removed.`,
            `Below are ${n} places to list a startup: dedicated startup directories, launch platforms, and founder communities that accept product posts. Each was verified live and is ranked by measured Domain Rating. If you only have time for a handful, take the top five dofollow entries: those combine a real audience with a link that helps your own search rankings.`,
            `Two narrower lists split out of this one if you already know what you need: launch platforms for launch-day visibility, and founder communities for slower but higher-quality feedback. Both are linked at the foot of this page.`,
        ],
        "startup",
    ),
    hub(
        "launch-platforms",
        byCategory("launchpad"),
        (n) => `${n} Product Launch Platforms Beyond Product Hunt`,
        (n) => `${n} Product Launch Platforms to Launch On (${DATA_YEAR})`,
        (n) =>
            `${n} launch platforms where you can ship your product, ranked by Domain Rating with dofollow status. Alternatives to Product Hunt that still send real traffic.`,
        (n) => [
            `Launch platforms work on launch-day timescales: you post, you get a spike, and the spike fades. That makes them worth stacking. Launching on six platforms across six weeks beats burning everything on a single Product Hunt attempt, and it gives you six chances to learn what messaging lands.`,
            `These ${n} platforms all accept new products and were verified live. Domain Rating tells you which ones leave a lasting search footprint after the traffic spike is gone. A launch page on a DR 60 site keeps ranking for your brand name long after launch day.`,
        ],
        "launchpad",
    ),
    hub(
        "startup-communities",
        byCategory("community"),
        (n) => `${n} Startup Communities Where Founders Share Their Work`,
        (n) =>
            `${n} Startup Communities to Share Your Product In (${DATA_YEAR})`,
        (n) =>
            `${n} communities where founders post products and get feedback, ranked by Domain Rating. Where to share without getting flagged as spam.`,
        (n) => [
            `Communities are the one channel on this site that punishes drive-by promotion. Post a link and nothing else and you will get downvoted, removed, or quietly ignored. Show up for a few weeks first, answer other people's questions, and the same link will land very differently.`,
            `These ${n} communities all host product and launch discussions. The payoff is slower than a directory listing but far higher quality: the feedback is specific, the people replying are often in your target market, and a thread that resonates can outrank your own homepage for your brand.`,
        ],
        "community",
    ),
    hub(
        "backlink-directories",
        dofollowOnly,
        (n) => `${n} Dofollow Directories That Pass Link Equity`,
        (n) =>
            `${n} Dofollow Backlink Directories for SEO (${DATA_YEAR})`,
        (n) =>
            `${n} directories confirmed to give dofollow backlinks, ranked by Domain Rating. Every URL verified live before listing.`,
        (n) => [
            `A dofollow link passes authority to your site; a nofollow one does not. Both can send traffic, but only dofollow listings help your own pages rank. These ${n} directories were marked dofollow at the time of checking, and are sorted by Domain Rating so the most valuable links appear first.`,
            `Two warnings worth taking seriously. First, link type changes. A directory can switch to nofollow without telling anyone, so treat this as a starting point rather than a guarantee. Second, submitting to every directory on a list is exactly the pattern search engines learned to discount years ago. Pick the ones genuinely relevant to your product and write a real description for each.`,
        ],
    ),
    hub(
        "directory-submission-sites",
        directories,
        (n) => `${n} Directory Submission Sites for Products & Startups`,
        (n) =>
            `${n} Directory Submission Sites, Free & Dofollow (${DATA_YEAR})`,
        (n) =>
            `The full database: ${n} directory submission sites with measured Domain Rating, dofollow status, and verified live URLs.`,
        (n) => [
            `This is the complete database: all ${n} directories, launch platforms, and communities tracked on this site, in one sortable list. Every URL was requested directly and returned a live response; entries that had gone dead were removed rather than left in to pad the count.`,
            `Domain Rating comes from the Ahrefs free Domain Rating API, queried per domain and dated, rather than copied from another directory list, which matters more than it sounds: republished DR figures across these lists are rarely dated and tend to run years stale. Use the category links to narrow this down to the directories that actually fit your product.`,
        ],
    ),
];

export function findHub(slug: string): Hub | undefined {
    return hubs.find((h) => h.slug === slug);
}

export function hubForCategory(category: DirectoryCategory): Hub | undefined {
    return hubs.find((h) => h.category === category);
}
