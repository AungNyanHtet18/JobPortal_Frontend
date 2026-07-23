import Link from "next/link"
import { LayoutDashboard, Users, Briefcase, FileText, Settings, BarChart2, LogOutIcon, Lock } from "lucide-react"
import { Button } from "../ui/button";
import { signOutAction } from "@/lib/actions/auth.action";

export default function SideBarNavigation() {
    return (
        <div className="h-full col-span-1 bg-zinc-950 text-white px-4 py-6 flex flex-col">
            <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight flex gap-1 items-center"><BarChart2 size={20}/> JobPortal</h2>
                <p className="text-xs text-zinc-400 mt-1">Admin Dashboard</p>
            </div>
            
            <nav className="space-y-2 flex-1">
                <NavLink href="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                <NavLink href="/admin/users" icon={<Users size={18} />} label="Users" />
                <NavLink href="/admin/jobs" icon={<Briefcase size={18} />} label="Jobs" />
                <NavLink href="/admin/posts" icon={<FileText size={18} />} label="Posts" />
                <NavLink href="/admin/settings" icon={<Settings size={18} />} label="Settings" />
            </nav>
            
            <div className="pt-6 border-t border-zinc-800">
                <Button onClick={signOutAction} variant={"ghost"} className="w-full" >
                    <Lock size={18}/> Sign Out
                </Button>
            </div>
        </div>
    )
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href} 
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-colors text-sm font-medium">
            {icon}
            <span>{label}</span>
        </Link>
    )
}
