import z from "zod"
import { PageSearch } from "../.."

export const SkillSchema = z.object({
    skill: z.string().min(1,"Please enter your skill")
})

export const ExperienceSchema = z.object({
    companyName: z.string().nonempty("Please fill your previous company name"),
    position: z.string().nonempty("Please fill your previous position"),
    year: z.string().nonempty("lease fill your experience year")
})

export  const ApplicantSchema = z.object({
    applicantName: z.string().nonempty("Please enter your applicant name."),
    gender: z.string().nonempty("Please select gender."),
    highestEducationalAttainment: z.string().optional(),
    skills: z.array(SkillSchema).nonempty("Please enter your skills."),
    professionalSummary: z.string().optional(),
    contactDetail: z.string().nonempty("Please fill your contact detail.").min(10).max(200),
    address: z.string().nonempty("Please fill your address.").min(10).max(200),
    experiences: z.array(ExperienceSchema)
})

export type ApplicantForm = z.infer<typeof ApplicantSchema>

export type JobSearch = {
   jobLevel?: string,
   jobType?: string,
   deleted?: string,
   keyword?: string
} & PageSearch

export type JobListItem = {
   jobId: number
   positionName: string
   salary: number
   jobLevel: string
   jobType: string
   companyName: string
   location: string
   createAt: string
}

export type ApplicantDetails = {
     name: string
     email: string
     gender: 'Male' | 'Female'
     skills: string[]
     experience: Experience[],
     highestEducationalAttainment: string
     professionalSummary: string,
     contactDetail: string
     address: string
}


export type Experience = {
     id: number,
     companyName: string,
     position: string,
     years: number
}