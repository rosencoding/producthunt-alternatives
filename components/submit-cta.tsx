import { submissionUrl } from "@/lib/submission";
import CustomerProof from "@/components/customer-proof";

/**
 * LaunchDirectories done-for-you submission service, with the Senja
 * testimonial wall folded into the same card as social proof. Rendered in the
 * sidebar on wide screens and inline in the page flow on narrow ones.
 */
export default function SubmitCta({
    variant = "card",
}: {
    variant?: "card" | "inline";
}) {
    return (
        <aside
            aria-label="LaunchDirectories submission service"
            className={`overflow-hidden rounded-lg border ${
                variant === "card"
                    ? "border-slate-200 bg-white"
                    : "border-neutral-200 bg-neutral-50"
            }`}
        >
            <div className="p-4">
                <h2
                    className="text-balance text-base font-semibold leading-6 text-slate-900"
                >
                    LaunchDirectories submits for you
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    Spend less time on forms. Our team handles manual directory
                    submissions and sends you a report. Packages cover 30+ to 100+ directories.
                </p>
                <a
                    href={submissionUrl(`directory_${variant}`)}
                    target="_blank"
                    rel="noopener"
                    className="group mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--brand-hover)]"
                >
                    See submission packages
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                    >
                        <path d="M4 10h11M11 6l4 4-4 4" />
                    </svg>
                </a>
            </div>

            <div className="border-t border-slate-200 bg-slate-50/70 px-4 py-3">
                <CustomerProof />
            </div>
        </aside>
    );
}
