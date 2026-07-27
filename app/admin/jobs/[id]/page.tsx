'use server'

import JobDetailsComponent from "@/app/job/_client/job-details-component";

export default async function JobDetailsPage({params} : {params: Promise<{id: string}>}) {
   const {id} = await params 

   return (
       <>
          <JobDetailsComponent jobId={id}/>
       </>
   )
}