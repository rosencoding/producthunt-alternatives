import Script from "next/script";

/** Senja testimonial walls. Each placement uses its own widget. */
export const PROOF_WIDGETS = {
    sidebar: "3d7a549b-3616-4037-b735-849af89879e4",
    service: "ed6eef04-1b74-4c8b-a30b-393cf262b63d",
} as const;

export default function CustomerProof({
    widgetId = PROOF_WIDGETS.sidebar,
}: {
    widgetId?: string;
}) {
    return (
        <>
            {/* Script ids must stay unique — two widgets can share a page. */}
            <Script
                id={`senja-${widgetId}`}
                src={`https://widget.senja.io/widget/${widgetId}/platform.js`}
                strategy="lazyOnload"
            />
            <div
                className="senja-embed"
                data-id={widgetId}
                data-mode="shadow"
                data-lazyload="false"
                style={{ display: "block", width: "100%" }}
            />
        </>
    );
}
