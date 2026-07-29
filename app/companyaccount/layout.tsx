import CompanyNavigation from "@/components/widgets/company-navigation";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Job Portal | Company Page",
    description: "Companany Features  of Job Portal Page"
};

export default async function CompanyLayout({children} : {children: React.ReactNode}) {
     
    return (
        <>
            <CompanyNavigation/>
            <main className="px-4 py-4 bg-gray-50 min-h-screen">
                {children}
            </main>
        </>
    )
}