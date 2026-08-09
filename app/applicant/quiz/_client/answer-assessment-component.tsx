'use client'

import { useEffect, useMemo, useState} from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Resolver, useForm, useWatch } from "react-hook-form"
import {AlertTriangle,ClipboardList, Loader2,MoveRight,RefreshCcw,Send} from "lucide-react"
import PageTitle from "@/components/widgets/page-title"
import Loading from "@/components/widgets/loading"
import ContentLayout from "@/components/widgets/content-layout"
import InputComponent from "@/components/widgets/input-component"
import DialogDetailComponent from "@/components/widgets/dialog-detail-component"
import IconComponent from "@/components/widgets/icon-component"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import * as Quiz from "@/lib/actions/quiz/quiz.action"
import { safeCall } from "@/lib/utils"
import {QuizAnswerPayload,QuizAssessmentForm,QuizAssessmentSchema,QuizDetails,QuizOption,QuizQuestion, quizSubmissionPayload,} from "@/lib/type/schema/quiz/quiz.schema"
import { AnswerMap, AssessmentState} from "@/lib/type/schema/admin/quiz.schema"
import { QuizNoticeSummary } from "./quiz-notice-summary-component"
import { QuestionCard } from "./quiz-question-component"
import { ScoreDialog } from "./score-dialog-component"

function buildEmptyAnswerMap(questions: QuizQuestion[]): AnswerMap {
    const map: AnswerMap = {}
    questions.forEach(question => {
        map[question.questionId] = {};
        question.quizOptions.forEach(option => {
            map[question.questionId][option.optionId] = false
        })
    })
    return map
}

function buildInitialFormEntries(questions: QuizQuestion[]): QuizAssessmentForm["quizAnswerLists"] {
    return questions.map(question => ({
        questionId: question.questionId.toString(),
        answerOptions: question.quizOptions.map(option => ({
            optionId: option.optionId.toString(),
            isCorrect: false
        }))
    }))
}

function countSelectedOptions(question: QuizQuestion,answers: AnswerMap): number {
    const questionOptions = answers[question.questionId] || {}
    return Object.values(questionOptions).filter(Boolean).length //return how many true options exist in each quiz question
}

