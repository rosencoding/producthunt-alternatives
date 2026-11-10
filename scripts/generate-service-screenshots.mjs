/**
 * Captures a screenshot of each submission service's pricing page for
 * /directory-submission-services.
 *
 * Unlike generate-screenshots.mjs, which uses the ScreenshotOne API for the
 * 500-odd directory profiles, this one drives the locally installed Chrome in
 * headless mode: twelve pages do not justify an API key, and the vendor pages
 * here need re-capturing whenever their promo pricing rotates.
 *
 *   npm run screenshots:services            # skips ids already captured
 *   npm run screenshots:services -- --force # re-captures everything
 *
 * Writes public/screenshots/services/<id>.webp and lib/service-screenshots.json
 * listing which ids actually have one, so the page renders an image only where
 * it exists and the build never depends on this script having run.
 */
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import process from "node:process";

const run = promisify(execFile);

const projectRoot = process.cwd();
const servicesPath = path.join(projectRoot, "lib", "submission-services.ts");
const outputDir = path.join(projectRoot, "public", "screenshots", "services");
const manifestPath = path.join(projectRoot, "lib", "service-screenshots.json");
const tmpDir = path.join(projectRoot, ".screenshot-tmp");
const force = process.argv.includes("--force");

const CHROME =
    process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const services = await readServices();
await mkdir(outputDir, { recursive: true });
await mkdir(tmpDir, { recursive: true });

const captured = [];

for (const service of services) {
    const outputPath = path.join(outputDir, `${service.id}.webp`);

    if (!force && (await exists(outputPath))) {
        console.log(`Skipping ${service.id}.webp`);
        captured.push(service.id);
        continue;
    }

    const rawPath = path.join(tmpDir, `${service.id}.png`);
    console.log(`Capturing ${service.id} from ${service.url}`);

    try {
        await run(
            CHROME,
            [
                "--headless",
                "--disable-gpu",
                "--hide-scrollbars",
                // Lets lazy-loaded hero content settle before the shot.
                "--virtual-time-budget=9000",
                "--window-size=1280,800",
                `--screenshot=${rawPath}`,
                service.url,
            ],
            { timeout: 60_000 },
        );
    } catch (error) {
        // Chrome writes the file and *then* sometimes trips its own teardown
        // watchdog, so a non-zero exit is only fatal if no image came out.
        if (!(await exists(rawPath))) {
            console.warn(`  capture failed, skipping (${error.message})`);
            continue;
        }
        console.warn(`  chrome exited noisily but wrote the file; keeping it`);
    }

    if (!(await exists(rawPath))) {
        console.warn(`  no file produced, skipping`);
        continue;
    }

    // 1280x800 down to a 640-wide webp, matching the directory screenshots.
    await run("cwebp", ["-q", "80", "-resize", "640", "0", rawPath, "-o", outputPath]);
    captured.push(service.id);
}

await rm(tmpDir, { recursive: true, force: true });
await writeFile(manifestPath, `${JSON.stringify(captured.sort(), null, 4)}\n`);
console.log(`\n${captured.length} of ${services.length} captured.`);

/**
 * Only services whose own site was reachable at the last check are worth
 * screenshotting; `sourced` carries that verdict.
 */
async function readServices() {
    const source = await readFile(servicesPath, "utf8");
    const blocks = source.matchAll(/\{\s*id: "(.+?)",\s*name:[\s\S]*?\n    \},/g);

    return Array.from(blocks, ([block, id]) => ({
        id,
        // Prefer the dedicated pricing page where one exists: the homepage
        // hero is often covered by a newsletter popup.
        url:
            block.match(/\n        screenshotUrl: "([^"]+)"/)?.[1] ??
            block.match(/\n        url: "([^"]+)"/)?.[1],
        sourced: block.match(/\n        sourced: "([^"]+)"/)?.[1],
    })).filter(
        (s) =>
            s.url?.startsWith("http") &&
            s.sourced === "vendor" &&
            s.id !== "diy",
    );
}

async function exists(filePath) {
    try {
        await readFile(filePath);
        return true;
    } catch {
        return false;
    }
}
