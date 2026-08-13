import CompanyDetailsComponent from "@/app/companyaccount/_client/company-details-component"

export default async function CompanyProfilePage({params} : {params: Promise<{id: string}>}) {
     
    const {id} = await params

    return (
        <section className="space-y-6">
             <CompanyDetailsComponent companyId={id}/> 
        </section>
    )
}