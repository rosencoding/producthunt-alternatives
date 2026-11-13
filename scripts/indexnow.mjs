// Pings IndexNow with every URL in the built sitemap, so Bing and Yandex pull
// changes instead of waiting for a crawl. Run it after a deploy is live — the
// endpoint fetches the key file over HTTP before it accepts a submission.
import { readFile } from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://producthuntalternatives.com";
const KEY = "e4daed575cd746cab53b42ae5f5ae731";
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";

const host = new URL(SITE_URL).host;

// The sitemap is the single source of truth for what is publishable, so this
// never drifts from what the build actually emitted.
const sitemap = await readFile(
    path.join(process.cwd(), "out", "sitemap.xml"),
    "utf8",
);
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

if (urlList.length === 0) {
    console.error("No URLs in out/sitemap.xml — run `npm run build` first.");
    process.exit(1);
}

// IndexNow rejects the whole batch if the key file is unreachable, so check it
// first and fail with a message that says what to fix.
const keyCheck = await fetch(KEY_LOCATION);
const keyBody = keyCheck.ok ? (await keyCheck.text()).trim() : null;
if (keyBody !== KEY) {
    console.error(
        `Key file not live at ${KEY_LOCATION} (HTTP ${keyCheck.status}).`,
    );
    console.error("Deploy first, then re-run.");
    process.exit(1);
}

const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: KEY, keyLocation: KEY_LOCATION, urlList }),
});

// 200 and 202 both mean accepted; 202 just means the key is still being checked.
if (!response.ok) {
    console.error(
        `IndexNow returned ${response.status} ${response.statusText}`,
    );
    console.error(await response.text());
    process.exit(1);
}

console.log(`Submitted ${urlList.length} URLs to IndexNow (${response.status}).`);
