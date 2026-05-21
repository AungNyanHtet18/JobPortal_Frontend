'use client'

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {BriefcaseBusiness,FileText,GraduationCap,ImagePlus,Loader2,Plus, Save,Trash,Upload,UserRound,X} from "lucide-react"

import { ApplicantForm, ApplicantSchema } from "@/lib/type/schema/applicant/applicant.schema"
import PageTitle from "@/components/widgets/page-title"
import { Form } from "@/components/ui/form"
import FormsInput from "@/components/fields/form-input"
import FormSelect from "@/components/fields/form-select"
import FormsTextAreaInput from "@/components/fields/form-textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { safeCall } from "@/lib/utils"
import * as Applicant from "@/lib/actions/applicant/applicant.action"

const emptyExperience = {
    companyName: "",
    position: "",
    year: ""
}

function formatFileSize(size: number) {
    if(size < 1024 * 1024) {
        return `${Math.max(1, Math.round(size / 1024))} KB`
    }

    return `${(size / 1024 / 1024).toFixed(1)} MB`
}

function toApplicantPayload(form: ApplicantForm) {
    return {
        applicantName: form.applicantName,
        gender: form.gender,
        highestEducationalAttainment: form.highestEducationalAttainment,
        professionalSummary: form.professionalSummary,
        contactDetail: form.contactDetail,
        address: form.address,
        skills: form.skills.map(item => item.skill.trim()).filter(Boolean),
        experiences: form.experiences.map(item => ({
            companyName: item.companyName.trim(),
            position: item.position.trim(),
            year: Number(item.year)
        }))
    }
}

