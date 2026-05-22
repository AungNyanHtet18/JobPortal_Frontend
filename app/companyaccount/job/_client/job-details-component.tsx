'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Loading from "@/components/widgets/loading"
import PageTitle from "@/components/widgets/page-title"
import { JobDetails } from "@/lib/type/schema/job/job.schema"
import { safeCall } from "@/lib/utils"
import { BriefcaseBusiness, Building2, DollarSign, Globe, Layers, MapPin, Pencil, Phone } from "lucide-react"
import * as Job from "@/lib/actions/job/job.action"

export default function JobDetailsComponent({jobId}: {jobId: string}) {
    const [details, setDetails] = useState<JobDetails>()

    useEffect(() => {
        function load() {
            safeCall(async () => {
                const result = await Job.findJobByIdAction(jobId)
                setDetails(result)
            })
        }

        load()
    }, [jobId])

    if(!details) {
        return <Loading />
    }

    const description = details.jobDescription ?? details.JobDescription ?? "No job description added."
    const salary = details.salary?.toString()

    return (
        <section className="mx-auto max-w-7xl space-y-6 px-1 pb-8 text-zinc-950">
            <PageTitle
                icon="BriefcaseBusiness"
                title="Job Detail"
                description="Review the published job information"
            />

            <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
                <aside className="space-y-4">
                    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                        <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center">
                            <div className="flex size-24 items-center justify-center rounded-lg bg-zinc-950 text-white">
                                <BriefcaseBusiness className="size-12" />
                            </div>
                            <p className="mt-5 text-sm font-medium text-zinc-500">Open Position</p>
                            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">{details.positionName}</h1>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                            <Badge variant="outline" className="border-zinc-300 bg-white text-zinc-900">
                                {details.jobLevel}
                            </Badge>
                            <Badge className="bg-zinc-950 text-white hover:bg-zinc-800">
                                {details.jobType}
                            </Badge>
                        </div>

                        <Button asChild className="mt-5 w-full bg-zinc-950 text-white hover:bg-zinc-800">
                            <Link href={`/companyaccount/job?jobId=${details.jobId}`}>
                                <Pencil className="size-4" />
                                Edit Job
                            </Link>
                        </Button>
                    </div>
                </aside>

                <div className="space-y-6">
                    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                        <div className="mb-5 flex items-center gap-2 border-b border-zinc-100 pb-4">
                            <BriefcaseBusiness className="size-5 text-zinc-900" />
                            <h2 className="text-base font-semibold">Job Description</h2>
                        </div>
                        <p className="whitespace-pre-line text-sm leading-7 text-zinc-700">
                            {description}
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center gap-2 border-b border-zinc-100 pb-4">
                                <Layers className="size-5 text-zinc-900" />
                                <h2 className="text-base font-semibold">Level</h2>
                            </div>
                            <p className="text-2xl font-semibold text-zinc-950">{details.jobLevel}</p>
                            <p className="mt-1 text-sm text-zinc-500">Required experience level</p>
                        </div>

                        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center gap-2 border-b border-zinc-100 pb-4">
                                <MapPin className="size-5 text-zinc-900" />
                                <h2 className="text-base font-semibold">Type</h2>
                            </div>
                            <p className="text-2xl font-semibold text-zinc-950">{details.jobType}</p>
                            <p className="mt-1 text-sm text-zinc-500">Work arrangement</p>
                        </div>

                        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center gap-2 border-b border-zinc-100 pb-4">
                                <DollarSign className="size-5 text-zinc-900" />
                                <h2 className="text-base font-semibold">Salary</h2>
                            </div>
                            <p className="text-2xl font-semibold text-zinc-950">{salary || "Not added"}</p>
                            <p className="mt-1 text-sm text-zinc-500">Compensation</p>
                        </div>
                    </div>

                    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                        <div className="mb-5 flex items-center gap-2 border-b border-zinc-100 pb-4">
                            <Building2 className="size-5 text-zinc-900" />
                            <h2 className="text-base font-semibold">Company Information</h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                <p className="text-xs font-medium uppercase text-zinc-500">Company</p>
                                <p className="mt-1 text-sm font-medium text-zinc-950">{details.companyName}</p>
                            </div>

                            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                <p className="text-xs font-medium uppercase text-zinc-500">Website</p>
                                <p className="mt-1 truncate text-sm font-medium text-zinc-950">{details.companyWebsite || "No website added"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center gap-2 border-b border-zinc-100 pb-4">
                                <MapPin className="size-5 text-zinc-900" />
                                <h2 className="text-base font-semibold">Location</h2>
                            </div>
                            <p className="text-sm leading-7 text-zinc-700">
                                {details.companyLocation || "No location added."}
                            </p>
                        </div>

                        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <Phone className="size-5 text-zinc-900" />
                                <h2 className="text-base font-semibold">Contact</h2>
                            </div>
                            <div className="space-y-4 text-sm">
                                <div className="flex gap-3">
                                    <Phone className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                                    <span className="text-zinc-800">{details.companyPhone || "No phone added"}</span>
                                </div>
                                <Separator />
                                <div className="flex gap-3">
                                    <Globe className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                                    <span className="min-w-0 truncate text-zinc-800">{details.companyWebsite || "No website added"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
