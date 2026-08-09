'use client'

import ContentLayout from "@/components/widgets/content-layout"
import { AssessmentState } from "@/lib/type/schema/admin/quiz.schema"
import { QuizDetails } from "@/lib/type/schema/quiz/quiz.schema"
import { Award, BrainCircuit, ClipboardList, Clock, HelpCircle, LayoutList, PencilLine, Send, Sparkles, Trophy, type LucideIcon } from "lucide-react"

type SidebarSummaryProps = {
    quiz: QuizDetails | null
    totalPossibleMarks: number
    answered: number
    totalQuestions: number
    percent: number
    totalMarks: number
    state: AssessmentState
}

function QuizStatRow({title, value, detail, icon: Icon}: {title: string, value: number | string, detail?: string, icon: LucideIcon}) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white p-4">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-800">
                    <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">{title}</p>
                    {detail && <p className="text-xs text-zinc-500">{detail}</p>}
                </div>
            </div>
            <p className="shrink-0 text-lg font-semibold text-zinc-950">{value}</p>
        </div>
    )
}

export function QuizNoticeSummary({quiz, totalPossibleMarks, answered, totalQuestions, percent, totalMarks, state}: SidebarSummaryProps) {
    const scoreTitle = state === "submitted" ? "Your Score" : "Passing Score"
    const scoreValue = state === "submitted" ? totalMarks : Number(quiz?.passingScore ?? 0)
    return (
        <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
                <ContentLayout title="Assessment Overview" icon={<BrainCircuit className="size-5 text-zinc-900" />}>
                    <div className="space-y-4">
                        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white">
                                    <ClipboardList className="size-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-zinc-900">
                                        {quiz?.quizTitle ?? "Interview Quiz"}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        Practice exam to validate role-specific knowledge.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-zinc-200 bg-white p-3">
                                <p className="text-xs text-zinc-500">Answered</p>
                                <p className="mt-1 text-xl font-bold text-zinc-900">
                                    {answered} <span className="text-sm font-medium text-zinc-500">/ {totalQuestions}</span>
                                </p>
                            </div>
                            <div className="rounded-xl border border-zinc-200 bg-white p-3">
                                <p className="text-xs text-zinc-500">Progress</p>
                                <p className="mt-1 text-xl font-bold text-zinc-900">{percent}%</p>
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
                                <span>Completion</span>
                                <span>{answered} of {totalQuestions} question{totalQuestions === 1 ? "" : "s"}</span>
                            </div>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
                                <div className="h-full rounded-full bg-gradient-to-r from-zinc-800 to-slate-600 transition-all duration-300"
                                    style={{ width: `${percent}%` }}/>
                            </div>
                        </div>
                    </div>
                </ContentLayout>
      
                <ContentLayout title="Quiz Stats" icon={<BrainCircuit className="size-5 text-zinc-900" />}>
                    <div className="grid gap-4">
                        <QuizStatRow title="Total Questions" value={totalQuestions} icon={LayoutList} />
                        <QuizStatRow title="Possible Marks" value={totalPossibleMarks} icon={Award} />
                        <QuizStatRow title="Answered" value={`${answered}/${totalQuestions}`} detail={`${percent}% complete`} icon={PencilLine} />
                        <QuizStatRow title={scoreTitle} value={scoreValue} icon={Trophy} />
                    </div>
                </ContentLayout>

                <ContentLayout title="Milestones" icon={<Sparkles className="size-5 text-zinc-900" />}>
                    <div className="grid gap-3">
                        <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                                <Trophy className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-900">Passing Score</p>
                                <p className="text-xs text-zinc-500">
                                    Need {quiz?.passingScore ?? 0} / {totalPossibleMarks} marks to pass this quiz.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3">
                            <div className="flex size-10 items-center justify-center rounded-md bg-zinc-950 text-white">
                                <Clock className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-900">No Time Limit</p>
                                <p className="text-xs text-zinc-500">
                                    Take your time to review each option carefully.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                                <Send className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-zinc-900">Review Before Submitting</p>
                                <p className="text-xs text-zinc-500">
                                    Check your answers carefully before you submit the quiz.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
                            <div className="flex items-center gap-2">
                                <HelpCircle className="size-4 text-zinc-500" />
                                <p>
                                    <span className="font-medium text-zinc-800">Single Choice</span> - Pick exactly one correct answer.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <HelpCircle className="size-4 text-zinc-500" />
                                <p>
                                   <span className="font-medium text-zinc-800">Multiple Choice</span> - Select every option that counts as correct.
                                </p>
                            </div>
                        </div>
                    </div>
                </ContentLayout>
            </div>
        </div>
    )
}



