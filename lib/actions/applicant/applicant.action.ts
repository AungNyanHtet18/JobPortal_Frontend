'use server'

import { POST_CONFIG, secureRequest, secureSearch } from "@/lib";
import { getLoginUser } from "@/lib/login-users";
import { ModificationResult, PageResult } from "@/lib/type";
import { ApplicantDetails, ApplicantForm, JobListItem, JobSearch } from "@/lib/type/schema/applicant/applicant.schema";

export async function createApplicantAction(form: ApplicantForm): Promise<ModificationResult<number>> {
     

     const payload = { 
          ...form, 
          skills: form.skills.map(s => s.skill), 
          experiences: form.experiences.map(e => ({ 
          ...e,
          year: Number(e.year)
          }))
     }
     
     const response = await secureRequest('applicant',{
           ...POST_CONFIG,
           body: JSON.stringify(payload)
      })

      return await response.json()
}

export async function search(form: JobSearch):Promise<PageResult<JobListItem>> {
     const response = await secureSearch('job',form)
     return await response.json()
}


export async function findByName() : Promise<ApplicantDetails> {
     const loginUser = await getLoginUser()
     
     const response = await secureSearch(`applicant/${loginUser.email}`)
      return await response.json()
}