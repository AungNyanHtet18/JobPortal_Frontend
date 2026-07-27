import { PageResult, PageSearch } from "../..";
import { ApplicantionStatus } from "../job/job.schema";

export type DashboardForm = {
    type: 'Yearly' | 'Monthly'
    year: string
    month?: string
}

export type YearMonthData = {
    type: 'Yearly' | 'Monthly'
    year: number
    month?: number
}

export type JobPostProgressTrend = {
    [date: string]: number
}

export type UserRegistrationTrend = {
    [date: string]: number
}

export type ApplicationSearch = {
    keyword?: string
} & PageSearch

export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE"
}

export type ApplicationListItem = {
    jobTitle: string
    status: ApplicantionStatus
    companyName: string
    applicantName: string
    gender: Gender
}

export type MostAppliedJobListItem = {
    jobId: number
    jobTitle: string
    totalApplications: number
}

export type DashboardStats = {
    totalUsers: number
    totalJobs: number
    totalApplications: number
    totalPosts: number
}
