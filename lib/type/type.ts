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