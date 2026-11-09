// Postbuild: emit a Markdown mirror of every page plus llms.txt, so AI agents
// can read and navigate the site without parsing the rendered HTML.
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import TurndownService from "turndown";

const outDir = path.join(process.cwd(), "out");
const SITE_URL = "https://producthuntalternatives.com";

const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
});

// Keep tables — they carry the DR / link-type data that matters most here.
// Cells are rendered by hand so anchors survive as Markdown links and the
// stacked name/domain spans do not run together.
function cellToMarkdown(node, siteUrl) {
    if (node.nodeType === 3) return node.nodeValue || "";
    if (node.nodeType !== 1) return "";

    if (node.getAttribute("aria-hidden") === "true") return "";

    if (node.nodeName === "A") {
        const text = (node.textContent || "").replace(/\s+/g, " ").trim();
        let href = node.getAttribute("href") || "";
        if (href.startsWith("/")) href = siteUrl + href;
        return href && text ? `[${text}](${href})` : text;
    }

    let out = "";
    for (const child of Array.from(node.childNodes)) {
        const text = cellToMarkdown(child, siteUrl);
        if (!text) continue;
        const className =
            child.nodeType === 1 ? child.getAttribute("class") || "" : "";
        // A "block" span is a second line in the cell (the domain under the name).
        out += (className.includes("block") && out.trim() ? " — " : "") + text;
    }
    return out;
}

turndown.addRule("table", {
    filter: "table",
    replacement: (_content, node) => {
        const rows = Array.from(node.getElementsByTagName("tr"));
        if (rows.length === 0) return "";

        const toCells = (tr) =>
            Array.from(tr.childNodes)
                .filter((cell) => cell.nodeType === 1)
                .map((cell) =>
                    cellToMarkdown(cell, SITE_URL)
                        .replace(/\s+/g, " ")
                        .trim()
                        .replace(/\|/g, "\\|"),
                );

        const [head, ...body] = rows;
        const headCells = toCells(head);
        const lines = [
            `| ${headCells.join(" | ")} |`,
            `| ${headCells.map(() => "---").join(" | ")} |`,
            ...body.map((tr) => `| ${toCells(tr).join(" | ")} |`),
        ];
        return `\n\n${lines.join("\n")}\n\n`;
    },
});

// Decorative favicons and badge icons carry no meaning for a reader.
turndown.addRule("decorative", {
    filter: (node) =>
        node.getAttribute && node.getAttribute("aria-hidden") === "true",
    replacement: () => "",
});

// Badges sit in a flex row; without a separator they run together as
// "DR 44DofollowFree/Paid".
turndown.addRule("badge", {
    filter: (node) =>
        node.nodeName === "SPAN" &&
        node.getAttribute("aria-hidden") !== "true" &&
        ["inline-flex", "metric-badge", "directory-meta"].some((cls) =>
            (node.getAttribute("class") || "").includes(cls),
        ),
    replacement: (content) => (content.trim() ? `${content.trim()} · ` : ""),
});

// Definition lists hold the "At a glance" stats.
turndown.addRule("definitionList", {
    filter: "dl",
    replacement: (_content, node) => {
        const terms = Array.from(node.getElementsByTagName("dt"));
        const defs = Array.from(node.getElementsByTagName("dd"));
        const lines = terms.map((dt, i) => {
            const term = (dt.textContent || "").replace(/\s+/g, " ").trim();
            const def = ((defs[i] && defs[i].textContent) || "")
                .replace(/\s+/g, " ")
                .trim();
            return `- **${term}**: ${def}`;
        });
        return `\n\n${lines.join("\n")}\n\n`;
    },
});

// The front matter already supplies an H1, so shift the page's own headings
// down a level rather than emitting two H1s.
for (const [tag, hashes] of [
    ["h1", "##"],
    ["h2", "###"],
    ["h3", "####"],
]) {
    turndown.addRule(`demote-${tag}`, {
        filter: tag,
        replacement: (content) =>
            `\n\n${hashes} ${content.replace(/\s+/g, " ").trim()}\n\n`,
    });
}

