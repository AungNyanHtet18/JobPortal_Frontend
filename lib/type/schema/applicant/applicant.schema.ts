import z from "zod"
import { PageSearch } from "../.."

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
     institutionName: z.string().nonempty("Please fill institution name."),
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
     languageName: z.string().nonempty("Please fill your language name."),
     languageLevel: z.string().nonempty("Please enter your language level.")
})


export  const ApplicantSchema = z.object({
    applicantName: z.string(),
    gender: z.string().nonempty("Please select gender."),
    professionalSummary: z.string().optional(),
    contactDetail: z.string().nonempty("Please fill your contact detail.").min(10).max(200),
    address: z.string().nonempty("Please fill your address.").min(10).max(200),
    experiences: z.array(ExperienceSchema).optional().default([]),
    socialLinks: z.array(SocialLinkSchema).optional().default([]),
    educations: z.array(EducationSchema).optional().default([]),
    careerRoles: z.array(CareerRoleSchema).min(1, "Please select at least one career role."),
    skills: z.array(SkillSchema).optional().default([]),
    languages : z.array(LanguageSchema).optional().default([]),
    file: z.instanceof(File).optional()
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
   profilePhoto: string
   location: string
   createAt: string
}

export type ApplicantDetails = {
     id: number | string
     name: string
     email: string
     gender: 'Male' | 'Female' | null
     professionalSummary: string,
     contactDetail: string,
     address: string,
     experience?: ApplicantExperienceDetails[],
     socialLink?: ApplicantSocialLinkDetails[],
     education?:  ApplicantEducationDetails[],
     careerRole: ApplicantCareerRoleDetails[],
     skill?: ApplicantSkillDetails[],
     language?: ApplicantLanguageDetails[],
     profileImage: string | null,
     resume: string | null,
     cvForm: string | null,
}


export type ApplicantExperienceDetails = {
     id: number,
     companyName: string,
     position: string,
     joinedDate: string,
     leftDate: string | null,
     currentlyWorking: boolean,
     experienceDescription: string
}

export type ApplicantSocialLinkDetails = {
     platform: string,
     url: string
}

export type ApplicantEducationDetails = {
     qualificationType: string,
     qualificationName: string,
     institutionName: string,
     completionDate: string
}

export type ApplicantCareerRoleDetails = {
      roleName: string
}

export type ApplicantSkillDetails = {
      skillType: string,
      skillName: string
}

export type ApplicantLanguageDetails = {
      languageName: string,
      languageLevel: string
}

