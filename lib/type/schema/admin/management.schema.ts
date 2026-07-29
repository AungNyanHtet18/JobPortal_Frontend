import { PageSearch } from "../..";
import { Role } from "../auth.schema";
import { ApplicantionStatus } from "../job/job.schema";
import { Gender } from "./dashboard.schema";

export type AdminAllAccountSearch = {
     role?: Role | string
     keyword?: string
} & PageSearch

export type AdminApplicantSearch = {
    keyword?: string
} & PageSearch

export type AdminCompanySearch = {
    keyword?: string
} & PageSearch

export type AdminAccountListItem = { 
    id: number
    name: string
    email: string
    active: string
    role: Role
    activatedAt: string
}

export type AdminApplicantListItem = {
    id: number
    name: string
    email: string
    active: boolean
    activatedAt: string
    profilePhoto: string | null
    gender: Gender
    jobApplicationCount: number
}

export type AdminCompanyListItem = {
    id: number
    name: string
    email: string
    active: boolean
    activatedAt: string
    profilePhoto: string | null
    industryType: string
    jobPostCount: number
}

export type AdminJobSearch = {
    keyword?: string
} & PageSearch

export type AdminJobListItem = {
    id: number
    jobName: string
    companyName: string
    clientName: string
    jobLevel: string,
    jobType: string,
    minSalaryRange: number
    maxSalaryRange: number,
    deleted: boolean
    createdAt: string
}

export type AdminPostSearch = {
    keyword?: string
} & PageSearch

export type AdminPostListItem = {
    id: number
    authorName: string
    content: string
    reactCount: number
    commentCount: number
    createdAt: string
}

//Color Theme for Application List Badges
export const getStatusBadgeColorForApplication = (status: ApplicantionStatus) => {
    switch (status) {
        case "APPLIED": return "bg-blue-200 text-blue-900 font-medium"
        case "REVIEWING": return "bg-yellow-200 text-yellow-900 font-medium"
        case "SHORTLISTED": return "bg-purple-200 text-purple-900 font-medium"
        case "INTERVIEW": return "bg-cyan-200 text-cyan-900 font-medium"
        case "OFFERED": return "bg-green-200 text-green-900 font-medium"
        case "HIRED": return "bg-emerald-200 text-emerald-900 font-medium"
        case "REJECTED": return "bg-red-200 text-red-900 font-medium"
        default: return "bg-zinc-200 text-zinc-900 font-medium"
    }
}

//Color Theme for Job List Badges
export const getStatusBadgeColorForJob = (status: string) => {
    switch (status) {
        case "Intern Level": return "bg-blue-200 text-blue-900 font-medium"
        case "Entry Level": return "bg-yellow-200 text-yellow-900 font-medium"
        case "Junior Level": return "bg-purple-200 text-purple-900 font-medium"
        case "Mid Level": return "bg-cyan-200 text-cyan-900 font-medium"
        case "Senior Level": return "bg-green-200 text-green-900 font-medium"
        case "Lead Level": return "bg-emerald-200 text-emerald-900 font-medium"
        default: return "bg-zinc-200 text-zinc-900 font-medium"
    }
}