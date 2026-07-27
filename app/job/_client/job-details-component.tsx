'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Loading from "@/components/widgets/loading"
import PageTitle from "@/components/widgets/page-title"
import { JobDetails } from "@/lib/type/schema/job/job.schema"
import { getInitials, safeCall } from "@/lib/utils"
import { BadgeCheck, BadgeX, Globe, Layers2, MarsStrokeIcon, Pencil, Phone, Users } from "lucide-react"
import * as Job from "@/lib/actions/job/job.action"
import * as Company from "@/lib/actions/company/company.action"
import PageDetailComponent from "@/components/widgets/page-detail-component"

export default function JobDetailsComponent({jobId}: {jobId: string}) {
    const [companyId, setCompanyId] = useState<string | undefined>(undefined)
    const [details, setDetails] = useState<JobDetails>()
    const [profileImageUrl, setProfileImageUrl] = useState<string>()
    const [profileImageFailed, setProfileImageFailed] = useState<boolean>(false)

    useEffect(() => {
        function load() {
            safeCall(async () => {
                const companyId = await Company.findByCompany()
                const result = await Job.findJobById(jobId)
                if(result != null) {
                    setCompanyId(companyId)
                    setDetails(result)
                    setProfileImageUrl(await Company.getCompanyProfileImageUrl(result.companyImage))
                    setProfileImageFailed(false)
                }
            })
        }

        load()
        
    }, [jobId])

    const visibleProfileImage = profileImageUrl && !profileImageFailed

    if(!details) {
        return <Loading content="Loading for Job Details" />
    }

    return (
        <section className="mx-auto max-w-7xl space-y-6 px-1 pb-8 text-zinc-950">
            <PageTitle icon="BriefcaseBusiness" title="Job Detail" description="Review the published job information" />

            <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
                <aside className="space-y-4">
                    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                            <div className="flex aspect-[4/5]  items-center justify-center bg-zinc-100 ">
                                {visibleProfileImage ? (
                                    <img
                                        src={profileImageUrl}
                                        alt={`${details.companyName} profile`}
                                        className="size-full object-cover"
                                        onError={() => setProfileImageFailed(true)}/>
                                ) : (
                                    <div className="flex size-24 items-center justify-center rounded-full bg-zinc-950 text-3xl font-semibold text-white">
                                        {getInitials(details.companyName)}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-5 space-y-1">
                            <p className="text-sm font-medium text-zinc-500">Open Position {details.jobPost ? `(${details.jobPost} Openings)` : ''}</p>
                            <h1 className="flex items-center gap-1 text-2xl font-semibold tracking-tight text-zinc-950"><Layers2 size="33" /> {details.positionName}</h1>
                            <h2 className="tracking-wide text-zinc-800">{details.companyName}</h2>
                            {details.clientName && (
                                <p className="mt-2 text-sm text-zinc-600">Client: <span className="font-medium text-zinc-900">{details.clientName}</span></p>
                            )}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                            <Badge variant="outline" className="border-zinc-300 bg-white text-zinc-900">
                                {details.deleted ?  
                                    <><BadgeX className="size-4"/>Not Verified</> : <><BadgeCheck/> Verified</>
                                 }
                            </Badge>
                            <Badge variant="outline" className="border-zinc-300 bg-white text-zinc-900">
                                {details.jobLevel}
                            </Badge>
                            <Badge className="bg-zinc-950 text-white hover:bg-zinc-800">
                                {details.jobType}
                            </Badge>
                        </div>

                        {companyId && 
                            <>
                              <Button asChild className="mt-5 w-full bg-zinc-950 text-white hover:bg-zinc-800">
                                  <Link href={`/companyaccount/job/edit?jobId=${details.jobId}`}>
                                      <Pencil className="size-4" />
                                      Edit Job
                                  </Link>
                              </Button>

                              <Button asChild variant="outline" className="mt-3 w-full text-zinc-950 hover:bg-zinc-100">
                                  <Link href={`/companyaccount/job/${details.jobId}`}>
                                      <Users className="size-4" />
                                      View Applicants
                                  </Link>
                              </Button>
                            </>
                        }                        
                    </div>
                </aside>

                <div className="space-y-6">
          
                    <div className="grid gap-4 xl:grid-cols-3">
                        <PageDetailComponent title="Level" icon="Layers">
                            <p className="text-2xl font-semibold text-zinc-950">{details.jobLevel}</p>
                            <p className="mt-1 text-sm text-zinc-500">Required experience level</p>
                        </PageDetailComponent>

                        <PageDetailComponent title="Type" icon="MapPin">
                            <p className="text-2xl font-semibold text-zinc-950">{details.jobType}</p>
                            <p className="mt-1 text-sm text-zinc-500">Work arrangement</p>
                        </PageDetailComponent>

                        <PageDetailComponent title="Salary" icon="DollarSign">
                            <p className="text-lg font-semibold text-zinc-950">{`${details.maxSalaryRange} MMK - ${details.minSalaryRange} MMK ` || "Not added"}</p>
                            <p className="mt-1 text-sm text-zinc-500">Compensation</p>
                        </PageDetailComponent>
                    </div>

                    <PageDetailComponent title="Company Information" icon="Building2">
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
                    </PageDetailComponent>

                    <PageDetailComponent title="Job Description" icon="Briefcase">
                        {details.jobDescription && details.jobDescription.length > 0 ? (
                            <ul className="list-inside list-disc space-y-2 text-sm leading-7 text-zinc-700">
                                {details.jobDescription.map((desc, idx) => (
                                    <li key={idx}>{desc}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-zinc-500">No job description added.</p>
                        )}
                    </PageDetailComponent>

                    <PageDetailComponent title="Job Requirements" icon="GraduationCap">
                        {details.jobRequirement && details.jobRequirement.length > 0 ? (
                            <ul className="list-inside list-disc space-y-2 text-sm leading-7 text-zinc-700">
                                {details.jobRequirement.map((req, idx) => (
                                    <li key={idx}>{req}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-zinc-500">No job requirement added.</p>
                        )}
                    </PageDetailComponent>
    
          
                    <div className="grid gap-4 md:grid-cols-2">  
                        <PageDetailComponent title="Location" icon="MapPin">
                            <p className="text-sm leading-7 text-zinc-700">
                                {details.jobLocation || "No location added."}
                            </p>
                        </PageDetailComponent>

                        <PageDetailComponent title="Contact" icon="Phone">
                            <div className="space-y-4 text-sm">
                                <div className="flex gap-3">
                                    <Phone className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                                    <span className="text-zinc-800">{details.companyPhone || "No phone added"}</span>
                                </div>
                                
                                <div className="flex gap-3">
                                    <Globe className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                                    <span className="min-w-0 truncate text-zinc-800">{details.companyWebsite || "No website added"}</span>
                                </div>
                            </div>
                        </PageDetailComponent>
                    </div>
                </div>
            </div>
        </section>
    )
}