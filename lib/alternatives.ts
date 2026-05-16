export type Alternative = {
    id: string;
    name: string;
    url: string;
    description: string;
    pricing: "Free" | "Free/Paid" | "Freemium";
};

export type SectionConfig = {
    id: string;
    title: string;
};

export const sections: SectionConfig[] = [
    { id: "why", title: "Why look beyond Product Hunt?" },
    { id: "launch-platforms", title: "Launch Platforms" },
    { id: "communities", title: "Communities" },
    { id: "directories", title: "Directories & Review Sites" },
    { id: "ai-directories", title: "AI-Specific Directories" },
    { id: "other", title: "Other Platforms" },
];

export const launchPlatforms: Alternative[] = [
    {
        id: "hacker-news",
        name: "Hacker News (Show HN)",
        url: "https://news.ycombinator.com",
        description:
            "Tech-focused community. A Show HN post that resonates can drive thousands of developer visits in hours.",
        pricing: "Free",
    },
    {
        id: "betalist",
        name: "BetaList",
        url: "https://betalist.com",
        description:
            "Curated startup directory focused on early-stage products. Paid options for faster listing.",
        pricing: "Free/Paid",
    },
    {
        id: "microlaunch",
        name: "MicroLaunch",
        url: "https://microlaunch.net",
        description:
            "Built specifically for indie hackers and micro-SaaS. Smaller audience, but highly relevant.",
        pricing: "Free",
    },
    {
        id: "uneed",
        name: "Uneed",
        url: "https://uneed.best",
        description:
            "Curated tool directory with daily rankings. Paid options get you featured faster.",
        pricing: "Free/Paid",
    },
    {
        id: "devhunt",
        name: "DevHunt",
        url: "https://devhunt.org",
        description:
            "Launch platform exclusively for developer tools. If your audience is developers, start here.",
        pricing: "Free",
    },
    {
        id: "peerlist",
        name: "Peerlist",
        url: "https://peerlist.io",
        description:
            "Professional network for builders with integrated launch features and peer endorsements.",
        pricing: "Free",
    },
    {
        id: "fazier",
        name: "Fazier",
        url: "https://fazier.com",
        description:
            "Startup launch platform with an engaged community of early adopters.",
        pricing: "Free",
    },
    {
        id: "launching-next",
        name: "Launching Next",
        url: "https://launchingnext.com",
        description:
            "Submit your startup to get listed and discovered by early adopters browsing new products.",
        pricing: "Free",
    },
    {
        id: "sideprojectors",
        name: "SideProjectors",
        url: "https://sideprojectors.com",
        description:
            "Marketplace for side projects. Launch, get feedback, or even sell your project.",
        pricing: "Free",
    },
    {
        id: "betapage",
        name: "BetaPage",
        url: "https://betapage.co",
        description:
            "Community of beta testers actively looking for new products to try and review.",
        pricing: "Free",
    },
];

export const communities: Alternative[] = [
    {
        id: "indie-hackers",
        name: "Indie Hackers",
        url: "https://indiehackers.com",
        description:
            "Founders sharing revenue numbers, growth strategies, and hard-won lessons. The audience is other builders who give honest, technical feedback.",
        pricing: "Free",
    },
    {
        id: "reddit",
        name: "Reddit",
        url: "https://reddit.com",
        description:
            "Subreddits like r/SideProject, r/startups, r/SaaS, and r/Entrepreneur each have distinct audiences. Share genuinely, not promotionally.",
        pricing: "Free",
    },
];

export const directories: Alternative[] = [
    {
        id: "alternativeto",
        name: "AlternativeTo",
        url: "https://alternativeto.net",
        description:
            "Crowdsourced software recommendations. Users search for tools by comparing them to ones they already know.",
        pricing: "Free",
    },
    {
        id: "g2",
        name: "G2",
        url: "https://g2.com",
        description:
            "Enterprise-focused review platform. Millions of B2B buyers use G2 to evaluate software before purchasing.",
        pricing: "Freemium",
    },
    {
        id: "capterra",
        name: "Capterra",
        url: "https://capterra.com",
        description:
            "Software directory owned by Gartner. Strong SEO presence means your listing gets found organically.",
        pricing: "Freemium",
    },
    {
        id: "saashub",
        name: "SaaSHub",
        url: "https://saashub.com",
        description:
            "Independent software marketplace with alternatives, reviews, and trending products.",
        pricing: "Free",
    },
    {
        id: "saasworthy",
        name: "SaaSworthy",
        url: "https://saasworthy.com",
        description:
            "SaaS discovery platform with awards, ratings, and comparison features.",
        pricing: "Free",
    },
    {
        id: "startupstash",
        name: "StartupStash",
        url: "https://startupstash.com",
        description:
            "Curated directory of resources and tools organized by category. Good for reaching startup founders.",
        pricing: "Free",
    },
    {
        id: "sourceforge",
        name: "SourceForge",
        url: "https://sourceforge.net",
        description:
            "One of the oldest and largest software directories. Especially strong for open-source and developer tools.",
        pricing: "Free",
    },
    {
        id: "resource-fyi",
        name: "Resource.fyi",
        url: "https://resource.fyi",
        description:
            "Curated collection of tools and resources for designers and developers.",
        pricing: "Free",
    },
    {
        id: "toolfio",
        name: "Toolfio",
        url: "https://toolfio.com",
        description:
            "Software directory great for SaaS. Free listing requires adding their badge to your site. Paid option removes the badge requirement.",
        pricing: "Free/Paid",
    },
    {
        id: "web-review",
        name: "Web Review",
        url: "https://web-review.com",
        description:
            "SEO directory that gives you 3 permanent dofollow backlinks. Helps boost domain authority and visibility on Google, ChatGPT, Claude, and Perplexity.",
        pricing: "Free/Paid",
    },
    {
        id: "tinylaunchpad",
        name: "TinyLaunchpad",
        url: "https://tinylaunchpad.com",
        description:
            "Lightweight launch platform for small products, side projects, and experiments.",
        pricing: "Free",
    },
];

export const aiDirectories: Alternative[] = [
    {
        id: "theres-an-ai-for-that",
        name: "There's An AI For That",
        url: "https://theresanaiforthat.com",
        description:
            "The largest AI tool directory, updated daily. High traffic from people actively searching for AI solutions.",
        pricing: "Free",
    },
    {
        id: "future-tools",
        name: "Future Tools",
        url: "https://futuretools.io",
        description:
            "Curated and searchable AI tool collection. Strong YouTube and newsletter audience drives extra visibility.",
        pricing: "Free",
    },
];

export const otherPlatforms: Alternative[] = [
    {
        id: "openhunts",
        name: "OpenHunts",
        url: "https://openhunts.com",
        description:
            "Open-source alternative to Product Hunt. Community-driven with transparent ranking.",
        pricing: "Free/Paid",
    },
    {
        id: "firsto",
        name: "Firsto",
        url: "https://firsto.co",
        description:
            "Minimalist launch platform designed to help you find your very first users.",
        pricing: "Free",
    },
];

export const allAlternatives = [
    ...launchPlatforms,
    ...communities,
    ...directories,
    ...aiDirectories,
    ...otherPlatforms,
];

export function findAlternativeById(id: string) {
    return allAlternatives.find((alternative) => alternative.id === id);
}
