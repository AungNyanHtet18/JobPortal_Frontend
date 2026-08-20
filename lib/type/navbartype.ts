import React from "react"

export type SideBarType = {
     href: string
     label: string
     icon: React.ReactNode
     dropdownMenu?: SideBarType[]
}

export type NavbarType = {
    id: number
    name: string
    url: string
}

export const applicantNavbar: NavbarType[] = [
    {id: 1, name: "Applicant", url: "/applicant"},
    {id: 2, name: "Quiz", url: "/applicant/quiz"},
    {id: 3, name: "Community", url: "/network/postlist"},
    {id: 4, name: "Joblist", url: "/applicant/joblist"},
    {id: 5, name: "Chat", url: "/chat"},
    {id: 6, name: "Edit", url: "/applicant/edit"},]

export const companyNavbar: NavbarType[] = [
    {id: 1, name: "Community", url: "/network/postlist"},
    {id: 2, name: "Chat", url: "/chat"},
    {id: 3, name: "Edit", url: "/companyaccount/edit"},
    {id: 4, name: "Profile", url: "/companyaccount/detail"}
]

export const companyAuthNavbar: NavbarType[] = [
    {id: 1, name: "Job", url: "/companyaccount/job/edit"}]

    