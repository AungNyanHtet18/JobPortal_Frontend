'use client'

import { useEffect, useMemo, useState } from "react"
import FormsInput from "@/components/fields/form-input"
import FormsTextAreaInput from "@/components/fields/form-textarea"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PageTitle from "@/components/widgets/page-title"
import { CompanyForm, CompanyPayload, CompanySchema } from "@/lib/type/schema/company/company.schema"
import { formatFileSize, safeCall } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Building, Building2, Camera, Globe, ImagePlus, Loader2, MapPin, Phone, Save, Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as Company from "@/lib/actions/company/company.action"
import InputComponent from "@/components/widgets/input-component"
import ContentLayout from "@/components/widgets/content-layout"
import FormSelect from "@/components/fields/form-select"
import { IndustryType } from "@/lib/type/type"

export default function CompanyEditComponent({id} : {id: string}) {
     
    const router = useRouter()
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [uploadedProfileUrl, setUploadedProfileUrl] = useState<string>()
    const [profileImageFailed, setProfileImageFailed] = useState(false)
    const profilePreview = useMemo(() => profileImage ? URL.createObjectURL(profileImage) : undefined, [profileImage]) //URL.createObjectURL(file) creates a temporary URL that points to the file data in memory.  
    const visibleProfileImage = profilePreview || (!profileImageFailed ? uploadedProfileUrl : undefined)

    const form = useForm<CompanyForm>({
            resolver: zodResolver(CompanySchema),
            defaultValues: {
                industryType: "",
                companyName: "",
                location: "",
                phone: "",
                websiteUrl: "",
                description: ""
            }
    })

    useEffect(() => {
        return () => {
            // cleanup the old URL when the component unmounts or profileImage changes
            if(profilePreview) {
                URL.revokeObjectURL(profilePreview)
            }
        }
    }, [profilePreview])

    useEffect(() => {
         async function load() {
             await safeCall(async () => {
                 const result = await Company.findByCompanyName()
                 console.log(result);
                 if(result) {
                     setUploadedProfileUrl(await Company.getCompanyProfileImageUrl(result.profileImage))
                     setProfileImageFailed(false)

                     form.reset({
                        industryType: result.industryType,
                        companyName: result.companyName,
                        location: result.location,
                        phone: result.phone || "",
                        websiteUrl: result.websiteUrl || "",
                        description: result.description
                     })
                 }
            })

            setIsLoading(false)
         }

         load()
    },[id, form])

    async function  save(form: CompanyForm) {
        setIsSaving(true)

        const payload = new FormData()
        payload.append("form", JSON.stringify(CompanyPayload(form)))

        if(profileImage) {
            payload.append("file", profileImage)
        }

        await safeCall(async () =>  {
            await Company.updateCompany(id, payload)
            router.replace("/companyaccount/detail")
        })

        setIsSaving(false)
    }

    return (
        <section className="mx-auto max-w-7xl space-y-6 px-1 pb-8 text-zinc-950">
            <PageTitle icon="Building2" title="Company Edit" description="Review and update your company profile"/>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(save)} className="grid gap-6 lg:grid-cols-[340px_1fr]">
                    <aside className="space-y-4">
                        <ContentLayout title="Profile Photo" icon={<Camera className="size-5 text-zinc-900" />}>
                            <div className="space-y-4">
                                <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-zinc-300 bg-zinc-50">
                                    {visibleProfileImage && (
                                        <img src={visibleProfileImage} alt="Company profile"
                                            className="size-full object-cover" onError={() => setProfileImageFailed(true)}/>
                                    )}

                                    {!visibleProfileImage && (
                                        <div className="flex flex-col items-center gap-2 text-zinc-500">
                                            <ImagePlus className="size-8" />
                                            <span className="text-sm font-medium">Current profile</span>
                                        </div>
                                    )}
                                </div>

                                <Input id="edit-company-profile-image" type="file" accept="image/*"
                                       className="hidden" onChange={(event) => setProfileImage(event.target.files?.[0] ?? null)} />

                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" className="flex-1 border-zinc-900 bg-white text-zinc-950 hover:bg-zinc-100" asChild>
                                        <Label htmlFor="edit-company-profile-image" className="cursor-pointer">
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

                    </aside> 

                    <div className="space-y-6">
                        <InputComponent title="Company Information" icon={<Building className="size-5 text-zinc-900" />} >
                            <FormSelect control={form.control} path="industryType" label="Industry Type" placeHolder="Enter Industry Type" options={IndustryType} />
                            <FormsInput control={form.control} path="companyName" label="Company Name" placeHolder="Enter your company name" />
                            <FormsTextAreaInput control={form.control} path="description" label="Description" placeHolder="Please fill your company description" rowHeight="min-h-[140px]" />
                        </InputComponent>

                        <InputComponent title="Website" className="md:grid-cols-2" icon={<Globe className="size-5 text-zinc-900" />}>
                            <FormsInput control={form.control} path="websiteUrl" label="Website URL" placeHolder="https://example.com" />
                            <FormsInput control={form.control} path="phone" label="Phone" placeHolder="Enter 10 digit phone number" />
                        </InputComponent>

                        <InputComponent title ="Location And Contact" className="md:grid-cols-2" icon={<MapPin className="size-5 text-zinc-900" />}>
                            <FormsTextAreaInput control={form.control} path="location" label="Location" placeHolder="Enter your company location" rowHeight="min-h-[96px]" />
                            <div className="mt-5 flex items-center rounded-lg border border-zinc-100 bg-zinc-50 p-3">
                                <div className="flex gap-3">
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                                        <Phone className="size-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-medium text-zinc-950">Company Contact</p>
                                        <p className="text-xs text-zinc-500">Use a reachable phone number for applicant inquiries.</p>
                                    </div>
                                </div>
                            </div>
                        </InputComponent>

                        <div className="sticky bottom-0 flex justify-end border-t border-zinc-200 bg-gray-50/95 py-4 backdrop-blur">
                            <Button type="submit" disabled={isSaving || isLoading} className="bg-zinc-950 px-6 text-white hover:bg-zinc-800">
                                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                {isSaving ? "Saving" : "Save Company"}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </section>
    )
}
