import z from "zod";
import { PageSearch } from "../..";

export const InterviewQuizOptionSchema = z.object({
    optionAnswer: z.string().nonempty("Please fill option answer for quiz."),
    isCorrect: z.boolean()
})

export const InterviewQuizQuestionSchema = z.object({
    questionTitle: z.string().nonempty("Please fill question title for quiz."),
    questionType: z.string().nonempty("Please select question title for quiz."),
    marks: z.string().nonempty()  
            .regex(/^\d+$/, "Marks must be a number.")
            .refine(value => Number(value) > 0, {
            message: "Marks must be greater than 0."
            }),
    interviewQuizOptions: z.array(InterviewQuizOptionSchema).min(2, "Please select at least two options for quiz question.")
})

export const QuizSchema = z.object({
    roleId: z.string().nonempty("Please fill role id for quiz."),
    quizTitle: z.string().nonempty("Please fill question title for quiz."),
    passingScore: z.string().trim().nonempty("Please fill passing score for quiz.").regex(/^\d+$/, "Passing score must be a number."),
    interviewQuizQuestions: z.array(InterviewQuizQuestionSchema).min(1, "Please select at least one question for quiz.")
})

export type QuizForm = z.infer<typeof QuizSchema>

export type QuizPayloadType = {
    roleId: number
    quizTitle: string
    passingScore: number
    interviewQuizQuestions: {
        questionTitle: string
        questionType: string
        marks: number
        interviewQuizOptions: {
            optionAnswer: string
            isCorrect: boolean
        }[]
    }[]
}

export const emptyQuizOption = {
    optionAnswer: "",
    isCorrect: false
}

export const emptyQuizQuestion = {
    questionTitle: "",
    questionType: "Single Choice",
    marks: "",
    interviewQuizOptions: [
        {...emptyQuizOption},
        {...emptyQuizOption},
        {...emptyQuizOption},
        {...emptyQuizOption}
    ]
}

export const QuestionTypeOptions = [
    {key: "Single Choice", value: "Single Choice"},
    {key: "Multiple Choice", value: "Multiple Choice"}
]

export const QuizPayload = (form: QuizForm): QuizPayloadType => {
    return {
        roleId: Number(form.roleId),
        quizTitle: form.quizTitle.trim(),
        passingScore: Number(form.passingScore),
        interviewQuizQuestions: form.interviewQuizQuestions.map(question => ({
            questionTitle: question.questionTitle.trim(),
            questionType: question.questionType,
            marks: Number(question.marks),
            interviewQuizOptions: question.interviewQuizOptions.map(option => ({
                optionAnswer: option.optionAnswer.trim(),
                isCorrect: option.isCorrect
            }))
        }))
    }
}

export type AdminQuizSearch = {
    questionType? : string
    keyword?: string
} & PageSearch

export type AdminQuizListItem = {
     id: number
     quizTitle: string
     passingScore: number
     roleName: string
     questionId: number
     questionTitle: string
     questionType: string
     marks: number,
     questionOptionsCount: number
}

export type AssessmentState = "loading" | "empty" | "active" | "submitted" | "error"
export type QuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE"
export type AnswerMap = Record<number, Record<number, boolean>>