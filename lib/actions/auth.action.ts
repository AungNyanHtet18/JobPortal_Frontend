'use server'

import { redirect } from "next/navigation";
import { POST_CONFIG, publicRequest } from "..";
import { AuthResult, SignInForm, SignUpForm } from "../type/schema/auth.schema";
import setAuthResult, { clearAuthResult } from "../login-users";

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

     redirect(`/${result.role.toLowerCase()}`)
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

     redirect(`/${result.role.toLowerCase()}`)
}

export async function signOutAction() {
      await clearAuthResult()
      redirect('/')
}