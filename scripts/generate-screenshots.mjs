import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { createHmac } from "node:crypto";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const alternativesPath = path.join(projectRoot, "lib", "alternatives.ts");
const outputDir = path.join(projectRoot, "public", "screenshots");
const force = process.argv.includes("--force");

await loadLocalEnv();

const accessKey = process.env.SCREENSHOTONE_ACCESS_KEY;
const secretKey = process.env.SCREENSHOTONE_SECRET_KEY;

if (!accessKey) {
    throw new Error("SCREENSHOTONE_ACCESS_KEY is required.");
}

const alternatives = await readAlternatives();

await mkdir(outputDir, { recursive: true });

for (const alternative of alternatives) {
    const outputPath = path.join(outputDir, `${alternative.id}.webp`);

    if (!force && (await exists(outputPath))) {
        console.log(`Skipping ${alternative.id}.webp`);
        continue;
    }

    const screenshotUrl = new URL("https://api.screenshotone.com/take");
    screenshotUrl.searchParams.set("access_key", accessKey);
    screenshotUrl.searchParams.set("url", alternative.url);
    screenshotUrl.searchParams.set("format", "webp");
    screenshotUrl.searchParams.set("viewport_width", "1280");
    screenshotUrl.searchParams.set("viewport_height", "720");
    screenshotUrl.searchParams.set("image_width", "640");
    screenshotUrl.searchParams.set("image_height", "360");
    screenshotUrl.searchParams.set("image_quality", "80");
    screenshotUrl.searchParams.set("block_cookie_banners", "true");
    screenshotUrl.searchParams.set("block_chats", "true");
    screenshotUrl.searchParams.set("ignore_host_errors", "true");

    if (secretKey) {
        screenshotUrl.searchParams.set(
            "signature",
            createHmac("sha256", secretKey)
                .update(screenshotUrl.searchParams.toString())
                .digest("hex"),
        );
    }

    console.log(`Capturing ${alternative.id}.webp`);

    const response = await fetch(screenshotUrl);

    if (!response.ok) {
        const message = await response.text();
        throw new Error(
            `ScreenshotOne failed for ${alternative.id}: ${response.status} ${message}`,
        );
    }

    const temporaryPath = `${outputPath}.tmp`;
    await writeFile(temporaryPath, Buffer.from(await response.arrayBuffer()));
    await rename(temporaryPath, outputPath);
}

async function readAlternatives() {
    const source = await readFile(alternativesPath, "utf8");
    const matches = source.matchAll(
        /\{\s*id:\s*"[^"]+"[^}]*pricing:\s*"[^"]+"[^}]*\}/g,
    );

    return Array.from(matches, ([block]) => {
        const id = block.match(/id:\s*"([^"]+)"/)?.[1];
        const url = block.match(/url:\s*"([^"]+)"/)?.[1];

        if (!id || !url) {
            throw new Error(`Could not parse alternative from block: ${block}`);
        }

        return { id, url };
    });
}

async function exists(filePath) {
    try {
        await readFile(filePath);
        return true;
    } catch {
        return false;
    }
}

async function loadLocalEnv() {
    const envPath = path.join(projectRoot, ".env.local");

    if (!(await exists(envPath))) {
        return;
    }

    const envFile = await readFile(envPath, "utf8");

    for (const line of envFile.split("\n")) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)=(.*)\s*$/);

        if (!match) {
            continue;
        }

        const [, key, value] = match;
        process.env[key] ??= value.replace(/^["']|["']$/g, "");
    }
}
