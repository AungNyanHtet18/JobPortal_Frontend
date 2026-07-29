'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, Eye, Trash2, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { formatDateForDay, getCompanyPhoto, safeCall } from '@/lib/utils';
import { DEFAULT_PAGE_RESULT, PageResult } from '@/lib/type';
import PagerWidget from '@/components/widgets/pager-widget';
import Loading from '@/components/widgets/loading';
import { searchCompanies } from '@/lib/actions/admin/management.action';
import { Form } from '@/components/ui/form';
import FormsInput from '@/components/fields/form-input';
import { AdminCompanyListItem, AdminCompanySearch } from '@/lib/type/schema/admin/management.schema';

export default function CompanyManagementPage() {
    const [result, setResult] = useState<PageResult<AdminCompanyListItem>>(DEFAULT_PAGE_RESULT)
    const [loading, setLoading] = useState(false)

    const form = useForm<AdminCompanySearch>({
        defaultValues: {
            keyword: '',
            page: 0,
            size: 10,
        },
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

    async function search(form: AdminCompanySearch) {
        setLoading(true)

        await safeCall(async () => {
            const data = await searchCompanies(form)
            setResult(data)
        })

        setLoading(false)
    }

    return (
        <>            
        <div className="flex items-center justify-between">
            <h1 className='tracking-wider text-xl text-zinc-500 font-[600]'>Company Management</h1>
            <Link href="/admin/users/applicant">
                <Button className='bg-slate-500 text-white hover:bg-slate-600 shadow-md rounded-lg'>
                    View Applicants
                </Button>
            </Link>
        </div>

        <Card className='rounded-none px-1'>
            <CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(search)} className='flex items-center gap-2'>
                        <FormsInput control={form.control} path='keyword' placeHolder='Search Applicants...' className='w-1/4' />
                        <Button type='submit' className='hover:bg-zinc-700 transition shadow-md'>
                            <Search /> Search
                        </Button>
                    </form>
                </Form>
            </CardHeader>

            <CardContent className="p-0">
                {loading ? (
                    <Loading content="Loading Company Data..." />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className='bg-zinc-800 hover:bg-zinc-600'>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase'>Company</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase'>Industry</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase'>Job Posts</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase'>Status</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase text-center'>Date Assigned</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider text-center uppercase'>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {result.list.map((company) => (
                                        <TableRow key={company.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={company.profilePhoto ? getCompanyPhoto(company.profilePhoto) : ''} alt={company.name} />
                                                        <AvatarFallback className="bg-zinc-100 text-zinc-600">
                                                            {company.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{company.name}</p>
                                                        <p className="font-normal text-zinc-500">{company.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {company.industryType}
                                                </Badge>
                                            </TableCell>

                                            <TableCell className='text-center text-zinc-600'>{company.jobPostCount}</TableCell>
                                            
                                            <TableCell>
                                                <Badge className={company.active ? 'bg-slate-500 text-zinc-100' : 'bg-red-700 text-zinc-100'}>
                                                    {company.active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            
                                            <TableCell className="text-center text-zinc-600">{formatDateForDay(company.activatedAt)}</TableCell>
                                            
                                            <TableCell className="text-center text-zinc-600">
                                                <div className="flex justify-center gap-2">
                                                   <Link href={`/admin/users/company/${company.id}`}>
                                                        <Button variant="ghost" size="icon">
                                                            <Eye className="size-4" />
                                                        </Button>
                                                   </Link>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="size-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {result.list.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-5 text-zinc-500">
                                                No companies found.
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
