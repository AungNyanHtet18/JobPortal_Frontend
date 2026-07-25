'use client'

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import Loading from "@/components/widgets/loading"
import * as companyClient from "@/lib/actions/company/company.action"
import * as authClient from "@/lib/actions/auth.action"
import { CompanyDetails } from "@/lib/type/schema/company/company.schema"
import { getInitials, safeCall } from "@/lib/utils"
import { ArrowRightIcon, Globe, MapPinned, Phone, PhoneCall } from "lucide-react"
import PageDetailComponent from "@/components/widgets/page-detail-component"
import Link from "next/link"

export default function CompanyDetailsComponent({companyId} : {companyId?: string}) {
    const [details, setDetails] = useState<CompanyDetails>()
    const [profileImageUrl, setProfileImageUrl] = useState<string>()
    const [profileImageFailed, setProfileImageFailed] = useState<boolean>(false)
    
    useEffect(() => {
        function load() {
            safeCall(async () => {
                
                const status = await authClient.checkRoleStatus()
                
                if(!status.id) {
                     const loginUser = await authClient.findByLoginUser()
                     setDetails({
                        id: 'undefined',
                        companyName: loginUser.name,
                        companyEmail: loginUser.email,
                        industryType: 'undefined',
                        phone: 'undefined',
                        websiteUrl: 'undefined',
                        location: 'undefined',
                        description: 'undefined',
                        profileImage: null,
                        totalPostedJobs: 0,
                        uploadedJob: []
                    })
                }else {

                 const result = companyId ? await companyClient.getCompanyById(companyId)  : await companyClient.findByCompanyName()
    
                    if(result) {
                        setDetails(result)
                        setProfileImageUrl(await companyClient.getCompanyProfileImageUrl(result.profileImage))
                        setProfileImageFailed(false)
                    }
                }
            })
        }
    
        load()
    }, [])

    if(!details) {
        return <Loading content="Loading Company Details" />
    }

    return (
        <section className="mx-auto max-w-7xl space-y-6 px-1 pb-8 text-zinc-950">
            <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
                <aside className="space-y-4">
                    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                            <div className="flex aspect-[4/5] items-center justify-center bg-zinc-100">
                                {profileImageFailed ? 
                                    (
                                        <div className="flex size-24 items-center justify-center rounded-full bg-zinc-950 text-3xl font-semibold text-white">
                                            {getInitials(details.companyName)}
                                        </div>
                                    ) :
                                    (<img
                                        src={profileImageUrl}
                                        alt={`${details.companyName} profile`}
                                        className="size-full object-cover"
                                        onError={() => setProfileImageFailed(true)}/>
                                    )}
                            </div>
                        </div>

                        <div className="mt-5 space-y-2">
                            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">{details.companyName}</h1>
                            <p className="text-sm text-zinc-500">{details.industryType}</p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="border-zinc-300 bg-white text-zinc-900">
                                    {details.companyEmail} 
                                </Badge>
                                {details.websiteUrl && (
                                    <Badge className="bg-zinc-950 text-white hover:bg-zinc-800">
                                        Company Account
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="space-y-6">
                    <PageDetailComponent title="Company Description" icon="Building2">
                        <p className="whitespace-pre-line text-sm leading-7 text-zinc-700">
                            {details.description || "No company description added."}
                        </p>
                    </PageDetailComponent>

                    <div className="grid md:grid-cols-2 gap-4">
                        <PageDetailComponent title="Posted Jobs" icon="Layers">
                            <p className="text-3xl font-semibold text-zinc-950">{details.totalPostedJobs}</p>
                            <p className="mt-1 text-sm text-zinc-500">Total uploaded jobs</p>
                        </PageDetailComponent>

                        <PageDetailComponent title="Contact" icon="Phone">
                            <div className="space-y-4 text-sm">
                                <div className="flex gap-3">
                                    <PhoneCall className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                                    <span className="text-zinc-800">{details.phone}</span>
                                </div>
                            </div>
                        </PageDetailComponent>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <PageDetailComponent title="Location" icon="MapPin">
                            <div className="flex gap-2 items-center">
                                 <MapPinned className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                                 <p className="text-sm leading-7 text-zinc-700">
                                    {details.location || "No location added."}
                                </p>
                            </div> 
                        </PageDetailComponent>

                        <PageDetailComponent title="Website" icon="Globe" >
                            <div className="flex gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                                    <Globe className="size-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-zinc-950">{details.websiteUrl || "No website added"}</p>
                                    <p className="text-xs text-zinc-500">Company website URL</p>
                                </div>
                            </div>
                        </PageDetailComponent>
                    </div>


                    <PageDetailComponent title="Uploaded Jobs" icon="Briefcase">
                        {details.uploadedJob.length > 0 ? (
                            <div className="space-y-4">
                                {details.uploadedJob.map((job, index) => (
                                    <div key={`${job.postionName}-${index}`} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="space-y-2">
                                                <h3 className="font-semibold text-zinc-950">{job.postionName}
                                                    <Badge className="bg-zinc-950 text-white hover:bg-zinc-800 cursor-pointer ms-2">
                                                        {`${job.minSalary.toLocaleString()} MMK  -  ${job.maxSalary.toLocaleString()}`} MMK
                                                    </Badge>
                                                </h3>
                                                
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm text-zinc-600">{job.jobLevel}</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        <Badge variant="outline" className="bg-zinc-900 text-white hover:bg-zinc-800 cursor-pointer">
                                                            {job.jobType}
                                                        </Badge>
                                                        <Badge className="border-zinc-300 bg-white text-zinc-900 cursor-pointer ms-2">
                                                            {job.jobLocation}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <Link href={`/job/${job.jobId}`} className="flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700">
                                                     Details <ArrowRightIcon className="size-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500">No uploaded jobs added.</p>
                        )}
                    </PageDetailComponent>
                </div>
            </div>
        </section>
    )
}