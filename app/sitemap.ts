import type { MetadataRoute } from "next";
import { detailDirectories } from "@/lib/directories";
import { hubs, SITE_URL } from "@/lib/hubs";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    return [
        {
            url: SITE_URL,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${SITE_URL}/directory-submission-services`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/methodology`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: 0.6,
        },
        ...hubs.map((h) => ({
            url: `${SITE_URL}/${h.slug}`,
            lastModified: now,
            changeFrequency: "weekly" as const,
            priority: 0.9,
        })),
        ...detailDirectories.map((d) => ({
            url: `${SITE_URL}/directory/${d.id}`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: d.curated ? 0.7 : 0.5,
        })),
    ];
}
