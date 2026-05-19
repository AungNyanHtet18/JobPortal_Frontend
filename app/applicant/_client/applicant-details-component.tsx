'use client'

import { ApplicantDetails } from "@/lib/type/schema/applicant/applicant.schema"
import { safeCall } from "@/lib/utils"
import { useEffect, useState } from "react"
import * as applicant from "@/lib/actions/applicant/applicant.action" 
import Loading from "@/components/widgets/loading"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, User, MapPin, Phone, Briefcase, Wrench, FileText,Calendar} from "lucide-react"

export default function ApplicantDetailsComponent() {
    const [details, setDetails] = useState<ApplicantDetails>()

    useEffect(() => {
        function load() {
            safeCall(async () => {
                const result = await applicant.findByName()
                setDetails(result) 
            })
        }
        load()
    }, [])

    if (!details) {
        return <Loading />
    }

    return (
        <div className="max-w-8xl mx-auto p-6 space-y-8 ">
          
            <div className="flex flex-col md:flex-row justify-between  md:items-center gap-4 p-6 rounded-xl shadow- border border-1 border-gray-500  bg-white">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">{details.name}</h1>
                    <div className="flex flex-wrap gap-3 text-slate-500 text-sm">
                        <span className="flex items-center gap-1 text-slate-700">
                            <Mail className="w-4 h-4" /> {details.email}
                        </span>
                        <span className="flex items-center gap-1 text-slate-700">
                            <User className="w-4 h-4" /> {details.gender}
                        </span>
                        <span className="flex items-center gap-1 text-slate-700">
                            <MapPin className="w-4 h-4" /> {details.address}
                        </span>
                    </div>
                </div>
                <Badge variant="outline" className="px-4 py-1 text-base text-white  bg-zinc-600">
                    {details.highestEducationalAttainment}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="p-3 lg:col-span-2 space-y-8  border border-1 border-slate-300 bg-white rounded-xl shadow-sm ">
                    <section className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-900">
                            <FileText className="w-5 h-5 text-black-600" />
                            <h2 className="text-xl font-semibold">Professional Summary</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            {details.professionalSummary}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-900">
                            <Briefcase className="w-5 h-5 text-black-600" />
                            <h2 className="text-xl font-semibold">Work Experience</h2>
                        </div>
                        <div className="space-y-6">
                            {details.experience.map((exp, index) => (
                                <div key={index} className="relative pl-6 border-l-2 border-gray-300 pb-2">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-400 border-2 border-gray-400" />
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-slate-800">{exp.companyName}</h3>
                                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                             {exp.years || 'Present'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">{exp.position}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <Card className="shadow-sm bg-white border border-1 border-gray-300">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Wrench className="w-5 h-5 text-black-600" />
                                Skills
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {details.skills.map((skill, i) => (
                                    <Badge key={i} variant="secondary" className="bg-gray-100 text-gray-900 font-medium hover:bg-gray-300 cursor-pointer border-none">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm bg-white border border-1 border-gray-300">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Phone className="w-5 h-5 text-black-600" />
                                Contact Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-base font-semibold text-gray-500 uppercase tracking-wider">Phone</p>
                                <p className="text-sm text-gray-900">{details.contactDetail}</p>
                            </div>
                            <Separator className="bg-gray-300" />
                            <div className="space-y-1">
                                <p className="text-base font-semibold text-gray-500 uppercase tracking-wider">Education</p>
                                <p className="text-sm text-gray-900">{details.highestEducationalAttainment}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

    
    )
}
