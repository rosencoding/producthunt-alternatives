import Link from "next/link";

/**
 * `eager` is right for the header logo — it sits above the fold, where lazy
 * loading only delays paint. The footer copy opts into lazy instead.
 */
export default function Brand({ loading = "eager" }: { loading?: "eager" | "lazy" }) {
    return (
        <Link href="/" aria-label="Product Hunt Alternatives home" className="flex shrink-0 items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" width={28} height={28} loading={loading} decoding="async" />
            <span className="text-[12px] font-semibold leading-[1.2] tracking-tight text-neutral-900">
                Product Hunt<span className="block">Alternatives.</span>
            </span>
        </Link>
    );
}
