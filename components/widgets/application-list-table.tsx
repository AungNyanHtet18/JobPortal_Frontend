import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ApplicationListItem} from "@/lib/type/schema/admin/dashboard.schema"
import { ChevronLeft, ChevronRight, TrendingUp, Users } from "lucide-react"
import { PageInfo } from "@/lib/type"
import {getStatusBadgeColorForApplication } from "@/lib/type/schema/admin/management.schema"

type ApplicationListTableProps = {
    applications: ApplicationListItem[] | undefined
    pageInfo: PageInfo | undefined
    loading: boolean
    onPageChange: (page: number) => void
}

export function ApplicationListTable({ applications, pageInfo, loading, onPageChange }: ApplicationListTableProps) {
       
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                
                <CardContent>
                    <div className="space-y-4">
                        {[1,2,3,4,5].map(i => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <div className ="flex items-center gap-2">
                        <TrendingUp className="size-5"/>
                         Job Applications
                    </div>
        
                </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-semibold tracking-wider text-center">Job Title</TableHead>
                                <TableHead className="font-semibold tracking-wider">Company</TableHead>
                                <TableHead className="font-semibold tracking-wider">Applicant</TableHead>
                                <TableHead className="font-semibold tracking-wider">Gender</TableHead>
                                <TableHead className="font-semibold tracking-wider">Status</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {applications && applications.map((applicantation, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium text-center">{applicantation.jobTitle}</TableCell>
                                    <TableCell>{applicantation.companyName}</TableCell>
                                    <TableCell>{applicantation.applicantName}</TableCell>
                                    <TableCell>{applicantation.gender}</TableCell>
                                    <TableCell>
                                        <Badge className={getStatusBadgeColorForApplication(applicantation.status)}>
                                            {applicantation.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!applications || applications.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-zinc-500">
                                        No applications found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {pageInfo && pageInfo.totalPage > 1 && (
                    <div className="flex items-center justify-between p-4 border-t">
                        <div className="text-sm text-zinc-500">
                            Showing page {pageInfo.page + 1} of {pageInfo.totalPage}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pageInfo.page === 0}
                                onClick={() => onPageChange(pageInfo.page - 1)}>
                                <ChevronLeft className="size-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={pageInfo.page + 1 >= pageInfo.totalPage}
                                onClick={() => onPageChange(pageInfo.page + 1)}>
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
