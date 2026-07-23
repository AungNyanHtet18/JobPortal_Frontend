'use client'

import Link from "next/link"
import FormsInput from "@/components/fields/form-input"
import FormSelect from "@/components/fields/form-select"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { AlertDialog } from "@/components/ui/alert-dialog"
import { DEFAULT_PAGE_RESULT, PageResult } from "@/lib/type"
import { JobLevel, JobType, Status } from "@/lib/type/type"
import {  formatDateTime, getCompanyPhoto, safeCall } from "@/lib/utils"
import { Briefcase, Building2, Calendar,  CheckCircle2Icon, Eye, Heart, MapPin, Search, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as applicantClient from '@/lib/actions/applicant/applicant.action'
import * as jobApplyClient from '@/lib/actions/job/job-apply.action'
import * as jobSavedClient from '@/lib/actions/job/job-saved.action'
import * as jobClient from '@/lib/actions/job/job.action'
import PagerWidget from "@/components/widgets/pager-widget"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Loading from "@/components/widgets/loading"
import { JobListItem, JobSearch } from "@/lib/type/schema/job/job.schema"

export default function JobSearchComponent() {

    const [result, setResult] = useState<PageResult<JobListItem>>(DEFAULT_PAGE_RESULT)
    const [applicant, setApplicant] = useState<string | null>(null)
    const [savedJobs, setSavedJobs] = useState<number[]>([])
    const [appliedJobs, setAppliedJobs] = useState<number[]>([])
    const [confirmJob, setConfirmJob] = useState<JobListItem | null>(null)
    const [isApplying, setIsApplying] = useState(false)
    const [loading, setLoading] = useState<boolean>(false)
    const { list, pageInfo } = result

    const form = useForm<JobSearch>({
       defaultValues: {
         page: 0,
         size: 10
       }
    })

    const jobLevel = form.watch("jobLevel")
    const jobType = form.watch("jobType")
    const deleted = form.watch("deleted")
    const keyword = form.watch("keyword")

    useEffect(() => {
         form.setValue("page", 0)
    }, [jobLevel, jobType, deleted, keyword])

   useEffect(() => {
       form.handleSubmit(search) ()
   }, [form.handleSubmit])

   const onPageChange = (page: number) => {
      form.setValue("page", page)
      form.handleSubmit(search) ()
   }

   const onSizeChange = (size: number) => {
      form.setValue("page", 0)
      form.setValue("size", size)
      form.handleSubmit(search) ()
   }

    async function saveJob (jobId: number) {
      safeCall(async() => {
        const result = savedJobs.includes(jobId) ? await jobSavedClient.unsavedJob(jobId) :  await jobSavedClient.savedJob(jobId)
        setSavedJobs(prev => prev.includes(jobId) ? prev.filter((id) => id !== result.id) : [...prev, result.id])
      })
    }

    async function applySelectedJob() {
      if (!confirmJob) {
        return
      }

      setIsApplying(true)

      await safeCall(async () => {
        const applicant = await applicantClient.findByApplicant()

        if(!applicant) {
          toast.error("Applicant cannot apply jobs",{
                description: "Please fill applicant form details to apply jobs"})
        }else{
          const response = await jobApplyClient.applyJob(confirmJob.jobId)
          toast.success(response.id || "Applied successfully")
          setAppliedJobs((prev) => [...new Set([...prev, confirmJob.jobId])])
        }
      })
      
      setIsApplying(false)
      setConfirmJob(null)
    }

    async function search(formValues: JobSearch) {
        
        setLoading(true) 
      
        if (formValues.jobLevel === "-1") {
           delete formValues.jobLevel
         }

         if (formValues.jobType === "-1") {
           delete formValues.jobType
         }

         await safeCall(async () => {
            const result = await jobClient.searchJobs(formValues)
            const applicant = await applicantClient.findByApplicant()
            const savedJobs = await jobSavedClient.getSavedJobList()

            if(applicant) {
                setApplicant(applicant)

                //Append Applied Job List of Applicant
                const appliedList = await jobApplyClient.getAppliedJobList()
                  if(appliedList.id) {
                    setAppliedJobs(appliedList.id.map(item => item.jobId)) 
                  }

                //Append Saved Job List
                setSavedJobs(savedJobs.id.map(item => item.jobId))
            }
              setResult(result)
         })

         setLoading(false)
    }

    if(loading) {
       return <Loading content="Preparing for job lists"/>
    }

    return (
        <div className="space-y-4">
           <Form {...form}>
              <form onSubmit={form.handleSubmit(search)} className="flex flex-wrap items-end gap-4" >
                <FormSelect control={form.control} path="jobLevel" label="Job Level" options={[{key: "-1", value: "Select Job Level"}, ...JobLevel]} className="w-fit"/>
                <FormSelect control={form.control} path="jobType" label="Job Type" options={[{key: "-1", value: "Select Job Type"}, ...JobType]} className="w-fit"/>
                <FormSelect control={form.control} path="deleted" label="Status" options={Status} className="w-28"/>
                <FormsInput control={form.control} path="keyword" label="Keyword" placeHolder="Enter keyword"/>
                <Button type="submit" className="h-9 rounded-lg hover:bg-zinc-700 transition shadow-md ">
                  <Search /> Search
                </Button>
              </form>
           </Form>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {list.map((job) => {
              const isSaved = savedJobs.includes(job.jobId)
              const isApplied = appliedJobs.includes(job.jobId)
              
              return (
                <Card key={job.jobId} className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative h-40 w-full overflow-hidden">

                      <img
                          src={job.profilePhoto ? `${getCompanyPhoto(job.profilePhoto)}` : '/images/signin.jpg' }
                          alt={job.positionName}
                          className="h-full w-full object-cover transition-all duration-500 hover:scale-110"/>
                      
                      {applicant && 
                        <button
                          type="button"
                          onClick={() => saveJob(job.jobId)}
                          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-md backdrop-blur transition hover:bg-white"
                          aria-label={isSaved ? "Unsave job" : "Save job"}>
                          <Heart className={isSaved ? "size-5 text-rose-800 fill-rose-600" : "size-5"} />
                        </button>
                      }

                      <div className="absolute bottom-3 left-2">
                        <div className="flex flex-wrap gap-1">
                          <Badge className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-900 backdrop-blur">
                            {job.jobType}
                          </Badge>

                          <Badge className="ms-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-900 backdrop-blur">
                            {job.jobLevel}
                          </Badge>

                          <Badge className="ms-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-900 backdrop-blur">
                            ${job.minSalaryRange } - ${job.maxSalaryRange} 
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">
                          {job.positionName}
                        </CardTitle>

                        <p className="text-sm text-zinc-600 flex items-center gap-1">
                           <Building2 className="size-4 text-zinc-600"/> {job.companyName}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-2">
                          {job.clientName && (
                            <Badge variant="outline" className="bg-zinc-800 text-zinc-200 py-1 text-xs">
                              <Briefcase className="mr-1 size-3" />
                              {job.clientName}
                            </Badge>
                          )}

                          <Badge variant="secondary" className="py-1 text-xs">
                            <MapPin className="mr-1 size-3" />
                            {job.jobLocation}
                          </Badge>
                        </div>
                    </CardHeader>
                      
                    <CardFooter className="flex flex-col gap-3">
                      <div className="w-full flex items-center justify-center">
                        <Button
                          className="tracking-wide text-lg font-medium rounded-none rounded-l-sm  h-10 w-4/5  bg-zinc-100 border-1 border-zinc-900 shadow-md text-zinc-700 font-semibold transition hover:bg-zinc-200"
                          disabled={isApplied || isApplying}
                          onClick={() => setConfirmJob(job)}>
                          {isApplied ? "Applied" : "Apply Now"}
                        </Button>
                        <Button className="rounded-none rounded-r-sm  h-10 w-1/5 bg-zinc-800 transition border-zinc-200 shadow-md hover:bg-zinc-900">
                          <Link href={`/job/${job.jobId}`}>
                            <Eye className="shrink-0 text-zinc-200 size-6"/>
                          </Link>
                        </Button>
                      </div>
                      
                      <div className="flex w-full justify-between items-center gap-2">
                        {job.deleted ? 
                          <Badge variant="secondary" className="mt-1 text-xs py-1">
                            <XCircle className="mr-1 size-3" />
                            Applications Closed
                          </Badge>
                           :
                           <Badge className="mt-1 bg-slate-800 text-white text-xs py-1">
                            <CheckCircle2Icon className="mr-1 size-3" />Open to Apply
                          </Badge>}
                         <span className="flex items-center gap-1 text-xs text-zinc-500"><Calendar className="size-4"/> {formatDateTime(job.createAt)}</span>                          
                      </div>
                    </CardFooter>
                  </Card>
              )
            })}
          </div>

          <PagerWidget pager={pageInfo} onPageChange={onPageChange} onSizeChange={onSizeChange} />

          <AlertDialog
            open={!!confirmJob}
            onOpenChange={(open) => { 
              if (!open) { //when open is not true => referencing open={!!confirmJob}
                setConfirmJob(null)
              }
            }}
            title="Confirm job application"
            description={`Do you want to apply for ${confirmJob?.positionName ?? "this job"} at ${confirmJob?.companyName ?? "the company"}?`}
            actionText={isApplying ? "Applying" : "Apply now"}
            onConfirm={applySelectedJob}
            loading={isApplying}>

              <p className="text-sm leading-6 text-zinc-600">
                This action will submit your application and notify the employer. You can cancel if you need more time.
              </p>
          </AlertDialog>
        </div>
    )
}
