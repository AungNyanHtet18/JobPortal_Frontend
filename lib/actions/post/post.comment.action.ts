'use server'

import { POST_CONFIG, secureRequest } from "@/lib"
import { ModificationResult } from "@/lib/type"
import { CommentListItem, PostCommentForm } from "@/lib/type/schema/post/post.comment.schema"

export async function createCommentPost(postId: number, form: PostCommentForm) : Promise<ModificationResult<number>> {
    const response = await secureRequest(`post/comment/create/${postId}`, {
        ...POST_CONFIG,
        body: JSON.stringify(form)
    })

    return await response.json() as ModificationResult<number>
}

export async function findCommentPost(postId: number) : Promise<CommentListItem[]> {
    const response = await secureRequest(`post/comment/${postId}`)
    return await response.json() as CommentListItem[]
}

export async function deleteCommentPost(id: number) : Promise<ModificationResult<string>> {
    const response = await secureRequest(`post/comment/${id}`, {
        method: "DELETE"
    })

    return await response.json() as ModificationResult<string>
}
