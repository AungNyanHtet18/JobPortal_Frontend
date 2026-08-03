'use client'

import FormsInput from "@/components/fields/form-input"
import FormSelect from "@/components/fields/form-select"
import { AlertDialog } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Loading from "@/components/widgets/loading"
import PageTitle from "@/components/widgets/page-title"
import PagerWidget from "@/components/widgets/pager-widget"
import { deleteQuizzes, searchQuizzes } from "@/lib/actions/admin/quiz.management.action"
import { DEFAULT_PAGE_RESULT, PageResult } from "@/lib/type"
import { AdminQuizListItem, AdminQuizSearch, QuestionTypeOptions } from "@/lib/type/schema/admin/quiz.schema"
import { safeCall } from "@/lib/utils"
import { Search, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function QuizzesManagementPage() {
    const [result, setResult] = useState<PageResult<AdminQuizListItem>>(DEFAULT_PAGE_RESULT) 
    const [loading, setLoading] = useState<boolean>(false)
    const [pendingDeleteQuizId, setPendingDeleteQuizId] = useState<number | null>(null)

    const form = useForm<AdminQuizSearch>({
        defaultValues: {
            questionType: '',
            keyword: '',
            page: 0,
            size: 10
        }
    })

    const keyword = form.watch('keyword')

    useEffect(() => {
         form.setValue('page', 0)
    }, [keyword])

    useEffect(() => {
        form.handleSubmit(search)()
    }, [form.handleSubmit])

    const onPageChange = (page: number) => {
        form.setValue('page', page)
        form.handleSubmit(search)()
    }

    const onSizeChange = (size: number) => {
        form.setValue('page', 0)
        form.setValue('size', size)
        form.handleSubmit(search)()
    }

    async function search(form: AdminQuizSearch) {
        setLoading(true)
         
        if(form.questionType === "-1") {
            delete form.questionType
        }

        await safeCall(async () => {
             const data = await searchQuizzes(form)
             setResult(data)
         })
        
        setLoading(false)
    }

    async function deleteQuiz(quizId: number | null) {
         
        if(!pendingDeleteQuizId) {
            return 
        }

        if(quizId != null) {
             await safeCall(async () => {
                const result = await deleteQuizzes(quizId)
                toast.success(result.id)
             })
        }

        setPendingDeleteQuizId(null)
        search(form.getValues())
    }

    return (
        <>
        <PageTitle icon="FileQuestion" title="Quiz Management" />

        <Card className='rounded-none px-1'>
            <CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(search)} className='flex items-center gap-2'>
                        <FormSelect control={form.control} path="questionType" options={[{key:"-1", value: "Select All Types"}, ...QuestionTypeOptions]} />
                        <FormsInput control={form.control} path='keyword' placeHolder='Search Quizzes...' className='w-1/4' />
                        <Button type='submit' className='hover:bg-zinc-700 transition shadow-md'>
                            <Search/> Search
                        </Button>
                    </form>
                </Form>
            </CardHeader>

            <CardContent className="p-0">
                {loading ? (
                    <Loading content="Loading Post Data..." />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className='bg-zinc-800 hover:bg-zinc-700'>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase'>Quiz ID</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase'>Quiz Title</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase'>Passing Score</TableHead>
                                        <TableHead className='text-center text-zinc-100 font-[600] tracking-wider uppercase'>Role</TableHead>
                                        <TableHead className='text-center text-zinc-100 font-[600] tracking-wider uppercase'>Question ID</TableHead>
                                        <TableHead className='text-start text-zinc-100 font-[600] tracking-wider uppercase'>Question Title</TableHead>
                                        <TableHead className='text-center text-zinc-100 font-[600] tracking-wider uppercase '>Question Type</TableHead>
                                        <TableHead className='text-end text-zinc-100 font-[600] tracking-wider uppercase '>Marks</TableHead>
                                        <TableHead className='text-center text-zinc-100 font-[600] tracking-wider uppercase'>Question Options</TableHead>
                                        <TableHead className='text-end text-zinc-100 font-[600] tracking-wider uppercase'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {result.list.map((quiz, index) => (
                                        <TableRow key={`${index}-${quiz.id}`}>
                                            <TableCell className="text-zinc-600">{quiz.id}</TableCell>
                                            <TableCell className="text-zinc-600">{quiz.quizTitle}</TableCell>
                                            <TableCell className="text-zinc-600 text-center">{quiz.passingScore}</TableCell>
                                            <TableCell className="text-center text-zinc-600">{quiz.roleName}</TableCell>
                                            <TableCell className="text-center text-zinc-600">{quiz.questionId}</TableCell>
                                            <TableCell className="text-start text-zinc-600">{quiz.questionTitle}</TableCell>
                                            <TableCell className="text-center text-zinc-600">{quiz.questionType}</TableCell>
                                            <TableCell className="text-end text-zinc-600">{quiz.marks}</TableCell>
                                            <TableCell className="text-center text-zinc-600">{quiz.questionOptionsCount}</TableCell>
                                            <TableCell className="text-center">
                                                
                                                <Button  className="!bg-black hover:bg-zinc-600"  size="icon" onClick={() => setPendingDeleteQuizId(quiz.id)}>
                                                    <Trash2 className=" size-5 font-bold text-red-600 " />
                                                </Button>
                                                    
                                                
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {result.list.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={10} className="text-center py-5 text-zinc-500">
                                                No quizzes found.
                                            </TableCell>
                                        </TableRow>
                                    )} 
                                </TableBody>
                            </Table>
                        </div>

                        <div className="p-4 border-t">
                            <PagerWidget pager={result.pageInfo} onPageChange={onPageChange} onSizeChange={onSizeChange}/>
                        </div>

                        <AlertDialog open={!!pendingDeleteQuizId}
                            onOpenChange={(open) => { 
                                if (!open) { //if open state is not true => referencing open={!!pendingDeleteQuizId}
                                    setPendingDeleteQuizId(null)
                                }
                            }}
                            title="Confirm To Delete This Quiz"
                            description={`You are about to delete quiz #${pendingDeleteQuizId}.Once deleted, this quiz and its related data will be permanently removed.`}
                            actionText="Delete Quiz"
                            onConfirm={() => deleteQuiz(pendingDeleteQuizId)}>
                            <p className="text-sm leading-6 text-zinc-600">
                                Please confirm if you want to permanently remove this quiz.
                            </p>
                        </AlertDialog>
                    </>
                )}
            </CardContent>
        </Card>
        </>)
}