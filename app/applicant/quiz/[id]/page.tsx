import AnswerAssessmentComponent from "../_client/answer-assessment-component"

export default async function AnswerAccessmentPage ({params}: {params: Promise<{id: string}>}) {
     const {id} = await params
     return <AnswerAssessmentComponent quizId={id} />
}