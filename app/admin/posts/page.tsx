'use client'

import FormsInput from "@/components/fields/form-input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Loading from "@/components/widgets/loading"
import PagerWidget from "@/components/widgets/pager-widget"
import { searchPosts } from "@/lib/actions/admin/management.action"
import { DEFAULT_PAGE_RESULT, PageResult } from "@/lib/type"
import { AdminPostListItem, AdminPostSearch, getStatusBadgeColorForJob } from "@/lib/type/schema/admin/management.schema"
import { formatDateTime, safeCall } from "@/lib/utils"
import { Eye, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export default function PostManagementPage() {
     const [result, setResult] = useState<PageResult<AdminPostListItem>>(DEFAULT_PAGE_RESULT)
     const [loading, setLoading] = useState<boolean>(false)

     const form = useForm<AdminPostSearch>({
         defaultValues: {
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

     async function search(form: AdminPostSearch) {
        setLoading(true)
        await safeCall(async () => {
             const data = await searchPosts(form)
             setResult(data)
        })
        setLoading(false)
     }

     return (
        <>
        <div className="flex items-center justify-between">
            <h1 className='tracking-wider text-xl text-zinc-500 font-[600]'>Post Management</h1>
        </div>

        <Card className='rounded-none px-1'>
            <CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(search)} className='flex items-center gap-2'>
                        <FormsInput control={form.control} path='keyword' placeHolder='Search Posts...' className='w-1/4' />
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
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase'>Post ID</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase'>Author Name</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase'>Content Name</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase text-center'>React Count</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase text-center'>Comment Count</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase text-end'>Date Published</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {result.list.map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell>{post.id}</TableCell>
                                            <TableCell>{post.authorName}</TableCell>
                                            <TableCell>
                                                {post.content.length> 30 ? `${post.content.slice(0, 30)} ...` : post.content}
                                            </TableCell>
                                            <TableCell className="text-center">{post.reactCount}</TableCell>
                                            <TableCell className="text-center">{post.commentCount}</TableCell>
                                            <TableCell className='text-end'>{formatDateTime(post.createdAt)}</TableCell>
                                        </TableRow>
                                    ))}

                                    {result.list.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-5 text-zinc-500">
                                                No posts found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="p-4 border-t">
                            <PagerWidget pager={result.pageInfo} onPageChange={onPageChange} onSizeChange={onSizeChange}/>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
        </>)
}