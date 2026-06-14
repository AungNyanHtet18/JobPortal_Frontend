'use client'

import FormsInput from "@/components/fields/form-input"
import FormSelect from "@/components/fields/form-select"
import FormsTextAreaInput from "@/components/fields/form-textarea"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import PageTitle from "@/components/widgets/page-title"
import { JobForm, JobPayload, JobSchema } from "@/lib/type/schema/job/job.schema"
import { JobLevel, JobType } from "@/lib/type/type"
import { safeCall } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { BriefcaseBusiness, ClipboardList, DollarSign, Layers, Loader2, MapPin, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as Job from "@/lib/actions/job/job.action"
import InputComponent from "@/components/widgets/input-component"
import ContentLayout from "@/components/widgets/content-layout"

export default function JobCreateComponent() {
    
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    
    const form = useForm<JobForm>({
         resolver: zodResolver(JobSchema),
         defaultValues: {
             jobPost: "",
             clientName: "",
             positionName: "",
             jobDescriptions: [],
             jobRequirements: [],
             jobLevel: "",
             jobType: "",
             salary: "",
             deleted: false
         }
    })

    async function save(values: JobForm) {
        setIsSaving(true)
         
        await safeCall(async () => {
            const result = await Job.createJob(JobPayload(values))
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
                                    <div className="flex size-10  items-center justify-center rounded-lg bg-zinc-950 text-white">
                                        <BriefcaseBusiness className="size-8" />
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
                            <FormsTextAreaInput control={form.control} path="jobDescription" label="Job Description" placeHolder="Please fill job description" rowHeight="min-h-[160px]" />
                        </InputComponent>

                        <InputComponent title="Job Classification" className={"md:grid-cols-2"} icon={<Layers className="size-5 text-zinc-900" />}>
                            <FormSelect control={form.control} path="jobLevel" label="Job Level" placeHolder="Select job level" options={JobLevel} />
                            <FormSelect control={form.control} path="jobType" label="Job Type" placeHolder="Select job type" options={JobType} />
                        </InputComponent>

                        <InputComponent title="Salary" className="md:grid-cols-2" icon={<DollarSign className="size-5 text-zinc-900" />}>
                            <FormsInput control={form.control} path="salary" label="Salary" placeHolder="Enter salary amount" />
                            <div className="mt-5 flex items-center rounded-lg border border-zinc-100 bg-zinc-50 p-3">
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
