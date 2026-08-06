import z from "zod"


export const QuizAnswerOptionListSchema = z.object({
    optionId: z.string().trim().nonempty("Please fill option id for quiz assessment.").regex(/^\d+$/, "Option Id must be a number."),
    isCorrect: z.boolean()
})

export const QuizAnswerListSchema = z.object({
    questionId: z.string().trim().nonempty("Please fill question id for quiz assessment.").regex(/^\d+$/, "Question Id must be a number."),
    answerOptions: z.array(QuizAnswerOptionListSchema).min(1, "Please select at least one option for quiz assessment question.")
})

export const QuizAssessmentSchema = z.object({
    quizId: z.string().trim().nonempty("Please fill quiz id for quiz assessment.").regex(/^\d+$/, "Quiz Id must be a number."),
    quizAnswerLists: z.array(QuizAnswerListSchema).min(1, "Please select at least one answer for quiz assessment question.")
})

export type QuizAssessmentForm = z.infer<typeof QuizAssessmentSchema>

export type QuizDetails = { 
    id: number
    roleId: number
    quizTitle: string
    passingScore: number
    quizQuestions: QuizQuestion[]
}

export type QuizQuestion = {
    questionId: number
    questionTitle: string
    questionType: string
    marks: number
    quizOptions: QuizOption[]
}

export type QuizOption = {
    optionId: number
    optionAnswer: string
    isCorrect: boolean
}

export type QuizTitleListItem = {
    quizId: number
    quizTitle: string
    roleName: string
    quizQuestionCount: number
}
