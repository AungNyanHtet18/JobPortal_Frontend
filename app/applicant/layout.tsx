import ApplicantNavigation from "@/components/widgets/applicant-navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Job Portal | Applicant Page",
    description: "Appliant Feature  of Job Portal Page"
};

export default async function ApplicantLayout({children} : {children: React.ReactNode}) {
     
    return (
        <>
            <ApplicantNavigation/>
            <main className="px-4 py-4 bg-gray-50 min-h-screen">
                {children}
            </main>
        </>
    )
}