import z from "zod";

export type ApplicantionStatus =  'APPLIED' | 
                                  'REVIEWING' | 
                                  'SHORTLISTED' | 
                                  'INTERVIEW' | 
                                  'OFFERED' | 
                                  'HIRED' | 
                                  'REJECTED' 

export const JobDescriptionSchema = z.object({
     description: z.string().nonempty("Job description point cannot be blank.").max(20, "You cannot add more than 20 description points.")
})

export const JobRequirementSchema = z.object({
      requirement: z.string().nonempty("Job requirement point cannt be blank.").max(20, "You cannot add more than 20 requirement points.")
})

export const JobSchema = z.object({
     jobPost : z.string().optional(),
     clientName : z.string().optional(),
     positionName : z.string().nonempty("Please enter job position name."),
     jobDescriptions : z.array(JobDescriptionSchema).min(1, "Please provide at least one job description bullect point."),
     jobRequirements : z.array(JobRequirementSchema).min(1, "Please provide at least one job requirement bullect point."),
     jobLevel : z.string().nonempty("Please enter job level."),
     jobType : z.string().nonempty("Please enter job type."),
     salary : z.string().nonempty("Please enter salary."),
     deleted : z.boolean().optional()
})

export type JobForm = z.infer<typeof JobSchema>

export const JobPayload = (form: JobForm): JobForm => {
        return {
            jobPost: form.jobPost,
            clientName: form.clientName?.trim() || "",
            positionName: form.positionName.trim(),
            jobDescriptions: form.jobDescriptions.map(item => ({
                description: item.description.trim() 
            })),
            jobRequirements: form.jobRequirements.map(item => ({
                requirement: item.requirement.trim() 
            })),
            jobLevel: form.jobLevel,
            jobType: form.jobType,
            salary: form.salary.trim(),
            deleted: form.deleted ?? false
        }
    }


export type JobDetails = {
     jobId: number,
     companyName: string,
     companyLocation: string,
     companyPhone: string,
     companyWebsite: string,
     companyImage: string | null,
     positionName: string,
     jobDescription: string,
     salary: number,
     jobLevel: string,
     jobType: string
}


export type JobApplicationListItem= {
      applicantId: number
      applicantName: string
      applicantEmail: string
      gender: 'Male' | 'Female',
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

