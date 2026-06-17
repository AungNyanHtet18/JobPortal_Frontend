'use server'

import { secureRequest, secureSearch } from "@/lib";
import { getApplicantId, getLoginUser, setApplicantId } from "@/lib/login-users";
import { ModificationResult, PageResult } from "@/lib/type";
import { ApplicantDetails, JobListItem, JobSearch } from "@/lib/type/schema/applicant/applicant.schema";

export async function createApplicant(formData: FormData): Promise<ModificationResult<number>> {
     
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

      const result =  await response.json() as ModificationResult<number>
      await setApplicantId(result.id.toString())

      return result
}

export async function updateApplicant(id: string | number, formData: FormData): Promise<ModificationResult<number>> {
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

     const response = await secureRequest(`applicant/${id}`, {
          method: "PUT",
          body: payload
     })

     const result = await response.json() as ModificationResult<number>
     await setApplicantId(result.id.toString())

     return result
}

export async function uploadApplicantResume(resumeFile: File): Promise<ModificationResult<string>> {

     if(!(resumeFile instanceof File) || resumeFile.size === 0) {
          throw new Error("Please select a resume file.")
     }

     const payload = new FormData()
     payload.append("file", resumeFile)

     const response = await secureRequest('applicant/uploadresume',{
          method: "PATCH",
          body: payload
     })

     return await response.json()
}


export async function uploadApplicantCvForm(cvFormFile: File): Promise<ModificationResult<string>> {
     
     if(!(cvFormFile instanceof File) || cvFormFile.size === 0) {
          throw new Error("Please select a CV Form file.")
     }

     const payload = new FormData()
     payload.append("file", cvFormFile)

     const response = await secureRequest('applicant/uploadcv',{
          method: "PATCH",
          body: payload
     })

     return await response.json()
}

export async function searchJobs(form: JobSearch):Promise<PageResult<JobListItem>> {
     const response = await secureSearch('job',form)
     return await response.json()
}

export async function downloadApplicantResume(id: number): Promise<Blob>{
      const response = await secureSearch(`applicant/resume/${id}/download`)

      if(!response.ok) {
           throw new Error("Failed to download resume file.")
      }

      return await response.blob()
}

export async function downloadApplicantCVForm(id: number): Promise<Blob>{
      
     const response = await secureSearch(`applicant/cvForm/${id}/download`)

      if(!response.ok) {
           throw new Error("Failed to download CV Form file.")
      }

      return await response.blob()
}

export async function getApplicantById(id: string | number): Promise<ApplicantDetails | null> {
     const response = await secureSearch(`applicant/id/${id}`)
     return await response.json().catch(() => null)
}

export async function findByApplicantName() : Promise<ApplicantDetails | null> {
     const loginUser = await getLoginUser()
     const response = await secureSearch(`applicant/${loginUser.email}`)
          
     return await response.json().catch(() => null);
}


export async function findByApplicant() : Promise<string | undefined> {
      return await getApplicantId()
}

export async function getApplicantProfileImageUrl(profileImage: string | null): Promise<string | undefined> {
     const baseUrl = process.env.BACKEND_URL

     if(!baseUrl) {
          throw new Error("Backend URL is missing.")
     }

     if(!profileImage) {
          return undefined
     }

     return `${baseUrl}/profile/${encodeURIComponent(profileImage)}`
}
