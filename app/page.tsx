import CustomerProof from "@/components/customer-proof";
import ResultsProof from "@/components/results-proof";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import DirectoryExplorer from "@/components/directory-explorer";
import Favicon from "@/components/favicon";
import { directories, directoryCount, dofollowCount, findDirectory } from "@/lib/directories";
import { allAlternatives } from "@/lib/alternatives";
import { DATA_YEAR, SITE_URL, hubs } from "@/lib/hubs";
import { submissionUrl } from "@/lib/submission";

const picks = ["uneed", "hacker-news", "betalist", "devhunt", "peerlist", "fazier", "alternativeto", "saashub", "indie-hackers", "future-tools", "g2", "capterra"];
const ordered = [...directories].sort((a, b) => {
    const ai = picks.indexOf(a.id), bi = picks.indexOf(b.id);
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
}).map((directory) => ({ ...directory, description: directory.description || allAlternatives.find((a) => a.id === directory.id)?.description }));
const comparisons = [
    { id: "uneed", audience: "Indie products & useful tools", approach: "A dedicated product launch" },
    { id: "hacker-news", audience: "Developers & technical founders", approach: "A hands-on Show HN demo" },
    { id: "betalist", audience: "Early-stage startups", approach: "Early-adopter discovery" },
    { id: "devhunt", audience: "Developer tools", approach: "A launch for a technical audience" },
    { id: "alternativeto", audience: "People comparing software", approach: "Ongoing software discovery" },
    { id: "indie-hackers", audience: "Bootstrapped founders", approach: "Feedback & conversations" },
];
const faqs = [
    { question: "What are the best Product Hunt alternatives?", answer: "Start with your audience. Uneed and Peerlist are options for product launches; Show HN and DevHunt suit developer tools. BetaList focuses on early-stage startups, while AlternativeTo and SaaSHub help people discover software through comparisons. Choose a few relevant platforms rather than treating every directory as the same channel." },
    { question: "Where can I promote my startup for free?", answer: "Community channels such as Hacker News and Indie Hackers let you share useful work and join discussions. Follow each community’s rules and contribute before promoting. Some directories also offer free listings, but featured placements and expedited reviews may cost extra. Check the platform’s current submission terms." },
    { question: "How do I choose a directory for my product?", answer: "Prioritize audience fit, an active website, a relevant category, and clear submission requirements. Use Domain Rating and link type as additional comparison points. A high DR alone does not tell you whether a directory will send customers or accept your product." },
    { question: "Do directory submissions help SEO?", answer: "Relevant listings can help people discover your product and may earn links to your website. Results depend on the directory, editorial decisions, link attributes, and your wider SEO work. Neither a dofollow link nor a submission guarantees rankings or traffic." },
    { question: "Can someone handle the directory submissions for me?", answer: "Yes. Our LaunchDirectories service handles manual submissions using the product details you provide. Packages cover different numbers of directories and include a submission report. Visit the service page for current pricing and package details. Each directory controls its own approval process." },
    { question: "Does the submission service cover every platform listed here?", answer: `No. This guide covers ${directoryCount} directories, communities, and launch platforms for research. The LaunchDirectories service has its own package scope and chooses suitable submission destinations for your product. A community conversation or a coordinated launch may need your direct involvement.` },
];
const categoryCopy: Record<string, [string, string]> = {
    "ai-tool-directories": ["AI tools", "Reach people looking for their next AI tool."],
    "saas-directories": ["SaaS & software", "Get discovered by people comparing software."],
    "startup-directories": ["Startup directories", "Put your startup in front of early adopters."],
    "launch-platforms": ["Launch platforms", "Find a new audience for your next launch."],
    "startup-communities": ["Founder communities", "Find conversations, feedback, and fellow builders."],
    "backlink-directories": ["Dofollow directories", "Compare listing opportunities by link type."],
};

