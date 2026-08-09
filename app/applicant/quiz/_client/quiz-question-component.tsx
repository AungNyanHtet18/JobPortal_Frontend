'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AssessmentState, QuestionType } from "@/lib/type/schema/admin/quiz.schema"
import { QuizOption, QuizQuestion } from "@/lib/type/schema/quiz/quiz.schema"
import { BadgeCheck, CircleCheckBig, CircleX, ListChecks, XCircle } from "lucide-react"
import { KeyboardEvent } from "react"

export type QuestionCardProps = {
    question: QuizQuestion
    index: number
    userSelection: Record<number, boolean>
    state: AssessmentState
    onToggleSingle: (option: QuizOption) => void
    onToggleMultiple: (option: QuizOption, checked: boolean) => void
}

export type OptionRowProps = {
    question: QuizQuestion
    option: QuizOption
    optionLetter: string
    selected: boolean
    state: AssessmentState
    onActivate: () => void
}

export type CorrectAnswerBoxProps = {
    question: QuizQuestion
    correctOptions: QuizOption[]
}

export type CorrectAnswerRowProps = {
    option: QuizOption
    optionLetter: string
}

export function normalizeQuestionType(raw: string): QuestionType {
    if (!raw) return "SINGLE_CHOICE"
    const clean = raw.trim().toLowerCase().replace(/[^a-z]+/g, "")
    return clean === "multiplechoice" ? "MULTIPLE_CHOICE" : "SINGLE_CHOICE"
}

export function optionLetter(index: number): string {
    return String.fromCharCode(65 + index)
}

export function isQuestionFullyCorrect(question: QuizQuestion, userSelection: Record<number, boolean>): boolean {
    const options:QuizOption[] = question.quizOptions 
    if (options.length === 0) return false 
    return options.every(option => !!option.isCorrect === !!userSelection[option.optionId]) 
}


export function getCheckboxStateClasses(isOfficialCorrect: boolean, isWrongUserPick: boolean) {
    if (isOfficialCorrect) {
        return "!border-green-600 !bg-green-600 !text-white data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600"
    } else if (isWrongUserPick) {
        return "!border-red-600 !bg-red-600 !text-white data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600"
    } else {
      return ""    
    }
}

export function listCorrectOptions(question: QuizQuestion): QuizOption[] {
    return (question.quizOptions).filter(option => option.isCorrect)
}

export function getOptionStateClasses({submitted,selected,isOfficialCorrect,isWrongUserPick,}: {
    submitted: boolean,selected: boolean,isOfficialCorrect: boolean,isWrongUserPick: boolean}) {

    if (!submitted && selected) {
        return "border-zinc-900 bg-zinc-50 shadow-sm cursor-pointer"
    }

    if (!submitted) {
        return "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 cursor-pointer"
    }

    if (isOfficialCorrect) {
        return "border-green-300 bg-green-50/80 shadow-[0_0_0_1px_rgba(22,163,74,0.08)] cursor-default"
    }

    if (isWrongUserPick) {
        return "border-red-300 bg-red-50/80 shadow-[0_0_0_1px_rgba(220,38,38,0.08)] cursor-default"
    }

    return "border-zinc-200 bg-white cursor-default"
}

export function OptionStatusIndicator({submitted,isOfficialCorrect,isWrongUserPick,kind,optionLetter}: 
    {submitted: boolean, isOfficialCorrect: boolean, isWrongUserPick: boolean, kind: QuestionType, optionLetter: string}) {
    if (submitted && isOfficialCorrect) return <CircleCheckBig className="size-5 text-green-600" />
    if (submitted && isWrongUserPick) return <CircleX className="size-5  text-red-600" />

    const shapeClass = kind === "SINGLE_CHOICE" ? "rounded-full mt-0.5" : "rounded"

    return (
        <span className={`flex size-5 shrink-0 items-center justify-center ${shapeClass} bg-zinc-900 text-[10px] font-semibold text-zinc-100`}>
            {optionLetter}
        </span>
    )
}

export function OptionResultBadges({submitted,isOfficialCorrect,isWrongUserPick,} : {submitted: boolean, isOfficialCorrect: boolean, isWrongUserPick: boolean}) {
    if (!submitted) return null

    return (
        <div className="flex flex-shrink-0 flex-wrap justify-end gap-1.5">
            {isOfficialCorrect && (
                <Badge className="shrink-0 bg-green-600 text-white hover:bg-green-600">
                    Correct Answer
                </Badge>
            )}
            {isWrongUserPick && (
                <Badge variant="outline" className="shrink-0 border-red-300 bg-white text-red-700">
                    Your Answer
                </Badge>
            )}
        </div>
    )
}

