'server only'

import { redirect } from "next/navigation"
import setAuthResult, { clearAuthResult, getAccessToken, getRefreshToken } from "./login-users"
import { AuthResult } from "./type/schema/auth.schema"

export async function publicRequest(path: string, options : RequestInit={}, search? : {[key: string] : any}) {
     const response = await fetch(url(path, search), options)

     if(!response.ok) {
         const message = await response.json()
         throw JSON.stringify(message)
     }

     return response
}

export async function secureRequest(path: string, options: RequestInit = {}, search? : {[key:string] : any}) {
     
    let response : Response | undefined

    async function fetchWithToken(token: string) {
         return await fetch(url(path, search), {
            ...options,
            headers: {
                 ...options.headers,
                 ...(token && {"Authorization" : `${token}`})
            }
         })
    }

    const accessToken = await getAccessToken() 

    if(!accessToken) {
         await clearAuthResult()
         redirect('/signin')
    }

    response = await fetchWithToken(accessToken)

    if(response.status ===410 ) { //Token missing / invalid / expired
         const refreshToken = await getRefreshToken()

         console.log(`Refresh Token : ${refreshToken}`);

         if(!refreshToken) {
             await clearAuthResult()
             redirect('/signin')
         }

         const refreshResponse = await publicRequest("token/refresh", {
             ...POST_CONFIG,
             body: JSON.stringify({
              token: refreshToken
             })
         })

         if(!refreshResponse.ok) {
             await clearAuthResult()
             redirect('/signin')
         }

         const authResult = await refreshResponse.json() as AuthResult
         await setAuthResult(authResult)

         response = await fetchWithToken(authResult.accessToken)
    }

    if(!response 
        || response.status === 403 
        || response.status === 401
    ) { // 401  = the request has not been authenticated || 403 = the user is authenticated, but does not have permission to access the requested
         await clearAuthResult()
         redirect('/signin')
    }

    if(response.status === 400 || response.status === 500) {
         const message = await response.json()
         throw JSON.stringify(message)
    }

    return response
}

export async function secureSearch(path: string, search? : {[key:string] : any}) {
        return secureRequest(path, {}, search)
}


function url(path: string, search?: {[key:string]: any}) {
    const url = new URL(`${process.env.BACKEND_URL}/${path}`)

    if(search) {
         url.search = new URLSearchParams(search).toString()
    }

    return url.toString()
}

export const POST_CONFIG:RequestInit = {
    method: 'POST',
    headers: {
        "Content-Type": "application/json"
    }
}

export const PUT_CONFIG:RequestInit = {
    method: 'PUT',
    headers: {
         "Content-Type": "application/json"
    }
}