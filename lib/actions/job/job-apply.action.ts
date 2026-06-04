'use server'

import { secureSearch } from "@/lib"
import { ModificationResult } from "@/lib/type"
import { JobApplicationListItem } from "@/lib/type/schema/job/job.schema"

export async function getApplicantListByJob(jobId: string) : Promise<ModificationResult<JobApplicationListItem[]>> {
   const response = await secureSearch(`apply/applicantinfo/${jobId}`)
   return await response.json()
}