export function OptionRow({question, option, optionLetter, selected, state, onActivate} : OptionRowProps) {
    const kind = normalizeQuestionType(question.questionType)
    const submitted = state === "submitted"
    const isOfficialCorrect = !!option.isCorrect
    const isWrongUserPick = submitted && selected && !isOfficialCorrect
    const optionClasses = ["group flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors duration-200",
        getOptionStateClasses({ submitted, selected, isOfficialCorrect, isWrongUserPick }),
    ].join(" ")

    const optionTextClass = submitted && isOfficialCorrect
        ? "font-medium text-green-900"
        : "text-zinc-800"

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (submitted) return
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onActivate()
        }
    }

    const stopInnerClick = (e: MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <div key={option.optionId} onClick={submitted ? undefined : onActivate} onKeyDown={handleKeyDown} className={optionClasses}>
            <div className="flex items-center gap-3 pt-0.5">
                <OptionStatusIndicator submitted={submitted} isOfficialCorrect={isOfficialCorrect}
                    isWrongUserPick={isWrongUserPick} kind={kind} optionLetter={optionLetter}/>

                {kind === "MULTIPLE_CHOICE" && (
                    <div onClick={() => stopInnerClick} onMouseDown={() => stopInnerClick}>
                        <Checkbox checked={selected} disabled={submitted}
                            className={submitted ? getCheckboxStateClasses(isOfficialCorrect, isWrongUserPick) : ""}
                            onCheckedChange={() => onActivate()}/>
                    </div>
                )}
            </div>

            <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                <span className={optionTextClass}>{option.optionAnswer}</span>
                <OptionResultBadges submitted={submitted} isOfficialCorrect={isOfficialCorrect} isWrongUserPick={isWrongUserPick}/>
            </div>
        </div>
    )
}

export function CorrectAnswerRow({option, optionLetter}: CorrectAnswerRowProps) {
    return (
        <li className="flex items-start gap-2">
            <CircleCheckBig className="mt-0.5 size-4 text-zinc-700" />
            <span>
                {optionLetter}. {option.optionAnswer}
            </span>
        </li>
    )
}

export function getCorrectOptionLetter(question: QuizQuestion, option: QuizOption) {
    const optionIndex = (question.quizOptions ?? []).findIndex(item => item.optionId === option.optionId)
    return optionIndex >= 0 ? optionLetter(optionIndex) : "-"
}

export function CorrectAnswerBox({question, correctOptions }: CorrectAnswerBoxProps) {
    if (correctOptions.length === 0) return null

    return (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">
                <div className="space-y-2">
                    <p className="text-sm font-semibold text-zinc-900">
                        Official correct answer{correctOptions.length === 1 ? "" : "s"}
                    </p>
                    <ul className="space-y-1.5 text-sm text-zinc-900">
                        {correctOptions.map(option => (
                            <CorrectAnswerRow key={option.optionId} option={option} optionLetter={getCorrectOptionLetter(question, option)}/>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export function QuestionCard({ question, index, userSelection, state, onToggleSingle, onToggleMultiple } : QuestionCardProps) {
    const kind = normalizeQuestionType(question.questionType)
    const submitted = state === "submitted"
    const fullyCorrect = submitted && isQuestionFullyCorrect(question, userSelection)
    const selectedCount = Object.values(userSelection).filter(Boolean).length
    const correctOptions = listCorrectOptions(question)

    const marksLabel = Number(question.marks) === 1 ? `${question.marks} mark` : `${question.marks} marks`

    return (
        <Card key={question.questionId} className={` bg-white transition-colors duration-200`}>
            <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex items-start gap-3">
                        <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg text-white bg-zinc-900`}>
                            <ListChecks className="size-5" />
                        </div>
                        <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold text-zinc-900">Question {index + 1}</p>
                                <Badge variant="outline" className="bg-zinc-50 text-zinc-700">
                                    {marksLabel}
                                </Badge>

                                <Badge className={kind === "SINGLE_CHOICE" ? "bg-zinc-800 text-white" : "bg-slate-500 text-white hover:bg-slate-700"}>
                                    {kind === "SINGLE_CHOICE" ? "Single Choice" : "Multiple Choice"}
                                </Badge>

                                {submitted && fullyCorrect && ( 
                                    <Badge variant="outline" className="bg-zinc-50 text-zinc-700">
                                        <BadgeCheck className="size-3 mr-1" />
                                        Correct
                                    </Badge>
                                 )} 

                                {submitted && !fullyCorrect && (
                                    <Badge variant="outline" className="border-red-300 bg-white text-red-600">
                                        <XCircle className="size-3.5 mr-1" />
                                        Missed
                                    </Badge>
                                )}
                            </div>
                            <p className="text-base leading-relaxed text-zinc-800">{question.questionTitle}</p>
                        </div>
                    </div>

                    <div className="shrink-0 text-right">
                        {!submitted && (
                            <Badge variant="outline" className={
                                    selectedCount > 0
                                        ? "border-green-300 bg-green-50 text-green-700"
                                        : "border-zinc-300 bg-white text-zinc-500"}>
                                {selectedCount > 0 ? `${selectedCount} selected` : "Not answered"}
                            </Badge>
                        )}
                        {submitted && !fullyCorrect && correctOptions.length > 0 && (
                            <Badge variant="outline" className="border-green-300 bg-green-50 text-green-700">
                                {correctOptions.length} correct {correctOptions.length === 1 ? "answer" : "answers"}
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="space-y-2.5">
                    {(question.quizOptions ?? []).map((option, optIndex) => {
                        const kind = normalizeQuestionType(question.questionType)
                        const activate = kind === "SINGLE_CHOICE" ? () => onToggleSingle(option) : () => onToggleMultiple(option, !userSelection[option.optionId])
                        
                        return (
                            <OptionRow key={option.optionId} question={question} 
                                option={option} optionLetter={optionLetter(optIndex)}
                                selected={!!userSelection[option.optionId]} state={state} onActivate={activate}/>
                        )
                    })}
                </div>

                {submitted && !fullyCorrect && (
                    <CorrectAnswerBox question={question} correctOptions={correctOptions} />
                )}
            </CardContent>
        </Card>
    )
}