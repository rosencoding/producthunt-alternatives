// Downloads each directory's favicon from Google's favicon service once, so the
// site serves them itself instead of firing 500+ third-party requests per page.
import { mkdir, writeFile, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const outputDir = path.join(projectRoot, "public", "favicons");
const force = process.argv.includes("--force");
const SIZE = 64;
const CONCURRENCY = 12;

const data = JSON.parse(
    await readFile(path.join(projectRoot, "lib", "directories.json"), "utf8"),
);

await mkdir(outputDir, { recursive: true });
const existing = new Set(await readdir(outputDir).catch(() => []));

const queue = data.filter(
    (d) => force || !existing.has(`${d.domain}.png`),
);

console.log(`${data.length} directories, ${queue.length} favicons to fetch`);

let done = 0;
const failures = [];

async function worker() {
    for (;;) {
        const d = queue.shift();
        if (!d) return;

        const url =
            `https://www.google.com/s2/favicons?domain=${encodeURIComponent(d.domain)}&sz=${SIZE}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const buffer = Buffer.from(await response.arrayBuffer());
            if (buffer.length === 0) throw new Error("empty body");
            await writeFile(path.join(outputDir, `${d.domain}.png`), buffer);
        } catch (error) {
            failures.push({ domain: d.domain, reason: String(error) });
        }

        done += 1;
        if (done % 50 === 0) console.log(`  ${done}/${done + queue.length}`);
    }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

// Record which domains actually have an icon so the UI can fall back to a
// monogram instead of rendering a broken image.
const available = new Set(
    (await readdir(outputDir))
        .filter((f) => f.endsWith(".png"))
        .map((f) => f.slice(0, -".png".length)),
);
await writeFile(
    path.join(projectRoot, "lib", "favicons.json"),
    JSON.stringify(
        data.map((d) => d.domain).filter((d) => available.has(d)).sort(),
        null,
        1,
    ) + "\n",
);

console.log(`Fetched ${done - failures.length}, failed ${failures.length}`);
console.log(`${available.size}/${data.length} domains have a favicon`);
for (const f of failures.slice(0, 20)) console.log(`  FAILED ${f.domain}: ${f.reason}`);
