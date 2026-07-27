import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Job Portal | Admin Page",
    description: "Admin Features  of Job Portal Page"
};

export default async function JobManagementLayout({children} : {children: React.ReactNode}) {
     return (
        <div className="space-y-6">
            {children}
        </div>
     )
}