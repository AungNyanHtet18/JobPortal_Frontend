'use server'

import { secureRequest, secureSearch } from "@/lib"
import { ModificationResult, PageResult } from "@/lib/type"
import { AdminPostListItem, AdminPostSearch } from "@/lib/type/schema/admin/management.schema"

export async function searchPosts(form: AdminPostSearch): Promise<PageResult<AdminPostListItem>> {
    const response = await secureSearch("admin/post", form)
    return await response.json() as PageResult<AdminPostListItem>
}

export async function deletePosts(id: number) : Promise<ModificationResult<string>> {
    const response = await secureRequest(`admin/post/${id}`, {
        method: "DELETE"
    })
    return await response.json() as ModificationResult<string>
}