'use client'

import FormsInput from "@/components/fields/form-input"
import { AlertDialog } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Loading from "@/components/widgets/loading"
import PagerWidget from "@/components/widgets/pager-widget"
import { deletePosts, searchPosts } from "@/lib/actions/admin/management.action"
import { DEFAULT_PAGE_RESULT, PageResult } from "@/lib/type"
import { AdminPostListItem, AdminPostSearch, getStatusBadgeColorForJob } from "@/lib/type/schema/admin/management.schema"
import {  formatDateForDay, safeCall } from "@/lib/utils"
import { Search, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function PostManagementPage() {
     const [result, setResult] = useState<PageResult<AdminPostListItem>>(DEFAULT_PAGE_RESULT)
     const [loading, setLoading] = useState<boolean>(false)
     const [pendingDeletePostId, setPendingDeletePostId] = useState<number | null>(null)

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
        console.log(pendingDeletePostId);
        setLoading(true)
        await safeCall(async () => {
             const data = await searchPosts(form)
             setResult(data)
        })
        setLoading(false)
     }

     async function deletePost(postId: number | null) {
        
        if(!pendingDeletePostId) {
            return
        }

        if(postId != null) {
            await safeCall(async () => {
                 const result = await deletePosts(postId)
                 toast.success(result.id)
            })
         }
         setPendingDeletePostId(null)
         search(form.getValues())
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
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase text-center'>Date Published</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase text-end'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {result.list.map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell className="text-zinc-600">{post.id}</TableCell>
                                            <TableCell className="text-zinc-600">{post.authorName}</TableCell>
                                            <TableCell className="text-zinc-600">
                                                {post.content.length> 30 ? `${post.content.slice(0, 30)} ...` : post.content}
                                            </TableCell>
                                            <TableCell className="text-center text-zinc-600">{post.reactCount}</TableCell>
                                            <TableCell className="text-center text-zinc-600">{post.commentCount}</TableCell>
                                            <TableCell className="text-center text-zinc-600">{formatDateForDay(post.createdAt)}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="group  rounded-md hover:bg-zinc-100 cursor-pointer transition-colors">
                                                    <Button variant="ghost" size="icon" onClick={() => setPendingDeletePostId(post.id)}>
                                                        <Trash2 className="size-5 text-red-500 group-hover:text-zinc-900 transition-colors" />
                                                    </Button>
                                                </div>
                                            </TableCell>
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

                        <AlertDialog open={!!pendingDeletePostId}
                            onOpenChange={(open) => { 
                                if (!open) { //if open is not true => referencing open={!!confirmJob}
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
                        </AlertDialog>
                    </>
                )}
            </CardContent>
        </Card>
        </>)
}