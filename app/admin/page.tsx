'use client'

import { useEffect, useState, useCallback } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Users, Briefcase, FileText, UserPlus, UsersRound, BriefcaseBusiness, FileCheck2, User2, FileArchive, Files, FolderCheck, ContactRound, Building2, Rocket, UserCog, UserCog2, UserCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { getDashboardYears, getJobPostProgressTrends, getUserRegistrationTrends, getApplicationList, getMostAppliedJobs, getDashboardStats } from '@/lib/actions/admin/dashboard.action'
import { safeCall } from '@/lib/utils'
import { LineChartComponent } from '@/components/widgets/line-chart-component'
import { BarChartComponent } from '@/components/widgets/bar-chart-component'
import Loading from '@/components/widgets/loading'
import FormSelect from '@/components/fields/form-select'
import { months } from '@/lib/type/type'
import { DashboardForm, ApplicationListItem, MostAppliedJobListItem, ApplicationSearch, DashboardStats} from '@/lib/type/schema/admin/dashboard.schema'
import { PageInfo } from '@/lib/type'
import { StatisticCard } from '@/components/widgets/statistic-card'
import { ApplicationListTable } from '@/components/widgets/application-list-table'
import { MostAppliedJobs } from '@/components/widgets/most-applied-jobs'

export default function AdminPage() {
    const [years, setYears] = useState<number[]>([])
    const [jobPostData, setJobPostData] = useState<{ date: string; value: number }[]>([])
    const [userRegisterData, setUserRegisterData] = useState<{ date: string; value: number }[]>([])
    const [applications, setApplications] = useState<ApplicationListItem[] | undefined>([])
    const [pageInfo, setPageInfo] = useState<PageInfo | undefined>()
    const [mostAppliedJobs, setMostAppliedJobs] = useState<MostAppliedJobListItem[] | undefined>([])
    const [stats, setStats] = useState<DashboardStats>({ totalUsers: 0, totalJobs: 0, totalApplications: 0,  totalPosts: 0 })
    const [loading, setLoading] = useState(true)
    const [applicationsLoading, setApplicationsLoading] = useState(false)

    const form = useForm<DashboardForm>({
        defaultValues: {
            type: 'Monthly',
            year: String(new Date().getFullYear()),
            month: String(new Date().getMonth() + 1)
        }
    })

    const applicationForm = useForm<ApplicationSearch>({
         defaultValues: {
             page: 0,
             size: 10
         }
    })

    const searchType = useWatch({ control: form.control, name: 'type' })
    const searchYear = useWatch({ control: form.control, name: 'year' })
    const searchMonth = useWatch({ control: form.control, name: 'month' })

    const handlePageChange = (page: number) => {
        fetchData(form.getValues(), page)
    }

    const fetchData = useCallback(async (formData: DashboardForm, page: number = 0) => {
        setLoading(true)
        setApplicationsLoading(true)
        
        applicationForm.setValue("page", page)

        const requestData = {
            type: formData.type,
            year: Number(formData.year),
            month: formData.month ? Number(formData.month) : undefined
        }

        await safeCall(async () => {
            const [dashboardStats, yearsList, jobPostProgress, userRegTrends, applications, mostAppliedJobs] = await Promise.all([
                getDashboardStats(),
                getDashboardYears(),
                getJobPostProgressTrends(requestData),
                getUserRegistrationTrends(requestData),
                getApplicationList(applicationForm.getValues()),
                getMostAppliedJobs()
            ])

            setYears(yearsList.length ? yearsList : [new Date().getFullYear()])

            const jobPostArray = Object.entries(jobPostProgress).map(([date, value]) => ({
                date,
                value: Number(value)
            }))

            const userRegisterArray = Object.entries(userRegTrends).map(([date, value]) => ({
                date,
                value: Number(value)
            }))

            setStats(dashboardStats.id)
            setJobPostData(jobPostArray)
            setUserRegisterData(userRegisterArray)
            setApplications(applications.list)
            setPageInfo(applications.pageInfo)
            setMostAppliedJobs(mostAppliedJobs)
        })

        setLoading(false)
        setApplicationsLoading(false)
    }, [])


    useEffect(() => {
        fetchData(form.getValues())
    }, [fetchData, form])

    useEffect(() => {
        if (searchType && searchYear) {
            fetchData({
                type: searchType,
                year: searchYear,
                month: searchMonth
            })
        }
    }, [searchType, searchYear, searchMonth, fetchData])

    if (loading) {
        return <Loading content='Preparing for your last dashboard data' />
    }

    return (
        <div className="space-y-5 pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatisticCard title="Total Users"  value={stats.totalUsers}  icon={UsersRound} color="blue" />
                <StatisticCard title="Total Jobs" value={stats.totalJobs} icon={Rocket} color="zinc" />
                <StatisticCard title="Total Applications" value={stats.totalApplications} icon={FolderCheck} color="purple" />
                <StatisticCard title="New Registrations" value={stats.totalPosts} icon={ContactRound} color="orange" />
            </div>

            <div className='flex justify-end'>
                <Form {...form}>
                    <div className="flex flex-wrap gap-4 items-end">
                        <FormSelect control={form.control} path='type' options={[{ key: 'Yearly', value: 'Yearly' }, { key: 'Monthly', value: 'Monthly' }]} />
                        <FormSelect control={form.control} path='year' options={years.map(year => ({ key: year.toString(), value: year.toString() }))} />
                        {searchType == 'Yearly' ||  <FormSelect control={form.control} path='month' options={months} />}
                    </div>
                </Form>
            </div>
             
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <CardContent className="p-0">
                        <LineChartComponent data={jobPostData} title="Job Post Trends" />
                    </CardContent>
                </Card>

                <Card className="p-6">
                    <CardContent className="p-0">
                        <BarChartComponent data={userRegisterData} title="User Registration Trends" />
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ApplicationListTable applications={applications} pageInfo={pageInfo} loading={applicationsLoading} onPageChange={handlePageChange}/>
                </div>
                <div className="lg:col-span-1 max-h-[430px]">
                    <MostAppliedJobs  jobs={mostAppliedJobs}  loading={applicationsLoading}/>
                </div>
            </div>
        </div>
    )
}
