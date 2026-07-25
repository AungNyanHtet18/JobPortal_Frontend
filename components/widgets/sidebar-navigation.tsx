'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Briefcase, FileText, Settings, BarChart2, LogOutIcon, Lock, Building2 } from "lucide-react"
import { Button } from "../ui/button";
import { signOutAction } from "@/lib/actions/auth.action";
import { cn } from "@/lib/utils";

export default function SideBarNavigation() {
    const pathname = usePathname()

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
        { href: "/admin/users/applicant", label: "Applicants", icon: <Users size={18} /> },
        { href: "/admin/users/company", label: "Companies", icon: <Building2 size={18} /> },
        { href: "/admin/jobs", label: "Jobs", icon: <Briefcase size={18} /> },
        { href: "/admin/posts", label: "Posts", icon: <FileText size={18} /> },
        { href: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
    ]

    return (
        <div className="h-full bg-zinc-950 text-white px-4 py-6 flex flex-col">
            <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight flex gap-1 items-center">
                    <BarChart2 size={20} /> JobPortal
                </h2>
            </div>

            <nav className="space-y-2 flex-1">
                {navItems.map((item) => (
                    <NavLink key={item.href} href={item.href} icon={item.icon} label={item.label} active={pathname === item.href}/>
                ))}
            </nav>

            <div className="pt-6 border-t border-zinc-800">
                <Button onClick={signOutAction} variant={"ghost"} className="w-full" >
                    <Lock size={18} /> Sign Out
                </Button>
            </div>
        </div>
    )
}

function NavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <Link href={href} className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                active ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-800 hover:text-white")}>
            {icon}
            <span>{label}</span>
        </Link>
    )
}
