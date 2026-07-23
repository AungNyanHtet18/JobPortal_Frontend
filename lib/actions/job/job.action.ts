'use server'

import { POST_CONFIG, PUT_CONFIG, secureRequest, secureSearch } from "@/lib";
import { ModificationResult, PageResult } from "@/lib/type";
import { JobListItem, JobSearch } from "@/lib/type/schema/applicant/applicant.schema";
import { JobDetails} from "@/lib/type/schema/job/job.schema";

export async function searchJobs(form: JobSearch):Promise<PageResult<JobListItem>> {
     const response = await secureSearch('job',form)
     return await response.json()
}

export async function createJob(form: any) : Promise<ModificationResult<number>> { 
    const response = await secureRequest("job", {
          ...POST_CONFIG,
          body: JSON.stringify(form)
    })

    return await response.json() as ModificationResult<number>
}

export async function updateJob(id: string | number, form: any): Promise<ModificationResult<number>> {
    const response = await secureRequest(`job/${id}`, {
        ...PUT_CONFIG,
        body: JSON.stringify(form)
    })

    return await response.json() as ModificationResult<number>
}


export async function findJobById(id: string): Promise<JobDetails> {
    const response = await secureSearch(`job/${id}`)
    return await response.json() as JobDetails
}