export default function AnswerAssessmentComponent({ quizId }: { quizId: string }) {
    const [quiz, setQuiz] = useState<QuizDetails | null>(null)
    const [state, setState] = useState<AssessmentState>("loading")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [totalMarks, setTotalMarks] = useState<number>(0)
    const [scoreDialogOpen, setScoreDialogOpen] = useState<boolean>(false)
    const [userAnswers, setUserAnswers] = useState<AnswerMap>({})

    const form = useForm<QuizAssessmentForm>({
        resolver: zodResolver(QuizAssessmentSchema) as Resolver<QuizAssessmentForm>,
        defaultValues: {
            quizId: "",
            quizAnswerLists: [],
        }
    })

    const watchedAnswers = useWatch({
        control: form.control,
        name: "quizAnswerLists",
        defaultValue: [],
    })

    const totalPossibleMarks = useMemo(() => {
        const questions = quiz?.quizQuestions ?? []
        return questions.reduce((sum, q) => sum + Number(q.marks || 0), 0)
    }, [quiz])

    const answersByQuestion = useMemo<AnswerMap>(() => {
        const map: AnswerMap = {}
        watchedAnswers.forEach(entry => {
            const qId = Number(entry.questionId)
            if (Number.isNaN(qId)) return
            const perOption: Record<number, boolean> = {};
            (entry.answerOptions ?? []).forEach(o => {
                const oId = Number(o.optionId)
                if (!Number.isNaN(oId)) perOption[oId] = !!o.isCorrect
            })
            map[qId] = perOption
        })
        return map
    }, [watchedAnswers])

    const progress = useMemo(() => {
        const questions = quiz?.quizQuestions ?? []
        const answered = questions.filter(q => countSelectedOptions(q, answersByQuestion) > 0).length
        const total = questions.length
        const percent = total === 0 ? 0 : Math.round((answered / total) * 100)
        return { answered, total, percent }
    }, [quiz, answersByQuestion])

    const passed = useMemo<boolean | null>(() => {
        if (state !== "submitted" || !quiz) return null
        return totalMarks >= Number(quiz.passingScore)
    }, [state, quiz, totalMarks])

    useEffect(() => {
        let cancelled = false

        async function loadQuiz() {
            try {
                await safeCall(async () => {
                    const result = await Quiz.findQuizById(quizId)
                    if (cancelled) return

                    const questions = result.quizQuestions ?? []

                    form.reset({quizId,quizAnswerLists: buildInitialFormEntries(questions),})

                    setUserAnswers(buildEmptyAnswerMap(questions))
                    setQuiz(result)
                    setState(questions.length === 0 ? "empty" : "active")
                })
            } catch {
                if (!cancelled) setState("error")
            }
        }

        setState("loading")
        loadQuiz()

        return () => {
            cancelled = true
        }
    }, [quizId, form])

    function findWatchedAnswerIndex(questionId: number): number | null {
        const idx = watchedAnswers.findIndex(a => Number(a.questionId) === questionId)
        return idx >= 0 ? idx : null
    }

    function findWatchedOptionIndex(answerIndex: number, optionId: number): number | null {
        const options = watchedAnswers[answerIndex]?.answerOptions ?? []
        const idx = options.findIndex(o => Number(o.optionId) === optionId)
        return idx >= 0 ? idx : null
    }

    function writeAnswerMap(questionId: number, nextForQuestionOptions: Record<number, boolean>) {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: nextForQuestionOptions,
        }))
    }

    function handleToggleSingle(question: QuizQuestion, option: QuizOption) {
        const answerIdx = findWatchedAnswerIndex(question.questionId)
        if (answerIdx === null) return

        const nextOptions = (question.quizOptions ?? []).map(qo => ({
            optionId: qo.optionId.toString(),
            isCorrect: qo.optionId === option.optionId,
        }))

        form.setValue(`quizAnswerLists.${answerIdx}.answerOptions`, nextOptions, {
            shouldDirty: true,
            shouldValidate: true,
        })

        const nextMap: Record<number, boolean> = {}

        nextOptions.forEach(o => {
            nextMap[Number(o.optionId)] = !!o.isCorrect
        })
        
        writeAnswerMap(question.questionId, nextMap)
    }

    function handleToggleMultiple(question: QuizQuestion, option: QuizOption, nextChecked: boolean) {
        
        const answerIdx = findWatchedAnswerIndex(question.questionId)
        if (answerIdx === null) return

        const optionIdx = findWatchedOptionIndex(answerIdx, option.optionId)
        if (optionIdx === null) return

        form.setValue(`quizAnswerLists.${answerIdx}.answerOptions.${optionIdx}.isCorrect`,
            nextChecked,{ shouldDirty: true, shouldValidate: true })

        const prevForQuestionOptions = userAnswers[question.questionId] ?? {}
        
        writeAnswerMap(question.questionId, {
            ...prevForQuestionOptions,
            [option.optionId]: nextChecked
        })
    }

    function handleReset() {
        if (!quiz) return
        const questions = quiz.quizQuestions || []
        
        form.reset({quizId, quizAnswerLists: buildInitialFormEntries(questions)})
        
        setUserAnswers(buildEmptyAnswerMap(questions))
        setTotalMarks(0)
        setScoreDialogOpen(false)
        setState(questions.length === 0 ? "empty" : "active")
    }

    async function handleSubmit(form: QuizAssessmentForm) {
        if (!quiz || state !== "active") return

        setIsSubmitting(true)
        try {
            await safeCall(async () => {
                const payload = quizSubmissionPayload(quiz, form)
                const quizAssessmentForm: QuizAssessmentForm = {
                    quizId: payload.quizId.toString(),
                    quizAnswerLists: payload.quizAnswerLists.map(q => ({
                        questionId: q.questionId.toString(),
                        answerOptions: q.answerOptions.map(o => ({
                            optionId: o.optionId.toString(),
                            isCorrect: o.isCorrect,
                        }))
                    }))
                }

                const result = await Quiz.answerQuiz(QuizAnswerPayload(quizAssessmentForm))
                setTotalMarks(Number(result.id ?? 0))
                setState("submitted")
                setScoreDialogOpen(true)
            })
        } catch {
            setState("active")
        } finally {
            setIsSubmitting(false)
        }
    }
    
    if (state === "loading") {
        return <Loading content="Loading Quiz Questions..." />
    }

    if (state === "error") {
        return (
            <section className="mx-auto max-w-7xl space-y-6 px-1 pb-8 text-zinc-950">
                <PageTitle icon="AlertTriangle" title="Quiz Not Available" description="We couldn't load this assessment."/>

                <ContentLayout title="Something went wrong" icon={<AlertTriangle className="size-5 text-zinc-900" />}>
                    <div className="space-y-4 text-sm text-zinc-700">
                        <p>
                            We couldn't load this quiz right now. Please try again in a few moments or go back to the quizzes list.
                        </p>
                        <div className="flex gap-2">
                            <Button onClick={handleReset} variant="outline">
                                <RefreshCcw className="size-4" /> Try Again
                            </Button>
                        </div>
                    </div>
                </ContentLayout>
            </section>
        )
    }

    const headerDescription = state === "submitted" ? "Your answers were scored. Review the official correct answers to reinforce your learning." : quiz
            ? `${quiz.quizTitle} - Passing score ${quiz.passingScore} / ${totalPossibleMarks} marks.`
            : "Answer the questions below and submit to calculate your total score."

    return (
        <section className="mx-auto max-w-7xl space-y-6 px-1 pb-8 text-zinc-950">
            <PageTitle icon="BrainCircuit" title={state === "submitted" ? "Assessment Result" : "Quiz Assessment"}
                description={headerDescription}/>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                        <div className="space-y-6 min-w-0">
                            {state === "empty" && !quiz?.quizQuestions?.length && 
                                <DialogDetailComponent title="Questions" titleIcon="ClipboardList" onClickAction={() => {}}>
                                    <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
                                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
                                            <IconComponent icon="Brain" className="size-6 text-zinc-700" />
                                        </div>
                                        <p className="mt-4 text-sm font-medium text-zinc-950">No questions yet</p>
                                        <p className="mt-1 text-sm text-zinc-500">
                                            This quiz does not contain any practice questions yet.
                                        </p>
                                    </div>
                                </DialogDetailComponent>}

                            {!!quiz?.quizQuestions?.length && (
                                <InputComponent title="Questions" icon={<ClipboardList className="size-5 text-zinc-900" />}
                                    className="gap-4 md:grid-cols-2">

                                    {(quiz.quizQuestions ?? []).map((question, index) => (
                                        <QuestionCard 
                                            key={question.questionId}
                                            question={question}
                                            index={index}
                                            userSelection={userAnswers[question.questionId] ?? {}}
                                            state={state}
                                            onToggleSingle={option => handleToggleSingle(question, option)}
                                            onToggleMultiple={(option, checked) => handleToggleMultiple(question, option, checked)}/>
                                    ))}
                                </InputComponent>
                            )}

                            <div className="flex flex-wrap items-center justify-end gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                                <div className="mr-auto flex items-center gap-2 text-sm text-zinc-600">
                                    <MoveRight className="size-4 text-zinc-500" />
                                    <span>
                                        Answered{" "}
                                        <span className="font-semibold text-zinc-900">{progress.answered}</span> /{" "}
                                        {progress.total} question{progress.total === 1 ? "" : "s"}
                                    </span>
                                </div>
                                
                                <Button type="button" variant="outline"
                                    onClick={handleReset} disabled={isSubmitting || state === "empty"}
                                    className="border-zinc-900 text-zinc-950 hover:bg-zinc-100">
                                    <RefreshCcw className="size-4" /> Reset Answers
                                </Button>

                                <Button type="submit" disabled={state !== "active" || isSubmitting}
                                    className="bg-zinc-950 text-white hover:bg-zinc-800">
                                    {isSubmitting ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <Send className="size-4" />
                                    )}
                                    {isSubmitting ? "Submitting..." : "Submit Assessment"}
                                </Button>
                            </div>
                        </div>

                        <QuizNoticeSummary quiz={quiz} totalPossibleMarks={totalPossibleMarks} answered={progress.answered}
                            totalQuestions={progress.total} percent={progress.percent} totalMarks={totalMarks} state={state}/>
                    </div>
                </form>
            </Form>

            <ScoreDialog open={scoreDialogOpen} passed={passed} totalMarks={totalMarks} totalPossibleMarks={totalPossibleMarks}  onClose={() => setScoreDialogOpen(false)}/>
        </section>
    )
}