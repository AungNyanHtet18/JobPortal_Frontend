'use server'

import { secureSearch } from "@/lib";
import { PageResult } from "@/lib/type";
import { JobListItem, JobSearch } from "@/lib/type/schema/applicant/applicant.schema";

export async function search(form: JobSearch):Promise<PageResult<JobListItem>> {
     const response = await secureSearch('job',form)
     return await response.json()
}

