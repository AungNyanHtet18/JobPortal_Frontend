'use client'

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Loading from "@/components/widgets/loading"
import { ApplicantCareerRoleDetails, ApplicantDetails, ApplicantEducationDetails, ApplicantExperienceDetails, ApplicantLanguageDetails, ApplicantSkillDetails, ApplicantSocialLinkDetails } from "@/lib/type/schema/applicant/applicant.schema"
import { formatDate, getFileName, getInitials, safeCall } from "@/lib/utils"
import * as applicantClient from "@/lib/actions/applicant/applicant.action"
import * as authClient from "@/lib/actions/auth.action"
import { Calendar, ExternalLink, FileText, Loader2, Mail, MapPin, MessageCircle, Phone, UserRoundPlus, Users, UsersRound } from "lucide-react"
import PageDetailComponent from "@/components/widgets/page-detail-component"
import { IconType } from "@/lib/type/type"
import PageTitle from "@/components/widgets/page-title"
import { Button } from "@/components/ui/button"
import { checkFollowAccountStatus, followAccount, unfollowAccount } from "@/lib/actions/follow/account.follow.action"
import { toast } from "sonner"

export default function ApplicantDetailsComponent({ applicantId }: { applicantId?: string }) {
        const [details, setDetails] = useState<ApplicantDetails>()
        const [profileImageUrl, setProfileImageUrl] = useState<string>()
        const [profileImageFailed, setProfileImageFailed] = useState(false)
        const [isFollow, setIsFollow] = useState<boolean>(false)
        const [isLoading, setIsLoading] = useState<boolean>(false)
        const resumeFileName = useMemo(() => getFileName(details?.resume ?? null), [details?.resume])
        const cvFormFileName = useMemo(() => getFileName(details?.cvForm ?? null), [details?.cvForm])

        useEffect(() => {
            function load() {
                safeCall(async () => {
                    const status = await authClient.checkRoleStatus()

                    if (!status.id) {
                        const loginUser = await authClient.findByLoginUser()
                        setDetails({
                            id: 'undefined',
                            name: loginUser.name,
                            email: loginUser.email,
                            followerCount: 0,
                            followingCount: 0,
                            gender: undefined,
                            professionalSummary: 'undefined',
                            contactDetail: 'undefined',
                            address: 'undefined',
                            experience: [],
                            socialLink: [],
                            education: [],
                            careerRole: [],
                            skill: [],
                            language: [],
                            profileImage: null,
                            resume: null,
                            cvForm: null
                        })
                    } else {
                        const result = applicantId ? await applicantClient.getApplicantById(applicantId) : await applicantClient.findByApplicantName()
                        
                        if(applicantId) {
                            const checkFollowStatus = await checkFollowAccountStatus(Number(applicantId))
                            setIsFollow(checkFollowStatus.id)
                        }

                        setDetails(result)
                        setProfileImageUrl(await applicantClient.getApplicantProfileImageUrl(result.profileImage))
                        setProfileImageFailed(false)
                        
                    }
                })
            }

            load()
        }, [applicantId])

        const followAction = async (followingId: number) => {
            setIsLoading(true)
            await safeCall(async () => {
                const result =  await followAccount(followingId)
                toast.success(result.id)
            })
            setIsFollow(true)
            setIsLoading(false)
        }

         const unFollowAction = async (followingId: number) => {
            setIsLoading(true)
            await safeCall(async () => {
                const result =  await unfollowAccount(followingId)
                toast.success(result.id)
            })
            setIsFollow(false)
            setIsLoading(false)
        }       

    if (!details) {
        return <Loading content="Loading Applicant Details" />
    }
        
        return (
            <section className="mx-auto max-w-7xl space-y-6 px-1 pb-8 text-zinc-950">
                <PageTitle icon="Contact" title="Applicant Profile" description="View applicant profile information" />

                <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
                    <aside className="space-y-4">
                        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                                <div className="flex aspect-[4/5] items-center justify-center bg-zinc-100">
                                    {profileImageFailed ? (
                                        <div className="flex size-24 items-center justify-center rounded-full bg-zinc-950 text-3xl font-semibold text-white">
                                            {getInitials(details.name)}
                                        </div>
                                    ):(<img
                                        src={profileImageUrl}
                                        alt={`${details.name} profile`}
                                        className="size-full object-cover"
                                        onError={() => setProfileImageFailed(true)}/>
                                    )}
                                </div>
                            </div>

                            <div className="mt-5 space-y-2">
                                <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
                                    {details.name}
                                    
                                    {details.gender && (
                                    <Badge variant="outline" className="ms-2 text-lg font-medium border-zinc-300 bg-white text-zinc-900 cursor-pointer">
                                        {details.gender}
                                    </Badge>
                                    )}
                                </h1>
                                <div className="flex flex-wrap gap-2">
                                     {details.careerRole &&  details.careerRole.slice(0, 2).map((role) => (
                                    <Badge key={role.roleName} className="bg-zinc-100 text-zinc-950  hover:bg-zinc-200 cursor-pointer">
                                        {role.roleName}
                                    </Badge>
                                    ))}
                                </div>

                                <div className="flex flex items-center gap-2">
                                    <Badge className="bg-zinc-950 text-white hover:bg-zinc-800 cursor-pointer">
                                        <Users className="size-5"/> {details.followerCount} Follower
                                    </Badge>
                                    
                                    <Badge className="bg-zinc-950 text-white hover:bg-zinc-800 cursor-pointer">
                                        <UsersRound className="size-5"/> {details.followingCount} Following 
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-3 w-full">
                                    {applicantId && isFollow ?  
                                    <Button variant="default" className="flex-1 bg-zinc-100 border-2 border-zinc-900 hover:bg-zinc-400 rounded-md"
                                        onClick={() => unFollowAction(Number(applicantId))}>
                                        {isLoading ? <Loader2 className="size-5 animate-spin font-bold text-zinc-900" /> : <UserRoundPlus className=" size-5 font-bold text-zinc-900" /> }
                                        <h2 className="text-zinc-900 font-semibold">{isLoading ? 'Loading' : 'UnFollow'}</h2>
                                    </Button> 
                                    :
                                    <Button variant="default" className="flex-1 bg-zinc-100 border-2 border-zinc-900 hover:bg-zinc-400 rounded-md"
                                        onClick={() => followAction(Number(applicantId))}>
                                        {isLoading ? <Loader2 className="size-5 animate-spin font-bold text-zinc-900" /> : <UserRoundPlus className=" size-5 font-bold text-zinc-900" /> }
                                        <h2 className="text-zinc-900 font-semibold">{isLoading ? 'Loading' : 'Follow'}</h2>
                                    </Button> 
                                    }
                                    
                                    <Button variant="outline" className="flex-1 bg-zinc-900 hover:bg-zinc-800 rounded-md border-none ">
                                        <MessageCircle className=" size-5 font-bold text-zinc-100" />
                                        <h2 className="text-zinc-100 font-semibold">Chat</h2>
                                    </Button>
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
                                    <span className="text-zinc-800">{details.contactDetail ||  "No contact added"}</span>
                                </div>

                                <Separator />

                                <div className="flex gap-3">
                                    <MapPin className="mt-0.5 size-4 shrink-0 text-zinc-500" />
                                    <span className="text-zinc-800">{details.address ||  "No address added"}</span>
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

                        <ExperienceSection experience={details.experience} />

                        <div className="grid lg:grid-cols-2 gap-6">
                            <CareerRoleSection careerRole={details.careerRole} />
                            <SocialLinkSection socialLink={details.socialLink } />
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6">
                            <SkillSection skill={details.skill} />
                            <LanguageSection language={details.language} />
                        </div>

                        <EducationSection education={details.education} />

                        <div className="grid  lg:grid-cols-2 gap-6">
                            <DocumentCard title="Resume" fileName={resumeFileName} description="Uploaded resume file" icon="FileText" />
                            <DocumentCard title="CV Form" fileName={cvFormFileName} description="Uploaded CV form file" icon="FilePen" />
                        </div>
                    </div>                    
                </div>
            </section>
        )
    }

    function ExperienceSection({ experience }: { experience?: ApplicantExperienceDetails[] }) {
        return (
            <PageDetailComponent title="Work Experience" icon="Briefcase">
                {experience && experience.length > 0 ? (
                    <div className="space-y-4">
                        {experience.map((exp) => (
                            <div key={exp.id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                <div className="flex md:flex-row md:items-start md:justify-between  gap-3">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-zinc-950">{exp.position}</h3>
                                        <p className="text-sm text-zinc-600">{exp.companyName}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-zinc-500">
                                        <Calendar className="size-4" />
                                        {formatDateRange(exp)}
                                    </div>
                                </div>

                                {exp.experienceDescription && (
                                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-700">
                                        {exp.experienceDescription}
                                    </p>
                                )}

                                {exp.currentlyWorking && (
                                    <Badge variant="outline" className="mt-3 border-zinc-300 bg-white text-zinc-900">
                                        Currently working
                                    </Badge>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-zinc-500">No work experience added.</p>
                )}
            </PageDetailComponent>
        )
    }

    function CareerRoleSection({ careerRole }: { careerRole?: ApplicantCareerRoleDetails[] }) {
        return (
            <PageDetailComponent title="Career Role" icon="BriefcaseBusiness">
                <div className="flex flex-wrap gap-2">
                    {careerRole && careerRole.length > 0 ? careerRole.map((role) => (
                        <Badge key={role.roleName} variant="secondary" className="border border-zinc-200 bg-zinc-100 text-[14px] text-zinc-900 hover:bg-zinc-200">
                            {role.roleName}
                        </Badge>
                    )) : (
                        <p className="text-sm text-zinc-500">No career roles added.</p>
                    )}
                </div>
            </PageDetailComponent>
        )
    }

    function SocialLinkSection({ socialLink }: { socialLink?: ApplicantSocialLinkDetails[] }) {
        return (
            <PageDetailComponent title="Social Links" icon="Link">
                {socialLink && socialLink.length > 0 ? (
                    <div className="space-y-3">
                        {socialLink.map((link) => (
                            <a  key={`${link.platform}-${link.url}`}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition hover:bg-zinc-100">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                                    <ExternalLink className="size-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-zinc-950">{link.platform}</p>
                                    <p className="truncate text-xs text-zinc-500">{link.url}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-zinc-500">No social links added.</p>
                )}
            </PageDetailComponent>
        )
    }

    function SkillSection({ skill }: { skill?: ApplicantSkillDetails[] }) {
        return (
            <PageDetailComponent title="Skill" icon="Wrench">
                <div className="space-y-4">
                    {skill && skill.length > 0 ? (
                        <>
                            <SkillGroup title="Hard Skill" skills={skill.filter((item) => item.skillType === "Hard Skill")} />
                            <SkillGroup title="Soft Skill" skills={skill.filter((item) => item.skillType === "Soft Skill")} />
                        </>
                    ) : (
                        <p className="text-sm text-zinc-500">No skills added.</p>
                    )}
                </div>
            </PageDetailComponent>
        )
    }

    function SkillGroup({ title, skills }: { title: string, skills: ApplicantSkillDetails[] }) {
        if (skills.length === 0) {
            return 
        }

        return (
            <div>
                <p className="mb-2 text-xs uppercase text-zinc-500">{title}</p>
                <div className="flex flex-wrap gap-2">
                    {skills.map((item) => (
                        <Badge key={`${item.skillType}-${item.skillName}`} variant="secondary" className="border border-zinc-200 bg-zinc-100 text-[14px] text-zinc-900 hover:bg-zinc-200">
                            {item.skillName}
                        </Badge>
                    ))}
                </div>
            </div>
        )
    }

    function LanguageSection({ language }: { language?: ApplicantLanguageDetails[] }) {
        return (
            <PageDetailComponent title="Language" icon="Languages">
                {language && language.length > 0 ? (
                    <div className="space-y-3">
                        {language.map((item) => (
                            <div key={`${item.languageName}-${item.languageLevel}`} className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                <p className="text-sm font-medium text-zinc-950">{item.languageName}</p>
                                <Badge variant="outline" className="shrink-0 border-zinc-300 bg-white text-zinc-900">
                                    {item.languageLevel}
                                </Badge>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-zinc-500">No languages added.</p>
                )}
            </PageDetailComponent>
        )
    }

    function EducationSection({ education }: { education?: ApplicantEducationDetails[] }) {
        return (
            <PageDetailComponent title="Education" icon="GraduationCap">
                {education && education.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {education.map((item) => (
                            <div key={`${item.qualificationName}-${item.institutionName}`} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <h3 className="font-semibold text-zinc-950">{item.qualificationName}</h3>
                                        <p className="mt-1 text-sm text-zinc-600">{item.institutionName}</p>
                                    </div>
                                    <Badge variant="outline" className="w-fit shrink-0 border-zinc-300 bg-white text-zinc-900">
                                        {item.qualificationType}
                                    </Badge>
                                </div>
                                <div className="mt-4 inline-flex items-center gap-1 text-sm text-zinc-500">
                                    <Calendar className="size-4" />
                                    {formatDate(item.completionDate)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-zinc-500">No education added.</p>
                )}
            </PageDetailComponent>
        )
    }

    function DocumentCard({ title, fileName, description, icon }: { title: string, fileName: string, description: string, icon: IconType }) {
        return (
            <PageDetailComponent title={title} icon={icon}>
                <div className="flex gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white">
                        <FileText className="size-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-950">{fileName}</p>
                        <p className="text-xs text-zinc-500">{description}</p>
                    </div>
                </div>
            </PageDetailComponent>
        )
    }

    function formatDateRange(exp: ApplicantExperienceDetails) {
        const start = formatDate(exp.joinedDate)
        const end = exp.currentlyWorking ? "Present" : formatDate(exp.leftDate)
        return `${start} - ${end}`
    }
