'use server'

import { secureSearch } from "@/lib";
import { getLoginUser } from "@/lib/login-users";
import { ModificationResult, PageResult } from "@/lib/type";
import { YearMonthData, UserRegistrationTrend, JobPostProgressTrend, ApplicationListItem, MostAppliedJobListItem, ApplicationSearch, DashboardStats} from "@/lib/type/schema/admin/dashboard.schema";
import { LoginUser } from "@/lib/type/schema/auth.schema";

export async function getAdminData() : Promise<LoginUser> {
     return await getLoginUser() as LoginUser
}

export async function getDashboardYears() : Promise<number[]> {
    const response = await secureSearch("admin/dashboard/job/years")
    return await response.json() as number[];
}

export async function getJobPostProgressTrends(data: YearMonthData) : Promise<JobPostProgressTrend> {
    const response = await secureSearch("admin/dashboard/jobPostingsSummary", data)
    return await response.json() as JobPostProgressTrend;
}

export async function getUserRegistrationTrends(data: YearMonthData) : Promise<UserRegistrationTrend> {
    const response = await secureSearch("admin/dashboard/memberSummary", data)
    return await response.json() as UserRegistrationTrend
}

export async function getApplicationList(form: ApplicationSearch) : Promise<PageResult<ApplicationListItem>> {
    const response = await secureSearch("admin/applicationList", form)
    return await response.json() as PageResult<ApplicationListItem>
}

export async function getMostAppliedJobs(): Promise<MostAppliedJobListItem[]> {
    const response = await secureSearch("admin/mostAppliedJobs")
    return await response.json() as MostAppliedJobListItem[]
}

export async function getDashboardStats(): Promise<ModificationResult<DashboardStats>> {
   const response = await secureSearch('admin/dashboard/stats')
   return await response.json() as ModificationResult<DashboardStats>
}

