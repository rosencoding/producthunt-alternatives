/**
 * A customer's own analytics around their LaunchDirectories submission.
 * Self-hosted rather than hotlinked from Senja's S3 bucket, so the image keeps
 * working if that URL moves and it is served from the site's own CDN.
 */
export default function ResultsProof() {
    return (
        <figure className="proof-figure">
            <p className="proof-label">Case study &middot; BlitzReels</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/proof/launchdirectories-results.webp"
                alt="DataFast analytics for BlitzReels over 30 days. An arrow labelled “launching on LaunchDirectories” points to the traffic line turning upward in mid-August, alongside revenue of $1,643, up 119%, and conversion rate up 528%."
                width={1496}
                height={851}
                loading="lazy"
                decoding="async"
                className="proof-image"
            />
            <figcaption className="proof-caption">
                BlitzReels&rsquo; own analytics around their LaunchDirectories
                submission, shared by the customer. Results depend on your
                product, the directories you pick, and their approval
                decisions.
            </figcaption>
        </figure>
    );
}
