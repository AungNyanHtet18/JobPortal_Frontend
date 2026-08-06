'use client'

import { useSearchParams } from "next/navigation"
import QuizzesCreateComponent from "../_client/quiz-create-component"
import QuizzesEditComponent from "../_client/quiz-edit-component"

export default function QuizzesEditPage() {
    
    const searchParam = useSearchParams()
    const quizId = searchParam.get('quizId')
    
    if(quizId) {
        return (<QuizzesEditComponent quizId={quizId} />)
    }

    return (
        <QuizzesCreateComponent />
    )

}