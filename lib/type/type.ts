import * as lucideIcons from 'lucide-react'
import z from 'zod'

export type IconType =  keyof typeof lucideIcons

export type OptionItem = {
     key: string
     value: string
}

export const RoleOptions: OptionItem[] = [
     {key: "Applicant", value: "Applicant"},
     {key: "CompanyAccount", value: "CompanyAccount"}
] 


export const JobLevel: OptionItem[] = [
     {key: "Intern", value: "Intern"},
     {key: "EntryLevel", value: "EntryLevel"},
     {key: "Junior", value: "Junior"},
     {key: "Senior", value: "Senior"},
     {key: "Lead", value: "Lead"}
]

export const JobType: OptionItem[] = [
     {key: "Remote", value: "Remote"},
     {key: "Hybrid", value: "Hybrid"},
     {key: "Onsite", value: "Onsite"}
]