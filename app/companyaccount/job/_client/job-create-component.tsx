'use client'

import FormsInput from "@/components/fields/form-input"
import FormSelect from "@/components/fields/form-select"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import PageTitle from "@/components/widgets/page-title"
import { JobForm, JobPayload, JobSchema } from "@/lib/type/schema/job/job.schema"
import { JobLevel, JobType } from "@/lib/type/type"
import { safeCall } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { BriefcaseBusiness, ClipboardList, DollarSign, Layers, Loader2, MapPin, Save, Plus, Trash2, ListChecks, Briefcase, GraduationCap } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import * as Job from "@/lib/actions/job/job.action"
import InputComponent from "@/components/widgets/input-component"
import ContentLayout from "@/components/widgets/content-layout"
import DialogDetailComponent from "@/components/widgets/dialog-detail-component"
import FormsCheckBox from "@/components/fields/form-checkbox"

export default function JobCreateComponent() {
    
    const router = useRouter()
    const [isSaving, setIsSaving] = useState<boolean>(false)
    
    const form = useForm<JobForm>({
         resolver: zodResolver(JobSchema),
         defaultValues: {
             jobPost: "",
             clientName: "",
             location : "",
             positionName: "",
             jobDescriptions: [{ description: "" }],
             jobRequirements: [{ requirement: "" }],
             jobLevel: "",
             jobType: "",
             minSalaryRange: "",
             maxSalaryRange: "",
             deleted: false
         }
    })

    const jobDescriptionsFieldArray = useFieldArray({
        control: form.control,
        name: "jobDescriptions"
    })

    const jobRequirementsFieldArray = useFieldArray({
        control: form.control,
        name: "jobRequirements"
    })

    const appendJobDescription = () => {
        jobDescriptionsFieldArray.append({ description: "" })
    }

    const removeJobDescription = (index: number) => {
         if(jobDescriptionsFieldArray.fields.length === 1) {
            form.setValue("jobDescriptions.0.description", "")
            return
         }
         jobDescriptionsFieldArray.remove(index)
    }

    const appendJobRequirement = () => {
        jobRequirementsFieldArray.append({ requirement: "" })
    }

    const removeJobRequirement =(index: number) => {
        if(jobRequirementsFieldArray.fields.length === 1) {
             form.setValue("jobRequirements.0.requirement", "")
             return 
        }
        
        jobRequirementsFieldArray.remove(index)
    }

    async function save(jobForm: JobForm) {
        setIsSaving(true)
        
        await safeCall(async () => {
            const result = await Job.createJob(JobPayload(jobForm))
             router.replace(`/job/${result.id}`)
        })

        setIsSaving(false)
    }

    return (
        <section className="mx-auto max-w-7xl space-y-6 px-1 pb-8 text-zinc-950">
            <PageTitle icon="BriefcaseBusiness" title="Job Create" description="Create a clear job post for applicants" />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(save)} className="grid gap-6 lg:grid-cols-[340px_1fr]">
                    <aside className="space-y-4">
                        <ContentLayout title="Summary" icon={<BriefcaseBusiness className="size-5 text-zinc-900"/>}>
                            <div className="space-y-4">
                                <div className="flex aspect-[4/5] w-full flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center">
                                    <div className="flex w-50 h-50 items-center justify-center rounded-lg bg-zinc-950 text-white">
                                        <BriefcaseBusiness className="size-25" />
                                    </div>
                                    <p className="mt-4 text-sm font-medium text-zinc-950">New company job post</p>
                                    <p className="mt-1 text-xs leading-5 text-zinc-500">Add the position, level, work type, salary, and description applicants need.</p>
                                </div>

                                <div className="flex items-center rounded-lg border border-zinc-100 bg-zinc-50 p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                                            <MapPin className="size-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-medium text-zinc-950">Company Location</p>
                                            <p className="text-xs text-zinc-500">Applicants will see your company profile details.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ContentLayout>
                    </aside>

                    <div className="space-y-6">

                        <InputComponent title="Position Information" icon={<ClipboardList className="size-5 text-zinc-900" />} >
                            <FormsInput control={form.control} path="positionName" label="Position Name" placeHolder="Enter job position name" />
                            <div className="grid gap-4 md:grid-cols-3">
                                <FormsInput control={form.control} path="clientName" label="Client Name (Optional)" placeHolder="Enter client name if applicable" className="col-span-2" />
                                <FormsInput control={form.control} path="jobPost" label="Job Post Amount (Optional)" placeHolder="Number of open positions" />
                            </div>
                        </InputComponent>

                        <DialogDetailComponent title="Job Description" titleIcon="Briefcase" onClickAction={appendJobDescription}>
                            <div className="grid gap-3">
                                {jobDescriptionsFieldArray.fields.map((field, index) => (
                                    <div key={field.id} className="grid gap-2 sm:grid-cols-[1fr_auto]">
                                        <FormsInput control={form.control} path={`jobDescriptions.${index}.description`} placeHolder="e.g., Lead the development of modern web applications" />
                                        <Button type="button" variant="outline" size="icon" className="border-zinc-300 text-red-500 hover:bg-zinc-50 hover:text-red-600" onClick={() => removeJobDescription(index)}>
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            {form.formState.errors.jobDescriptions?.root && (
                                <p className="mt-2 text-sm font-medium text-red-500">{form.formState.errors.jobDescriptions.root.message}</p>
                            )}
                        </DialogDetailComponent>

                        <DialogDetailComponent title="Job Requirements" titleIcon="GraduationCap" onClickAction={appendJobRequirement}>
                            <div className="grid gap-3">
                                {jobRequirementsFieldArray.fields.map((field, index) => (
                                    <div key={field.id} className="grid gap-2 sm:grid-cols-[1fr_auto]">
                                        <FormsInput control={form.control} path={`jobRequirements.${index}.requirement`} placeHolder="e.g., 3+ years of experience with React and TypeScript" />
                                        <Button type="button" variant="outline" size="icon" className="border-zinc-300 text-red-500 hover:bg-zinc-50 hover:text-red-600" onClick={() => removeJobRequirement(index)}>
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            {form.formState.errors.jobRequirements?.root && (
                                <p className="mt-2 text-sm font-medium text-red-500">{form.formState.errors.jobRequirements.root.message}</p>
                            )}
                        </DialogDetailComponent>

                        <InputComponent title="Job Classification" className={"md:grid-cols-2"} icon={<Layers className="size-5 text-zinc-900" />}>
                            <FormSelect control={form.control} path="jobLevel" label="Job Level" placeHolder="Select job level" options={JobLevel} />
                            <FormSelect control={form.control} path="jobType" label="Job Type" placeHolder="Select job type" options={JobType} />
                        </InputComponent>

                        <InputComponent title="Salary" className="md:grid-cols-4" icon={<DollarSign className="size-5 text-zinc-900" />}>
                            <FormsInput control={form.control} path="minSalaryRange" label="Minimum Salary" placeHolder="Minimum Salary Range" />
                            <FormsInput control={form.control} path="maxSalaryRange" label="Maximum Salary" placeHolder="Maximum Salary Range" />
                            
                            <div className="col-span-2 mt-5 flex items-center rounded-lg border border-zinc-100 bg-zinc-50 p-3">
                                <div className="flex gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                                        <DollarSign className="size-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium text-zinc-950">Compensation</p>
                                        <p className="text-xs text-zinc-500">Use the exact salary or range you want applicants to see.</p>
                                    </div>
                                </div>
                            </div>
                        </InputComponent>

                        <InputComponent title="Salary" className="md:grid-cols-2" icon={<DollarSign className="size-5 text-zinc-900" />}>
                            <FormsInput control={form.control} path="location" label="Location For Job" placeHolder="Enter Location for Job."/>
                            <FormsCheckBox control={form.control} path="deleted" label="Archived Job Posting" description="Mark this job posting as deleted" className="mt-4"  />
                        </InputComponent>

                        <div className="sticky bottom-0 flex justify-end border-t border-zinc-200 bg-gray-50/95 py-4 backdrop-blur">
                            <Button type="submit" disabled={isSaving} className="bg-zinc-950 px-6 text-white hover:bg-zinc-800">
                                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                {isSaving ? "Saving" : "Save Job"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </section>
    )
}
