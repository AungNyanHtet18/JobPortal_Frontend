'use client'

import FormsInput from "@/components/fields/form-input"
import FormSelect from "@/components/fields/form-select"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { DEFAULT_PAGE_RESULT, PageResult } from "@/lib/type"
import { JobListItem, JobSearch } from "@/lib/type/schema/applicant/applicant.schema"
import { JobLevel, JobType, Status } from "@/lib/type/type"
import { cn, safeCall } from "@/lib/utils"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as applicantClient from '@/lib/actions/applicant/applicant.action'
import JobSearchResult from "./job-search-result"
import PagerWidget from "@/components/widgets/pager-widgert"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


export default function JobSearchComponent() {
    
    const form = useForm<JobSearch>({
       defaultValues: {
         page: 0,
         size: 10
       }
    })

    const [result, setResult] = useState<PageResult<JobListItem>>(DEFAULT_PAGE_RESULT)
    const {list, pageInfo}  = result 

    const jobLevel = form.watch("jobLevel")
    const jobType = form.watch("jobType")
    const deleted = form.watch("deleted")
    const keyword = form.watch("keyword")


    useEffect(() => {
         form.setValue("page",0)
    }, [jobLevel, jobType, deleted, keyword])


   useEffect(() => {
       form.handleSubmit(search) ()
   }, [form.handleSubmit])


   const onPageChange = (page: number) => { 
      form.setValue("page", page)
      form.handleSubmit(search)()
   }

   const onSizeChange = (size: number) => { 
      form.setValue("page", 0)
      form.setValue("size", size)
      form.handleSubmit(search) ()
   }

    async function search(form: JobSearch) {
      
         if(form.jobLevel === "-1") {
           delete form.jobLevel
         }

         if(form.jobType === "-1") {
           delete form.jobType
         }
      
         await safeCall(async () => {
             const response = await applicantClient.search(form)
             setResult(response)
         })
    }

    return (
        <div className="space-y-4">
           <Form {...form}>
              <form onSubmit={form.handleSubmit(search)} className="flex items-end gap-4 " >
                <FormSelect control={form.control} path="jobLevel" label="Job Level" options={[{key: "-1", value: "Select Job Level"}, ...JobLevel]}  className="w-fit"/>
                <FormSelect control={form.control} path="jobType" label="Job Type"  options={[{key: "-1", value: "Select Job Type"}, ...JobType]} className="w-fit"/>
                <FormSelect control={form.control} path="deleted" label="Status" options={Status} className="w-25 mr-4"/>
                <FormsInput control={form.control} path="keyword" label="Keyword" placeHolder="Enter Keyword"/>

                <Button  type="submit">
                  <Search/>Search
                </Button>
              </form>
           </Form>

          {/* <JobSearchResult list={list}/>  */}


          <div className="grid grid-cols-4 gap-3">
            {list.map(job => 
             <Card>
                <img className="object-cover w-75 mx-auto mb-2" src="/images/signin.jpg"></img>
                <CardHeader >
                    <CardTitle>{job.positionName} <span className="text-gray-600 text-sm">({job.jobType})</span></CardTitle>
                    <CardDescription className="font-semibold text-black">Position - {job.jobLevel}</CardDescription>
                    <CardDescription className="font-normal text-black overflow-hidden whitespace-nowrap truncate">Location - {job.location} </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button className="w-full">Save Job</Button>
                </CardFooter>
            </Card>)}
          </div>

          <PagerWidget pager={pageInfo} onPageChange={onPageChange} onSizeChange={onSizeChange}/> 
        </div>)
}