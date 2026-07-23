'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { getDashboardYears, getJobPostProgressTrends, getUserRegistrationTrends } from '@/lib/actions/admin/dashboard.action'
import { safeCall } from '@/lib/utils'
import { LineChartComponent } from '@/components/widgets/line-chart-component'
import { BarChartComponent } from '@/components/widgets/bar-chart-component'
import Loading from '@/components/widgets/loading'
import FormSelect from '@/components/fields/form-select'
import {months } from '@/lib/type/type'
import { DashboardForm } from '@/lib/type/schema/admin/dashboard.schema'

export default function AdminPage() {
    const [years, setYears] = useState<number[]>([])
    const [jobPostData, setJobPostData] = useState<{ date: string; value: number }[]>([])
    const [userRegData, setUserRegData] = useState<{ date: string; value: number }[]>([])
    const [loading, setLoading] = useState(true)

    const form = useForm<DashboardForm>({
        defaultValues: {
            type: 'Monthly',
            year:  String(new Date().getFullYear()),
            month: String(new Date().getMonth() + 1)
        }
    })

    useEffect(() => {
        search(form.getValues())
    }, [])

    async function search(form: DashboardForm) {
        setLoading(true)

        const requestData = {
            type: form.type,
            year: Number(form.year),
            month: form.month ? Number(form.month) : undefined
        } 

        await safeCall(async () => {
            const [yearsList, jobPostProgress, userRegTrends] = await Promise.all([
                getDashboardYears(),
                getJobPostProgressTrends(requestData),
                getUserRegistrationTrends(requestData)
            ])

            setYears(yearsList.length ? yearsList : [new Date().getFullYear()])
            
            const jobPostArray = Object.entries(jobPostProgress).map(([date, value]) => ({
                date,
                value: Number(value)
            }))

            const userRegArray = Object.entries(userRegTrends).map(([date, value]) => ({
                date,
                value: Number(value)
            }))

            setJobPostData(jobPostArray)
            setUserRegData(userRegArray)
        })

        setLoading(false)
    }

    if(loading) {
        return <Loading content='Preparing for your last dashboard data'/>
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="px-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(search)} className="flex flex-wrap gap-4 items-end">
                            <FormSelect control={form.control} path='type' options={[{key: 'Yearly', value: 'Yearly'}, {key: 'Monthly', value: 'Monthly'}]}/>

                            <FormSelect control={form.control} path='year' options={years.map(year => 
                                                ({key: year.toString(), value: year.toString() }))} />

                            <FormSelect control={form.control} path='month' options={months}/>

                            <Button type="submit" className="bg-zinc-900 hover:bg-zinc-700">
                                <Calendar className="h-4 w-4" />
                                Apply Filters
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <CardContent className="p-0">
                        <LineChartComponent data={jobPostData} title="Job Post Trends"/>
                    </CardContent>
                </Card>
                <Card className="p-6">
                    <CardContent className="p-0">
                        <BarChartComponent data={userRegData} title="User Registration Trends"/>
                    </CardContent>
                </Card>
            </div> 
        </div>
    )
}
