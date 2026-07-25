'use server'

import ApplicantDetailsComponent from "@/app/applicant/_client/applicant-details-component";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ApplicantDetailsPage({params} : {params: Promise<{id: string}>}) {
   const {id} = await params 

   return (
       <>
         <div className="flex items-center justify-between">
            <h1 className='tracking-wider text-xl text-zinc-500 font-[600]'>Applicant Details</h1>
            <Link href="/admin/users/applicant">
                 <Button className='bg-slate-500 text-white hover:bg-slate-600 shadow-md rounded-lg'>
                    View Applicants
                </Button>
            </Link>
        </div>
        <ApplicantDetailsComponent applicantId={id}/>
       </>
        
   )
}