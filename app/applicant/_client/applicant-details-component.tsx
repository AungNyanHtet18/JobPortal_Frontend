'use client'

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Loading from "@/components/widgets/loading"
import { ApplicantDetails } from "@/lib/type/schema/applicant/applicant.schema"
import { getFileName, getInitials, safeCall } from "@/lib/utils"
import * as applicantClient from "@/lib/actions/applicant/applicant.action"
import * as authClient from "@/lib/actions/auth.action"
import { Calendar, FileText, Mail, MapPin, Phone} from "lucide-react"
import PageDetailComponent from "@/components/widgets/page-detail.component"

export default function ApplicantDetailsComponent({applicantId} : {applicantId?: string}) {
    const [details, setDetails] = useState<ApplicantDetails>()
    const [profileImageUrl, setProfileImageUrl] = useState<string>()
    const [profileImageFailed, setProfileImageFailed] = useState(false)
    const resumeFileName = useMemo(() => getFileName(details?.resume ?? null), [details?.resume]) //Only run getFileName() again when details.resume changes.
    
    useEffect(() => {
        function load() {
            safeCall(async () => {

                //Show Account Information
                //Checking account active to show default
                //Use tenary operator when adding feature for applicant Id
                const status = await authClient.checkRoleStatus()
                
                if(!status.id) {
                    const loginUser  = await authClient.findByLoginUser()
                    setDetails({
                        id: 'undefined',
                        name: loginUser.name,
                        email: loginUser.email,
                        gender: null,
                        skills: [],
                        experience: [],
                        highestEducationalAttainment: 'undefined',
                        professionalSummary: 'undefined',
                        contactDetail: 'undefined',
                        address: 'undefined',
                        profileImage: null,
                        resume: null
                        })
                }else {
                    const result = applicantId ? await applicantClient.getApplicantById(applicantId) : await applicantClient.findByApplicantName() 
                
                    if(result !== null) {
                        setDetails(result)
                        setProfileImageUrl(await applicantClient.getApplicantProfileImageUrl(result.profileImage))
                        setProfileImageFailed(false)
                    }
                }
            })
        }

        load()
    }, [])
    
    const visibleProfileImage = profileImageUrl && !profileImageFailed

    if (!details) {
        return <Loading />
    }

    return (
        <section className="mx-auto max-w-7xl space-y-6 px-1 pb-8 text-zinc-950">
            <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
                <aside className="space-y-4">
                    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                            <div className="flex aspect-[4/5] items-center justify-center bg-zinc-100">
                                {visibleProfileImage ? (
                                    <img
                                        src={profileImageUrl}
                                        alt={`${details.name} profile`}
                                        className="size-full object-cover"
                                        onError={() => setProfileImageFailed(true)}
                                    />
                                ) : (
                                    <div className="flex size-24 items-center justify-center rounded-full bg-zinc-950 text-3xl font-semibold text-white">
                                        {getInitials(details.name)}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-5 space-y-2">
                            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">{details.name}</h1>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="border-zinc-300 bg-white text-zinc-900">
                                    {details.gender}
                                </Badge>
                                {details.highestEducationalAttainment && (
                                    <Badge className="bg-zinc-950 text-white hover:bg-zinc-800">
                                        {details.highestEducationalAttainment}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-2">
                            <Phone className="size-5 text-zinc-900" />
                            <h2 className="text-base font-semibold">Contact</h2>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div className="flex gap-3">
                                <Mail className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                                <span className="break-all text-zinc-800">{details.email}</span>
                            </div>
                            <Separator />
                            <div className="flex gap-3">
                                <Phone className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                                <span className="text-zinc-800">{details.contactDetail}</span>
                            </div>
                            <Separator />
                            <div className="flex gap-3">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                                <span className="text-zinc-800">{details.address}</span>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="space-y-6">
                    <PageDetailComponent title="Professional Summary" icon="User">
                         <p className="whitespace-pre-line text-sm leading-7 text-zinc-700">
                            {details.professionalSummary || "No professional summary added."}
                        </p>
                    </PageDetailComponent>

                    <PageDetailComponent title="Work Experience" icon="Briefcase">
                        {details.experience.length > 0 ? (
                            <div className="space-y-4">
                                {details.experience.map((exp) => (
                                    <div key={exp.id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h3 className="font-semibold text-zinc-950">{exp.companyName}</h3>
                                                <p className="text-sm text-zinc-600">{exp.position}</p>
                                            </div>
                                            <div className="inline-flex items-center gap-1 text-sm text-zinc-500">
                                                <Calendar className="size-4" />
                                                {exp.years || "Present"}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500">No work experience added.</p>
                        )}
                    </PageDetailComponent>

                    <div className="grid gap-6 xl:grid-cols-3">

                        <PageDetailComponent title="Skill" icon="Wrench">
                            <div className="flex flex-wrap gap-2">
                                {details.skills.length > 0 ? details.skills.map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="text-[14px]  border border-zinc-200 bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
                                        {skill}
                                    </Badge>
                                )) : (
                                    <p className="text-sm text-zinc-500">No skills added.</p>
                                )}
                            </div>
                        </PageDetailComponent>

                        <PageDetailComponent title="Education" icon="GraduationCap">
                            <p className="text-sm leading-7 text-zinc-700">
                                {details.highestEducationalAttainment || "No education added."}
                            </p>
                        </PageDetailComponent>

                        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-2">
                                <FileText className="size-5 text-zinc-900" />
                                <h2 className="text-base font-semibold">Resume</h2>
                            </div>
                            <div className="flex  gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                                    <FileText className="size-5" />
                                </div>
                                <div>
                                    <p className="truncate text-sm font-medium text-zinc-950">{resumeFileName}</p>
                                    <p className="text-xs text-zinc-500">Uploaded resume file</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}