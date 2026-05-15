import Footer from "@/components/footer";
import { SectionsProgressProvider } from "@/components/sections-progress";
import Section from "@/components/section";
import Sidebar from "@/components/sidebar";
import MobileToc from "@/components/mobile-toc";
import Link from "next/link";

type Alternative = {
    name: string;
    url: string;
    description: string;
    pricing: "Free" | "Free/Paid" | "Freemium";
};

type SectionConfig = {
    id: string;
    title: string;
};

const sections: SectionConfig[] = [
    { id: "why", title: "Why look beyond Product Hunt?" },
    { id: "launch-platforms", title: "Launch Platforms" },
    { id: "communities", title: "Communities" },
    { id: "directories", title: "Directories & Review Sites" },
    { id: "ai-directories", title: "AI-Specific Directories" },
    { id: "other", title: "Other Platforms" },
];

const launchPlatforms: Alternative[] = [
    {
        name: "Hacker News (Show HN)",
        url: "https://news.ycombinator.com",
        description:
            "Tech-focused community. A Show HN post that resonates can drive thousands of developer visits in hours.",
        pricing: "Free",
    },
    {
        name: "BetaList",
        url: "https://betalist.com",
        description:
            "Curated startup directory focused on early-stage products. Paid options for faster listing.",
        pricing: "Free/Paid",
    },
    {
        name: "MicroLaunch",
        url: "https://microlaunch.net",
        description:
            "Built specifically for indie hackers and micro-SaaS. Smaller audience, but highly relevant.",
        pricing: "Free",
    },
    {
        name: "Uneed",
        url: "https://uneed.best",
        description:
            "Curated tool directory with daily rankings. Paid options get you featured faster.",
        pricing: "Free/Paid",
    },
    {
        name: "DevHunt",
        url: "https://devhunt.org",
        description:
            "Launch platform exclusively for developer tools. If your audience is developers, start here.",
        pricing: "Free",
    },
    {
        name: "Peerlist",
        url: "https://peerlist.io",
        description:
            "Professional network for builders with integrated launch features and peer endorsements.",
        pricing: "Free",
    },
    {
        name: "Fazier",
        url: "https://fazier.com",
        description:
            "Startup launch platform with an engaged community of early adopters.",
        pricing: "Free",
    },
    {
        name: "Launching Next",
        url: "https://launchingnext.com",
        description:
            "Submit your startup to get listed and discovered by early adopters browsing new products.",
        pricing: "Free",
    },
    {
        name: "SideProjectors",
        url: "https://sideprojectors.com",
        description:
            "Marketplace for side projects. Launch, get feedback, or even sell your project.",
        pricing: "Free",
    },
    {
        name: "BetaPage",
        url: "https://betapage.co",
        description:
            "Community of beta testers actively looking for new products to try and review.",
        pricing: "Free",
    },
];

const communities: Alternative[] = [
    {
        name: "Indie Hackers",
        url: "https://indiehackers.com",
        description:
            "Founders sharing revenue numbers, growth strategies, and hard-won lessons. The audience is other builders who give honest, technical feedback.",
        pricing: "Free",
    },
    {
        name: "Reddit",
        url: "https://reddit.com",
        description:
            "Subreddits like r/SideProject, r/startups, r/SaaS, and r/Entrepreneur each have distinct audiences. Share genuinely, not promotionally.",
        pricing: "Free",
    },
];

const directories: Alternative[] = [
    {
        name: "AlternativeTo",
        url: "https://alternativeto.net",
        description:
            "Crowdsourced software recommendations. Users search for tools by comparing them to ones they already know.",
        pricing: "Free",
    },
    {
        name: "G2",
        url: "https://g2.com",
        description:
            "Enterprise-focused review platform. Millions of B2B buyers use G2 to evaluate software before purchasing.",
        pricing: "Freemium",
    },
    {
        name: "Capterra",
        url: "https://capterra.com",
        description:
            "Software directory owned by Gartner. Strong SEO presence means your listing gets found organically.",
        pricing: "Freemium",
    },
    {
        name: "SaaSHub",
        url: "https://saashub.com",
        description:
            "Independent software marketplace with alternatives, reviews, and trending products.",
        pricing: "Free",
    },
    {
        name: "SaaSworthy",
        url: "https://saasworthy.com",
        description:
            "SaaS discovery platform with awards, ratings, and comparison features.",
        pricing: "Free",
    },
    {
        name: "StartupStash",
        url: "https://startupstash.com",
        description:
            "Curated directory of resources and tools organized by category. Good for reaching startup founders.",
        pricing: "Free",
    },
    {
        name: "SourceForge",
        url: "https://sourceforge.net",
        description:
            "One of the oldest and largest software directories. Especially strong for open-source and developer tools.",
        pricing: "Free",
    },
    {
        name: "Resource.fyi",
        url: "https://resource.fyi",
        description:
            "Curated collection of tools and resources for designers and developers.",
        pricing: "Free",
    },
    {
        name: "Toolfio",
        url: "https://toolfio.com",
        description:
            "Software directory great for SaaS. Free listing requires adding their badge to your site. Paid option removes the badge requirement.",
        pricing: "Free/Paid",
    },
    {
        name: "Web Review",
        url: "https://web-review.com",
        description:
            "SEO directory that gives you 3 permanent dofollow backlinks. Helps boost domain authority and visibility on Google, ChatGPT, Claude, and Perplexity.",
        pricing: "Free/Paid",
    },
    {
        name: "TinyLaunchpad",
        url: "https://tinylaunchpad.com",
        description:
            "Lightweight launch platform for small products, side projects, and experiments.",
        pricing: "Free",
    },
];

