'use client'

import FormSelect from "@/components/fields/form-select"
import { Form } from "@/components/ui/form"
import { DEFAULT_PAGE_RESULT, PageResult } from "@/lib/type"
import { JobListItem, JobSearch } from "@/lib/type/schema/applicant/applicant.schema"
import { JobLevel } from "@/lib/type/type"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export default function JobSearchComponent() {
    
    const form = useForm<JobSearch>({
       defaultValues: {
         page: 0,
         size: 10
       }
    })

    const [result, setResult] = useState<PageResult<JobListItem> | undefined >()
    const {contents, ...pageInfo}  = result ? result : DEFAULT_PAGE_RESULT

    const jobLevel = form.watch("jobLevel")
    const jobType = form.watch("jobType")
    const deleted = form.watch("deleted")
    const keyword = form.watch("keyword")


    useEffect(() => {
         form.setValue("page",0)
    }, [jobLevel, jobType, deleted, keyword])


    async function search() {
         
    }



    return (
        <div>
           <Form {...form}>
              <form onSubmit={form.handleSubmit(search)} className="flex gap-4 " >
                <FormSelect control={form.control} path="jobLevel" label="Job Level" options={[{key: "-1", value: "Select Job Level"}, ...JobLevel]}  className="w-fit"/>
                <FormSelect control={form.control} path="jobType" label="Job Type"  options={[{key: "-1", value: "Select Job Level"}, ...JobLevel]} className="w-fit"/>
                 


              </form>
           </Form>
        </div>
    )

}