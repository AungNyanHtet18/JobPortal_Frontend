'use server'

import { secureRequest, secureSearch } from "@/lib"
import { ModificationResult } from "@/lib/type"

export async function followAccount(followingId: number) : Promise<ModificationResult<string>> {
     const response = await secureSearch(`account/${followingId}/follow`)
     return await response.json()
}

export async function unfollowAccount(followingId: number) : Promise<ModificationResult<string>> {
     const response = await secureRequest(`account/${followingId}/unfollow`, {
        method: 'DELETE'
     })

     if(!response.ok) { 
        const error = await response.json()
        throw new Error(error.message) 
     }

     return await response.json()
}

export async function checkFollowAccountStatus(followingId: number) : Promise<ModificationResult<boolean>> {
     const response = await secureSearch(`account/${followingId}/checkFollowStatus`)
     return await response.json()
}