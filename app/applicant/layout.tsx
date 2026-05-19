import Navigation from "@/components/widgets/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Job Portal | Applicant Page",
    description: "Appliant Info  of Job Portal Page"
};

export default async function ApplicantLayout({children} : {children: React.ReactNode}) {
     
    return (
        <>
            <Navigation/>
            <main className="px-4 py-4 bg-gray-50">
                {children}
            </main>
        </>
    )
}