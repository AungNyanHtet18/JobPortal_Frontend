import z from "zod";

export const CompanySchema = z.object({
     industryType: z.string().nonempty("Please enter your industry type."),
     companyName: z.string().nonempty("Please enter your company name."),
     location: z.string().min(5).max(200).nonempty("Please enter your company location."),
     phone: z.string().nonempty("Please enter company phone numbers."), //phone: z.string().regex(/^\d{8,15}$/, "Invalid phone number format, expected 10 digits") // In Spring Boot Validation @Pattern(regexp = "^\\d{10}$", message =  "Invalid phone number format,expected 10 digit")
     websiteUrl: z.union([z.string().url("Invalid URL Format"), z.literal("")]).optional(),
     description: z.string().nonempty("Please enter your company description."),
     file: z.instanceof(File).optional()
})

export type CompanyForm = z.infer<typeof CompanySchema>

export type UploadedJob = {
      postionName : string,
      salary : number,
      jobId: number,
      jobLevel : string,
      jobType : string
}


export type CompanyDetails = {
      id: number | string,
      companyName : string ,
      companyEmail: string,
      industryType: string,
      location : string,
      phone : string,
      websiteUrl : string,
      description : string,
      profileImage?: string | null,
      totalPostedJobs : number,
      uploadedJob: UploadedJob[]
}
