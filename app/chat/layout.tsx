import ApplicantNavigation from "@/components/widgets/applicant-navigation";
import CompanyNavigation from "@/components/widgets/company-navigation";
import { getLoginUser } from "@/lib/login-users";
import { LoginUser } from "@/lib/type/schema/auth.schema";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Job Portal | Job Page",
    description: "Chat Feature  of Job Portal Page"
};

export default async function ChatLayout({children} : {children: React.ReactNode}) {
    const loginUser:LoginUser = await getLoginUser()

    return (
        <div className="flex h-screen w-full flex-col">
            {loginUser.role === 'Applicant' ? 
            <ApplicantNavigation/> : <CompanyNavigation/> }
            <main className="px-4 py-4 flex-1 min-h-0 bg-gray-50  overflow-hidden">
               {children}
            </main>
        </div>
    )
}
