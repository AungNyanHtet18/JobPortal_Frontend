import CompanyJobApplicantsComponent from "../_client/job-applicants-component"

export default async function CompanyJobApplicantsPage({ params } : { params: Promise<{applicantlistbyjobId: string }>}) {
  
  const {applicantlistbyjobId} = await params
 
  return <CompanyJobApplicantsComponent jobId={applicantlistbyjobId} />
}
