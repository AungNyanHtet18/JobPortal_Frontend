'use client'

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Resolver, useFieldArray, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileText, ImagePlus, Loader2, PaperclipIcon, Pencil, Plus, Save, Trash, Upload, UserRound, X } from "lucide-react"
import FormsInput from "@/components/fields/form-input"
import FormSelect from "@/components/fields/form-select"
import FormsTextAreaInput from "@/components/fields/form-textarea"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageTitle from "@/components/widgets/page-title"
import { formatFileSize, getFileName, safeCall } from "@/lib/utils"
import { ApplicantForm, ApplicantPayload, ApplicantSchema, emptyEducation, emptyExperience, emptyLanguage, emptySkill, emptySocialLink } from "@/lib/type/schema/applicant/applicant.schema"
import * as Applicant from "@/lib/actions/applicant/applicant.action"
import InputComponent from "@/components/widgets/input-component"
import ContentLayout from "@/components/widgets/content-layout"
import DialogDetailComponent from "@/components/widgets/dialog-detail-component"
import { Badge } from "@/components/ui/badge"
import DialogComponent from "@/components/widgets/dialog-widget"
import FormsDate from "@/components/fields/form.date"
import FormsCheckBox from "@/components/fields/form-checkbox"
import { LanguageLevel, QualificationType, SkillType } from "@/lib/type/type"
import Loading from "@/components/widgets/loading"

