'use client'

import { safeCall } from "@/lib/utils"
import { useEffect, useState } from "react"
import * as Quiz from "@/lib/actions/quiz/quiz.action"
import { QuizAssessmentForm, QuizAssessmentSchema, QuizDetails } from "@/lib/type/schema/quiz/quiz.schema"
import Loading from "@/components/widgets/loading"
import { Resolver, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export default function AnswerAssessmentComponent({quizId} : {quizId: string}) {
    const [quiz, setQuiz] = useState<QuizDetails>()

    const form = useForm<QuizAssessmentForm>({
        resolver: zodResolver(QuizAssessmentSchema) as Resolver<QuizAssessmentForm>,
        defaultValues: {
            quizId: "",
            quizAnswerLists: []
        }
    })

    const quizAnswerListFieldArray = useFieldArray({
        control: form.control,
        name: "quizAnswerLists"
    })

    useEffect(() => {
        function load() {
             safeCall(async () => {
                const result = await Quiz.findQuizById(quizId)
                form.reset({
                    quizId: quizId,
                    quizAnswerLists: result.quizQuestions && result.quizQuestions.length > 0
                        ? result.quizQuestions.map(quizQuestion => 
                        ({questionId: quizQuestion.questionId.toString()})) : []
                })

                setQuiz(result)
             })
        }
        
        load()

    }, [quizId])
    
    if(!quiz) {
        return <Loading content="Loading Quiz Questions..." />
    }
    
    return (
        <div>
            {quiz.quizQuestions.map(question => 
                <h1 className="" key={question.questionId}>
                    {question.questionId}
                    {question.marks}
                    {question.questionTitle}
                    {question.questionType}
                </h1>
            )}
        </div> 
    )
}
