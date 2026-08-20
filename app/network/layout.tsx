import ApplicantNavigation from "@/components/widgets/applicant-navigation";
import CompanyNavigation from "@/components/widgets/company-navigation";
import {  getLoginUser } from "@/lib/login-users";
import { LoginUser } from "@/lib/type/schema/auth.schema";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Job Portal | Job Page",
    description: "Job List Features  of Job Portal Page"
};

export default async function NetworkLayout({children} : {children: React.ReactNode}) {
    const loginUser:LoginUser = await getLoginUser()
    return (
        <div className="w-full">
            {loginUser.role === 'Applicant' ? <ApplicantNavigation/> : <CompanyNavigation/> }
            <main className="px-4 py-4 bg-gray-50">
               {children}
            </main>
        </div>
    )
}