export default function ApplicantEditComponent({id} : {id: string}) {

    const router = useRouter()
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [resumeFile, setResumeFile] = useState<File | null>(null)
    const [cvFormFile, setCvFormFile] = useState<File | null>(null)
    const [resumeDummy, setResumeDummy] = useState<string | null>(null)
    const [cvFormDummy, setCvFormDummy] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [uploadedProfileUrl, setUploadedProfileUrl] = useState<string>()
    const [profileImageFailed, setProfileImageFailed] = useState(false)
    const [educationDialogIndex, setEducationDialogIndex] = useState<number | null>(null)
    const [experienceDialogIndex, setExperienceDialogIndex] = useState<number | null>(null)
    const [skillDialogIndex, setSkillDialogIndex] = useState<number | null>(null)
    const [languageDialogIndex, setLanguageDialogIndex] = useState<number | null>(null)
    
    const profilePreview = useMemo(() => profileImage ? URL.createObjectURL(profileImage) : undefined, [profileImage])
    const visibleProfileImage = profilePreview || (!profileImageFailed ? uploadedProfileUrl : undefined)

    const form = useForm<ApplicantForm>({
        resolver: zodResolver(ApplicantSchema) as Resolver<ApplicantForm>,
        defaultValues: {
            applicantName: "",
            gender: "",
            professionalSummary: "",
            contactDetail: "",
            address: "",
            experiences: [emptyExperience],
            socialLinks: [emptySocialLink],
            educations: [emptyEducation],
            careerRoles: [{ roleName: "" }],
            skills: [emptySkill],
            languages: [emptyLanguage]
        }
    })

    const experiencesFieldArray = useFieldArray({
        control: form.control,
        name: "experiences"
    })

    const socialLinksFieldArray = useFieldArray({
        control: form.control,
        name: "socialLinks"
    })

    const educationsFieldArray = useFieldArray({
        control: form.control,
        name: "educations"
    })

    const careerRolesFieldArray = useFieldArray({
        control: form.control,
        name: "careerRoles"
    })

    const skillsFieldArray = useFieldArray({
        control: form.control,
        name: "skills"
    })

    const languagesFieldArray = useFieldArray({
        control: form.control,
        name: "languages"
    })

    const currentExperience = useWatch({  //When checkbox  is checked, usewatch returns true 
            control: form.control,
            name: experienceDialogIndex !== null ? `experiences.${experienceDialogIndex}.currentlyWorking` : "experiences.0.currentlyWorking",
    })

   // Run when the component unmounts. When profilePreview changes,this cleanup function handles memory management during component updates
    useEffect(() => {
        return () => {
            if(profilePreview) {
                URL.revokeObjectURL(profilePreview)
            }
        }
    }, [profilePreview])

    useEffect(() => {
        async function load() {

            setIsLoading(true)

            await safeCall(async () => {
                const result = await Applicant.findByApplicantName()

                if(result) {
                    setUploadedProfileUrl(await  Applicant.getApplicantProfileImageUrl(result.profileImage))
                    setProfileImageFailed(false)

                    form.reset({
                        applicantName: result.name,
                        gender: result.gender,
                        professionalSummary: result.professionalSummary,
                        contactDetail: result.contactDetail,
                        address: result.address,
                        experiences: result.experience && result.experience.length > 0
                            ? result.experience.map(exp => ({
                                companyName: exp.companyName,
                                position: exp.position,
                                joinedDate: exp.joinedDate,
                                leftDate: exp.leftDate ? exp.leftDate : '',
                                currentlyWorking: exp.currentlyWorking,
                                experienceDescription: exp.experienceDescription
                            })) : [],

                        socialLinks: result.socialLink && result.socialLink.length > 0
                           ? result.socialLink.map(social => ({
                              platform: social.platform,
                              url: social.url
                           })) : [],

                        educations: result.education && result.education.length > 0
                           ? result.education.map(edu => ({
                             qualificationType: edu.qualificationType,
                             qualificationName: edu.qualificationName,
                             institutionName: edu.institutionName,
                             completionDate: edu.completionDate
                           })) : [],

                        careerRoles: result.careerRole && result.careerRole.length > 0
                          ? result.careerRole.map(role => ({
                              roleName: role.roleName
                          })) : [{ roleName: "" }],

                        skills: result.skill && result.skill.length > 0
                          ? result.skill.map(s => ({
                              skillType: s.skillType,
                              skillName: s.skillName
                          })) : [],

                        languages: result.language && result.language.length > 0
                          ? result.language.map(lang => ({
                             languageName: lang.languageName,
                             languageLevel: lang.languageLevel
                          })) : []
                    })

                    if(result.resume) {
                         setResumeDummy(result.resume)
                    }

                    if(result.cvForm) {
                        setCvFormDummy(result.cvForm)
                    }

                }
            })

            setIsLoading(false)
        }

        load()
    }, [id, form])


    const openNewExperience = () => {
        const nextIndex = experiencesFieldArray.fields.length
        experiencesFieldArray.append(emptyExperience)
        setExperienceDialogIndex(nextIndex)
    }

    const removeExperience = (index: number) => {
        experiencesFieldArray.remove(index)
        setExperienceDialogIndex(null)
    }

    const openNewEducation = () => {
            const nextIndex = educationsFieldArray.fields.length
            educationsFieldArray.append(emptyEducation) //when empty data append in education array, the array length is 1
            setEducationDialogIndex(nextIndex)
    }

    const removeEducation = (index: number) => {
            educationsFieldArray.remove(index)
            setEducationDialogIndex(null)
    }

    const appendCareerRole = () => {
        careerRolesFieldArray.append({ roleName: "" })
    }

    const removeCareerRole = (index: number) => {
        if(careerRolesFieldArray.fields.length === 1) {
            form.setValue("careerRoles.0.roleName", "")
            return
        }
        careerRolesFieldArray.remove(index)
    }

    const openNewSkill = () => {
        const nextIndex = skillsFieldArray.fields.length
        skillsFieldArray.append(emptySkill)
        setSkillDialogIndex(nextIndex)
    }

    const removeSkill = (index: number) => {
        skillsFieldArray.remove(index)
        setSkillDialogIndex(null)
    }

    const openNewLanguage = () => {
        const nextIndex = languagesFieldArray.fields.length
        languagesFieldArray.append(emptyLanguage)
        setLanguageDialogIndex(nextIndex)
    }

    const removeLanguage = (index: number) => {
        languagesFieldArray.remove(index)
        setLanguageDialogIndex(null)
    }

    async function save(form: ApplicantForm) {
        setIsSaving(true)

        const payload = new FormData()
        payload.append("form", JSON.stringify(ApplicantPayload(form)))

        if(profileImage) {
            payload.append("file", profileImage)
        }

        await safeCall(async () => {
            await Applicant.updateApplicant(id, payload)

            if(resumeFile) {
               await Applicant.uploadApplicantResume(resumeFile)
            }

            if(cvFormFile) {
                await Applicant.uploadApplicantCvForm(cvFormFile)
            }

            router.replace("/applicant/detail")
        })

        setIsSaving(false)
    }

    if(isLoading) {
         return <Loading content="Loading data for applicant edit"/>
    }

    return ( 
        <section className="mx-auto max-w-7xl space-y-6 px-1 pb-8 text-zinc-950">
            <PageTitle icon="User" title="Applicant Create" description="Create a complete candidate profile" />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(save)} className="grid gap-6 lg:grid-cols-[340px_1fr]">
                    <aside className="space-y-4">
                        <ContentLayout title="Profile" icon={<UserRound className="size-5 text-zinc-900" />}>
                            <div className="space-y-3">
                                <div className="flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-zinc-50">
                                    {visibleProfileImage && (
                                        <img
                                            src={visibleProfileImage}
                                            alt="Applicant profile"
                                            className="size-full object-cover"
                                            onError={() => setProfileImageFailed(true)}
                                        />
                                    )}

                                    {!visibleProfileImage && (
                                        <div className="flex flex-col items-center gap-2 text-zinc-500">
                                            <ImagePlus className="size-8" />
                                            <span className="text-sm font-medium">Current profile</span>
                                        </div>
                                    )}
                                </div>

                                <Input id="edit-profile-image" type="file" accept="image/*"
                                    className="hidden" onChange={(event) => setProfileImage(event.target.files?.[0] ?? null)}/>

                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" className="flex-1 border-zinc-900 bg-white text-zinc-950 hover:bg-zinc-100" asChild>
                                        <Label htmlFor="edit-profile-image" className="cursor-pointer">
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
                        </ContentLayout>

                        <ContentLayout title="Resume" icon={<FileText className="size-5 text-zinc-900" />}>
                            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                <Input id="resume-file" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    className="hidden" onChange={(event) => {
                                            setResumeDummy(null)
                                            setResumeFile(event.target.files?.[0] ?? null)}}/>

                                <div className="flex items-start gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                                        <FileText className="size-5" />
                                    </div>

                                    {resumeDummy ? 
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-zinc-950">
                                            {resumeDummy}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            PDF, DOC, or DOCX
                                        </p>
                                    </div> :
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-zinc-950">
                                            {resumeFile?.name || "No resume selected"}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {resumeFile ? formatFileSize(resumeFile.size) : "PDF, DOC, or DOCX"}
                                        </p>
                                    </div>}
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
                        </ContentLayout>

                        <ContentLayout title="CV Form" icon={<PaperclipIcon className="size-5 text-zinc-900" />}>
                            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                <Input id="cv-form" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    className="hidden" onChange={(event) => {
                                        setCvFormDummy(null)
                                        setCvFormFile(event.target.files?.[0] ?? null)}}/>

                                <div className="flex items-start gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                                        <PaperclipIcon className="size-5" />
                                    </div>

                                    { cvFormDummy ?
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-zinc-950">
                                            {cvFormDummy}
                                        </p>
                                        <p className="text-xs text-zinc-500">PDF, DOC, or DOCX</p>
                                    </div>  :

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-zinc-950">
                                            {cvFormFile?.name || "No CV Form selected"}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            {cvFormFile ? formatFileSize(cvFormFile.size) : "PDF, DOC, or DOCX"}
                                        </p>
                                    </div>}
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Button type="button" className="flex-1 bg-zinc-950 text-white hover:bg-zinc-800" asChild>
                                        <Label htmlFor="cv-form" className="cursor-pointer">
                                            <Upload className="size-4" />
                                            Upload
                                        </Label>
                                    </Button>

                                    {cvFormFile && (
                                        <Button type="button" variant="outline" size="icon" className="border-zinc-300" onClick={() => setCvFormFile(null)}>
                                            <X className="size-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </ContentLayout>
                    </aside>

                    <div className="space-y-6">
                        <InputComponent className="md:grid-cols-2" title="Personal Information" icon={<UserRound className="size-5 text-zinc-900" />}>
                            <FormsInput control={form.control} path="applicantName" label="Applicant Name" placeHolder="Enter your applicant name" />
                            <FormSelect control={form.control} path="gender" label="Gender" options={[{key: "Male", value: "Male"}, {key: "Female", value: "Female"}]} />
                            <FormsTextAreaInput control={form.control} path="contactDetail" label="Contact Detail" placeHolder="Enter your contact detail" rowHeight="min-h-[96px]" />
                            <FormsTextAreaInput control={form.control} path="address" label="Address" placeHolder="Enter your address" rowHeight="min-h-[96px]" />
                            <FormsTextAreaInput control={form.control} path="professionalSummary" label="Professional Summary" placeHolder="Write a short profile summary" rowHeight="min-h-[120px] md:col-span-2" />
                        </InputComponent>

                        <DialogDetailComponent title="Interested Career Roles" titleIcon="Target" onClickAction={appendCareerRole}>
                            <div className="grid gap-3 md:grid-cols-2">
                                {careerRolesFieldArray.fields.map((field, index) => (
                                    <div key={field.id} className="grid gap-2 sm:grid-cols-[1fr_auto]">
                                        <FormsInput control={form.control} path={`careerRoles.${index}.roleName`} placeHolder="Fill Your Interested Career Roles" />
                                        <Button type="button" variant="outline" size="icon" className="border-zinc-300 text-zinc-950 hover:bg-zinc-100" onClick={() => removeCareerRole(index)}>
                                            <Trash className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </DialogDetailComponent>

                        <DialogDetailComponent title="Social" titleIcon="LinkIcon" onClickAction={() => socialLinksFieldArray.append(emptySocialLink)}>
                            <div className="space-y-3">
                                {socialLinksFieldArray.fields.length === 0 && (
                                    <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-500">
                                        Add portfolio, LinkedIn, GitHub, or other professional links.
                                    </div>
                                )}

                                {socialLinksFieldArray.fields.map((field, index) => (
                                    <div key={field.id} className="grid gap-2 md:grid-cols-[200px_1fr_auto]">
                                        <FormsInput control={form.control} path={`socialLinks.${index}.platform`} placeHolder="Platform" />
                                        <FormsInput control={form.control} path={`socialLinks.${index}.url`} placeHolder="https://..." />
                                        <Button type="button" variant="outline" size="icon" className="border-zinc-300 text-zinc-950 hover:bg-zinc-100" onClick={() => socialLinksFieldArray.remove(index)}>
                                            <Trash className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </DialogDetailComponent>
                    
                        <DialogDetailComponent title="Education" titleIcon="GraduationCap" onClickAction={openNewEducation}>
                            <div className="space-y-4">
                                    {educationsFieldArray.fields.length === 0 && (
                                    <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-500">
                                        Add education history with qualification type, name, and completion date.
                                    </div>
                                )} 

                                <div className="grid md:grid-cols-2 gap-3">
                                    <button type="button" onClick={() => openNewEducation()} className="min-h-36 flex flex-col items-center justify-center gap-2  rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-zinc-600 transition-colors hover:border-zinc-900 hover:bg-white hover:text-zinc-950">
                                        <div className="flex size-10  items-center justify-center rounded-md bg-white shadow-sm">
                                            <Plus className="size-5"/>
                                        </div>
                                        <span className="text-sm font-medium">Add Education</span>
                                    </button> 

                                    { educationsFieldArray.fields.map((field, index) => {  
                                    const value = form.getValues(`educations.${index}`)
                                    
                                    return (
                                        <div key={field.id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                            <div className="space-y-1">
                                                <div className="flex justify-between item-center">
                                                    <p className="truncate text-sm font-semibold text-zinc-950">{value.qualificationType || 'Qualification Type'}</p>
                                                    <Badge variant='outline' className="bg-white">
                                                        {value.qualificationName  || 'QualificationName'}
                                                    </Badge>
                                                </div>
                                                <p className="truncate text-sm text-zinc-500">{value.institutionName || 'Institution Name'}</p>
                                            </div>
                                            
                                            <p className="mt-2 truncate text-xs text-zinc-500">{value.completionDate || 'Completion Date'}</p>

                                            <div className="flex gap-2 mt-2">
                                                <Button type="button" variant='outline' size='sm' className="flex-1 bg-white" onClick={() => setEducationDialogIndex(index)}>
                                                    <Pencil size={4}/> Edit
                                                </Button>
                                                
                                                <Button type="button" variant='outline' size='sm' onClick={() => removeEducation(index)}>
                                                    <Trash size={4}/>
                                                </Button>
                                            </div>
                                        </div>
                                        
                                    )})}  
                                </div>
                            </div>
                        </DialogDetailComponent>

                        <DialogDetailComponent title="Experience" titleIcon="BriefcaseBusiness" onClickAction={openNewExperience}>
                            <div className="grid gap-3 md:grid-cols-2">
                                <button type="button" onClick={openNewExperience} className="min-h-36 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-4 text-center text-zinc-600 transition-colors hover:border-zinc-900 hover:bg-white hover:text-zinc-950">
                                    <div className="flex size-10 items-center justify-center rounded-md bg-white shadow-sm">
                                        <Plus className="size-5" />
                                    </div>
                                    <span className="text-sm font-medium">Add experience</span>
                                </button>

                                { experiencesFieldArray.fields.map((field, index) => {
                                    const value = form.getValues(`experiences.${index}`)
                                    
                                    return (
                                        <div key={field.id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-zinc-950">{value.position || "Untitled position"}</p>
                                                    <p className="truncate text-sm text-zinc-500">{value.companyName || "Company name"}</p>
                                                </div>
                                                <Badge variant="outline" className="bg-white">
                                                    {value.currentlyWorking ? "Current" : "Past"}
                                                </Badge>
                                            </div>
                                            <p className="mt-3 text-xs text-zinc-500">
                                                {value.joinedDate || "Start date"} - {value.currentlyWorking ? "Present" : value.leftDate || "Left date"}
                                            </p>
                                            <div className="mt-4 flex gap-2">
                                                <Button type="button" variant="outline" size="sm" className="flex-1 bg-white" onClick={() => setExperienceDialogIndex(index)}>
                                                    <Pencil className="size-4" />
                                                    Edit
                                                </Button>
                                                <Button type="button" variant="outline" size="icon-sm" className="bg-white" onClick={() => removeExperience(index)}>
                                                    <Trash className="size-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </DialogDetailComponent>

                        <div className="grid gap-6 md:grid-cols-2">
                            <DialogDetailComponent title="Skills" titleIcon="Sparkles" onClickAction={openNewSkill}>
                                <div className="flex flex-wrap gap-2">
                                    {skillsFieldArray.fields.length === 0 && (
                                        <p className="text-sm text-zinc-500">Add technical and soft skills.</p>
                                    )}

                                    {skillsFieldArray.fields.map((field, index) => {
                                        const value = form.getValues(`skills.${index}`)

                                        return (
                                            <button key={field.id} type="button" onClick={() => setSkillDialogIndex(index)} className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-left text-sm transition-colors hover:border-zinc-900 hover:bg-white">
                                                <span className="font-medium text-zinc-950">{value.skillName || "Unnamed skill"}</span>
                                                {value.skillType && <span className="ml-2 text-xs text-zinc-500">{value.skillType}</span>}
                                            </button>
                                        )
                                    })}
                                </div>
                            </DialogDetailComponent>
                            
                            <DialogDetailComponent title="Languages" titleIcon="Languages" onClickAction={openNewLanguage} >
                                <div className="flex flex-wrap gap-2">
                                    {languagesFieldArray.fields.length === 0 && (
                                        <p className="text-sm text-zinc-500">Add languages you can use professionally.</p>
                                    )}

                                    {languagesFieldArray.fields.map((field, index) => {
                                        const value = form.getValues(`languages.${index}`)

                                        return (
                                            <button key={field.id} type="button" onClick={() => setLanguageDialogIndex(index)} className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-950 transition-colors hover:border-zinc-900 hover:bg-white">
                                                <span className="font-medium text-zinc-950">{value.languageName}</span>
                                                {value.languageLevel && <span className="ms-1 text-xs text-zinc-500">({value.languageLevel})</span>}
                                            </button>
                                        )
                                    })}
                                </div>
                            </DialogDetailComponent>
                        </div>

                        <div className="sticky bottom-0 flex justify-end border-t border-zinc-200 bg-gray-50/95 py-4 backdrop-blur">
                            <Button type="submit" disabled={isSaving} className="bg-zinc-950 px-6 text-white hover:bg-zinc-800">
                                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                {isSaving ? "Saving" : "Save Applicant"}
                            </Button>
                        </div>
                    </div>

                    <DialogComponent diaLogIndex={educationDialogIndex} diaLogTitle="Education Details" diaLogDescription="  Add education history with qualification type, name, and completion date." 
                        onOpenChange={()=> {setEducationDialogIndex(null)}}
                        onRemoveChange={(educationDialogIndex) => {
                                if(educationDialogIndex !== null) {
                                    removeEducation(educationDialogIndex)
                                }
                        }}>

                        {educationDialogIndex !== null && (
                            <div className="space-y-8">
                            <FormSelect control={form.control} path={`educations.${educationDialogIndex}.qualificationType`} label="Qualification Type" placeHolder="Enter Qualification Type" options={QualificationType} className="w-full"/> 
                            <FormsInput control={form.control} path={`educations.${educationDialogIndex}.qualificationName`} label="Qualification Name" placeHolder="Enter Qualification Name" className="w-full"/> 
                            <FormsInput control={form.control} path={`educations.${educationDialogIndex}.institutionName`} label="Institution Name" placeHolder="Enter Institution Name" />
                            <FormsInput control={form.control} type="date" path={`educations.${educationDialogIndex}.completionDate`} label="Completion Date" />
                            </div>)}

                    </DialogComponent>

                    <DialogComponent diaLogIndex={experienceDialogIndex} diaLogTitle="Experience Detail" diaLogDescription="Capture the role, dates, and a short description."
                        onOpenChange={()=> {setExperienceDialogIndex(null)}}  
                        onRemoveChange={(experienceDialogIndex) => {
                            if(experienceDialogIndex !== null) {
                                removeExperience(experienceDialogIndex)
                            }   
                        }}>
                        {experienceDialogIndex !== null && (
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormsInput control={form.control} path={`experiences.${experienceDialogIndex}.companyName`} label="Company Name" placeHolder="Company name" />
                            <FormsInput control={form.control} path={`experiences.${experienceDialogIndex}.position`} label="Position" placeHolder="Position" />
                            <FormsInput control={form.control} type="date" path={`experiences.${experienceDialogIndex}.joinedDate`} label="Joined Date" />
                            <FormsDate control={form.control} path={`experiences.${experienceDialogIndex}.leftDate`} label="Left Date" disable={currentExperience}/>
                            <FormsCheckBox control={form.control} path={`experiences.${experienceDialogIndex}.currentlyWorking`}  label="Currently working here" description="Leave the left date empty and show this role as present." 
                                        className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 md:col-span-2" action={() =>  {form.setValue(`experiences.${experienceDialogIndex}.leftDate`, "")}} />
                            <FormsTextAreaInput control={form.control} path={`experiences.${experienceDialogIndex}.experienceDescription`} label="Description" placeHolder="What did you work on?" rowHeight="min-h-[80px]" className="col-span-2" />
                        </div>)}
                    </DialogComponent>

                    <DialogComponent diaLogIndex={skillDialogIndex}  diaLogTitle="Skill Detail" diaLogDescription="Choose the skill type and enter the skill name." 
                        onOpenChange={() => {setSkillDialogIndex(null)}}
                        onRemoveChange={(skillDialogIndex) => {
                            if(skillDialogIndex !== null) {    
                                removeSkill(skillDialogIndex)
                            }
                        }}>
                        
                        {skillDialogIndex !== null && (
                        <div className="grid gap-5">
                            <FormSelect control={form.control} path={`skills.${skillDialogIndex}.skillType`} label="Skill Type" placeHolder="Enter Skill Type" options={SkillType} />
                            <FormsInput control={form.control} path={`skills.${skillDialogIndex}.skillName`} label="Skill Name" placeHolder="Enter Skill Name" />
                        </div>
                        )}
                    </DialogComponent>

                    <DialogComponent diaLogIndex={languageDialogIndex} diaLogTitle="Language Detail"  diaLogDescription="Add one language at a time." 
                        onOpenChange={() => {setLanguageDialogIndex(null)}}
                        onRemoveChange={(languageDialogIndex) => {
                                if(languageDialogIndex !== null) {
                                    removeLanguage(languageDialogIndex)
                                }
                            }}>
                        {languageDialogIndex != null &&  
                            <div className="grid gap-5">
                                <FormsInput control={form.control} path={`languages.${languageDialogIndex}.languageName`} label="Language" placeHolder="Enter Language Name" />
                                <FormSelect control={form.control} path={`languages.${languageDialogIndex}.languageLevel`} label="Language Level" placeHolder="Enter Language Level" options={LanguageLevel} />
                            </div>
                        }
                    </DialogComponent>
                </form>
            </Form>
    </section>)
}
