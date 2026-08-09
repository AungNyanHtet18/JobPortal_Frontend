'use server'

import { POST_CONFIG, secureRequest, secureSearch } from "@/lib";
import { ModificationResult, PageResult, PageSearch } from "@/lib/type";
import { QuizAnswerPayloadType, QuizDetails, QuizTitleListItem } from "@/lib/type/schema/quiz/quiz.schema";

export async function findQuizById(id: string) : Promise<QuizDetails> {
    const response = await secureSearch(`quiz/${id}`)
    return await response.json() as QuizDetails 
}

export async function getQuizTitles(pageSearch: PageSearch) : Promise<PageResult<QuizTitleListItem>> {
    const response = await secureSearch('quiz/quiztitle', pageSearch)
    return await response.json() as PageResult<QuizTitleListItem>
}

export async function answerQuiz(form: QuizAnswerPayloadType): Promise<ModificationResult<number>> {
    const response = await secureRequest('quiz', {
        ...POST_CONFIG,
        body: JSON.stringify(form)
    })
    return await response.json() as ModificationResult<number>
}