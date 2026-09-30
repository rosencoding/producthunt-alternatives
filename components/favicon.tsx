import faviconDomains from "@/lib/favicons.json";
import type { Directory } from "@/lib/directories";

const available = new Set<string>(faviconDomains);

const MONOGRAM_TONES = [
    "bg-slate-100 text-slate-600",
    "bg-blue-50 text-blue-700",
    "bg-emerald-50 text-emerald-700",
    "bg-amber-50 text-amber-700",
    "bg-violet-50 text-violet-700",
];

/**
 * Directory favicon, fetched once from Google's favicon service and served
 * from this site. Domains Google has no icon for fall back to a monogram.
 */
export default function Favicon({
    directory,
    size = 20,
}: {
    directory: Pick<Directory, "domain" | "name">;
    size?: number;
}) {
    if (available.has(directory.domain)) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={`/favicons/${directory.domain}.png`}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                width={size}
                height={size}
                className="shrink-0 rounded-sm"
                style={{ width: size, height: size }}
            />
        );
    }

    const letter = directory.name.replace(/[^A-Za-z0-9]/g, "").charAt(0) || "?";
    const tone =
        MONOGRAM_TONES[
            directory.domain.length % MONOGRAM_TONES.length
        ];

    return (
        <span
            aria-hidden="true"
            className={`inline-flex shrink-0 items-center justify-center rounded-sm text-[0.6rem] font-semibold uppercase ${tone}`}
            style={{ width: size, height: size }}
        >
            {letter}
        </span>
    );
}
