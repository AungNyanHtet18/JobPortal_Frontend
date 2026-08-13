import ApplicantDetailsComponent from "../../../applicant/_client/applicant-details-component";

export default async function ApplicantProfilePage({params}: {params: Promise<{id: string}> }) {
  
  const {id} = await params
  
  return (
        <section className="space-y-6">
            <ApplicantDetailsComponent applicantId={id}/>
        </section>
      )
}
