import z from "zod";

export type ApplicantionStatus =  'APPLIED' | 
                                  'REVIEWING' | 
                                  'SHORTLISTED' | 
                                  'INTERVIEW' | 
                                  'OFFERED' | 
                                  'HIRED' | 
                                  'REJECTED' 


export const JobSchema = z.object({
     positionName : z.string().nonempty("Please enter job position name."),
     jobDescription : z.string().nonempty("Please enter summary for position."),
     salary : z.string().nonempty("Please enter salary."),
     jobLevel : z.string().nonempty("Please enter job level."),
     jobType : z.string().nonempty("Please enter job type."),
     deleted : z.boolean().optional()
})

export type JobForm = z.infer<typeof JobSchema>

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

