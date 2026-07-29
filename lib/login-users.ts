'server only'

import { AuthResult, LoginUser } from "./type/schema/auth.schema";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const COOKIE_OPTIONS: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60
}

export default async function setAuthResult(auth: AuthResult) {
    
    const {accessToken, refreshToken, ...loginUser} = auth
    const cookieStore = await cookies()

    cookieStore.set("loginUser",JSON.stringify(loginUser), COOKIE_OPTIONS)
    cookieStore.set("accessToken", accessToken, COOKIE_OPTIONS)
    cookieStore.set("refreshToken", refreshToken, COOKIE_OPTIONS)
} 

export async function isLogin() :Promise<boolean> {
     const cookieStore = await cookies()
     return cookieStore.get("loginUser")?.value != undefined
}

export async function getLoginUser() {
    const cookieStore = await cookies()

    const userInfo = cookieStore.get("loginUser")?.value

    if(!userInfo) {
         redirect('/signin')
    }
    
    return JSON.parse(userInfo) as LoginUser
}

export async function getAccessToken() { 
    const cookieStore = await cookies()
    return cookieStore.get("accessToken")?.value
}

export async function getRefreshToken() {
     const cookieStore = await cookies()
     return cookieStore.get("refreshToken")?.value
}


export async function setApplicantId(id: string) {
      const cookieStore = await cookies()
      cookieStore.set("applicantId",id, COOKIE_OPTIONS)
}

export async function getApplicantId() {
     const cookieStore = await cookies()
     return cookieStore.get("applicantId")?.value
}

export async function setCompanyId(id: string) {
      const cookieStore = await cookies()
      cookieStore.set("companyId",id, COOKIE_OPTIONS)
}
 
export async function getCompanyId() {
     const cookieStore = await cookies()
     return cookieStore.get("companyId")?.value
}

export async function clearAuthResult() {
      const cookieStore = await cookies()
      cookieStore.delete("loginUser")
      cookieStore.delete("accessToken")
      cookieStore.delete("refreshToken")
      cookieStore.delete("applicantId")
      cookieStore.delete("companyId")
}