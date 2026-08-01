'use server'

import { POST_CONFIG, secureRequest } from "@/lib";
import { ModificationResult } from "@/lib/type";
import { QuizPayloadType } from "@/lib/type/schema/admin/quiz.schema";

export async function createQuiz(form: QuizPayloadType): Promise<ModificationResult<number>> {
    const response = await secureRequest("admin/quiz", {
        ...POST_CONFIG,
        body: JSON.stringify(form)
    })

    return await response.json() as ModificationResult<number>
}
