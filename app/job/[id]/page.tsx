import JobDetailsComponent from "../_client/job-details-component"

export default async function JobDetailPage({params}: {params: Promise<{id: string}>}) {
     const {id} = await params
     return <JobDetailsComponent jobId={id} />
}
