'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Briefcase, FileText, Settings, BarChart2, LogOutIcon, Lock, Building2, User, ArrowUp, ArrowDown, ChevronRight, ChevronUp, ChevronDown, ClipboardList, ClipboardClock, ClipboardCheckIcon, FileQuestion, CircleHelp, BookOpenCheck, FileUser } from "lucide-react"
import { Button } from "../ui/button";
import { signOutAction } from "@/lib/actions/auth.action";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { SideBarType } from "@/lib/type/navbartype";

export default function SideBarNavigation() {
    const pathname = usePathname()
    const [open, setOpen] = useState<number | null>(null)

    const navItems: SideBarType[] = [
        { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
        { href: "/admin/jobs", label: "Jobs", icon: <Briefcase size={18} /> },
        { href: "/admin/posts", label: "Posts", icon: <FileText size={18} /> },
        { href: "#", label: "Users", icon: <User size={18}/>,  
            dropdownMenu: [
                { href: "/admin/users/allaccount", label: "All Accounts", icon: <Users size={18} />},
                { href: "/admin/users/applicant", label: "Applicants", icon: <FileUser size={18} />},
                { href: "/admin/users/company", label: "Companies", icon: <Building2 size={18} /> }
            ]
        },
        { href: "#", label: "Quizzes", icon: <ClipboardList size={18} />,
             dropdownMenu: [
               { href: "/admin/quizzes", label: "All Quizzes", icon: <FileQuestion size={18} />},
               { href: "/admin/quizzes/edit", label: "Create Quiz", icon: <BookOpenCheck size={18} />}
             ]
        },
        { href: "/admin/settings", label: "Settings", icon: <Settings size={18} /> },
    ]

    const openSideMenu = (index: number) => {
        index === open ? setOpen(null) : setOpen(index)
    }

    return (
        <div className="h-full bg-zinc-950 text-white px-4 py-6 flex flex-col">
            <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight flex gap-1 items-center">
                    <BarChart2 size={20} /> JobPortal
                </h2>
            </div>

            <nav className="space-y-2 flex-1">
                {navItems.map((item, index) => (
                   <React.Fragment key={index}>
                    <NavLink id={index} href={item.href} icon={item.icon} label={item.label} active={pathname === item.href} arrowAction={open == index} arrowOpenAction={item.dropdownMenu?.length != undefined } openSideMenu={openSideMenu} />
                    {open == index && item.dropdownMenu &&
                       item.dropdownMenu.map((dropdownItem, index) => (
                       <DropDownLink key={index} href={dropdownItem.href} icon={dropdownItem.icon} label={dropdownItem.label} active={pathname === dropdownItem.href}/>
                       ))   
                    }
                   </React.Fragment>
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

function NavLink({ id, href, icon, label, active, arrowAction, arrowOpenAction, openSideMenu}: {id: number, href: string, icon: React.ReactNode, label: string, active?: boolean, arrowAction: boolean, arrowOpenAction: boolean, openSideMenu : (index: number)=> void}) {
   
    return (
        <Link  href={href} onClick={() => {openSideMenu(id)}}
            className={cn("flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium", 
            active ? "bg-zinc-800 text-white" : "text-zinc-300 hover:bg-zinc-800 hover:text-white")}>
                {icon}
            <span className="w-full flex items-center justify-between">
                {label}
                 {
                    arrowOpenAction ? 
                    arrowAction ? <ChevronDown size={16}/> : <ChevronUp size={16} />  :
                    <></>
                 }       
            </span>
        </Link>
    )
}

function DropDownLink({ href, icon, label, active}: { href: string, icon: React.ReactNode, label: string, active?: boolean}) {
    return (
        <Link href={href}
            className={cn("flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm font-medium", active ? "bg-zinc-100 text-zinc-700" : "text-zinc-300 hover:bg-zinc-800 hover:text-white")}>
                {icon}
            <span>{label}</span>
        </Link>
    )
}