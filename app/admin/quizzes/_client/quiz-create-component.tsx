'use client'

import FormsInput from "@/components/fields/form-input"
import FormsTextAreaInput from "@/components/fields/form-textarea"
import FormSelect from "@/components/fields/form-select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import ContentLayout from "@/components/widgets/content-layout"
import DialogDetailComponent from "@/components/widgets/dialog-detail-component"
import DialogComponent from "@/components/widgets/dialog-widget"
import InputComponent from "@/components/widgets/input-component"
import PageTitle from "@/components/widgets/page-title"
import * as Quiz from "@/lib/actions/admin/quiz.management.action"
import { safeCall } from "@/lib/utils"
import { emptyQuizOption, emptyQuizQuestion, QuestionTypeOptions, QuizForm, QuizPayload,QuizSchema} from "@/lib/type/schema/admin/quiz.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import {Award, CheckCircle2, ClipboardCheck, FileQuestion, Layers3, Loader2, Pencil, Plus, Save, ShieldCheck, Sparkles, Trash2} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Resolver, useFieldArray, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import { getCareers } from "@/lib/actions/admin/career.action"
import { CareerListItem } from "@/lib/type/schema/admin/career.schema"
import FormsCheckBox from "@/components/fields/form-checkbox"

export default function QuizzesCreateComponent() {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [questionDialogIndex, setQuestionDialogIndex] = useState<number | null>(null)
    const [careers, setCareers] = useState<CareerListItem[]>([{roleId: 0, roleName: ""}])

    const form = useForm<QuizForm>({
        resolver: zodResolver(QuizSchema) as Resolver<QuizForm>,
        defaultValues: {
            roleId: "",
            quizTitle: "",
            passingScore: "",
            interviewQuizQuestions: [],
        }
    })

    useEffect(() => {
        function load() {
            safeCall(async () => {
                const careers: CareerListItem[] = await getCareers()
                setCareers(careers) 
            })
        }
        load()
    }, [form])

    const quizQuestionFieldArray = useFieldArray({
        control: form.control,
        name: "interviewQuizQuestions",
    })

    const watchedQuestions = useWatch({
        control: form.control,
        name: "interviewQuizQuestions",
    }) || []

    const watchedPassingScore = useWatch({
        control: form.control,
        name: "passingScore",
    })
    
    const totalMarks = watchedQuestions.reduce((total, question) => total + Number(question.marks), 0)
    const currentQuestion = questionDialogIndex !== null ? watchedQuestions[questionDialogIndex] : undefined
    const currentQuestionType = currentQuestion?.questionType || "SINGLE_CHOICE"

    const openNewQuestion = () => {
        const nextIndex = quizQuestionFieldArray.fields.length
        quizQuestionFieldArray.append(emptyQuizQuestion)
        setQuestionDialogIndex(nextIndex)
    }

    const removeQuestion = (index: number) => {
        quizQuestionFieldArray.remove(index)
        setQuestionDialogIndex(null)
    }

    const addOption = (questionIndex: number) => {
        const currentOptions = form.getValues(`interviewQuizQuestions.${questionIndex}.interviewQuizOptions`) || []

        form.setValue(
            `interviewQuizQuestions.${questionIndex}.interviewQuizOptions`,
            [...currentOptions, emptyQuizOption],
            { shouldDirty: true, shouldValidate: true }
        )
    }

    const removeOption = (questionIndex: number, optionIndex: number) => {
        const currentOptions = form.getValues(`interviewQuizQuestions.${questionIndex}.interviewQuizOptions`) || []

        if (currentOptions.length <= 2) {
            form.setValue(`interviewQuizQuestions.${questionIndex}.interviewQuizOptions.${optionIndex}.optionAnswer`, "")
            form.setValue(`interviewQuizQuestions.${questionIndex}.interviewQuizOptions.${optionIndex}.isCorrect`, false)
        }else{
             form.setValue(`interviewQuizQuestions.${questionIndex}.interviewQuizOptions`,
             currentOptions.filter((_, index) => index !== optionIndex),
            { shouldDirty: true, shouldValidate: true })
        }
    }

    const  changingQuestionType = (questionIndex: number, optionIndex: number, checked: boolean) => {
        const questionType = form.getValues(`interviewQuizQuestions.${questionIndex}.questionType`)
        const currentOptions = form.getValues(`interviewQuizQuestions.${questionIndex}.interviewQuizOptions`) || []

        if (questionType === "Single Choice" && checked) {
            form.setValue(`interviewQuizQuestions.${questionIndex}.interviewQuizOptions`,
            currentOptions.map((option, index) => ({
                ...option, 
                isCorrect: index === optionIndex, 
            })),{ shouldDirty: true, shouldValidate: true })
        }else {
              form.setValue(`interviewQuizQuestions.${questionIndex}.interviewQuizOptions.${optionIndex}.isCorrect`,
              checked, { shouldDirty: true, shouldValidate: true })
        }
    }

    async function save(quizForm: QuizForm) {
        setIsSaving(true)

        await safeCall(async () => {
            const result = await Quiz.createQuizzes(QuizPayload(quizForm))

            toast.success("Quiz is created", {
                description: `Quiz #${result.id} has been added successfully.`,
            })

            form.reset({
                roleId: "",
                quizTitle: "",
                passingScore: "",
                interviewQuizQuestions: [],
            })

            setQuestionDialogIndex(null)
            router.push(`/admin/quizzes`)
        })

        setIsSaving(false)
    }

    return (
        <section className="mx-auto max-w-7xl space-y-6 px-1 pb-8 text-zinc-950">
            <PageTitle icon="BookOpenCheck" title="Create Quiz" description="Build interview quizzes with clear questions, structured answers, and a passing score." />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(save)}>
                    <div className="flex gap-3 w-full">
                        <div className="w-2/3  space-y-6">
                            <InputComponent title="Quiz Information" className="md:grid-cols-2" icon={<ClipboardCheck className="size-5 text-zinc-900" />}>
                                <FormsInput control={form.control} path="quizTitle" label="Quiz Title" placeHolder="Enter quiz title" />
                                <FormSelect control={form.control} path="roleId" label="Role ID"  options={careers.map(career => ({key: String(career.roleId), value: career.roleName}))}/>
                                <FormsInput control={form.control} path="passingScore" type="number" label="Passing Score" placeHolder="Enter passing score" />

                                <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 md:col-span-2">
                                    <p className="text-sm font-medium text-zinc-950">Quiz setup summary</p>
                                    <p className="mt-1 text-sm text-zinc-500">
                                        This quiz currently contains {watchedQuestions.length} question{watchedQuestions.length === 1 ? "" : "s"} and {totalMarks} total mark{totalMarks === 1 ? "" : "s"}.
                                    </p>
                                </div>
                            </InputComponent>

                            <DialogDetailComponent title="Quiz Questions" titleIcon="FileQuestion" onClickAction={openNewQuestion}>
                                <div className="space-y-4">
                                    {watchedQuestions.length === 0 && (
                                        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
                                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
                                                <FileQuestion className="size-6 text-zinc-700" />
                                            </div>
                                            <p className="mt-4 text-sm font-medium text-zinc-950">No questions added yet</p>
                                            <p className="mt-1 text-sm text-zinc-500">
                                                Add your first question to start building the interview quiz.
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid gap-4 md:grid-cols-2">
                                        {quizQuestionFieldArray.fields.map((field, index) => {
                                            const question = watchedQuestions[index]
                                            const optionCount = question?.interviewQuizOptions?.length || 0
                                            const correctCount = question?.interviewQuizOptions?.filter(option => option.isCorrect).length || 0
                                            
                                            return (
                                                <div key={field.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-semibold text-zinc-950">
                                                                {question?.questionTitle || `Question ${index + 1}`}
                                                            </p>
                                                            <p className="mt-1 text-xs text-zinc-500">
                                                                {question?.questionTitle
                                                                    ? "Review the choices and correct answers before saving."
                                                                    : "Open this card to add the question and options."}
                                                            </p>
                                                        </div>

                                                        <Badge variant="outline" className="bg-white text-zinc-700">
                                                            {question?.marks || 0} marks
                                                        </Badge>
                                                    </div>

                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        <Badge className="bg-zinc-900 text-white hover:bg-zinc-900">
                                                            {question?.questionType === "MULTIPLE_CHOICE" ? "Multiple Choice" : "Single Choice"}
                                                        </Badge>
                                                        <Badge variant="outline" className="bg-white text-zinc-700">
                                                            {optionCount} options
                                                        </Badge>
                                                        <Badge variant="outline" className="bg-white text-zinc-700">
                                                            {correctCount} correct
                                                        </Badge>
                                                    </div>

                                                    <div className="mt-4 flex gap-2">
                                                        <Button type="button" variant="outline" size="sm" className="flex-1 bg-white" onClick={() => setQuestionDialogIndex(index)}>
                                                            <Pencil className="size-4" />
                                                            Edit
                                                        </Button>

                                                        <Button type="button" variant="outline" size="icon" className="bg-white text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => removeQuestion(index)}>
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </div>)
                                        })}
                                    </div>
                                </div>
                            </DialogDetailComponent>
                        </div>

                        <div className="w-1/3 space-y-4">
                            <ContentLayout title="Builder Tips" icon={<Layers3 className="size-5 text-zinc-900" />}>
                                <div className="space-y-2">
                                    <div className="grid gap-3">
                                        <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                                                <Award className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-zinc-950">Passing score</p>
                                                <p className="text-xs text-zinc-500">
                                                    {watchedPassingScore ? `${watchedPassingScore} marks required to pass` : "Set the minimum score candidates need to pass."}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                                                <ShieldCheck className="size-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-zinc-950">Role mapping</p>
                                                <p className="text-xs text-zinc-500">
                                                    Use the backend career id in <span className="font-medium text-zinc-700">Role ID</span> so this quiz is attached to the correct role.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 text-sm text-zinc-600">
                                        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4">
                                            Use <span className="font-medium text-zinc-800">Single Choice</span> for one correct answer and <span className="font-medium text-zinc-800">Multiple Choice</span> when several answers can be correct.
                                        </div>
                                        <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4">
                                            Start with 3-5 strong questions, then adjust the total marks and passing score.
                                        </div>
                                    </div>
                                </div>
                            </ContentLayout>
                        </div>
                    </div>
                    <div className="sticky bottom-0 flex justify-end border-t border-zinc-200 bg-gray-50/95 py-3 backdrop-blur">
                        <Button type="submit" disabled={isSaving} className="bg-zinc-950 px-6 text-white hover:bg-zinc-800">
                            {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                            {isSaving ? "Saving" : "Save Quiz"}
                        </Button>
                    </div>

                    <DialogComponent diaLogIndex={questionDialogIndex} diaLogTitle="Quiz Question Detail" diaLogDescription="Write the question, choose the answer type, and mark the correct option values."
                        onOpenChange={() => setQuestionDialogIndex(null)} onRemoveChange={(index) => {
                            if (index !== null) {
                                removeQuestion(index)
                            }}}>

                        {questionDialogIndex !== null && (
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormsTextAreaInput control={form.control} path={`interviewQuizQuestions.${questionDialogIndex}.questionTitle`}
                                        label="Question Title" placeHolder="Write the quiz question" rowHeight="min-h-[80px]" className="md:col-span-2"/>

                                    <FormSelect control={form.control} path={`interviewQuizQuestions.${questionDialogIndex}.questionType`}
                                        label="Question Type" placeHolder="Choose Question Type" options={QuestionTypeOptions}/>

                                    <FormsInput control={form.control} path={`interviewQuizQuestions.${questionDialogIndex}.marks`}
                                        type="number" label="Marks" placeHolder="Enter marks"/>
                                </div>

                                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-950">Answer Options</p>
                                            <p className="text-xs text-zinc-500">
                                                {currentQuestionType === "MULTIPLE_CHOICE"
                                                    ? "Select every option that should count as correct."
                                                    : "Selecting one correct option will clear the others automatically."}
                                            </p>
                                        </div>

                                        <Button type="button" variant="outline" size="sm" className="bg-white" onClick={() => addOption(questionDialogIndex)}>
                                            <Plus className="size-4" />
                                            Add Option
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {(currentQuestion?.interviewQuizOptions || []).map((option, optionIndex) => (
                                            <div key={`${questionDialogIndex}-${optionIndex}`} className="rounded-lg border border-zinc-200 bg-white p-3">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex gap-2">
                                                        <FormsInput control={form.control} path={`interviewQuizQuestions.${questionDialogIndex}.interviewQuizOptions.${optionIndex}.optionAnswer`}
                                                            label={`Option ${optionIndex + 1}`} placeHolder="Enter option answer" className="w-full"/>
                                                        
                                                        <div className="mt-5">
                                                            <Button type="button" variant="outline" size="icon" className=" bg-white text-red-500 hover:bg-red-50 hover:text-red-600"
                                                                onClick={() => removeOption(questionDialogIndex, optionIndex)}>
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    <div className="w-1/4">
                                                        <FormsCheckBox control={form.control} path={`interviewQuizQuestions.${questionDialogIndex}.interviewQuizOptions.${optionIndex}.isCorrect`} 
                                                            action={(checked) => changingQuestionType(questionDialogIndex, optionIndex, checked)} label="Correct Answer" className="rounded-lg border border-zinc-200 bg-zinc-50 pl-2 p-2"/>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                                            <CheckCircle2 className="size-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-950">Question check</p>
                                            <p className="text-xs text-zinc-500">
                                                Current correct answers: {currentQuestion?.interviewQuizOptions?.filter(option => option.isCorrect).length || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogComponent>
                </form>
            </Form>
        </section>
    )
}
