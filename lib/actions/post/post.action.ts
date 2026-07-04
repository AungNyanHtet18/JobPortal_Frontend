'use server'

import { secureRequest, secureSearch } from "@/lib"
import { ModificationResult } from "@/lib/type"
import { PostListItem, PostSearch } from "@/lib/type/schema/post/post.schema"

export async function searchPost(keyword?: string) : Promise<PostListItem[]> {
    const form: PostSearch = {keyword: keyword}
    const response = await secureSearch('post', form)
    return await response.json() 
}

export async function createPost(formData: FormData) : Promise<ModificationResult<number>> {
     const formValue = formData.get("form")

     if(typeof formValue != "string") {
          throw new Error("Post form data is missing.")
     }

     const payload = new FormData()
     payload.append("form", new Blob([formValue], {type: "application/json"}))

     const file = formData.get("file")

    if(file instanceof File && file.size > 0) {
          payload.append("file", file)
    }

    const response = await secureRequest('post', {
        method: "POST",
        body: payload
    })

    return await response.json() as ModificationResult<number>
}

export async function updatePost(id: number, formData: FormData) : Promise<ModificationResult<number>> {
     const formValue = formData.get("form")

     if(typeof formValue != "string") {
          throw new Error("Post form data is missing.")
     }

     const payload = new FormData()
     payload.append("form", new Blob([formValue], {type: "application/json"}))

     const file = formData.get("file")

    if(file instanceof File && file.size > 0) {
          payload.append("file", file)
    }

    const response = await secureRequest(`post/${id}`, {
        method: "PUT",
        body: payload
    })

    return await response.json() as ModificationResult<number>
}