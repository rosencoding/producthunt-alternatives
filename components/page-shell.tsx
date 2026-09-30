import Link from "next/link";
import Footer from "@/components/footer";
import SiteHeader from "@/components/site-header";
import SubmitCta from "@/components/submit-cta";
import { hubs } from "@/lib/hubs";

export function Breadcrumbs({
    trail,
}: {
    trail: { name: string; href?: string }[];
}) {
    return (
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
            <ol className="flex flex-wrap items-center gap-1">
                {trail.map((step, i) => (
                    <li key={step.name} className="flex items-center gap-1">
                        {i > 0 && <span aria-hidden="true">/</span>}
                        {step.href ? (
                            <Link
                                href={step.href}
                                className="underline underline-offset-2 hover:text-slate-800"
                            >
                                {step.name}
                            </Link>
                        ) : (
                            <span className="text-slate-700">{step.name}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

export function HubNav({ current }: { current?: string }) {
    return (
        <nav
            aria-label="Directory categories"
            className="flex flex-wrap gap-2 text-sm"
        >
            {hubs.map((h) => {
                const active = h.slug === current;
                return (
                    <Link
                        key={h.slug}
                        href={`/${h.slug}`}
                        aria-current={active ? "page" : undefined}
                        className={`rounded-full border px-3 py-1 transition-colors ${
                            active
                                ? "border-slate-800 bg-slate-800 text-white"
                                : "border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900"
                        }`}
                    >
                        {h.h1.replace(/^\d+\s+/, "")}
                        <span className="ml-1 font-mono text-xs opacity-60">
                            {h.items.length}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}

export default function PageShell({
    children,
    currentHub,
    trail,
}: {
    children: React.ReactNode;
    currentHub?: string;
    trail: { name: string; href?: string }[];
}) {
    return (
        <>
            <SiteHeader current={currentHub} />
            <div className="mx-auto flex max-w-6xl gap-10 px-6 py-10 sm:px-10">
                <div className="min-w-0 flex-1 space-y-8">
                    <Breadcrumbs trail={trail} />
                    <main id="main-content" className="space-y-8">{children}</main>
                    <div className="xl:hidden">
                        <SubmitCta variant="inline" />
                    </div>
                    <HubNav current={currentHub} />
                </div>
                <div className="hidden w-72 shrink-0 xl:block">
                    <div className="sticky top-20 space-y-4">
                        <SubmitCta />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