// Form controls, screen-reader-only labels, and complementary asides are UI,
// not content — flattened into Markdown they become unreadable run-on text.
turndown.remove([
    "script",
    "style",
    "noscript",
    "select",
    "option",
    "optgroup",
    "input",
    "button",
    "aside",
    "form",
]);

turndown.addRule("srOnly", {
    filter: (node) =>
        node.getAttribute &&
        (node.getAttribute("class") || "").split(/\s+/).includes("sr-only"),
    replacement: () => "",
});

async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === "_next") continue;
            files.push(...(await walk(full)));
        } else if (entry.name.endsWith(".html")) {
            files.push(full);
        }
    }
    return files;
}

function pick(html, regex) {
    const match = html.match(regex);
    return match ? match[1] : "";
}

function decode(value) {
    return value
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/&mdash;/g, "—")
        .replace(/&ndash;/g, "–");
}

const files = (await walk(outDir)).filter(
    (f) => !/(^|\/)(404|_not-found)\.html$/.test(f),
);

const pages = [];

for (const file of files) {
    const html = await readFile(file, "utf8");
    const main = pick(html, /<main[^>]*>([\s\S]*?)<\/main>/);
    if (!main) continue;

    const route =
        "/" +
        path
            .relative(outDir, file)
            .replace(/\\/g, "/")
            .replace(/\.html$/, "")
            .replace(/(^|\/)index$/, "");

    const title = decode(pick(html, /<title>([\s\S]*?)<\/title>/));
    const description = decode(
        pick(html, /<meta name="description" content="([^"]*)"/),
    );

    // React's text-splitting comments would otherwise land in the Markdown.
    const cleaned = main.replace(/<!--[\s\S]*?-->/g, "");
    const body = turndown
        .turndown(cleaned)
        // Make every internal link absolute so an agent can follow it directly.
        .replace(/\]\((\/[^)\s]*)\)/g, `](${SITE_URL}$1)`)
        .replace(/ · (\n|$)/g, "$1")
        .replace(/ · +/g, " · ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    const markdown = [
        `# ${title}`,
        "",
        description ? `> ${description}` : "",
        "",
        `Source: ${SITE_URL}${route === "/" ? "" : route}`,
        "",
        "---",
        "",
        body,
        "",
    ]
        .filter((line, i, all) => !(line === "" && all[i - 1] === ""))
        .join("\n");

    const target = path.join(outDir, `${route === "/" ? "/index" : route}.md`);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, markdown);

    pages.push({ route, title, description, markdown });
}

const routeOf = (p) => (p.route === "/" ? "/index.md" : `${p.route}.md`);
const home = pages.find((p) => p.route === "/");
const hubs = pages
    .filter((p) => p.route !== "/" && !p.route.startsWith("/directory/"))
    .sort((a, b) => a.route.localeCompare(b.route));
const details = pages
    .filter((p) => p.route.startsWith("/directory/"))
    .sort((a, b) => a.route.localeCompare(b.route));

// One machine-readable file exposes the full database without a thin profile
// page for every record.
const rows = JSON.parse(
    await readFile(path.join(process.cwd(), "lib", "directories.json"), "utf8"),
);
const categoryRoutes = {
    launchpad: "launch-platforms",
    startup: "startup-directories",
    software: "saas-directories",
    ai: "ai-tool-directories",
    community: "startup-communities",
};
const redirects = rows
    .filter((row) => !row.curated)
    .flatMap((row) => {
        const category = categoryRoutes[row.category];
        return [
            `/directory/${row.id} /${category} 301`,
            `/directory/${row.id}/ /${category} 301`,
            `/directory/${row.id}.md /${category}.md 301`,
        ];
    });
await writeFile(path.join(outDir, "_redirects"), `${redirects.join("\n")}\n`);
const generated = new Date().toISOString().slice(0, 10);
const categoryCounts = rows.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + 1;
    return acc;
}, {});

