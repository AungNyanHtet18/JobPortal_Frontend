'use client'

import Link from "next/link"
import FormsInput from "@/components/fields/form-input"
import FormSelect from "@/components/fields/form-select"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { AlertDialog } from "@/components/ui/alert-dialog"
import { DEFAULT_PAGE_RESULT, PageResult } from "@/lib/type"
import { JobListItem, JobSearch } from "@/lib/type/schema/applicant/applicant.schema"
import { JobLevel, JobType, Status } from "@/lib/type/type"
import { getCompanyPhotoForJobList, safeCall } from "@/lib/utils"
import { ArrowRight, Heart, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as applicantClient from '@/lib/actions/applicant/applicant.action'
import * as jobApplyClient from '@/lib/actions/job/job-apply.action'
import PagerWidget from "@/components/widgets/pager-widget"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function JobSearchComponent() {
    const [result, setResult] = useState<PageResult<JobListItem>>(DEFAULT_PAGE_RESULT)
    const [applicant, setApplicant] = useState<string>("")
    const [savedJobs, setSavedJobs] = useState<number[]>([])
    const [appliedJobs, setAppliedJobs] = useState<number[]>([])
    const [confirmJob, setConfirmJob] = useState<JobListItem | null>(null)
    const [isApplying, setIsApplying] = useState(false)
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

    const saveJob = (jobId: number) => {
            
      setSavedJobs(prev =>
         prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
      )
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
         if (formValues.jobLevel === "-1") {
           delete formValues.jobLevel
         }

         if (formValues.jobType === "-1") {
           delete formValues.jobType
         }

         await safeCall(async () => {
            const response = await applicantClient.searchJobs(formValues)
            const applicant = await applicantClient.findByApplicant()
             
            if(applicant) {
                const appliedList = await jobApplyClient.getAppliedJobList()
                  if(appliedList.id) {
                    setAppliedJobs(appliedList.id.map(item => item.jobId))
             }
            }
              setResult(response)
         })
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
                          src={job.profilePhoto ? `${getCompanyPhotoForJobList(job.profilePhoto)}` : '/images/signin.jpg' }
                          alt={job.positionName}
                          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"/>
                      
                      {applicant ||  
                      
                      <button
                        type="button"
                        onClick={() => saveJob(job.jobId)}
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-zinc-900 shadow-md backdrop-blur transition hover:bg-white"
                        aria-label={isSaved ? "Unsave job" : "Save job"}>
                        <Heart className={isSaved ? "size-5 text-rose-800 fill-rose-600" : "size-5"} />
                      </button>
                      
                      }
                    

                      <div className="absolute bottom-3 left-3">
                        <Badge className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-zinc-900 backdrop-blur">
                          {job.jobType}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-base font-semibold text-zinc-900">
                        {job.positionName} <span className="text-zinc-500">({job.jobLevel})</span>
                      </CardTitle>

                      <CardDescription className="text-sm font-medium text-zinc-700">
                        {job.companyName}
                      </CardDescription>
                    </CardHeader>

                    <CardFooter className="flex flex-col gap-3">
                      <div className="w-full flex items-center justify-center">
                        <Button
                          className="rounded-none rounded-l-lg  h-10 w-2/3  bg-zinc-900 text-white transition hover:bg-zinc-800"
                          disabled={isApplied || isApplying}
                          onClick={() => setConfirmJob(job)}>
                          {isApplied ? "Applied" : "Apply Now"}
                        </Button>
                        <Button className="rounded-none rounded-r-lg  h-10 w-1/3 bg-zinc-200 transition hover:bg-zinc-300 text-black">
                          <Link className="flex justify-center items-center gap-1" href={`/job/${job.jobId}`}>
                            <span className="font-semibold">Detail</span><ArrowRight className="size-4" />
                          </Link>
                        </Button>
                      </div>
                      
                      <div className="flex w-full justify-end gap-2">
                         <span className="text-xs text-zinc-400">Posted {job.createAt}</span>                          
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
