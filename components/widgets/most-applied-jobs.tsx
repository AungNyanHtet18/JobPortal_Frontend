import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MostAppliedJobListItem } from "@/lib/type/schema/admin/dashboard.schema"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, Trophy } from "lucide-react"

type MostAppliedJobsProps = {
    jobs: MostAppliedJobListItem[] | undefined
    loading: boolean
}

export function MostAppliedJobs({ jobs, loading }: MostAppliedJobsProps) {
    const maxApplications = jobs && jobs.length > 0 ? Math.max(...jobs.map(j => j.totalApplications)) : 1

    if (loading) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-1"> 
                    <Trophy className="size-5" />
                    Most Applied Jobs
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {jobs && jobs.map((job) => {
                    const percentage = (job.totalApplications / maxApplications) * 100

                    return (
                        <div key={job.jobId} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-zinc-800 truncate flex-1 mr-4" title={job.jobTitle}>
                                    {job.jobTitle}
                                </span>
                                <span className="text-sm font-bold text-zinc-600">
                                    {job.totalApplications}
                                </span>
                            </div>
                            <div className="w-full bg-zinc-100 rounded-full h-3 overflow-hidden">
                                <div className="bg-gradient-to-r from-zinc-600 to-zinc-800 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}/>
                            </div>
                        </div>
                    )
                })}

                {(!jobs || jobs.length === 0) && (
                    <p className="text-zinc-500 text-center py-8">No job applications found.</p>
                )}
            </CardContent>
        </Card>
    )
}
