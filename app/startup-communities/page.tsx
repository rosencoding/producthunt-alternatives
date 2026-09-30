import HubPage, { hubMetadata } from "@/components/hub-page";

const slug = "startup-communities";

export const metadata = hubMetadata(slug);

export default function Page() {
    return <HubPage slug={slug} />;
}
