import z from "zod"
import { PageSearch } from "../.."
import { OptionItem } from "../../type"


export const ExperienceSchema = z.object({
    companyName: z.string().nonempty("Please fill your previous company name"),
    position: z.string().nonempty("Please fill your previous position"),
    joinedDate: z.string().nonempty("Please enter completion date."),
    leftDate: z.string(),
    currentlyWorking: z.boolean().default(false),
    experienceDescription: z.string().optional()
})

export const SocialLinkSchema = z.object({
    platform: z.string().nonempty("Please fill your platform"),
    url: z.string().nonempty("Please fill your social link ur url")
})

export const EducationSchema = z.object({
     qualificationType: z.string().nonempty("Please enter qualification type."),
     qualificationName: z.string().nonempty("Please fill your qualification name."),
     completionDate: z.string().nonempty("Please enter completion date.")
})

export const CareerRoleSchema = z.object({
     roleName: z.string().nonempty("Please fill your intersted role.")
})

export const SkillSchema = z.object({
     skillType: z.string().nonempty("Please choose skill type."),
     skillName: z.string().nonempty("Please fill your skill name.")
})

export const LanguageSchema = z.object({
     name: z.string().nonempty("Please fill your platform")
})


export  const ApplicantSchema = z.object({
    applicantName: z.string().nonempty("Please enter your applicant name."),
    gender: z.string().nonempty("Please select gender."),
    professionalSummary: z.string().optional(),
    contactDetail: z.string().nonempty("Please fill your contact detail.").min(10).max(200),
    address: z.string().nonempty("Please fill your address.").min(10).max(200),
    experiences: z.array(ExperienceSchema).optional().default([]),
    socialLinks: z.array(SocialLinkSchema).optional().default([]),
    educations: z.array(EducationSchema).optional().default([]),
    careerRoles: z.array(CareerRoleSchema),
    skills: z.array(SkillSchema).optional().default([]),
    languages : z.array(LanguageSchema).optional().default([]),
    file: z.instanceof(File).optional()
})


export type ApplicantForm = z.infer<typeof ApplicantSchema>


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
   profilePhoto: string
   location: string
   createAt: string
}

export type ApplicantDetails = {
     id: number | string
     name: string
     email: string
     gender: 'Male' | 'Female' | null
     skills: string[]
     experience: Experience[],
     highestEducationalAttainment: string
     professionalSummary: string,
     contactDetail: string
     address: string
     profileImage: string | null
     resume: string | null
}


export type Experience = {
     id: number,
     companyName: string,
     position: string,
     years: number
}
