import z from "zod";

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
