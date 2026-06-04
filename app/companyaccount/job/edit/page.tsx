'use client'

import { useSearchParams } from "next/navigation"
import JobCreateComponent from "../_client/job-create-component"
import JobEditComponent from "../_client/job-edit-component"

export default function JobEditPage() {
    
    const searchParam = useSearchParams()
    const jobId = searchParam.get('jobId')
    
    if(jobId) {
         return (
            <JobEditComponent jobId={jobId} />
         )
    }

    return (
        <JobCreateComponent />
    )

}