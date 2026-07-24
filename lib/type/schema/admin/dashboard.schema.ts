import { ApplicationListTable } from "@/components/widgets/application-list-table"
import { PageResult, PageSearch } from "../.."
import { ApplicantionStatus } from "../job/job.schema"

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

export const applicationDummyData: PageResult<ApplicationListItem> = {
    list: [
        {
            jobTitle: "Backend Java Developer",
            status: "APPLIED",
            companyName: "Tech Solutions",
            applicantName: "Aung Nyan Htet",
            gender: Gender.MALE,
        },
        {
            jobTitle: "Frontend React Developer",
            status: "REVIEWING",
            companyName: "Innovate Myanmar",
            applicantName: "Su Su Win",
            gender: Gender.FEMALE,
        },
        {
            jobTitle: "UI/UX Designer",
            status: "REJECTED",
            companyName: "Creative Studio",
            applicantName: "Ko Ko Zaw",
            gender: Gender.MALE,
        },
        {
            jobTitle: "QA Engineer",
            status: "INTERVIEW",
            companyName: "Future Tech",
            applicantName: "May Thazin",
            gender: Gender.FEMALE,
        },
        {
            jobTitle: "DevOps Engineer",
            status: "SHORTLISTED",
            companyName: "Cloud Vision",
            applicantName: "Mg Mg Aye",
            gender: Gender.MALE,
        },
        {
            jobTitle: "Mobile Developer",
            status: "OFFERED",
            companyName: "NextGen Software",
            applicantName: "Ei Ei Phyo",
            gender: Gender.FEMALE,
        },
        {
            jobTitle: "Data Analyst",
            status: "HIRED",
            companyName: "Data Insight",
            applicantName: "Kyaw Min",
            gender: Gender.MALE,
        },
        {
            jobTitle: "System Analyst",
            status: "REJECTED",
            companyName: "Enterprise IT",
            applicantName: "Hnin Wut Yi",
            gender: Gender.FEMALE,
        },
                {
            jobTitle: "DevOps Engineer",
            status: "SHORTLISTED",
            companyName: "Cloud Vision",
            applicantName: "Mg Mg Aye",
            gender: Gender.MALE,
        },
        {
            jobTitle: "Mobile Developer",
            status: "OFFERED",
            companyName: "NextGen Software",
            applicantName: "Ei Ei Phyo",
            gender: Gender.FEMALE,
        },

    ],
    pageInfo: {
        page: 2,
        size: 10,
        totalCount: 40,
        totalPage: 5,
        links: [1, 2, 3, 4, 5],
    },
};
