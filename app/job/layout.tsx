import AdminNavigation from "@/components/widgets/admin-navigation";
import ApplicantNavigation from "@/components/widgets/applicant-navigation";
import CompanyNavigation from "@/components/widgets/company-navigation";
import { findByCompany } from "@/lib/actions/company/company.action";
import { getCompanyId, getLoginUser } from "@/lib/login-users";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Job Portal | Job Page",
    description: "Job List Features  of Job Portal Page"
};


export default async function JobLayout({children} : {children: React.ReactNode}) {
    
    const loginUsers = await getLoginUser()
    
    return (
        <>
            {loginUsers.role === 'CompanyAccount' ?  
            <CompanyNavigation/> : <ApplicantNavigation/>}
            
            <main className="px-4 py-4 bg-gray-50 min-h-screen">
                {children}
            </main>
        </>
    )
}