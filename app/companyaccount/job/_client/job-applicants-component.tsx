"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Loading from "@/components/widgets/loading"
import PageTitle from "@/components/widgets/page-title"
import PageDetailComponent from "@/components/widgets/page-detail.component"
import { safeCall } from "@/lib/utils"
import * as jobClient from "@/lib/actions/job/job.action"
import * as jobApplyClient from "@/lib/actions/job/job-apply.action"
import { JobApplicationListItem, JobDetails } from "@/lib/type/schema/job/job.schema"
import { Calendar, Download, Eye,Layers2, MapPin, Star, Users, X } from "lucide-react"
import { toast } from "sonner"

export default function CompanyJobApplicantsComponent({ jobId }: { jobId: string }) {
  const [details, setDetails] = useState<JobDetails>()
  const [applicants, setApplicants] = useState<JobApplicationListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    safeCall(async () => {

      const jobDetail = await jobClient.findJobById(jobId)
      const jobApplyList =  await jobApplyClient.getApplicantListByJob(jobId)
      

      if(jobDetail !== null && jobApplyList.id !== null) {
         setDetails(jobDetail)
         setApplicants(jobApplyList.id)
      }
      setLoading(false)
    })
  }, [jobId])

  if (loading || !details) {
      return <Loading />
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-1 pb-8 text-zinc-950">
      <PageTitle
        icon="Users"
        title="Applicant List"
        description={`Review candidates who applied for ${details.positionName}`}
      />

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Job summary</p>
                <h2 className="mt-5 font-semibold text-zinc-950">{details.positionName}</h2>
                <p className="mt-2 text-sm  leading-6 text-zinc-600">{details.companyName}</p>
              </div>
              <div className="rounded-3xl bg-zinc-950 px-3 py-2 text-sm font-semibold text-white">
                APPLY: {applicants.length}
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="overflow-hidden rounded-xl flex items-center justify-between border border-zinc-200 bg-zinc-50 p-3">
                <div className="flex items-center gap-2 text-base font-semibold text-zinc-500">
                  <Layers2 className="size-4" />
                  Job Level
                </div>
                <p className="text-base tracking-widest truncate font-medium text-zinc-950">{details.jobLevel}</p>
              </div>

               <div className="overflow-hidden rounded-xl flex items-center justify-between gap-2 border border-zinc-200 bg-zinc-50 p-3">
                <div className="flex items-center gap-2 text-base font-semibold text-zinc-500">
                  <MapPin className="size-4" />
                  Job Type
                </div>
                <p className="text-base tracking-widest truncate font-medium text-zinc-950">{details.jobType}</p>
              </div>
      
            </div>

            <div className="mt-6 grid gap-3">
              <Button asChild className="w-full bg-zinc-950 text-white hover:bg-zinc-800">
                <Link href={`/companyaccount/job?jobId=${details.jobId}`}>Edit job</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/job/${details.jobId}`}>View public job</Link>
              </Button>
            </div>
          </div>

        </aside>

        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <PageDetailComponent title="Job description" icon="FileText">
              <p className="whitespace-pre-line text-sm leading-7 text-zinc-700">
                {details.jobDescription || "No job description provided."} Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed dolore ducimus molestias neque tenetur incidunt, consequuntur facere ad suscipit aperiam. Modi animi officia enim voluptatem quod similique rem illum architecto! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod sed deleniti nam excepturi labore praesentium sit tenetur, cumque dolore iste asperiores eos harum provident cupiditate placeat repudiandae optio maxime pariatur?
              </p>
            </PageDetailComponent>
            
            <PageDetailComponent title="Company Website" icon="Globe">
              <p className="whitespace-pre-line text-sm leading-7 text-zinc-700">
                {details.companyWebsite || "No job description provided."}
              </p>
            </PageDetailComponent>
          </div>

          <PageDetailComponent title="Applied candidates" icon="Users">
            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicants.map((item, index) => (
                    <TableRow key={`${index}`}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-zinc-950">{item.applicantName || "Unknown candidate"}</span>
                          <span className="text-xs text-zinc-500">{details.companyName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{details.jobLevel || "-"}</TableCell>
                      <TableCell>{details.jobType || "-"}</TableCell>
                      <TableCell>{details.salary ? details.salary.toLocaleString() : 'Negotiable'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-zinc-300 bg-white text-zinc-950">
                          {item.status || "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toast("Download resume is a placeholder until resume URL is available.")}
                            title="Download resume"
                          >
                            <Download className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toast("Marked shortlisted (UI only).")}
                            title="Shortlist candidate"
                          >
                            <Star className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toast("Marked rejected (UI only).")}
                            title="Reject candidate"
                          >
                            <X className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toast("Scheduled interview (UI only).")}
                            title="Interview candidate"
                          >
                            <Calendar className="size-4" />
                          </Button>
                          {item.applicantId ? (
                            <Link href={`/job/applicant/${item.applicantId}`}>
                              <Button variant="outline" size="icon" title="View applicant details">
                                <Eye className="size-4" />
                              </Button>
                            </Link>
                          ) : (
                            <Button variant="outline" size="icon" disabled title="Applicant info unavailable">
                              <Eye className="size-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PageDetailComponent>
        </div>
      </div>
    </section>

  )
}
