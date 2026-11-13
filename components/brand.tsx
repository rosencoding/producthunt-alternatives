import Link from "next/link";

/**
 * `eager` is right for the header logo — it sits above the fold, where lazy
 * loading only delays paint. The footer copy opts into lazy instead.
 *
 * The logo is decorative: the link already carries an `aria-label` and the
 * brand name sits beside it as real text, so alt text here would make a
 * screen reader announce the name three times. `aria-hidden` says that
 * outright — the same marking the favicons use — which also stops crawlers
 * reporting the empty alt as an oversight.
 */
export default function Brand({ loading = "eager" }: { loading?: "eager" | "lazy" }) {
    return (
        <Link href="/" aria-label="Product Hunt Alternatives home" className="flex shrink-0 items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" aria-hidden="true" width={28} height={28} loading={loading} decoding="async" />
            <span className="text-[12px] font-semibold leading-[1.2] tracking-tight text-neutral-900">
                Product Hunt<span className="block">Alternatives.</span>
            </span>
        </Link>
    );
}
