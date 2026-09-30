import Script from "next/script";

export default function Scripts() {
    const domain = "scripts.howbrowserswork.com";

    return (
        <>
            <Script
                id="pianjs"
                src={`https://${domain}/static/files/pa.js`}
                data-hit-endpoint={`https://${domain}/p/pv`}
                data-event-endpoint={`https://${domain}/p/e`}
                data-session-endpoint={`https://${domain}/p/s`}
                strategy="afterInteractive"
            />
            <Script
                id="senja-site"
                src="https://widget.senja.io/widget/e345f5fa-a66b-4266-b3b6-0caf3d278b9d/platform.js"
                strategy="lazyOnload"
            />
            {/* 100% privacy-first analytics */}
            <Script
                id="simple-analytics"
                src="https://scripts.simpleanalyticscdn.com/latest.js"
                strategy="afterInteractive"
            />
        </>
    );
}
