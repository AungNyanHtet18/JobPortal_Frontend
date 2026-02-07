'use client'

import PageTitle from "@/components/widgets/page-title";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page() {

   useEffect(()=> {
       redirect('/signin')
   },[])

   return (
     <div className="px-4 py-4">
        <PageTitle icon="Home" title="Home"/>

     </div>
   )
}