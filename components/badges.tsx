import type { Directory } from "@/lib/directories";

export function DrBadge({ dr }: { dr: number }) {
    const tone =
        dr >= 60
            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
            : dr >= 40
              ? "bg-green-50 text-green-700 ring-green-600/20"
              : dr >= 25
                ? "bg-amber-50 text-amber-700 ring-amber-600/20"
                : "bg-slate-50 text-slate-600 ring-slate-500/20";

    return (
        <span
            title={`Domain Rating ${dr} of 100`}
            className={`inline-flex items-center rounded-md px-1.5 py-0.5 font-mono text-xs font-medium ring-1 ring-inset ${tone}`}
        >
            DR {dr}
        </span>
    );
}

export function LinkTypeBadge({ dofollow }: { dofollow: boolean | null }) {
    if (dofollow === null) {
        return (
            <span
                title="Link type not verified"
                className="inline-flex items-center rounded-md bg-slate-50 px-1.5 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-inset ring-slate-500/20"
            >
                Unverified
            </span>
        );
    }

    return (
        <span
            title={
                dofollow
                    ? "Passes link equity to your site"
                    : "Link is nofollow: traffic only, no link equity"
            }
            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                dofollow
                    ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                    : "bg-slate-50 text-slate-500 ring-slate-500/20"
            }`}
        >
            {dofollow ? "Dofollow" : "Nofollow"}
        </span>
    );
}

export function PricingBadge({
    pricing,
}: {
    pricing: NonNullable<Directory["pricing"]>;
}) {
    const colors = {
        Free: "bg-green-50 text-green-700",
        "Free/Paid": "bg-amber-50 text-amber-700",
        Freemium: "bg-blue-50 text-blue-700",
        Paid: "bg-rose-50 text-rose-700",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[pricing]}`}
        >
            {pricing}
        </span>
    );
}
