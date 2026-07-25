'use client'

import SideBarNavigation from "@/components/widgets/sidebar-navigation";
import { useEffect, useState } from "react";
import AdminNavigation from "@/components/widgets/admin-navigation";
import { safeCall } from "@/lib/utils";
import { getAdminData } from "@/lib/actions/admin/dashboard.action";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [adminData, setAdminData] = useState<{name: string, email: string}>({name: "", email: ""})

    useEffect(() => {
      async function load() {
         await safeCall(async () => {
             const data = await getAdminData()
             setAdminData({name: data.name, email: data.email})
         })
      }
      load()
    },[])

    const toggleSiderbar = () => {
         setSidebarOpen(prev => !prev)
    }
    
    return (
        <div className="w-full h-screen grid grid-cols-7 ">
            {sidebarOpen && (
                <div className="col-span-1">
                    <SideBarNavigation />
                </div>
            )}
            
            <main className={`${sidebarOpen ? 'col-span-6' : 'col-span-7'} flex flex-col h-screen overflow-hidden`}>
                <AdminNavigation admin={adminData} setSiderbarOpen={toggleSiderbar} />
                <div className="flex-1 p-6 overflow-auto bg-zinc-50">
                     {children}
                </div>
            </main>
        </div>
    )
}
