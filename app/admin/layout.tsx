import type { Metadata } from "next";
import SideBarNavigation from "@/components/widgets/sidebar-navigation";
import PageTitle from "@/components/widgets/page-title";

export const metadata: Metadata = {
    title: "Job Portal | Admin Page",
    description: "Admin Features  of Job Portal Page"
};

export default async function AdminLayout({children} : {children: React.ReactNode}) {
     
    return (
        <div className="w-full h-screen grid grid-cols-7">
           <SideBarNavigation/>
           <main className="col-span-6 p-6 overflow-auto bg-zinc-50">
                <PageTitle icon="ChartColumn" title="Dashboard" currentRoute ="Home" nextRoute="Dashboard"/>
               {children}
           </main>
        </div>
    )
}