const aiDirectories: Alternative[] = [
    {
        name: "There's An AI For That",
        url: "https://theresanaiforthat.com",
        description:
            "The largest AI tool directory, updated daily. High traffic from people actively searching for AI solutions.",
        pricing: "Free",
    },
    {
        name: "Future Tools",
        url: "https://futuretools.io",
        description:
            "Curated and searchable AI tool collection. Strong YouTube and newsletter audience drives extra visibility.",
        pricing: "Free",
    },
];

const otherPlatforms: Alternative[] = [
    {
        name: "OpenHunts",
        url: "https://openhunts.com",
        description:
            "Open-source alternative to Product Hunt. Community-driven with transparent ranking.",
        pricing: "Free/Paid",
    },
    {
        name: "Firsto",
        url: "https://firsto.co",
        description:
            "Minimalist launch platform designed to help you find your very first users.",
        pricing: "Free",
    },
];

const allAlternatives = [
    ...launchPlatforms,
    ...communities,
    ...directories,
    ...aiDirectories,
    ...otherPlatforms,
];

const sectionIds = sections.map((s) => s.id);
const sidebarSections = sections.map(({ id, title }) => ({ id, title }));

function PricingBadge({ pricing }: { pricing: Alternative["pricing"] }) {
    const colors = {
        Free: "bg-green-50 text-green-700",
        "Free/Paid": "bg-amber-50 text-amber-700",
        Freemium: "bg-blue-50 text-blue-700",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[pricing]}`}
        >
            {pricing}
        </span>
    );
}

function AlternativesList({ alternatives }: { alternatives: Alternative[] }) {
    return (
        <ul role="list" className="divide-y divide-slate-100">
            {alternatives.map((alt) => (
                <li
                    key={alt.name}
                    className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-3"
                >
                    <div className="flex items-baseline gap-2 shrink-0">
                        <a
                            href={alt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2"
                        >
                            {alt.name}
                        </a>
                        <PricingBadge pricing={alt.pricing} />
                    </div>
                    <p className="text-sm text-slate-600">{alt.description}</p>
                </li>
            ))}
        </ul>
    );
}

function JsonLd() {
    const itemList = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Product Hunt Alternatives",
        description:
            "A curated list of platforms to launch and promote your product beyond Product Hunt.",
        numberOfItems: allAlternatives.length,
        itemListElement: allAlternatives.map((alt, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: alt.name,
            url: alt.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
        />
    );
}

export default function IndexPage() {
    return (
        <SectionsProgressProvider sectionIds={sectionIds}>
            <JsonLd />
            <div className="relative flex min-h-screen justify-center px-6 py-12 sm:p-16 lg:p-20">
                <div className="w-full max-w-3xl">
                    <MobileToc sections={sidebarSections} />
                    <div className="mt-8 space-y-10 lg:mt-0">
                        <main className="flex w-full flex-col space-y-10">
                            <header className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
                                <Link href="/">
                                    <h1 className="font-serif max-w-sm text-3xl font-semibold leading-8 tracking-tight text-black">
                                        Product Hunt Alternatives
                                    </h1>
                                </Link>
                                <p className="max-w-lg text-lg leading-8 text-zinc-600">
                                    A curated guide to platforms where you can
                                    launch and promote your product beyond
                                    Product Hunt.
                                </p>
                            </header>

                            <Section id="why" title="Why look beyond Product Hunt?">
                                <p className="text-base leading-7 text-zinc-700">
                                    Product Hunt is the most well-known launch
                                    platform, but it has become increasingly
                                    competitive and pay-to-play. Getting to the
                                    top of the daily leaderboard now often
                                    requires a coordinated campaign with a large
                                    existing audience, not just a great product.
                                    For indie hackers, solo founders, and small
                                    teams, this can feel like a lottery.
                                </p>
                                <p className="text-base leading-7 text-zinc-700">
                                    More importantly, Product Hunt gives you a
                                    single spike of traffic on launch day.
                                    Once your post slides off the front page,
                                    the visibility is gone. A smarter approach
                                    is to spread your launch across multiple
                                    platforms that work on different timescales:
                                    launch platforms for day-one visibility,
                                    communities for ongoing engagement, and
                                    directories for long-term organic discovery.
                                </p>
                                <p className="text-base leading-7 text-zinc-700">
                                    This guide organizes {allAlternatives.length}+ platforms
                                    by type so you can build a launch strategy
                                    that compounds over time instead of
                                    depending on a single day.
                                </p>
                            </Section>

                            <Section
                                id="launch-platforms"
                                title="Launch Platforms"
                            >
                                <p className="text-base leading-7 text-zinc-700">
                                    Launch platforms give you a spike of
                                    visibility on a specific day. They work like
                                    Product Hunt: you submit, the community
                                    votes, and the best products rise to the
                                    top. The audience is smaller than Product
                                    Hunt, but that can work in your favor.
                                    Less competition means a better chance of
                                    getting noticed.
                                </p>
                                <p className="text-base leading-7 text-zinc-700">
                                    The key with launch platforms is timing.
                                    Don&apos;t launch everywhere on the same day.
                                    Stagger your launches across platforms over
                                    a few weeks. Each launch gives you a new
                                    wave of traffic, feedback, and backlinks.
                                    Prepare a landing page, a clear one-liner,
                                    and screenshots before you start.
                                </p>
                                <AlternativesList
                                    alternatives={launchPlatforms}
                                />
                            </Section>

                            <Section id="communities" title="Communities">
                                <p className="text-base leading-7 text-zinc-700">
                                    Communities are not launch platforms. They
                                    are places where people have ongoing
                                    conversations. The value here is not a
                                    one-day spike but sustained visibility
                                    through genuine participation. Share what
                                    you&apos;re building, ask for feedback, help
                                    others, and let your product come up
                                    naturally.
                                </p>
                                <p className="text-base leading-7 text-zinc-700">
                                    The founders who get the most from
                                    communities are the ones who contribute
                                    before they promote. Write about your
                                    building process, share revenue numbers,
                                    answer questions in your area of expertise.
                                    When you eventually share your product, the
                                    community already knows and trusts you.
                                    Dropping a link with no context gets you
                                    ignored or downvoted.
                                </p>
                                <AlternativesList
                                    alternatives={communities}
                                />
                            </Section>

                            <Section
                                id="directories"
                                title="Directories & Review Sites"
                            >
                                <p className="text-base leading-7 text-zinc-700">
                                    Directories are the long game. Unlike launch
                                    platforms where traffic spikes and fades,
                                    directory listings compound over time.
                                    Sites like G2, Capterra, and AlternativeTo
                                    have strong domain authority. Your listing
                                    shows up when potential customers search
                                    for tools in your category. This is passive,
                                    ongoing traffic you don&apos;t have to maintain.
                                </p>
                                <p className="text-base leading-7 text-zinc-700">
                                    The trade-off is that directories are slow.
                                    It can take weeks or months for a listing to
                                    gain reviews and rank in search results. But
                                    once it does, a single G2 or Capterra
                                    listing can consistently drive qualified
                                    leads. Encourage your early users to leave
                                    reviews. The number of reviews is the
                                    primary ranking factor on most of these
                                    platforms. If you want to find even more
                                    directories beyond the ones listed here,{" "}
                                    <a
                                        href="https://launchdirectories.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
                                    >
                                        LaunchDirectories.com
                                    </a>{" "}
                                    is a great resource for discovering them.
                                </p>
                                <AlternativesList alternatives={directories} />
                            </Section>

                            <Section
                                id="ai-directories"
                                title="AI-Specific Directories"
                            >
                                <p className="text-base leading-7 text-zinc-700">
                                    If you are building an AI product, these
                                    directories are essential. The AI tool
                                    landscape is exploding, and users actively
                                    browse these sites to discover new tools for
                                    specific tasks. &quot;There&apos;s An AI For
                                    That&quot; alone gets millions of monthly
                                    visits from people searching for AI
                                    solutions.
                                </p>
                                <p className="text-base leading-7 text-zinc-700">
                                    Listing here is straightforward and usually
                                    free. The key is to clearly describe what
                                    your tool does and which problem it solves.
                                    Users browse by category, so your
                                    positioning matters more than your brand.
                                </p>
                                <AlternativesList
                                    alternatives={aiDirectories}
                                />
                            </Section>

                            <Section id="other" title="Other Platforms">
                                <p className="text-base leading-7 text-zinc-700">
                                    These platforms don&apos;t fit neatly into
                                    the categories above but are worth knowing
                                    about. Some are newer and still building
                                    their audience, which means less
                                    competition and a chance to be an early
                                    presence. Others serve specific niches or
                                    take a different approach to product
                                    discovery.
                                </p>
                                <AlternativesList
                                    alternatives={otherPlatforms}
                                />
                            </Section>
                        </main>
                        <Footer />
                    </div>
                </div>
                <nav
                    aria-label="Table of contents"
                    className="hidden 2xl:fixed 2xl:right-20 2xl:top-16 2xl:block 2xl:w-80 px-4"
                >
                    <Sidebar sections={sidebarSections} />
                </nav>
            </div>
        </SectionsProgressProvider>
    );
}
