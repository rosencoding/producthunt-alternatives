import Link from "next/link";
import Brand from "@/components/brand";
import { submissionUrl } from "@/lib/submission";
import {
    directories,
    directoryCount,
    dofollowCount,
} from "@/lib/directories";
import { hubs, DATA_YEAR } from "@/lib/hubs";

// One list, not two overlapping ones: the previous footer linked the same
// high-DR directories twice (once as "highest authority", once as "top
// dofollow"), which duplicated links to the same URLs on every page.
const popular = directories.slice(0, 10);

type FooterLink = { href: string; label: string; external?: boolean };

function LinkGroup({
    id,
    heading,
    links,
}: {
    id: string;
    heading: string;
    links: FooterLink[];
}) {
    return (
        <nav className="footer-group" aria-labelledby={id}>
            {/* Deliberately not a heading: four <h2>s per page would compete
                with the page's own outline on all 513 pages. */}
            <p className="footer-heading" id={id}>
                {heading}
            </p>
            <ul>
                {links.map((link) =>
                    link.external ? (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                target="_blank"
                                rel="noopener"
                            >
                                {link.label}
                            </a>
                        </li>
                    ) : (
                        <li key={link.href}>
                            <Link href={link.href}>{link.label}</Link>
                        </li>
                    ),
                )}
            </ul>
        </nav>
    );
}

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-container">
                <div className="footer-top">
                    <Brand loading="lazy" />
                    <p>
                        A free resource by{" "}
                        <a href={submissionUrl("footer_brand")}>
                            LaunchDirectories
                        </a>
                        . Built for your next launch.
                    </p>
                </div>

                <div className="footer-columns">
                    <LinkGroup
                        id="footer-categories"
                        heading="Directories by category"
                        links={hubs.map((h) => ({
                            href: `/${h.slug}`,
                            // shortName keeps these to one line; the full H1
                            // lives on the hub page itself.
                            label: `${h.shortName.charAt(0).toUpperCase()}${h.shortName.slice(1)} (${h.items.length})`,
                        }))}
                    />
                    <LinkGroup
                        id="footer-popular"
                        heading="Popular directories"
                        links={popular.map((d) => ({
                            href: d.curated ? `/directory/${d.id}` : d.url,
                            external: !d.curated,
                            label: `${d.name} · DR ${d.dr}`,
                        }))}
                    />
                    <LinkGroup
                        id="footer-resources"
                        heading="Resources"
                        links={[
                            {
                                href: "/directory-submission-sites",
                                label: `Full database (${directoryCount})`,
                            },
                            {
                                href: "/backlink-directories",
                                label: `Dofollow only (${dofollowCount})`,
                            },
                            {
                                href: "/methodology",
                                label: "How the data is collected",
                            },
                            { href: "/directories.json", label: "Data as JSON" },
                            { href: "/llms.txt", label: "llms.txt for AI agents" },
                            { href: "/sitemap.xml", label: "XML sitemap" },
                            {
                                href: submissionUrl("footer"),
                                label: "Submission service",
                                external: true,
                            },
                            {
                                href: "https://github.com/krasun/producthuntalternatives/issues",
                                label: "Suggest a directory",
                                external: true,
                            },
                        ]}
                    />
                    <div className="footer-group footer-about">
                        <p className="footer-heading">About this data</p>
                        <p>
                            {directoryCount} directories, {dofollowCount} of
                            them dofollow. Every URL is reachability-checked and
                            every Domain Rating is queried per domain rather
                            than copied from other lists.
                        </p>
                        <p>
                            Domain Rating and link type reflect what was
                            measured at the time of checking and can change
                            without notice. Verify before you rely on a
                            listing.
                        </p>
                    </div>
                </div>

                <p className="footer-legal">
                    Product Hunt Alternatives · {DATA_YEAR} · Not affiliated
                    with Product Hunt. Domain Rating by{" "}
                    <a href="https://ahrefs.com" rel="noopener">
                        Ahrefs
                    </a>
                    , used under the{" "}
                    <a
                        href="https://ahrefs.com/legal/domain-rating-license"
                        rel="noopener"
                    >
                        Domain Rating License
                    </a>
                    .
                </p>
            </div>
        </footer>
    );
}
