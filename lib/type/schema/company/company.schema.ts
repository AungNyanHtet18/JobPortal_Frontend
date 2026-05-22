import z from "zod";

export const CompanySchema = z.object({
     companyName: z.string().nonempty("Please enter your company name."),
     location: z.string().min(5).max(200),
     phone: z.string().regex(/^\d{10}$/, "Invalid phone number format, expected 10 digits"),
     websiteUrl: z.union([z.string().url("Invalid URL Format"), z.literal("")]).optional(),
     description: z.string().nonempty("Please enter your description."),
     file: z.instanceof(File).optional()
})

export type CompanyForm = z.infer<typeof CompanySchema>

export type UploadedJob = {
      postionName : string,
      salary : number,
      jobLevel : string,
      jobType : string
}

export type CompanyDetails = {
      id: number,
      companyName : string ,
      location : string,
      phone : string,
      websiteUrl : string,
      description : string,
      profileImage?: string | null,
      totalPostedJobs : number,
      uploadedJob: UploadedJob[]
}
