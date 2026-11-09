import Link from "next/link";
import { DrBadge, LinkTypeBadge } from "@/components/badges";
import Favicon from "@/components/favicon";
import {
    categoryMeta,
    directoryPageHref,
    displayName,
    type Directory,
} from "@/lib/directories";

export default function DirectoryTable({
    items,
    showCategory = true,
}: {
    items: Directory[];
    showCategory?: boolean;
}) {
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                        <th scope="col" className="px-3 py-2 font-medium">
                            #
                        </th>
                        <th scope="col" className="px-3 py-2 font-medium">
                            Directory
                        </th>
                        <th scope="col" className="px-3 py-2 font-medium">
                            DR
                        </th>
                        <th scope="col" className="px-3 py-2 font-medium">
                            Link
                        </th>
                        {showCategory && (
                            <th scope="col" className="px-3 py-2 font-medium">
                                Category
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {items.map((d, i) => (
                        <tr key={d.id} className="align-middle">
                            <td className="dir-rank">{i + 1}</td>
                            <td className="px-3 py-2">
                                <div className="dir-cell">
                                    <Favicon directory={d} />
                                    <span>
                                        {d.curated ? (
                                            <Link
                                                href={directoryPageHref(d)}
                                                className="dir-name"
                                            >
                                                {displayName(d)}
                                            </Link>
                                        ) : (
                                            <a
                                                href={d.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="dir-name"
                                            >
                                                {displayName(d)}
                                            </a>
                                        )}
                                        <span className="dir-domain">
                                            {d.domain}
                                        </span>
                                    </span>
                                </div>
                            </td>
                            <td className="px-3 py-2">
                                <DrBadge dr={d.dr} />
                            </td>
                            <td className="px-3 py-2">
                                <LinkTypeBadge dofollow={d.dofollow} />
                            </td>
                            {showCategory && (
                                <td className="px-3 py-2 text-xs text-slate-500">
                                    {categoryMeta[d.category].label}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
