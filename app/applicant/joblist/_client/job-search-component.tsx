'use client'

import FormsInput from "@/components/fields/form-input"
import FormSelect from "@/components/fields/form-select"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { DEFAULT_PAGE_RESULT, PageResult } from "@/lib/type"
import { JobListItem, JobSearch } from "@/lib/type/schema/applicant/applicant.schema"
import { JobLevel, JobType, Status } from "@/lib/type/type"
import { safeCall } from "@/lib/utils"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import * as applicantClient from '@/lib/actions/applicant/applicant.action'
import JobSearchResult from "./job-search-result"

export default function JobSearchComponent() {
    
    const form = useForm<JobSearch>({
       defaultValues: {
         page: 0,
         size: 10
       }
    })

    const [result, setResult] = useState<PageResult<JobListItem> | undefined >()
    const {list, ...pageInfo}  = result ? result : DEFAULT_PAGE_RESULT

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

          <JobSearchResult list={list}/>
           

        </div>
    )

}