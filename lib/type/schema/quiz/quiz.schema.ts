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

export type QuizAnswerPayloadType = {
    quizId: number
    quizAnswerLists: {
        questionId: number
        answerOptions: {
            optionId: number
            isCorrect: boolean
        }[]
    }[]
}

export const QuizAnswerPayload = (form: QuizAssessmentForm): QuizAnswerPayloadType => {
    return {
        quizId: Number(form.quizId),
        quizAnswerLists: form.quizAnswerLists.map(answer => ({
            questionId: Number(answer.questionId),
            answerOptions: answer.answerOptions.map(option => ({
                optionId: Number(option.optionId),
                isCorrect: option.isCorrect
            }))
        }))
    }
}

export function quizSubmissionPayload(quiz: QuizDetails, form: QuizAssessmentForm): QuizAnswerPayloadType {
    const submittedByQuestion = new Map<number, Map<number, boolean>>()
    form.quizAnswerLists.forEach(answer => {
        const questionId = Number(answer.questionId)
        const quizOption = new Map<number, boolean>();

        answer.answerOptions.forEach(option => {
            quizOption.set(Number(option.optionId), option.isCorrect)
        })
        submittedByQuestion.set(questionId, quizOption)
    })

    const quizAnswerLists = quiz.quizQuestions.map(question => ({
        questionId: question.questionId,
        answerOptions: (question.quizOptions).map(option => ({
            optionId: option.optionId,
            isCorrect: !! submittedByQuestion.get(question.questionId)?.get(option.optionId)
        }))
    }))

    return {
        quizId: Number(form.quizId),
        quizAnswerLists,
    }
}
