'use server'

import { secureRequest, secureSearch } from "@/lib"
import { ModificationResult } from "@/lib/type"
import { ApplicantAppliedJobListItem, JobApplicationListItem } from "@/lib/type/schema/job/job.schema"


export async function applyJob(jobId: number): Promise<ModificationResult<string>> {
     const response = await secureRequest(`apply/position/${jobId}`)
     return await response.json()
}

export async function cancelJob(jobId: number): Promise<ModificationResult<string>> {
     const response = await secureRequest(`job/cancel/${jobId}`, {
          method: 'DELETE'
     })
     return await response.json()
}

export async function getApplicantListByJob(jobId: string) : Promise<ModificationResult<JobApplicationListItem[]>> {
   const response = await secureSearch(`apply/applicantinfo/${jobId}`)
   return await response.json()
}

export async function getAppliedJobList() : Promise<ModificationResult<ApplicantAppliedJobListItem[]>> {
   const response = await secureSearch(`apply/joblist`)
   return await response.json()
}