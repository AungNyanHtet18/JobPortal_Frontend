"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Loading from "@/components/widgets/loading"
import PageTitle from "@/components/widgets/page-title"
import PageDetailComponent from "@/components/widgets/page-detail-component"
import { safeCall } from "@/lib/utils"
import * as JobClient from "@/lib/actions/job/job.action"
import * as JobApplyClient from "@/lib/actions/job/job-apply.action"
import { ApplicationStatusForm, ApplicationStatusSchema, JobApplicationListItem, JobDetails } from "@/lib/type/schema/job/job.schema"
import { Calendar, Download, Eye,FileDown,FormInput,Layers2, Layers3, MapPin, Star, Users, X } from "lucide-react"
import { toast } from "sonner"
import { downloadCVForm, downloadResume } from "@/lib/download-files"
import { Form } from "@/components/ui/form"
import DialogComponent from "@/components/widgets/dialog-widget"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import FormsInput from "@/components/fields/form-input"
import FormSelect from "@/components/fields/form-select"
import { ApplicationStatusType } from "@/lib/type/type"
import FormsTextAreaInput from "@/components/fields/form-textarea"

export default function CompanyJobApplicantsComponent({ jobId }: { jobId: string }) {
  const [details, setDetails] = useState<JobDetails>()
  const [applicants, setApplicants] = useState<JobApplicationListItem[]>([])
  const [notifyApplicantDialogIndex, setNotifyApplicantDialogIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const form = useForm<ApplicationStatusForm>({
    resolver: zodResolver(ApplicationStatusSchema),
    defaultValues: {
       applicantId: "",
       status: "",
       note: ""
    }
  })

   const getJobData = async () => {
      const jobDetail = await JobClient.findJobById(jobId)
      const jobApplyList =  await JobApplyClient.getApplicantListByJob(jobId)
      
      if(jobDetail !== null && jobApplyList.id !== null) {
         setDetails(jobDetail)
         setApplicants(jobApplyList.id)
      }

      setLoading(false)
    }

  useEffect(() => {
    safeCall(getJobData)
  }, [jobId])


  const openNotifyApplicantDialog = (applicantId: number) => {
     setNotifyApplicantDialogIndex(applicantId)
  }

  async function save(form: ApplicationStatusForm) {
    try{
      setLoading(true)
        if(!details?.jobId) return 

        await safeCall(async () => {
            await JobApplyClient.updateApplicationStatus(details.jobId.toString(), form)
          })

          toast.success("Successfully send the statuses")

          await getJobData()
          setNotifyApplicantDialogIndex(null)
    
    } finally {
       setLoading(false)
    }
  }

  if (loading || !details) {
      return <Loading content="Loading for Applicant Lists" />
  }

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-1 pb-8 text-zinc-950">
      <PageTitle icon="Users" title="Applicant List" description={`Review candidates who applied for ${details.positionName}`}/>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-center text-sm uppercase tracking-[0.2em] text-zinc-500">Job summary</p>
                <h2 className="mt-2 text-lg font-semibold text-zinc-950">{details.positionName}</h2>
                <p className="mt-1 text-sm  leading-6 text-zinc-600">{details.companyName}</p>
              </div>
          
            <div className="mt-6 grid gap-3">
              <div className="overflow-hidden rounded-xl flex items-center justify-between border border-zinc-200 bg-zinc-50 p-3">
                <div className="flex items-center gap-2 font-bold text-zinc-600  tracking-wider">
                  <Layers2 className="size-4" />
                  Job Level
                </div>
                <p className="text-base tracking-widest truncate font-medium text-zinc-700">{details.jobLevel}</p>
              </div>

               <div className="overflow-hidden rounded-xl flex items-center justify-between gap-2 border border-zinc-200 bg-zinc-50 p-3">
                <div className="flex items-center gap-2 font-bold text-zinc-600  tracking-wider">
                  <Layers3 className="size-4" />
                  Job Type
                </div>
                <p className="text-base tracking-widest truncate font-medium text-zinc-700">{details.jobType}</p>
              </div>

              <div className="overflow-hidden rounded-xl flex items-center justify-between gap-2 border border-zinc-200 bg-zinc-50  font-bold p-3">
                <div className="flex items-center gap-2 text-base text-zinc-600 tracking-wider">
                  <MapPin className="size-4" />
                  Apply
                </div>
                <p className="text-base tracking-widest truncate font-medium text-zinc-700">{applicants.length} Applicants</p>
              </div>
      
            </div>

            <div className="mt-6 grid gap-3">
                <Button asChild className="w-full bg-zinc-950 text-white hover:bg-zinc-800">
                  <Link href={`/companyaccount/job/edit?jobId=${details.jobId}`}>Edit Job</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/job/${details.jobId}`}>View Public Job</Link>
                </Button>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <PageDetailComponent title="Applied candidates" icon="Users">
            <div className="overflow-hidden rounded-lg border border-zinc-300 bg-white shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow >
                    <TableHead className="font-semibold">Candidate</TableHead>
                    <TableHead className="font-semibold">Level</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Salary</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {applicants.map((applicant, index) => (
                    <TableRow key={`${index}`}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-zinc-950">{applicant.applicantName || "Unknown candidate"}</span>
                          <span className="text-xs text-zinc-500">{applicant.gender}</span>
                        </div>
                      </TableCell>

                      <TableCell>{details.jobLevel || "-"}</TableCell>
                      <TableCell>{details.jobType || "-"}</TableCell>
                      <TableCell>{details.minSalaryRange.toLocaleString()} - {details.maxSalaryRange.toLocaleString()} MMK</TableCell>
                      
                      <TableCell>
                        <Badge variant="outline" className="border-zinc-300 bg-white text-zinc-950">
                          {applicant.status || "Pending"}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {applicant.applicantResume &&
                            <Button variant="outline" size="icon" onClick={() => downloadResume(applicant.applicantId,applicant.applicantName )} title="Download Resume">
                              <Download className="size-4" />
                            </Button>}

                          {applicant.applicantCVForm && 
                            <Button variant="outline" size="icon" onClick={() => downloadCVForm(applicant.applicantId,applicant.applicantName )} title="Download CV Form">
                              <FileDown className="size-4" />
                            </Button>}
                          
                          <Button  size="icon" onClick={() => {
                              form.setValue("applicantId", applicant.applicantId.toString())
                              form.setValue("status", applicant.status)
                              openNotifyApplicantDialog(applicant.applicantId)}} 
                              title="Notify The Applicants">
                            <Calendar className="size-4" />
                          </Button>

                          {applicant.applicantId ? (
                            <Link href={`/job/applicant/${applicant.applicantId}`}>
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

          <div className="grid gap-6 md:grid-cols-2">
              <PageDetailComponent title="Job description" icon="FileText">
                  {details.jobDescription && details.jobDescription.length > 0 ? (
                        <ul className="list-inside list-disc space-y-2 text-sm leading-7 text-zinc-700">
                            {details.jobDescription.map((desc, idex) => (
                                <li key={idex}>{desc}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-zinc-500">No job description added.</p>
                  )}
              </PageDetailComponent>
            
              <PageDetailComponent title="Job Requirement" icon="GraduationCap">
                  {details.jobRequirement && details.jobRequirement.length > 0 ? (
                        <ul className="list-inside list-disc space-y-2 text-sm leading-7 text-zinc-700">
                            {details.jobRequirement.map((desc, idex) => (
                                <li key={idex}>{desc}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-zinc-500">No job requirement added.</p>
                  )}
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

        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(save)}>
            <DialogComponent diaLogIndex={notifyApplicantDialogIndex} diaLogTitle="Notify Applicants" diaLogDescription="Send Applicant Statuses via email."
              onOpenChange={() => {setNotifyApplicantDialogIndex(null)}}
              onRemoveChange={(notifyApplicantDialogIndex) => {
                if(notifyApplicantDialogIndex !== null) {
                  setNotifyApplicantDialogIndex(null)
                }
              }}
              saved={true}>
              
              <div className="grid gap-5">
                  <FormsInput control={form.control} path="applicantId" hidden /> 
                  <FormSelect control={form.control} path="status" label="Application Status" placeHolder="Choose Applicaton Status" options={ApplicationStatusType} />
                  <FormsTextAreaInput control={form.control} path="note" label="Note" placeHolder="Note for applicant" rowHeight="min-h-[80px]" />
              </div>  
            </DialogComponent>
         </form>
      </Form>

        
    </section>

  )
}
