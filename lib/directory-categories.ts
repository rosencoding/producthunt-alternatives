export type DirectoryCategory =
    | "launchpad"
    | "startup"
    | "software"
    | "ai"
    | "community";

export const categoryMeta: Record<
    DirectoryCategory,
    { slug: string; label: string; labelLower: string; plural: string }
> = {
    launchpad: {
        slug: "launch-platforms",
        label: "Launch platform",
        labelLower: "launch platform",
        plural: "Launch platforms",
    },
    startup: {
        // These are company-profile listings (Crunchbase, Wellfound, Owler).
        // Naming them "Startup directories" collided with the broader
        // /startup-directories hub, which also covers launch platforms and
        // communities — same label, two different counts on the same page.
        slug: "startup-directories",
        label: "Startup profile",
        labelLower: "startup profile site",
        plural: "Startup profiles",
    },
    software: {
        slug: "saas-directories",
        label: "SaaS directory",
        labelLower: "SaaS directory",
        plural: "SaaS & software directories",
    },
    ai: {
        slug: "ai-tool-directories",
        label: "AI tool directory",
        labelLower: "AI tool directory",
        plural: "AI tool directories",
    },
    community: {
        slug: "startup-communities",
        label: "Community",
        labelLower: "community",
        plural: "Startup communities",
    },
};

