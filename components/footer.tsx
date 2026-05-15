export default function Footer() {
    return (
        <footer className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
            <hr className="w-full border-slate-200" />
            <p className="text-sm text-slate-500">
                Know a platform that should be listed here?{" "}
                <a
                    href="https://github.com/krasun/producthuntalternatives/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 font-semibold underline hover:text-blue-600"
                >
                    Suggest it on GitHub
                </a>
                .
            </p>
        </footer>
    );
}
