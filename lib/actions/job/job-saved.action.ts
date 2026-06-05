'use server'

import { secureSearch } from "@/lib";
import { ModificationResult } from "@/lib/type";
import { SavedJobListItem } from "@/lib/type/schema/job/job.schema";

export async function savedJob(jobId: number) : Promise<ModificationResult<number>> {
     const response = await secureSearch(`job/saved/${jobId}`)
     return await response.json()    
}

export async function unsavedJob(jobId: number) : Promise<ModificationResult<number>> {
     const response = await secureSearch(`job/unsaved/${jobId}`)
     return await response.json()
}

export async function getSavedJobList() : Promise<ModificationResult<SavedJobListItem[]>> {
     const response = await secureSearch(`job/savedjoblist`)
    return await response.json()
}

