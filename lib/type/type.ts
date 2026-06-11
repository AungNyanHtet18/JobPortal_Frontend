import * as lucideIcons from 'lucide-react'

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

export const Status: OptionItem[] = [
     {key: "true", value: "true"},
     {key: "false", value: "false"}
]


export const QualificationType: OptionItem[] =[
    {key: "DOCTORATE", value: "DOCTORATE"},
    {key: "PHD", value: "PHD"},
    {key: "MASTER", value: "MASTER"},
    {key: "DEGREE", value: "DEGREE"},
    {key: "DIPLOMA", value: "DIPLOMA"},
    {key: "POSTGRADUATE_DIPLOMA", value: "POSTGRADUATE_DIPLOMA"},
    {key: "HIGH_SCHOOL", value: "HIGH_SCHOOL"},
    {key: "FOUNDATION_PROGRAM", value: "FOUNDATION_PROGRAM"},
    {key: "COURSE", value: "COURSE"},
    {key: "CERTIFICATE", value: "CERTIFICATE"},
    {key: "BOOTCAMP", value: "BOOTCAMP"},
    {key: "PROFESSIONAL_TRAINING", value: "PROFESSIONAL_TRAINING"},
    {key: "VOCATIONAL", value: "VOCATIONAL"},
    {key: "TECHNICAL_CERTIFICATION", value: "TECHNICAL_CERTIFICATION"}]

export const SkillType: OptionItem[] = [
    {key: "SoftSkill", value: "SoftSkill"},
    {key: "HardSkill", value: "HardSkill"}]

export const LanguageLevel : OptionItem[] = [
     {key: "Beginer", value: "Beginer"},
     {key: "Elementary", value: "Elementary"},
     {key: "PreIntermediate", value: "PreIntermediate"},
     {key: "Intermediate", value: "Intermediate"},
     {key: "UpperIntermediate", value: "UpperIntermediate"},
     {key: "Advanced", value: "Advanced"},
     {key: "Native", value: "Native"}
]