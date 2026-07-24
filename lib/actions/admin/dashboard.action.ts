'use server'

import { secureSearch } from "@/lib"
import { ModificationResult, PageResult } from "@/lib/type"
import { YearMonthData, UserRegistrationTrend, JobPostProgressTrend, ApplicationListItem, MostAppliedJobListItem, ApplicationSearch, Gender, applicationDummyData, DashboardStats} from "@/lib/type/schema/admin/dashboard.schema"

export async function getDashboardYears(): Promise<number[]> {
    const response = await secureSearch('admin/dashboard/job/years')
    return await response.json() as number[]
}

export async function getJobPostProgressTrends(data: YearMonthData): Promise<JobPostProgressTrend> {    
    const response = await secureSearch('admin/dashboard/jobPostingsSummary', data)
    return await response.json() as JobPostProgressTrend
}

export async function getUserRegistrationTrends(data: YearMonthData): Promise<UserRegistrationTrend>{
    const response = await secureSearch('admin/dashboard/memberSummary', data) 
   return await response.json() as UserRegistrationTrend
}

export async function getApplicationList(form: ApplicationSearch): Promise<PageResult<ApplicationListItem>> {
     const response = await secureSearch('admin/applicationList', form)
     return await response.json() as PageResult<ApplicationListItem>
}

export async function getMostAppliedJobs(): Promise<MostAppliedJobListItem[]> {
    const response = await secureSearch('admin/mostAppliedJobs')
    return await response.json() as MostAppliedJobListItem[]
}

export async function getDashboardStats(): Promise<ModificationResult<DashboardStats>> {
   const response = await secureSearch('admin/dashboard/stats')
   return await response.json() as ModificationResult<DashboardStats>
}
