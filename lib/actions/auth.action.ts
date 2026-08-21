'use server'

import { redirect } from "next/navigation";
import { POST_CONFIG, publicRequest, secureSearch } from "..";
import { AccountDetails, AuthResult, LoginUser, SignInForm, SignUpForm } from "../type/schema/auth.schema";
import setAuthResult, { clearAuthResult, getLoginUser, setApplicantId, setCompanyId } from "../login-users";
import * as applicant from "../actions/applicant/applicant.action"  
import * as company from "../actions/company/company.action"
import { ModificationResult } from "../type";

export async function signInAction(form: SignInForm) {
      const response = await publicRequest('token/signin', {
          ...POST_CONFIG,
          body: JSON.stringify(form)
     })

     if(!response.ok) {
           redirect("/signin")
     }

     const result = await response.json() as AuthResult
     await  setAuthResult(result)

     if(result.role === 'Applicant' ) {
      const applicantResult = await applicant.findApplicantExists()

      if(applicantResult.id > 0) {
        await setApplicantId(applicantResult.id.toString())
      }
     }

     if(result.role === 'CompanyAccount') {
       const companyResult = await company.findCompanyExists()
       
       if(companyResult.id > 0) {
           await setCompanyId(companyResult.id.toString())
       }
     }

     redirect(`/${result.role.toLowerCase()}/detail`)
}

export async function signUpAction(form: SignUpForm) {
     const response = await publicRequest('token/signup',{  //add
          ...POST_CONFIG,
          body: JSON.stringify(form)
     })

     if(!response.ok) {
           redirect("/signup")
     }

     const result = await response.json() as AuthResult
     await setAuthResult(result)

     redirect(`/${result.role.toLowerCase()}/detail`)
}

export async function checkRoleStatus() : Promise<ModificationResult<boolean>> {
       const loginUser = await getLoginUser()
       const response = await secureSearch(`account/status/${loginUser.email}`)
       return await response.json()
}

export async function findByLoginUser() : Promise<LoginUser> {
      return await getLoginUser()
}

export async function signOutAction() {
      await clearAuthResult()
      redirect('/')
}

export async function findAccountById(id: string) : Promise<AccountDetails> {
      const response = await secureSearch(`account/${id}`)
      return await response.json()
}

export async function checkRoleStatusById(id: string) : Promise<ModificationResult<boolean>> {
      const response = await secureSearch(`account/status/accountId/${id}`)
      return await response.json()
}