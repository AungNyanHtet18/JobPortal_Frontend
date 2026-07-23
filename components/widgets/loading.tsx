import { BriefcaseBusiness, Building2, Loader2 } from "lucide-react"

export default function Loading({content} : {content : string}) {
     return (
        <section className="mx-auto max-w-7xl space-y-6 px-1 pb-8 text-zinc-950" aria-busy="true" aria-live="polite">
            <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-white">
                        <Loader2 className="size-5 animate-spin" />
                    </div>
                    <div>
                        <p className="text-base font-semibold text-zinc-950">Loading workspace</p>
                        <p className="text-sm text-zinc-500">{content}</p>
                    </div>
                </div>
                <div className="h-9 w-32 animate-pulse rounded-md bg-zinc-100" />
            </div>

            <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
                <aside className="space-y-4">
                    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <Building2 className="size-5 text-zinc-400" />
                            <div className="h-5 w-24 animate-pulse rounded bg-zinc-100" />
                        </div>

                        <div className="aspect-[4/5] w-full animate-pulse rounded-lg border border-zinc-200 bg-zinc-100" />

                        <div className="mt-5 space-y-3">
                            <div className="h-6 w-3/4 animate-pulse rounded bg-zinc-100" />
                            <div className="flex gap-2">
                                <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-100" />
                                <div className="h-6 w-28 animate-pulse rounded-full bg-zinc-100" />
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="space-y-6">
                    {[0, 1, 2].map((item) => (
                        <div key={item} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center gap-2 border-b border-zinc-100 pb-4">
                                <BriefcaseBusiness className="size-5 text-zinc-400" />
                                <div className="h-5 w-44 animate-pulse rounded bg-zinc-100" />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
                                    <div className="h-10 animate-pulse rounded-md bg-zinc-100" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-20 animate-pulse rounded bg-zinc-100" />
                                    <div className="h-10 animate-pulse rounded-md bg-zinc-100" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
     )
}
