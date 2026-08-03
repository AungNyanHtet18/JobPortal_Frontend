'use client'

import FormsInput from "@/components/fields/form-input"
import FormSelect from "@/components/fields/form-select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Loading from "@/components/widgets/loading"
import PageTitle from "@/components/widgets/page-title"
import PagerWidget from "@/components/widgets/pager-widget"
import { searchAllAccounts } from "@/lib/actions/admin/management.action"
import { DEFAULT_PAGE_RESULT, PageResult } from "@/lib/type"
import { AdminAccountListItem, AdminAllAccountSearch } from "@/lib/type/schema/admin/management.schema"
import { formatDateTime, safeCall } from "@/lib/utils"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export default function AllAccountPage() {
    const [result, setResult] = useState<PageResult<AdminAccountListItem>>(DEFAULT_PAGE_RESULT)
    const [loading, setLoading] = useState(false)
    
    const form = useForm<AdminAllAccountSearch>({
        defaultValues: {
            keyword: '',
            page: 0,
            size: 10,
        },
    })

    const role = form.watch('role')
    const keyword = form.watch('keyword')

    useEffect(() => {
        form.setValue('page', 0)
    }, [role, keyword])

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

    async function search(form: AdminAllAccountSearch) {
        setLoading(true)
        
        if(form.role === "-1") {
            delete form.role
        }
        
        await safeCall(async () => {
            const data = await searchAllAccounts(form)
            setResult(data)
        })
        setLoading(false)
    }

    return (
        <>
        <PageTitle icon="Users" title="All Accounts"  />

        <Card className='rounded-none px-1'>
            <CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(search)} className='flex items-center gap-4'>
                        <FormSelect control={form.control} path="role" options={[{key: "-1", value: "Select Role"}, {key: "Admin", value: "Admin"}, {key: "Applicant", value: "Applicant"}, {key: "CompanyAccount", value: "CompanyAccount"}]} />
                        <div className="flex-1 flex items-center gap-2">
                            <FormsInput control={form.control} path='keyword' placeHolder='Search All Accounts...' className='w-1/4' />
                            <Button type='submit' className='hover:bg-zinc-700 transition shadow-md'>
                                <Search /> Search
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardHeader>

            <CardContent className="p-0">
                {loading ? (
                    <Loading content="Loading All Account Data..." />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className='bg-zinc-800 hover:bg-zinc-700'>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase'>ID</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase text-center'>Role</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase'>Account</TableHead>
                                        <TableHead className='text-zinc-100 font-[600] tracking-wider uppercase text-end'>Activated At</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {result.list.map((account) => (
                                        <TableRow key={account.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={''} />
                                                        <AvatarFallback className="bg-zinc-100 text-zinc-600">
                                                            {account.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">{account.name}</p>
                                                        <p className="font-normal text-zinc-500">{account.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <Badge variant="secondary">{account.role}</Badge>
                                            </TableCell>

                                            <TableCell>
                                                <Badge className={account.active ? 'bg-slate-500 text-zinc-100' : 'bg-red-700 text-zinc-100'}>
                                                    {account.active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className='text-end text-zinc-600'>{formatDateTime(account.activatedAt)}</TableCell>
                                        </TableRow>
                                    ))}

                                    {result.list.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-5 text-zinc-500">
                                                No accounts found.
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