export default function ApplicantCreateComponent() {

    const router = useRouter()
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const profilePreview = useMemo(() => profileImage ? URL.createObjectURL(profileImage) : undefined, [profileImage])

    const form = useForm<ApplicantForm>({
        resolver: zodResolver(ApplicantSchema),
        defaultValues: {
            applicantName: "",
            gender: "",
            highestEducationalAttainment: "",
            skills: [{skill: ""}],
            professionalSummary: "",
            contactDetail: "",
            address: "",
            experiences: [emptyExperience]
        }
    })

    const skillsFieldArray = useFieldArray({
        control: form.control,
        name: 'skills'
    })

    const experiencesFieldArray = useFieldArray({
        control: form.control,
        name: 'experiences'
    })

    useEffect(() => {
        return () => {
            if(profilePreview) {
                URL.revokeObjectURL(profilePreview)
            }
        }
    }, [profilePreview])

    const appendSkill = () => {
        skillsFieldArray.append({skill: ""})
    }

    const removeSkill = (index: number) => {
        if(skillsFieldArray.fields.length === 1) {
            form.setValue("skills.0.skill", "")
            return
        }

        skillsFieldArray.remove(index)
    }

    const appendExperiences = () => {
        experiencesFieldArray.append(emptyExperience)
    }

    const removeExperiences = (index: number) => {
        if(experiencesFieldArray.fields.length === 1) {
            experiencesFieldArray.update(index, emptyExperience)
            return
        }

        experiencesFieldArray.remove(index)
    }

    async function save(values: ApplicantForm) {
        setIsSaving(true)

        const payload = new FormData()
        payload.append("form", JSON.stringify(toApplicantPayload(values)))

        if(profileImage) {
            payload.append("file", profileImage)
        }

        await safeCall(async () =>  {
            await Applicant.createApplicantAction(payload)

            if(resumeFile) {
                const resumePayload = new FormData()
                resumePayload.append("file", resumeFile)
                await Applicant.uploadApplicantResumeAction(resumePayload)
            }

            router.replace(`/applicant/detail`)
        })

        setIsSaving(false)
    }

    return (
        <section className="mx-auto max-w-7xl space-y-6 px-1 pb-8 text-zinc-950">
            <PageTitle
                icon="User"
                title="Applicant Create"
                description="Create a complete candidate profile"
            />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(save)} className="grid gap-6 lg:grid-cols-[340px_1fr]">
                    <aside className="space-y-4">
                        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <UserRound className="size-5 text-zinc-900" />
                                <h2 className="text-base font-semibold">Profile</h2>
                            </div>

                            <div className="space-y-3">
                                <div
                                    className="flex aspect-[4/5] w-full items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 bg-cover bg-center"
                                    style={profilePreview ? {backgroundImage: `url(${profilePreview})`} : undefined}
                                >
                                    {!profilePreview && (
                                        <div className="flex flex-col items-center gap-2 text-zinc-500">
                                            <ImagePlus className="size-8" />
                                            <span className="text-sm font-medium">Profile image</span>
                                        </div>
                                    )}
                                </div>

                                <Input
                                    id="profile-image"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(event) => setProfileImage(event.target.files?.[0] ?? null)}
                                />

                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" className="flex-1 border-zinc-900 bg-white text-zinc-950 hover:bg-zinc-100" asChild>
                                        <Label htmlFor="profile-image" className="cursor-pointer">
                                            <Upload className="size-4" />
                                            Choose
                                        </Label>
                                    </Button>

                                    {profileImage && (
                                        <Button type="button" variant="outline" size="icon" className="border-zinc-300" onClick={() => setProfileImage(null)}>
                                            <X className="size-4" />
                                        </Button>
                                    )}
                                </div>

                                {profileImage && (
                                    <p className="truncate text-xs text-zinc-500">
                                        {profileImage.name} - {formatFileSize(profileImage.size)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <FileText className="size-5 text-zinc-900" />
                                <h2 className="text-base font-semibold">Resume</h2>
                            </div>

                            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                <Input
                                    id="resume-file"
                                    type="file"
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    className="hidden"
                                    onChange={(event) => setResumeFile(event.target.files?.[0] ?? null)}
                                />

                                <div className="flex items-start gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                                        <FileText className="size-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-zinc-950">
                                            {resumeFile?.name || "No resume selected"}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {resumeFile ? formatFileSize(resumeFile.size) : "PDF, DOC, or DOCX"}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Button type="button" className="flex-1 bg-zinc-950 text-white hover:bg-zinc-800" asChild>
                                        <Label htmlFor="resume-file" className="cursor-pointer">
                                            <Upload className="size-4" />
                                            Upload
                                        </Label>
                                    </Button>

                                    {resumeFile && (
                                        <Button type="button" variant="outline" size="icon" className="border-zinc-300" onClick={() => setResumeFile(null)}>
                                            <X className="size-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="space-y-6">
                        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center gap-2 border-b border-zinc-100 pb-4">
                                <UserRound className="size-5 text-zinc-900" />
                                <h2 className="text-base font-semibold">Personal Information</h2>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <FormsInput control={form.control} path="applicantName" label="Applicant Name" placeHolder="Enter your applicant name" />
                                <FormSelect control={form.control} path="gender" label="Gender" options={[{key: "Male", value: "Male"}, {key: "Female", value: "Female"}]} />
                                <FormsTextAreaInput control={form.control} path="contactDetail" label="Contact Detail" placeHolder="Enter your contact detail" rowHeight="min-h-[96px]" />
                                <FormsTextAreaInput control={form.control} path="address" label="Address" placeHolder="Enter your address" rowHeight="min-h-[96px]" />
                            </div>
                        </div>

                        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center gap-2 border-b border-zinc-100 pb-4">
                                <GraduationCap className="size-5 text-zinc-900" />
                                <h2 className="text-base font-semibold">Education And Summary</h2>
                            </div>

                            <div className="grid gap-4">
                                <FormsTextAreaInput control={form.control} path="highestEducationalAttainment" label="Highest Education Attainment" placeHolder="Enter highest education attainment" rowHeight="min-h-[96px]" />
                                <FormsTextAreaInput control={form.control} path="professionalSummary" label="Professional Summary" placeHolder="Please fill your professional summary" rowHeight="min-h-[120px]" />
                            </div>
                        </div>

                        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <BriefcaseBusiness className="size-5 text-zinc-900" />
                                    <h2 className="text-base font-semibold">Skills</h2>
                                </div>
                                <Button type="button" variant="outline" size="sm" className="border-zinc-900 text-zinc-950 hover:bg-zinc-100" onClick={appendSkill}>
                                    <Plus className="size-4" />
                                    Add
                                </Button>
                            </div>

                            <div className="space-y-3">
                                {skillsFieldArray.fields.map((field, index) => (
                                    <div key={field.id} className="grid gap-2 sm:grid-cols-[1fr_auto]">
                                        <FormsInput control={form.control} path={`skills.${index}.skill`} placeHolder="Enter your skill" />
                                        <Button type="button" variant="outline" size="icon" className="border-zinc-300 text-zinc-950 hover:bg-zinc-100" onClick={() => removeSkill(index)}>
                                            <Trash className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <BriefcaseBusiness className="size-5 text-zinc-900" />
                                    <h2 className="text-base font-semibold">Experience</h2>
                                </div>
                                <Button type="button" variant="outline" size="sm" className="border-zinc-900 text-zinc-950 hover:bg-zinc-100" onClick={appendExperiences}>
                                    <Plus className="size-4" />
                                    Add
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {experiencesFieldArray.fields.map((field, index) => (
                                    <div key={field.id} className="grid gap-3 rounded-lg border border-zinc-100 bg-zinc-50 p-3 md:grid-cols-[1fr_1fr_110px_auto]">
                                        <FormsInput control={form.control} path={`experiences.${index}.companyName`} placeHolder="Company name" />
                                        <FormsInput control={form.control} path={`experiences.${index}.position`} placeHolder="Position" />
                                        <FormsInput control={form.control} type="number" path={`experiences.${index}.year`} placeHolder="Year" />
                                        <Button type="button" variant="outline" size="icon" className="border-zinc-300 bg-white text-zinc-950 hover:bg-zinc-100" onClick={() => removeExperiences(index)}>
                                            <Trash className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="sticky bottom-0 flex justify-end border-t border-zinc-200 bg-gray-50/95 py-4 backdrop-blur">
                            <Button type="submit" disabled={isSaving} className="bg-zinc-950 px-6 text-white hover:bg-zinc-800">
                                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                {isSaving ? "Saving" : "Save Applicant"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </section>
    )
}
