'use server'

import { secureRequest, secureSearch } from "@/lib";
import { getApplicantId, getLoginUser } from "@/lib/login-users";
import { ModificationResult, PageResult } from "@/lib/type";
import { ApplicantDetails, JobListItem, JobSearch } from "@/lib/type/schema/applicant/applicant.schema";

export async function createApplicantAction(formData: FormData): Promise<ModificationResult<number>> {
     
     const formValue = formData.get("form")

     if(typeof formValue !== "string") {
          throw new Error("Applicant form data is missing.")
     }

     const payload = new FormData()
     payload.append("form", new Blob([formValue], {type: "application/json"}))

     const file = formData.get("file")

     if(file instanceof File && file.size > 0) {
          payload.append("file", file)
     }
     
     const response = await secureRequest('applicant',{
           method: "POST",
           body: payload
      })

      return await response.json()
}

export async function uploadApplicantResumeAction(formData: FormData): Promise<ModificationResult<string>> {
     const file = formData.get("file")

     if(!(file instanceof File) || file.size === 0) {
          throw new Error("Please select a resume file.")
     }

     const payload = new FormData()
     payload.append("file", file)

     const response = await secureRequest('applicant/uploadresume',{
          method: "PATCH",
          body: payload
     })

     return await response.json()
}

export async function search(form: JobSearch):Promise<PageResult<JobListItem>> {
     const response = await secureSearch('job',form)
     return await response.json()
}


export async function findByName() : Promise<ApplicantDetails | null> {
     const loginUser = await getLoginUser()
     const response = await secureSearch(`applicant/${loginUser.email}`)
          
     return await response.json().catch(() => null);
}


export async function findByApplicant() : Promise<string | undefined> {
      return await getApplicantId()
}