await writeFile(
    path.join(outDir, "directories.json"),
    JSON.stringify(
        {
            name: "Product Hunt Alternatives directory database",
            description:
                "Directories, launch platforms, and communities that accept product submissions. Every URL was reachability-checked; every Domain Rating comes from the Ahrefs free Domain Rating API, queried per domain rather than copied from other directory lists.",
            url: `${SITE_URL}/directories.json`,
            license: "https://creativecommons.org/licenses/by/4.0/",
            generated,
            count: rows.length,
            categories: categoryCounts,
            fields: {
                id: "Stable record slug; individually reviewed records have a /directory/<id> profile page",
                name: "Directory name",
                url: "Directory homepage",
                domain: "Registrable domain",
                dr: "Domain Rating 0-100 by Ahrefs (free Domain Rating API), for the root domain",
                category: "launchpad | startup | software | ai | community",
                dofollow: "true, false, or null when the link type has not been verified",
                pricing: "Free | Free/Paid | Freemium | Paid; present only where pricing has been recorded",
                description: "Hand-written blurb, present only on curated entries",
                curated: "true when the entry was reviewed by hand",
            },
            directories: rows.map((r) => ({
                ...r,
                page: r.curated
                    ? `${SITE_URL}/directory/${r.id}`
                    : `${SITE_URL}/${categoryRoutes[r.category]}`,
                markdown: r.curated
                    ? `${SITE_URL}/directory/${r.id}.md`
                    : `${SITE_URL}/${categoryRoutes[r.category]}.md`,
            })),
        },
        null,
        1,
    ) + "\n",
);

const llms = [
    "# Product Hunt Alternatives",
    "",
    `> A database of ${rows.length} directory and launch platform records where you can submit a product. ${details.length} hand-reviewed records have individual editorial profiles; the remaining records are available in the relevant category list. Every URL was reachability-checked and every Domain Rating comes from the Ahrefs free Domain Rating API rather than copied from other lists.`,
    "",
    "Every page below is also available as Markdown at the same path with a `.md` suffix.",
    "",
    "## Machine-readable data",
    "",
    `- [directories.json](${SITE_URL}/directories.json): the whole database as JSON — ${rows.length} entries with id, name, url, domain, Domain Rating, category, dofollow status, and the corresponding editorial or category page. Fetch this instead of crawling the database.`,
    `- [llms-full.txt](${SITE_URL}/llms-full.txt): every page's Markdown concatenated into one file.`,
    "",
    "## How to read the data",
    "",
    "- `dr` is Domain Rating on a 0-100 scale, by Ahrefs (free Domain Rating API, used under the Domain Rating License: https://ahrefs.com/legal/domain-rating-license). Ahrefs reports DR per root domain, so subdomain entries carry their parent domain's figure. It is a link metric, not a measure of traffic, relevance, or acceptance likelihood.",
    "- `dofollow: true` means the directory's outbound link passes authority; `false` means it does not; `null` means the link type was not verified. Link type can change without notice.",
    "- `category` is one of launchpad, startup, software, ai, community.",
    `- Data generated ${generated}. Every listed site returned a live response at that point; entries that had gone dead were removed rather than left in to pad the count.`,
    "",
    "## Start here",
    "",
    home ? `- [${home.title}](${SITE_URL}${routeOf(home)}): ${home.description}` : "",
    "",
    "## Category lists",
    "",
    ...hubs.map(
        (p) => `- [${p.title}](${SITE_URL}${routeOf(p)}): ${p.description}`,
    ),
    "",
    "## Individual directories",
    "",
    ...details.map((p) => `- [${p.title}](${SITE_URL}${routeOf(p)})`),
    "",
].filter((line, i, all) => !(line === "" && all[i - 1] === ""));

await writeFile(path.join(outDir, "llms.txt"), llms.join("\n"));

await writeFile(
    path.join(outDir, "llms-full.txt"),
    [home, ...hubs, ...details]
        .filter(Boolean)
        .map((p) => p.markdown)
        .join("\n\n---\n\n"),
);

console.log(
    `Markdown: ${pages.length} pages (${hubs.length} hubs, ${details.length} directories)`,
);
console.log("Wrote llms.txt and llms-full.txt");
