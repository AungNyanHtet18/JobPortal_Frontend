'use server'

import { POST_CONFIG, PUT_CONFIG, secureRequest, secureSearch } from "@/lib";
import { ModificationResult, PageResult } from "@/lib/type";
import { AdminQuizListItem, AdminQuizSearch, QuizPayloadType } from "@/lib/type/schema/admin/quiz.schema";

export async function searchQuizzes(form: AdminQuizSearch) : Promise<PageResult<AdminQuizListItem>> {
     const response = await secureSearch('admin/quiz', form)
     return await response.json() as PageResult<AdminQuizListItem>
}

export async function createQuizzes(form: QuizPayloadType) : Promise<ModificationResult<number>> {
    const response = await secureRequest('admin/quiz', {
        ...POST_CONFIG,
        body: JSON.stringify(form)
    })

    return await response.json() as ModificationResult<number>
}

export async function editQuizzes(id: string, form: QuizPayloadType) : Promise<ModificationResult<number>> {
     const response = await secureRequest(`admin/quiz/${id}`, {
        ...PUT_CONFIG,
        body: JSON.stringify(form)
     })

     return await response.json() as ModificationResult<number>
}

export async function deleteQuizzes(id: number) : Promise<ModificationResult<string>> {
    const response = await secureRequest(`admin/quiz/${id}`, {
        method: "DELETE"
    }) 

    return await response.json() as ModificationResult<string>
}

