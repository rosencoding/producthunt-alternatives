import HubPage, { hubMetadata } from "@/components/hub-page";

const slug = "directory-submission-sites";

export const metadata = hubMetadata(slug);

export default function Page() {
    return <HubPage slug={slug} />;
}
