import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

const rows = JSON.parse(await readFile(new URL("../lib/directories.json", import.meta.url), "utf8"));
const publicDir = new URL("../public/", import.meta.url);
const mark = `<rect width="64" height="64" rx="12" fill="#3155a4"/><path d="M18 46 46 18M22 18h24v24" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;
const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">${mark}</svg>`;
await writeFile(new URL("logo.svg", publicDir), logo);
await writeFile(new URL("favicon.svg", publicDir), logo);
await sharp(Buffer.from(logo)).resize(192, 192).png().toFile(new URL("../app/icon.png", import.meta.url).pathname);
for (const [name, size] of [["favicon-32.png", 32], ["apple-touch-icon.png", 180]]) {
    await sharp(Buffer.from(logo)).resize(size, size).png().toFile(new URL(name, publicDir).pathname);
}
// ICO container with a PNG image; supported by current desktop browsers.
const png = await sharp(Buffer.from(logo)).resize(48, 48).png().toBuffer();
const ico = Buffer.alloc(22); ico.writeUInt16LE(1, 2); ico.writeUInt16LE(1, 4); ico[6] = 48; ico[7] = 48;
ico.writeUInt16LE(1, 10); ico.writeUInt16LE(32, 12); ico.writeUInt32LE(png.length, 14); ico.writeUInt32LE(22, 18);
await writeFile(new URL("favicon.ico", publicDir), Buffer.concat([ico, png]));
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#fafafa"/>
<g transform="translate(64 54)">${mark}</g>
<text x="146" y="82" font-family="Arial, sans-serif" font-size="20" font-weight="600" fill="#171717">Product Hunt</text><text x="146" y="108" font-family="Arial, sans-serif" font-size="20" font-weight="600" fill="#171717">Alternatives.</text>
<line x1="64" y1="158" x2="1136" y2="158" stroke="#e5e5e5"/>
<text x="64" y="271" font-family="Arial, sans-serif" font-size="64" font-weight="600" letter-spacing="-2" fill="#171717">Product Hunt alternatives.</text>
<text x="64" y="340" font-family="Arial, sans-serif" font-size="42" letter-spacing="-1" fill="#737373">Find your next place to launch.</text>
<text x="64" y="414" font-family="Arial, sans-serif" font-size="23" fill="#636363">${rows.length} directories, launch platforms, and communities.</text>
<text x="64" y="455" font-family="Arial, sans-serif" font-size="21" fill="#636363">Compare audiences, Domain Rating, and link types.</text>
<line x1="64" y1="534" x2="1136" y2="534" stroke="#e5e5e5"/>
<text x="64" y="584" font-family="Arial, sans-serif" font-size="17" fill="#525252">producthuntalternatives.com</text>
<text x="868" y="584" font-family="Arial, sans-serif" font-size="17" fill="#3155a4">By LaunchDirectories</text>
</svg>`;
await writeFile(new URL("og.svg", publicDir), og);
await sharp(Buffer.from(og)).png().toFile(new URL("og.png", publicDir).pathname);
console.log("Generated logo, favicon, Apple icon, and 1200×630 OG image.");
