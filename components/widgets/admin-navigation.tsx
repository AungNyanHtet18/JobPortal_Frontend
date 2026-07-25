'use client'

import { ChevronDown, Menu, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { useState } from "react";

type AdminNavigationProps = {
     admin: {name: string, email: string}
     setSiderbarOpen: () => void
}

export default function AdminNavigation({admin, setSiderbarOpen} : AdminNavigationProps) {
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    
    return (
            <nav className="sticky top-0  bg-slate-500  border-b border-zinc-200 px-6 py-4 flex items-center justify-between gap-4">
                <Button variant="default" size="icon" onClick={setSiderbarOpen} className="bg-transparent rounded-md hover:bg-zinc-400 ">
                    <Menu className="size-7 text-white" />
                </Button>

                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                        <Input placeholder="Search applications, users, or jobs..." className="pl-10 bg-zinc-50" />
                    </div>
                </div>

                <div className="relative flex items-center gap-2">  
                    <Avatar className="h-10 w-10 ring-1 ring-zinc-100 bg-white">
                        <AvatarFallback className="text-zinc-600 font-bold">
                            {admin.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <Button variant="default" size="icon" className="bg-transparent hover:bg-zinc-300 rounded-lg" 
                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                        <ChevronDown className="size-4 text-zinc-50" />
                    </Button>

                    {profileDropdownOpen && (
                        <div className="absolute right-0  mt-45 w-60 bg-white rounded-xl shadow-lg border border-zinc-200 z-40">
                            <Card className="border-0 px-2">
                                <CardContent className="p-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback className="bg-zinc-100 text-zinc-600">
                                                {admin.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-zinc-900">{admin.name}</p>
                                            <p className="text-xs text-zinc-500">{admin.email}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </nav>
     )
}