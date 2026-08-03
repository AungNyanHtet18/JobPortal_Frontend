'use client'

import FormsInput from "@/components/fields/form-input"
import FormSelect from "@/components/fields/form-select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Loading from "@/components/widgets/loading"
import PageTitle from "@/components/widgets/page-title"
import PagerWidget from "@/components/widgets/pager-widget"
import { searchQuizzes } from "@/lib/actions/admin/quiz.management.action"
import { DEFAULT_PAGE_RESULT, PageResult } from "@/lib/type"
import { AdminQuizListItem, AdminQuizSearch, QuestionTypeOptions } from "@/lib/type/schema/admin/quiz.schema"
import { safeCall } from "@/lib/utils"
import { Search, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export default function QuizzesManagementPage() {
    const [result, setResult] = useState<PageResult<AdminQuizListItem>>(DEFAULT_PAGE_RESULT) 
    const [loading, setLoading] = useState<boolean>(false)

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
                                        <TableHead className='text-zinc-100 font-[600] text-center tracking-wider uppercase'>Role</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase text-center'>Question Title</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase text-center'>Question Type</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase text-center'>Marks</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase text-center'>Question Options</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase text-end'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {result.list.map((quiz, index) => (
                                        <TableRow key={`${index}-${quiz.id}`}>
                                            <TableCell className="text-zinc-600">{quiz.id}</TableCell>
                                            <TableCell className="text-zinc-600">{quiz.quizTitle}</TableCell>
                                            <TableCell className="text-zinc-600 text-center">{quiz.passingScore}</TableCell>
                                            <TableCell className="text-center text-zinc-600">{quiz.roleName}</TableCell>
                                            <TableCell className="text-center text-zinc-600">{quiz.questionTitle}</TableCell>
                                            <TableCell className="text-center text-zinc-600">{quiz.questionType}</TableCell>
                                            <TableCell className="text-center text-zinc-600">{quiz.marks}</TableCell>
                                            <TableCell className="text-center text-zinc-600">{quiz.questionOptionsCount}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="group  rounded-md hover:bg-zinc-100 cursor-pointer transition-colors">
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="size-5 text-red-600  group-hover:text-zinc-900 transition-colors" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {result.list.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-5 text-zinc-500">
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

                        {/* <AlertDialog open={!!pendingDeletePostId}
                            onOpenChange={(open) => { 
                                if (!open) { //if open state is not true => referencing open={!!confirmJob}
                                setPendingDeletePostId(null)
                                }
                            }}
                            title="Confirm To Delete This Post"
                            description={`You are about to delete post #${pendingDeletePostId}.Once deleted, this post and its related data will be permanently removed.`}
                            actionText="Delete Post"
                            onConfirm={() => deletePost(pendingDeletePostId)}>
                            <p className="text-sm leading-6 text-zinc-600">
                                Please confirm if you want to permanently remove this post.
                            </p>
                        </AlertDialog> */}
                    </>
                )}
            </CardContent>
        </Card>
        </>)
}