import { PageSearch } from "../..";
import { Gender } from "./dashboard.schema";

export type AdminApplicantSearch = {
    keyword?: string
} & PageSearch

export type AdminCompanySearch = {
    keyword?: string
} & PageSearch

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