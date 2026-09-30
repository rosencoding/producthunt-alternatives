export function submissionUrl(placement: string) {
    const url = new URL("https://launchdirectories.com/submit");
    url.searchParams.set("utm_source", "producthuntalternatives.com");
    url.searchParams.set("utm_medium", "referral");
    url.searchParams.set("utm_campaign", "directory_submission");
    url.searchParams.set("utm_content", placement);
    return url.toString();
}
