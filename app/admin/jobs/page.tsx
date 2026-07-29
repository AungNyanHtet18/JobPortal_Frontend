'use client'

import FormsInput from "@/components/fields/form-input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Loading from "@/components/widgets/loading"
import PagerWidget from "@/components/widgets/pager-widget"
import { searchJobs } from "@/lib/actions/admin/management.action"
import { DEFAULT_PAGE_RESULT, PageResult } from "@/lib/type"
import { AdminApplicantSearch, AdminJobListItem, AdminJobSearch, getStatusBadgeColorForJob } from "@/lib/type/schema/admin/management.schema"
import { formatDateTime, safeCall } from "@/lib/utils"
import { Eye, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export default function JobManagementPage() {
     const [result, setResult] = useState<PageResult<AdminJobListItem>>(DEFAULT_PAGE_RESULT)
     const [loading, setLoading] = useState<boolean>(false)

     const form = useForm<AdminJobSearch>({
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

     async function search(form: AdminJobSearch) {
        setLoading(true)
        await safeCall(async () => {
             const data = await searchJobs(form)
             setResult(data)
        })
        setLoading(false)
     }

     return (
        <>
        <div className="flex items-center justify-between">
            <h1 className='tracking-wider text-xl text-zinc-500 font-[600]'>Job Management</h1>
        </div>

        <Card className='rounded-none px-1'>
            <CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(search)} className='flex items-center gap-2'>
                        <FormsInput control={form.control} path='keyword' placeHolder='Search Jobs...' className='w-1/4' />
                        <Button type='submit' className='hover:bg-zinc-700 transition shadow-md'>
                            <Search /> Search
                        </Button>
                    </form>
                </Form>
            </CardHeader>

            <CardContent className="p-0">
                {loading ? (
                    <Loading content="Loading Job Data..." />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className='bg-zinc-800 hover:bg-zinc-700'>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase'>Job ID</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase'>Job Name</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase'>Company Name</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase'>Job Level</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase text-center'>Job Type</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider text-center uppercase'>Salary Range</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider text-center uppercase'>Registered Date</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider text-end uppercase'>Available</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider text-start uppercase'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {result.list.map((job) => (
                                        <TableRow key={job.id}>
                                            <TableCell>{job.id}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <p className="font-medium">{job.jobName}</p>
                                                        <p className="font-normal text-zinc-500">{job.clientName}</p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>{job.companyName}</TableCell>
                                           
                                            <TableCell>
                                                <Badge className={getStatusBadgeColorForJob(job.jobLevel)}>{job.jobLevel}</Badge>
                                            </TableCell>
                                           
                                            <TableCell>
                                                <Badge > {job.jobType}</Badge>
                                            </TableCell>
                                           
                                            <TableCell className='text-center'>{job.minSalaryRange} - {job.maxSalaryRange} MMK</TableCell>
                                            <TableCell className="text-center">{formatDateTime(job.createdAt)}</TableCell>
                                            <TableCell className="text-end">{job.deleted ? 'Not Available' : 'Available'}</TableCell>
                                            
                                            <TableCell className="text-center">
                                                <div className="group  rounded-md hover:bg-zinc-100 cursor-pointer transition-colors">
                                                    <Link href={`/admin/jobs/${job.id}`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Eye className="size-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {result.list.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-5 text-zinc-500">
                                                No jobs found.
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
        </>
     )
}