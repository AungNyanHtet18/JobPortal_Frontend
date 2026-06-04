'use server'

import { secureRequest, secureSearch } from "@/lib";
import { getCompanyId, getLoginUser, setCompanyId } from "@/lib/login-users";
import { ModificationResult } from "@/lib/type";
import type { CompanyDetails } from "@/lib/type/schema/company/company.schema";


export async function createCompany(formData: FormData): Promise<ModificationResult<number>> {
   const formValue = formData.get("form")

   if(typeof formValue !== "string") {
      throw new Error("Company form data is missing.")
   }

   const payload = new FormData()
   payload.append("form", new Blob([formValue], {type: "application/json"}))

   const file = formData.get("file")

   if(file instanceof File && file.size > 0) {
      payload.append("file", file)
   }

   const response = await secureRequest("company", {
      method: "POST",
      body: payload
   })

   const result = await response.json() as ModificationResult<number>
   await setCompanyId(result.id.toString())

   return result
}

export async function updateCompany(id: string | number, formData: FormData): Promise<ModificationResult<number>> {
   const formValue = formData.get("form")

   if(typeof formValue !== "string") {
      throw new Error("Company form data is missing.")
   }

   const payload = new FormData()
   payload.append("form", new Blob([formValue], {type: "application/json"}))

   const file = formData.get("file")

   if(file instanceof File && file.size > 0) {
      payload.append("file", file)
   }

   const response = await secureRequest(`company/${id}`, {
      method: "PUT",
      body: payload
   })

   const result = await response.json() as ModificationResult<number>
   await setCompanyId(result.id.toString())

   return result
}

export async function findByCompanyName() : Promise<CompanyDetails | null> {
   const loginUser = await getLoginUser()
   const response = await secureSearch(`company/${loginUser.email}`)
   
   return await response.json().catch(() => null);
}

export async function findByCompany() : Promise<string | undefined> {
   return await getCompanyId()
}

export async function getCompanyProfileImageUrl(profileImage: string | null | undefined): Promise<string | undefined> {
   const baseUrl = process.env.BACKEND_URL

   if(!baseUrl) {
      throw new Error("Backend URL is missing.")
   }

   if(!profileImage) {
      return undefined
   }

   return `${baseUrl}/companyprofile/${encodeURIComponent(profileImage)}`
}
