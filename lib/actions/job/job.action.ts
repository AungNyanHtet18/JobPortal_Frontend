'use server'

import { POST_CONFIG, PUT_CONFIG, secureRequest, secureSearch } from "@/lib";
import { ModificationResult } from "@/lib/type";
import { JobDetails, JobForm } from "@/lib/type/schema/job/job.schema";

export async function createJob(form: JobForm) : Promise<ModificationResult<number>> { 

    const response = await secureRequest("job", {
          ...POST_CONFIG,
          body: JSON.stringify(form)
    })

    return await response.json() as ModificationResult<number>
}

export async function updateJob(id: string | number, form: JobForm): Promise<ModificationResult<number>> {
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
