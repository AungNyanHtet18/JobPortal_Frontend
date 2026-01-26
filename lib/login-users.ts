'server only'

import { cookies } from "next/headers";
import { AuthResult, LoginUser } from "./type/schema/auth.schema";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { redirect } from "next/navigation";


export default async function setAuthResult(auth: AuthResult) {
    
    const {accessToken, refreshToken, ...loginUser} = auth
    const cookieStore = await cookies()
    const secure = process.env.NODE_ENV === 'production'

       const options:Partial<ResponseCookie> = {
         httpOnly: true,
         secure: secure,
         sameSite: 'lax',
         path: "/",
         maxAge: 60 * 60
    }

    cookieStore.set("loginUser",JSON.stringify(loginUser), options)
    cookieStore.set("accessToken", accessToken, options)
    cookieStore.set("refreshToken", refreshToken, options)
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

export async function clearAuthResult() {
      const cookieStore = await cookies()
      cookieStore.delete("loginUser")
      cookieStore.delete("accessToken")
      cookieStore.delete("refreshToken")
}