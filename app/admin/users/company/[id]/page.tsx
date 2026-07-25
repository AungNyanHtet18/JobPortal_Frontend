'use server'

import CompanyDetailsComponent from "@/app/companyaccount/_client/company-details-component";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CompanyDetailsPage({params} : {params: Promise<{id: string}>}) {
   const {id} = await params 

   return (
       <>
        <div className="flex items-center justify-between">
            <h1 className='tracking-wider text-xl text-zinc-500 font-[600]'>Company Details</h1>
            <Link href="/admin/users/company">
                 <Button className='bg-slate-500 text-white hover:bg-slate-600 shadow-md rounded-lg'>
                    View Companies
                </Button>
            </Link>
        </div>
        <CompanyDetailsComponent companyId={id}/>
       </>
        
   )
}