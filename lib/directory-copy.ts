import { hubForCategory } from "@/lib/hubs";
import {
    byCategory,
    categoryMeta,
    directories,
    directoryCount,
    drRank,
    type Directory,
} from "@/lib/directories";

function median(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2
        ? sorted[mid]
        : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

export type DirectoryFacts = {
    /** Human name of the set the ranks are measured against. */
    peerSetName: string;
    overallRank: number;
    categoryRank: number;
    categorySize: number;
    categoryMedianDr: number;
    percentile: number;
    topTier: boolean;
};

export function directoryFacts(d: Directory): DirectoryFacts {
    // Rank against the category hub the page links to, so the stat and the
    // "see all N" link always agree.
    const hub = hubForCategory(d.category);
    const peers = hub?.items ?? byCategory(d.category);
    const peerSetName = hub?.shortName ?? categoryMeta[d.category].plural.toLowerCase();
    const categoryRank = peers.findIndex((o) => o.id === d.id) + 1;
    const overallRank = drRank(d);

    return {
        peerSetName,
        overallRank,
        categoryRank,
        categorySize: peers.length,
        categoryMedianDr: median(peers.map((o) => o.dr)),
        percentile: Math.round(
            ((directoryCount - overallRank + 1) / directoryCount) * 100,
        ),
        topTier: overallRank <= Math.ceil(directoryCount * 0.1),
    };
}

/** Two fact-derived paragraphs for directories without a hand-written blurb. */
export function describeDirectory(d: Directory, f: DirectoryFacts): string[] {
    const cat = categoryMeta[d.category];
    const vsMedian = d.dr - f.categoryMedianDr;

    const standing = f.topTier
        ? `That puts it in the top 10% of every directory tracked here`
        : vsMedian > 8
          ? `That sits well above the ${f.categoryMedianDr} median for this category`
          : vsMedian >= -5
            ? `That is close to the ${f.categoryMedianDr} median for this category`
            : `That is below the ${f.categoryMedianDr} median for this category`;

    const first =
        `${d.name} (${d.domain}) is a ${cat.labelLower} with a Domain Rating of ${d.dr}, ` +
        `ranking ${f.categoryRank} of ${f.categorySize} among ${f.peerSetName} and ${f.overallRank} of ${directoryCount} overall. ` +
        `${standing}.`;

    const linkClause =
        d.dofollow === true
            ? `Its outbound links are dofollow, so a listing passes authority to your own domain as well as sending referral traffic.`
            : d.dofollow === false
              ? `Its outbound links are nofollow, so a listing will not pass authority to your domain. The value here is referral traffic and the brand mention, not SEO.`
              : `Its link type has not been verified, so treat any SEO benefit as unconfirmed and judge the listing on referral traffic instead.`;

    const priority =
        d.dr >= 50
            ? `At this authority level the listing is worth the submission effort even if approval takes a few weeks.`
            : d.dr >= 30
              ? `Authority is moderate, so submit it as part of a batch rather than as a priority on its own.`
              : `Authority is low, so only submit if the audience is a genuine fit for your product. A listing here will not move your rankings by itself.`;

    return [first, `${linkClause} ${priority}`];
}

export function relatedHubLinks(d: Directory) {
    const cat = categoryMeta[d.category];
    return {
        categoryHref: `/${cat.slug}`,
        categoryLabel: cat.plural,
    };
}

export { directories };
