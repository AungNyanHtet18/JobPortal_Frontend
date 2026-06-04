import ApplicantDetailsComponent from "../../../applicant/_client/applicant-details-component";

export default async function CompanyApplicantDetailPage({ params }: { params: Promise<{applicantId: string }> }) {
  
  const {applicantId} = await params
  
  return (
          <section className="space-y-6">
             <ApplicantDetailsComponent applicantId={applicantId}/>
          </section>
  )

}
