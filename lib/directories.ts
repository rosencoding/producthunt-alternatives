import type { DirectoryCategory } from "./directory-categories";
export { categoryMeta, type DirectoryCategory } from "./directory-categories";
// Directory database. Domain Rating (`dr`) comes from DataForSEO bulk ranks
// (0-1000 scale, divided by 10) and every URL was reachability-checked before
// being included. `dofollow: null` means the link type has not been verified.
// Rows live in directories.json so build scripts can read the same source.
import rows from "./directories.json";


export type Directory = {
    id: string;
    name: string;
    url: string;
    domain: string;
    dr: number;
    category: DirectoryCategory;
    dofollow: boolean | null;
    pricing?: "Free" | "Free/Paid" | "Freemium";
    description?: string;
    curated?: boolean;
};

export const directoryData: Directory[] = rows as Directory[];


const byDr = (a: Directory, b: Directory) =>
    b.dr - a.dr || a.name.localeCompare(b.name);

export const directories: Directory[] = [...directoryData].sort(byDr);

export const directoryCount = directories.length;
export const dofollowCount = directories.filter((d) => d.dofollow).length;

export function byCategory(category: DirectoryCategory): Directory[] {
    return directories.filter((d) => d.category === category);
}

export function findDirectory(id: string): Directory | undefined {
    return directories.find((d) => d.id === id);
}

// Every directory has its own page.
export const detailDirectories: Directory[] = directories;

/** Closest peers to `d`: same category first, ranked by DR proximity. */
export function similarDirectories(d: Directory, limit = 10): Directory[] {
    const sameCategory = directories.filter(
        (o) => o.id !== d.id && o.category === d.category,
    );
    const pool = sameCategory.length >= limit
        ? sameCategory
        : [...sameCategory, ...directories.filter(
              (o) => o.id !== d.id && o.category !== d.category,
          )];

    return pool
        .slice()
        .sort(
            (a, b) =>
                Math.abs(a.dr - d.dr) - Math.abs(b.dr - d.dr) ||
                b.dr - a.dr,
        )
        .slice(0, limit);
}

export function drRank(d: Directory): number {
    return directories.findIndex((o) => o.id === d.id) + 1;
}

// A handful of scraped names collide across different domains (aitools.inc and
// aitoolsdirectory.com both call themselves "AI Tools Directory"). Those pages
// would otherwise ship identical titles and H1s, so the domain disambiguates.
const nameCounts = directories.reduce<Record<string, number>>((acc, d) => {
    acc[d.name] = (acc[d.name] ?? 0) + 1;
    return acc;
}, {});

export function displayName(d: Directory): string {
    return nameCounts[d.name] > 1 ? `${d.name} (${d.domain})` : d.name;
}