export default function IndexPage() {
    const schema = { "@context": "https://schema.org", "@graph": [
        { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "Product Hunt Alternatives", url: SITE_URL },
        { "@type": "CollectionPage", "@id": `${SITE_URL}/#webpage`, name: `Product Hunt Alternatives: ${directoryCount} Places to Launch`, url: SITE_URL, isPartOf: { "@id": `${SITE_URL}/#website` }, mainEntity: { "@id": `${SITE_URL}/#alternatives` } },
        { "@type": "ItemList", "@id": `${SITE_URL}/#alternatives`, name: "Product Hunt alternatives to compare", numberOfItems: comparisons.length, itemListElement: comparisons.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: findDirectory(item.id)?.name, url: `${SITE_URL}/directory/${item.id}` })) },
        { "@type": "FAQPage", mainEntity: faqs.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
    ] };
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
            <SiteHeader />
            <main id="main-content" className="home-page site-container">
                <header className="home-intro">
                    <p className="intro-label">The product launch directory · {DATA_YEAR}</p>
                    <h1>Product Hunt alternatives.</h1>
                    <p>Compare {directoryCount} Product Hunt alternatives by audience, Domain Rating, and link type. Find the right directories, or let LaunchDirectories handle the submissions for you.</p>
                    <div className="intro-actions">
                        <a href={submissionUrl("hero")} className="button-primary hero-submit">Let us handle the submissions <span aria-hidden="true">↗</span></a>
                        <a href="#explore" className="text-link">Explore directories <span aria-hidden="true">↓</span></a>
                    </div>
                    <p className="hero-service-note">Manual submissions · Product details shared once · Submission report included</p>
                </header>

                <div className="browse-layout">
                    <aside className="browse-sidebar" aria-label="Categories and submission service">
                        <section className="sidebar-service" aria-labelledby="sidebar-service-title">
                            <p className="service-provider">LaunchDirectories <span>Done for you</span></p>
                            <h2 id="sidebar-service-title">We submit 30&ndash;100 directories by hand.</h2>
                            <p>Share your product once. Our team handles the manual submissions while you focus on building.</p>
                            <ul className="service-benefits">
                                <li>30+ to 100+ directory packages</li>
                                <li>Manual submissions by our team</li>
                                <li>A detailed submission report</li>
                            </ul>
                            <a href={submissionUrl("home_sidebar")} className="button-primary">See packages & pricing <span aria-hidden="true">↗</span></a>
                            <div className="service-proof"><p>Reviews from LaunchDirectories customers</p><CustomerProof /></div>
                        </section>
                        <section className="sidebar-categories">
                            <h2>Browse by category</h2>
                            <nav aria-label="Directory categories">
                                <Link href="/directory-submission-sites">All directories <span>{directoryCount}</span></Link>
                                {hubs.filter((hub) => categoryCopy[hub.slug]).map((hub) => (
                                    <Link href={`/${hub.slug}`} key={hub.slug}>{categoryCopy[hub.slug][0]} <span>{hub.items.length}</span></Link>
                                ))}
                            </nav>
                        </section>
                        <p className="sidebar-note">Free to browse. {dofollowCount} directories marked dofollow. Check each platform’s current submission terms.</p>
                    </aside>
                    <section id="explore" className="browse-results">
                        <div className="section-heading"><h2>Explore launch platforms & directories</h2><span>{directoryCount} platforms</span></div>
                        <DirectoryExplorer items={ordered} />
                    </section>
                </div>

                <section className="content-section" id="quick-picks">
                    <h2>Which Product Hunt alternative is best for your product?</h2>
                    <p className="section-intro">Choose for audience fit. Uneed suits product launches, Show HN and DevHunt reach developers, and AlternativeTo helps people compare software. Use this shortlist to decide where to start.</p>
                    <div className="comparison-wrap">
                        <table className="comparison-table">
                            <caption className="sr-only">Compare Product Hunt alternatives by audience and approach</caption>
                            <thead><tr><th scope="col">Platform</th><th scope="col">Best suited to</th><th scope="col">How to use it</th><th scope="col">Details</th></tr></thead>
                            <tbody>{comparisons.map((item) => {
                                const directory = findDirectory(item.id);
                                return directory && <tr key={item.id}>
                                    <th scope="row"><Link href={`/directory/${item.id}`} className="flex items-center gap-3"><Favicon directory={directory} size={20} />{directory.name}</Link></th>
                                    <td>{item.audience}</td><td>{item.approach}</td>
                                    <td><Link href={`/directory/${item.id}`} aria-label={`View ${directory.name} details`}>View ↗</Link></td>
                                </tr>;
                            })}</tbody>
                        </table>
                    </div>
                </section>

                <section id="launch-guide" className="content-section">
                    <h2>How to launch beyond Product Hunt</h2>
                    <p className="section-intro">Use launch platforms for an introduction, directories for ongoing discovery, and communities for feedback. Each channel serves a different purpose.</p>
                    <ol className="guide-steps">
                        <li><h3>1. Find your audience</h3><p>Start with a few relevant platforms. Compare audience, category, submission requirements, and link type. A high DR alone does not tell you whether a directory will send customers.</p></li>
                        <li><h3>2. Prepare your submission</h3><p>Have your tagline, product description, logo, screenshots, pricing, and website ready. Adapt the copy to each platform’s audience and requirements.</p></li>
                        <li><h3>3. Launch and learn</h3><p>Space out your launches, reply to feedback, and track referral visits and signups. Focus on the channels that bring relevant users.</p></li>
                    </ol>
                </section>

                <section id="submission-service" className="service-section">
                    <div className="service-section-row">
                        <div>
                            <h2>LaunchDirectories submits your startup for you</h2>
                            <p>We manually submit your startup to 100+ directories. Here is what those listings do once they are live:</p>
                            <ul className="service-outcomes">
                                <li><strong>Dofollow backlinks</strong> from directories that pass authority, which is what moves your Domain Rating.</li>
                                <li><strong>Referral visitors</strong> from people already browsing directories for a tool like yours.</li>
                                <li><strong>Search visibility</strong>, because directory listings rank for &ldquo;best X tools&rdquo; and &ldquo;X alternatives&rdquo; long after launch week.</li>
                                <li><strong>AI citations</strong>, since ChatGPT and Perplexity pull from the same directories when they recommend tools.</li>
                            </ul>
                            <a href={submissionUrl("service_section")} className="button-primary">See packages &amp; pricing ↗</a>
                        </div>
                        <div className="service-section-figure"><ResultsProof /></div>
                    </div>
                </section>

                <section className="content-section faq-section">
                    <h2>Product Hunt alternatives: frequently asked questions</h2>
                    {faqs.map(({ question, answer }) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}
                </section>
                <section className="methodology">
                    <h2>About this directory</h2>
                    <p>The database contains {directoryCount} platforms. Domain Rating is sourced from the Ahrefs free Domain Rating API, and link types reflect the stored checks. Metrics, pricing, and submission rules can change; confirm details with each platform. Curated picks are starting points, not a guarantee of results.</p>
                </section>
            </main>
            <Footer />
        </>
    );
}
