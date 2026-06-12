import * as lucideIcons from 'lucide-react'

export type IconType =  keyof typeof lucideIcons

export type OptionItem = {
     key: string
     value: string
}

export const RoleOptions: OptionItem[] = [
     {key: "Applicant", value: "Applicant "},
     {key: "CompanyAccount", value: "Company"}
] 

export const JobLevel: OptionItem[] = [
     {key: "Intern", value: "Intern Level"},
     {key: "Entry", value: "Entry Level"},
     {key: "Junior", value: "Junior Level"},
     {key: "Senior", value: "Senior Level"},
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
    {key: "POSTGRADUATE_DIPLOMA", value: "POSTGRADUATE DIPLOMA"},
    {key: "HIGH_SCHOOL", value: "HIGH_SCHOOL"},
    {key: "FOUNDATION_PROGRAM", value: "FOUNDATION PROGRAM"},
    {key: "COURSE", value: "COURSE"},
    {key: "CERTIFICATE", value: "CERTIFICATE"},
    {key: "BOOTCAMP", value: "BOOTCAMP"},
    {key: "PROFESSIONAL_TRAINING", value: "PROFESSIONAL TRAINING"},
    {key: "VOCATIONAL", value: "VOCATIONAL"},
    {key: "TECHNICAL_CERTIFICATION", value: "TECHNICAL CERTIFICATION"}]

export const SkillType: OptionItem[] = [
    {key: "SoftSkill", value: "Soft Skill"},
    {key: "HardSkill", value: "Hard Skill"}]

export const LanguageLevel : OptionItem[] = [
     {key: "Beginner", value: "Beginner"},
     {key: "Elementary", value: "Elementary"},
     {key: "PreIntermediate", value: "Pre Intermediate"},
     {key: "Intermediate", value: "Intermediate"},
     {key: "UpperIntermediate", value: "Upper Intermediate"},
     {key: "Advanced", value: "Advanced"},
     {key: "Native", value: "Native"}
]