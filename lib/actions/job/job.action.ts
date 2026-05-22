'use server'

import { POST_CONFIG, PUT_CONFIG, secureRequest, secureSearch } from "@/lib";
import { ModificationResult } from "@/lib/type";
import { JobDetails, JobForm } from "@/lib/type/schema/job/job.schema";

export async function createJobAction(form: JobForm) : Promise<ModificationResult<number>> { 

    const response = await secureRequest("job", {
          ...POST_CONFIG,
          body: JSON.stringify(form)
    })

    return await response.json() as ModificationResult<number>
}

export async function findJobByIdAction(id: string | number): Promise<JobDetails> {
    const response = await secureSearch(`job/${id}`)

    return await response.json() as JobDetails
}

export async function updateJobAction(id: string | number, form: JobForm): Promise<ModificationResult<number>> {
    const response = await secureRequest(`job/${id}`, {
        ...PUT_CONFIG,
        body: JSON.stringify(form)
    })

    return await response.json() as ModificationResult<number>
}
