'use client'

import { useEffect, useMemo, useState } from "react";
import FormsInput from "@/components/fields/form-input";
import FormsTextAreaInput from "@/components/fields/form-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageTitle from "@/components/widgets/page-title";
import * as Company from "@/lib/actions/company/company.action";
import { CompanyForm, CompanySchema } from "@/lib/type/schema/company/company.schema";
import { formatFileSize, safeCall } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Globe, ImagePlus, Loader2, MapPin, Phone, Save, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import InputComponent from "@/components/widgets/input-component";
import ContentLayout from "@/components/widgets/content-layout";

export default function CompanyCreateComponent() {
     
    const router = useRouter()
    const [profileImage, setProfileImage] = useState<File | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const profilePreview = useMemo(() => profileImage ? URL.createObjectURL(profileImage) : undefined, [profileImage])

    const form = useForm<CompanyForm>({
         resolver: zodResolver(CompanySchema),
         defaultValues: {
             companyName: "",
             location: "",
             phone: "",
             websiteUrl: "",
             description: ""
         }
    })

    useEffect(() => {
        return () => {
            if(profilePreview) {
                URL.revokeObjectURL(profilePreview)
            }
        }
    }, [profilePreview])


    const CompanyPayload = (form: CompanyForm) => {
        return {
            companyName: form.companyName.trim(),
            location: form.location.trim(),
            phone: form.phone.trim(),
            websiteUrl: form.websiteUrl?.trim() || "",
            description: form.description.trim()
        }
   }


    async function save(form: CompanyForm) {
        setIsSaving(true)

        const payload = new FormData()
        payload.append("form", JSON.stringify(CompanyPayload(form)))

        if(profileImage) {
            payload.append("file", profileImage)
        }

        await safeCall(async () =>  {
            await Company.createCompany(payload)
            router.replace("/companyaccount/detail")
        })

        setIsSaving(false)
    }

    return (
        <section className="mx-auto max-w-7xl space-y-6 px-1 pb-8 text-zinc-950">
            <PageTitle icon="Building2" title="Company Create" description="Create a complete company profile"/>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(save)} className="grid gap-6 lg:grid-cols-[340px_1fr]">
                    <aside className="space-y-4">
                        <ContentLayout title="Profile" icon={<Building2 className="size-5 text-zinc-900" />} >
                            <div className="space-y-3">
                                <div className="flex aspect-[4/5] w-full items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 bg-cover bg-center"
                                     style={profilePreview ? {backgroundImage: `url(${profilePreview})`} : undefined}>
                                     {!profilePreview && (
                                        <div className="flex flex-col items-center gap-2 text-zinc-500">
                                            <ImagePlus className="size-8" />
                                            <span className="text-sm font-medium">Company image</span>
                                        </div>
                                    )}
                                </div>

                                <Input id="company-profile-image"
                                       type="file"
                                       accept="image/*"
                                       className="hidden"
                                       onChange={(event) => setProfileImage(event.target.files?.[0] ?? null)} />

                                <div className="flex gap-2">
                                    <Button type="button" variant="outline" className="flex-1 border-zinc-900 bg-white text-zinc-950 hover:bg-zinc-100" asChild>
                                        <Label htmlFor="company-profile-image" className="cursor-pointer">
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
                        <InputComponent title="Company Information" icon={<Building2 className="size-5 text-zinc-900" />} >
                            <FormsInput control={form.control} path="companyName" label="Company Name" placeHolder="Enter your company name" />
                            <FormsTextAreaInput control={form.control} path="description" label="Description" placeHolder="Please fill your company description" rowHeight="min-h-[140px]" />
                        </InputComponent>

                        <InputComponent className="md:grid-cols-2" title="Website" icon={<Globe className="size-5 text-zinc-900" />}>
                            <FormsInput control={form.control} path="websiteUrl" label="Website URL" placeHolder="https://example.com" />
                            <FormsInput control={form.control} path="phone" label="Phone" placeHolder="Enter 10 digit phone number" />
                       </InputComponent>

                        <InputComponent className="md:grid-cols-2" title="Location And Contact" icon={<MapPin className="size-5 text-zinc-900" />} >
                            <FormsTextAreaInput control={form.control} path="location" label="Location" placeHolder="Enter your company location" rowHeight="min-h-[96px]" />
                            <div className="flex items-center rounded-lg border border-zinc-100 bg-zinc-50 mt-5 p-3">
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
                            <Button type="submit" disabled={isSaving} className="bg-zinc-950 px-6 text-white hover:bg-zinc-800">
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
