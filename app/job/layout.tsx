import ApplicantNavigation from "@/components/widgets/applicant-navigation";
import CompanyNavigation from "@/components/widgets/company-navigation";
import { findByCompany } from "@/lib/actions/company/company.action";
import { getCompanyId } from "@/lib/login-users";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Job Portal | Job Page",
    description: "Job List Features  of Job Portal Page"
};


export default async function CompanyLayout({children} : {children: React.ReactNode}) {
    
    const companyId = await getCompanyId()

    return (
        <>
            {companyId ?  <CompanyNavigation/> : <ApplicantNavigation/> }
            <main className="px-4 py-4 bg-gray-50 min-h-screen">
                {children}
            </main>
        </>
    )
}