'use server'

import { secureSearch } from "@/lib";
import { PageResult, PageSearch } from "@/lib/type";
import { QuizDetails, QuizTitleListItem } from "@/lib/type/schema/quiz/quiz.schema";

export async function findQuizById(id: string) : Promise<QuizDetails> {
    const response = await secureSearch(`quiz/${id}`)
    return await response.json() as QuizDetails 
}

export async function getQuizTitles(pageSearch: PageSearch) : Promise<PageResult<QuizTitleListItem>> {
    const response = await secureSearch('quiz/quiztitle', pageSearch)
    return await response.json() as PageResult<QuizTitleListItem>
}