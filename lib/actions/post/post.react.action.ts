'use server'

import { secureRequest } from "@/lib"
import { ModificationResult } from "@/lib/type"

export async function reactPost(postId: number) : Promise<ModificationResult<number>> {
    const response = await secureRequest(`post/react/${postId}`)
    return await response.json() as ModificationResult<number>
}

export async function unreactPost(postId: number) : Promise<ModificationResult<number>> {
    const response = await secureRequest(`post/unreact/${postId}`)
    return await response.json() as ModificationResult<number>
}
