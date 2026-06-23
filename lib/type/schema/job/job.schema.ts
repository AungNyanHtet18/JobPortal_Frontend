import z from "zod";

export type ApplicantionStatus =  'APPLIED' | 
                                  'REVIEWING' | 
                                  'SHORTLISTED' | 
                                  'INTERVIEW' | 
                                  'OFFERED' | 
                                  'HIRED' | 
                                  'REJECTED' 

export const JobDescriptionSchema = z.object({
     description: z.string().nonempty("Job description point cannot be blank.").max(200, "You cannot add more than 200 description points.")
})

export const JobRequirementSchema = z.object({
      requirement: z.string().nonempty("Job requirement point cannt be blank.").max(200, "You cannot add more than 200 requirement points.")
})

export const JobSchema = z.object({
     jobPost : z.string().optional(),
     clientName : z.string().optional(),
     location : z.string().nonempty("Please enter location for job."),
     positionName : z.string().nonempty("Please enter job position name."),
     jobDescriptions : z.array(JobDescriptionSchema).min(1, "Please provide at least one job description bullect point."),
     jobRequirements : z.array(JobRequirementSchema).min(1, "Please provide at least one job requirement bullect point."),
     jobLevel : z.string().nonempty("Please enter job level."),
     jobType : z.string().nonempty("Please enter job type."),
     minSalaryRange : z.string().nonempty("Please enter minimum salary range."),
     maxSalaryRange: z.string().nonempty("Please enter maximum salary range."),
     deleted : z.boolean().optional()
})

export type JobForm = z.infer<typeof JobSchema>

export const JobPayload = (form: JobForm): any => {
      return {
      jobPost: form.jobPost ? Number(form.jobPost) : null,
      clientName: form.clientName?.trim() || "",
      location: form.location.trim(),
      positionName: form.positionName.trim(),
      jobDescriptions: form.jobDescriptions.map(item => item.description.trim()),
      jobRequirements: form.jobRequirements.map(item => item.requirement.trim()),
      jobLevel: form.jobLevel,
      jobType: form.jobType,
      minSalaryRange: Number(form.minSalaryRange),
      maxSalaryRange: Number(form.maxSalaryRange),
      deleted: form.deleted
      }
}

export const ApplicationStatusSchema = z.object({
       applicantId : z.string().nonempty("Please enter application id."),
       status: z.string().nonempty("Please enter application status."),
       note: z.string().optional()
})

export type ApplicationStatusForm = z.infer<typeof ApplicationStatusSchema  >

export type JobDetails = {
     jobId: number,
     jobCategory: string,
     companyName: string,
     companyPhone: string,
     companyWebsite: string,
     companyImage: string | null,
     positionName: string,
     clientName: string | null,
     jobLocation: string,
     jobDescription: string[],
     jobRequirement: string[],
     minSalaryRange: number,
     maxSalaryRange: number,
     jobPost: number | null,
     jobLevel: string,
     jobType: string,
     deleted: boolean
}

export type JobApplicationListItem= {
      applicantId: number
      applicantName: string
      applicantEmail: string
      applicantResume: string
      applicantCVForm: string
      gender: 'Male' | 'Female'
      status: ApplicantionStatus
}


export type ApplicantAppliedJobListItem = {
      positionName: string
      salary: number
      jobId: number
      jobType: string
      jobLevel: string
      companyName: string
      websiteUrl: string
      status: ApplicantionStatus
}

export type SavedJobListItem = {
       jobId : number
}

