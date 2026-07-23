'use server'

import { secureSearch } from "@/lib"
import { YearMonthData, UserRegistrationTrend, JobPostProgressTrend } from "@/lib/type/schema/admin/dashboard.schema"

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